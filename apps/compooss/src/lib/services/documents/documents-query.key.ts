export const DOCUMENTS_QUERY_KEYS = {
  list: (db: string, collection: string, params?: Record<string, unknown>) =>
    ["documents", db, collection, params] as const,
} as const;
