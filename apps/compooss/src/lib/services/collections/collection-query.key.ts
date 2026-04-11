export const COLLECTION_QUERY_KEYS = {
  list: (db: string) => ["collections", db] as const,
} as const;
