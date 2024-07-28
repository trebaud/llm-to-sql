# llm-sql

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src/cli.ts "How many users do I have?" --db "pocketbase" --dataFilename "pb/pb_data/data.db" --schemaFilename "pb/pb_schema.json"
```

Supported db types:
* pocketbase
* SQLite

This project was created using `bun init` in bun v1.1.7. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
