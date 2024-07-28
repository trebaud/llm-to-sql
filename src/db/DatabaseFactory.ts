import type { DatabaseConfig, Database } from "./Database";

import { PocketbaseDatabase } from "./Pocketbase";
import { SQLiteDatabase } from "./SQLite";

export class DatabaseFactory {
  static createDatabase(config: DatabaseConfig): Database {
    switch (config.type) {
      case "sqlite":
        return new SQLiteDatabase(config);
      case "pocketbase":
        return new PocketbaseDatabase(config);
      default:
        throw new Error("Unsupported database type");
    }
  }
}
