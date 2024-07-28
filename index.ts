import ollama from "ollama";
import { Database } from "bun:sqlite";

import dbSchema from "./pb/pb_schema.json";

export function getPrettyDBSchemaForLLM() {
  const schema = dbSchema.map((db) => ({
    tableName: db.name,
    fields: db.schema.map((field) => ({
      name: field.name,
      type: field.type,
    })),
  }));

  return JSON.stringify(schema);
}

export async function getSQLQueryFromLLM(userQuery: string) {
  const LLM = process.env.LLM_MODEL || "phi3";
  const systemPrompt = `
    Given a user query in natural language and a database schema, output the corresponding SQL statement.
    For example if the query is: "What are the address and phone number of each business with wifi?"
    The output should look like: "SELECT address, phone_number FROM businesses FROM wifi = true"
    For example if the query is: "How many of the businesses offer wifi at their location?"
    The output should look like: "SELECT COUNT(*) FROM businesses WHERE wifi = true"
    Only output the sql statement and NOTHING else!
  `;
  const dbSchema = getPrettyDBSchemaForLLM();
  const query = `${systemPrompt}. Here is the db schema: ${dbSchema}. Here is the user query: ${userQuery}`;
  const resp = await ollama.generate({
    model: LLM,
    prompt: query,
  });

  return resp.response;
}

const userQuery = await getSQLQueryFromLLM(process.env.QUERY as string);

const db = new Database("./pb/pb_data/data.db");
const dbQuery = db.query(userQuery);
console.log(dbQuery.get());
