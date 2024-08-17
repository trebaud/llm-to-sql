import type { DatabaseConfig } from "./src/db/Database";
import { parseArgs } from "util";
import { DatabaseFactory } from "./src/db/DatabaseFactory";
import { translateToSQL } from "./src/llm";

interface Args {
  query: string;
  model: string;
  db: string;
  dataFilename?: string;
  schemaFilename?: string;
  exec?: boolean;
}

export function getArgs(): Args {
  const { values, positionals } = parseArgs({
    args: Bun.argv,
    options: {
      model: {
        type: "string",
        default: "llama3",
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
  const { model, db, dataFilename, schemaFilename, exec } = values;
  return {
    query: rest.join(" "),
    model: model!!,
    db: db!!,
    dataFilename,
    schemaFilename,
    exec,
  };
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
  const sql = await translateToSQL(query, schema, model!!);
  console.log(`\n### Generated SQL: <${sql}>`);

  if (exec) {
    const result = db.query(sql);
    console.log("*** Results: ", result);
  }
}

run();
