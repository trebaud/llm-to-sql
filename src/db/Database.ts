export interface DatabaseConfig {
  type: string;
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
  filename?: string;
  schemaFilename?: string;
}

export interface Database {
  // Implement main query function
  query(sql: string): string;
  // Implement logic to get schema-formatted data for the given table
  getSchemaForLLM(): string;
}
