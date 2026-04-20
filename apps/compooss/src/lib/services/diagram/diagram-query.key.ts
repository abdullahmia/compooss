export const DIAGRAM_QUERY_KEYS = {
  erDiagram: (db: string) => ["diagram", "er", db] as const,
  schemaForDiagram: (db: string, col: string) =>
    ["diagram", "schema", db, col] as const,
} as const;
