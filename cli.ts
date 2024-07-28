import type { DatabaseConfig } from "./src/db/Database";
import { parseArgs } from "util";
import { DatabaseFactory } from "./src/db/DatabaseFactory";
import { translateToSQL } from "./src/llm";

export function getArgs() {
  const { values, positionals } = parseArgs({
    args: Bun.argv,
    options: {
      model: {
        type: "string",
        default: "phi3",
      },
      db: {
        type: "string",
        default: "pocketbase",
      },
      dataFilename: {
        type: "string",
      },
      schemaFilename: {
        type: "string",
      },
      exec: {
        type: "boolean",
      },
    },
    strict: true,
    allowPositionals: true,
  });
  const [, , ...rest] = positionals;
  return { query: rest.join(" "), ...values };
}

async function run() {
  const args = getArgs();
  const { query, model, db: dbType, dataFilename, schemaFilename, exec } = args;

  const dataFilePath = `${import.meta.dir}/${dataFilename}` || "";
  const schemaFilePath = `${import.meta.dir}/${schemaFilename}` || "";

  const conf: DatabaseConfig = {
    type: dbType || "",
    filename: dataFilePath,
    schemaFilename: schemaFilePath,
  };

  const db = DatabaseFactory.createDatabase(conf);
  const schema = db.getSchemaForLLM();
  const sql = await translateToSQL(query, schema, model);
  console.log(`\n### Generated SQL: <${sql}>`);

  if (exec) {
    const result = db.query(sql);
    console.log("*** Results: ", result);
  }
}

run();
