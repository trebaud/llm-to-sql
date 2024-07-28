import { Database as SQLiteDB } from "bun:sqlite";
import type { DatabaseConfig, Database } from "../Database";

export class SQLiteDatabase implements Database {
  protected config: DatabaseConfig;
  protected db: any; // Use the appropriate SQLite library

  constructor(config: DatabaseConfig) {
    this.config = config;
    this.db = new SQLiteDB(this.config.filename);
  }

  query(userQuery: string): string {
    return this.db.query(userQuery).all();
  }

  getSchemaForLLM(): string {
    return this.db.exec("select sql from sqlite_schema;");
  }
}
