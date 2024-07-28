import { expect, test } from "bun:test";

import type { DatabaseConfig } from "../src/db/Database";
import { DatabaseFactory } from "../src/db/DatabaseFactory";

test("simple query with pocketbase", () => {
  const pocketbaseConf: DatabaseConfig = {
    type: "pocketbase",
    filename: "mocks/pb/pb_data/data.db",
    schemaFilename: "mocks/pb/pb_schema.json",
  };

  const pocketbaseDB = DatabaseFactory.createDatabase(pocketbaseConf);
  const schema = pocketbaseDB.getSchemaForLLM();
  expect(schema).toBe("");
});
