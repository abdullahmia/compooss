export const DOCUMENTS_QUERY_KEYS = {
  list: (db: string, collection: string, params?: Record<string, unknown>) =>
    params ? (["documents", db, collection, params] as const) : (["documents", db, collection] as const),
} as const;
