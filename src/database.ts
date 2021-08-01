import {
  ConnectionOptions,
  createConnection,
  getConnectionOptions,
} from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import User from "./entity/User";
import { getLogger } from "./logging";
import ConfigurationService from "./services/configuration.service";

const logger = getLogger("database");

export class DatabaseConnectionError extends Error {
  constructor(public readonly error: any) {
    super(`Error while connecting to the database`);
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

    const predefinedConfig = await getConnectionOptions();

    const config: ConnectionOptions = {
      type: "postgres",
      host: databaseHost,
      port: databasePort,
      username: databaseUsername,
      password: databasePassword,
      database: databaseName,
      logging: databaseLogEnabled,
      entities: [User],
    };

    const connection = await createConnection({
      ...(predefinedConfig as any),
      ...config,
    });

    return connection;
  } catch (err) {
    throw new DatabaseConnectionError(err);
  }
}
