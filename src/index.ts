// import "express-async-errors";
import "reflect-metadata";
import * as routingControllers from "routing-controllers";
import * as typeDI from "typedi";
import * as typeorm from "typeorm";
import * as typeormTypediExtensions from "typeorm-typedi-extensions";
import Application from "./app";
import { createDatabaseConnection } from "./database";
import { getLogger } from "./logging";
import ConfigurationService from "./services/configuration.service";

/**
 * [x] Loggers
 * [x] User Roles
 * [x] Authentication
 * [x] Password Encryption
 * [x] Create default user
 * [ ] Tests
 * [ ] Environment variables
 * [ ]
 * [ ]
 */

const logger = getLogger("Bootstrap");

async function bootstrap() {
  typeorm.useContainer(typeormTypediExtensions.Container);
  routingControllers.useContainer(typeDI.Container);

  logger.info("🚀 Initializing application");
  await createDatabaseConnection(typeDI.Container.get(ConfigurationService));
  logger.info(`📚 Connected to database`);

  const application = typeDI.Container.get(Application);

  await application.preStart();

  await application.start();
}

bootstrap().catch((err) => logger.error("Error on application startup!", err));
