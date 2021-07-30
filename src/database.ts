import { createConnection } from "typeorm"
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import Tag from "./entity/Tag";
import User from "./entity/User";

export async function createDatabaseConnection() {
    const connection = await createConnection({
        type: "sqlite",
        database: "./database/db.sqlite",
        synchronize: true,
        namingStrategy: new SnakeNamingStrategy(),
        logging: true,
        entities: [
            User, Tag
        ]
    });

    return connection;
}