export const SCHEMA_QUERY_KEYS = {
  all: (db: string, col: string) => ["schema", db, col] as const,
} as const;
