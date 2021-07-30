import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import morgan from "morgan";
import "reflect-metadata";
import { createDatabaseConnection } from "./database";
import { useRoutes } from "./controllers/routes";
import { HttpError } from "./types";
import { ValidationErrorSet } from "./validations";

async function bootstrap() {
  console.log("Initializing application");
  
  console.log("Initializing Db connection");
  await createDatabaseConnection()
  console.log("Connected");
  
  const app = express();

  app.use(express.json());
  app.use(morgan("common"));

  useRoutes(app);

  app.listen(3000, () => {
    console.log("App listening to 3000");
  });

  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof HttpError) {
      return res.status(err.status).json({
        code: err.status,
        message: err.message,
      });
    }

    if (err instanceof ValidationErrorSet) {
      return res.status(400).json({
        message: "Error on validating payload",
        errors: err.errors,
      });
    }

    if (err instanceof Error) {
      return res.status(400).json({ message: err.message, name: err.name, stack: err.stack });
    }

    console.error(`Error handling ${req.method} to ${req.path} `, err);

    return res.status(500).json({ message: "Internal Server Error!" });
  });
}

bootstrap().catch((err) => console.error(err));
