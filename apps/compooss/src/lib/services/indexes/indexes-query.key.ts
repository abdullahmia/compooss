export const INDEXES_QUERY_KEYS = {
  all: (db: string, col: string) => ["indexes", db, col] as const,
} as const;
