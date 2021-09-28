// import "express-async-errors";
import "reflect-metadata";
import * as typeDI from "typedi";
import Application from "./app";
import { createDatabaseConnection } from "./database";
import { getLogger } from "./logging";
import ConfigurationService from "./services/configuration.service";
import { initDI } from "./utils";

/**
 * [x] Loggers
 * [x] User Roles
 * [x] Authentication
 * [x] Password Encryption
 * [x] Create default user
 * [ ] Tests
 * [x] Environment variables
 * [ ]
 * [ ]
 */

const logger = getLogger("Bootstrap");

async function bootstrap() {
  initDI();

  logger.info("🚀 Initializing application");
  await createDatabaseConnection(typeDI.Container.get(ConfigurationService));
  logger.info(`📚 Connected to database`);

  const application = typeDI.Container.get(Application);

  await application.preStart();

  await application.start();
}

bootstrap().catch((err) => logger.error("Error on application startup!", err));
