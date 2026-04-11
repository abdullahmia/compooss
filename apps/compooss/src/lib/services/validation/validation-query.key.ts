export const VALIDATION_QUERY_KEYS = {
  all: (db: string, col: string) => ["validation", db, col] as const,
} as const;
