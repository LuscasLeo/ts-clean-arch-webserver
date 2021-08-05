import {
  ConnectionOptions,
  createConnection,
  getConnectionOptions,
} from "typeorm";
import { getLogger } from "../logging";
import ConfigurationService from "../services/configuration.service";
import entities from "./entities";

const logger = getLogger("database");

export class DatabaseConnectionError extends Error {
  constructor(public readonly error: any) {
    super(`Error while connecting to the database: ${error}`);
  }
}

export async function createDatabaseConnection(
  configuration: ConfigurationService
) {
  try {
    const {
      databaseHost,
      databaseName,
      databasePassword,
      databasePort,
      databaseUsername,
      databaseLogEnabled,
    } = configuration;

    logger.info(
      `Connecting to postgres://${databaseUsername}@${databaseHost}:${databasePort}/${databaseName}`
    );

    const { namingStrategy } = await getConnectionOptions();

    const options: ConnectionOptions = {
      type: "postgres",
      host: databaseHost,
      port: databasePort,
      username: databaseUsername,
      password: databasePassword,
      database: databaseName,
      logging: databaseLogEnabled,
      namingStrategy,
      entities,
    };

    const connection = await createConnection(options);

    return connection;
  } catch (err) {
    throw new DatabaseConnectionError(err);
  }
}
