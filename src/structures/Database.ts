import { ConnectionManager } from "typeorm";
import { dbName } from "../Config";

import { Warns } from "../models/Warns";

const connectionManager: ConnectionManager = new ConnectionManager();
connectionManager.create({
    name: dbName,
    type: "sqlite",
    database: "./db.sqlite",
    entities: [
        Warns
    ]
});

export default connectionManager; 