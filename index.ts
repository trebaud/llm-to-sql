import ollama from "ollama";

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
    Only output the SQL statement and NOTHING ELSE!
  `;
  const dbSchema = getPrettyDBSchemaForLLM();
  const query = `${systemPrompt}. Here is the db schema: ${dbSchema}. Here is the user query: ${userQuery}`;
  console.log({ query });
  const resp = await ollama.generate({
    model: LLM,
    prompt: query,
  });

  console.log(resp.response);
  // TODO check if output is valid SQL query
  return resp.response;
}

getSQLQueryFromLLM(process.env.QUERY as string);
