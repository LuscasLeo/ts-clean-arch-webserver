const { SnakeNamingStrategy } = require("typeorm-naming-strategies");

if(process.env.NODE_ENV != "production")
  require("dotenv").config({ path: ".env.dev" });


/**
 * @type {import("typeorm").ConnectionOptions}
 */
const config = {
  namingStrategy: new SnakeNamingStrategy(),

  type: "postgres",
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  logging: process.env.DATABASE_LOG == "true",
  synchronize: process.env.DATABASE_SYNC == "true",

  entities: ["src/entity/*.ts"],
  migrations: ["database/migrations/*.ts"],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "database/migrations",
  },
};

module.exports = config;
