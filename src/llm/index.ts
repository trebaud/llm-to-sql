import ollama from "ollama";
import { isValidSQL, tryExtractSQLFromMarkdown } from "../util";
import { systemPrompt } from "./prompts";

const MAX_REC_DEPTH = 5;
const DEFAULT_LLM = "phi3";

export async function translateToSQL(
  userQuery: string,
  dbSchema: string,
  model?: string,
): Promise<string> {
  const llm = model || DEFAULT_LLM;
  const queryPrompt = `${systemPrompt}. Here is the db schema: ${dbSchema}. Here is the user query: ${userQuery}`;
  console.log(`**** Generating SQL using ${llm} 🤖...`);
  return translateToSQLRec(queryPrompt, llm);
}

async function translateToSQLRec(prompt: string, llm: string, depth = 0) {
  if (depth === MAX_REC_DEPTH) {
    throw new Error("Invalid sql output - Max retries reached");
  }

  const resp = await ollama.generate({
    model: llm,
    prompt,
  });

  let rawSQL = tryExtractSQLFromMarkdown(resp.response);
  const isValid = isValidSQL(rawSQL);
  if (!isValid) {
    const updatedPrompt = prompt.concat(
      "Output SQL and ONLY SQL! Do NOT output a parametrized query",
    );
    console.log(`Generated SQL is invalid, retrying... (depth = ${depth})`);
    return translateToSQLRec(updatedPrompt, llm, depth + 1);
  }

  return rawSQL;
}
