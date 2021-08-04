import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import { Express, NextFunction, Request, Response } from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import {
  createExpressServer,
  getMetadataArgsStorage,
  HttpError,
  RoutingControllersOptions
} from "routing-controllers";
import { routingControllersToSpec } from "routing-controllers-openapi";
import { AuthorizationChecker } from "routing-controllers/types/AuthorizationChecker";
import { CurrentUserChecker } from "routing-controllers/types/CurrentUserChecker";
import swaggerUi from "swagger-ui-express";
import { QueryFailedError } from "typeorm";
import { getLogger } from "../logging";
import { ValidationErrorSet } from "../middlewares/validations";
import controllers from "./controllers";



const logger = getLogger("server");

export function createServer(
  authorizationChecker: AuthorizationChecker,
  currentUserChecker: CurrentUserChecker
) {
  const options: RoutingControllersOptions = {
    controllers,
    defaultErrorHandler: false,
    authorizationChecker,
    currentUserChecker,
  };

  const app = createExpressServer(options);

  setupErrorHandler(app);

  setupOpenAPI(app, options);

  return app;
}

function setupErrorHandler(app: Express) {
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    try {
      if (err instanceof HttpError) {
        return res.status(err.httpCode).json({
          ...err,
        });
      }

      if (err instanceof ValidationErrorSet) {
        return res.status(400).json({
          message: "Error on validating payload",
          errors: err.errors,
        });
      }

      if (err instanceof QueryFailedError) {
        logger.error(`Query Error on path ${req.path}`, err);
        return res.status(500).json({ message: "Internal Server Error!" });
      }

      if (err instanceof JsonWebTokenError) {
        return res.status(401).json({ message: err.message });
      }

      if (err instanceof SyntaxError) {
        return res.status(400).json({
          ...err,
          errors: [err.message],
        });
      }

      if (err instanceof Error) {
        logger.error(err);
        return res.status(500).json({
          message: err.message,
          name: err.name,
          stack: err.stack,
        });
      }

      return res.status(500).json({ message: "Internal Server Error!", err });
    } finally {
      next();
    }
  });
}

function setupOpenAPI(app: Express, options: RoutingControllersOptions) {
  const storage = getMetadataArgsStorage();

  const { defaultMetadataStorage } = require("class-transformer/cjs/storage");

  // Parse class-validator classes into JSON Schema:
  const schemas = validationMetadatasToSchemas({
    classTransformerMetadataStorage: defaultMetadataStorage,
    refPointerPrefix: "#/components/schemas/",
  });

  const spec = routingControllersToSpec(storage, options, {
    components: { schemas },
  });

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));
}
