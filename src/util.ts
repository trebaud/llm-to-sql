import { validate } from "mysql-query-validator";

export function isValidSQL(sqlQuery: string): boolean | Error {
  try {
    validate(sqlQuery);
  } catch (err) {
    return false;
  }

  if (isSQLParameterized(sqlQuery)) {
    return false;
  }

  return true;
}

function isSQLParameterized(sqlQuery: string) {
  // Regex pattern to match parameterized queries
  const parameterizedQueryPattern = /\s*\?\s*/g;

  // Check if the query contains parameter placeholders
  return parameterizedQueryPattern.test(sqlQuery);
}

export function tryExtractSQLFromMarkdown(content: string): string {
  try {
    // Use a regular expression to find the SQL statement
    const sqlRegex = /```sql\n([\s\S]*?)\n```/;
    const match = content.match(sqlRegex);

    if (match) {
      // Return the extracted SQL statement
      return match[1].trim();
    } else {
      return content;
    }
  } catch (error) {
    return "";
  }
}
