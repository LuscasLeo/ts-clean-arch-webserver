const { SnakeNamingStrategy } = require("typeorm-naming-strategies");

/**
 * @type {import("typeorm").ConnectionOptions}
 */
const config = {
    namingStrategy: new SnakeNamingStrategy(),

    type: "postgres",
    host: "localhost",
    port: "5432",
    username: "postgres",
    password: "example",
    database: "ts_teste",
    logging: true,

    entities: ["src/entity/*.ts"],
    cli: {
        migrationsDir: ["src/database/migrations/*.ts"]
    }
}

module.exports = config;