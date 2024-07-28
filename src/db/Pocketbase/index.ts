import { SQLiteDatabase } from "../SQLite";
import type { DatabaseConfig } from "../Database";

export class PocketbaseDatabase extends SQLiteDatabase {
  constructor(config: DatabaseConfig) {
    super(config)
  }

  getSchemaForLLM(): string {
    const pbSchema = require(this.config.schemaFilename || '')
    if (!pbSchema) {
      return super.getSchemaForLLM()
    }
    // TODO validate is JSON
    const schema = pbSchema.map((db: any) => ({
      tableName: db.name,
      fields: db.schema.map((field: any) => ({
        name: field.name,
        type: field.type,
      })),
    }));

    return JSON.stringify(schema);
  }
}
