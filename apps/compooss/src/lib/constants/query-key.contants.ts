

export const QUERY_KEYS = {
  databases: {
    all: () => ["databases"],
  },
  collections: {
    all: (db: string) => ["collections", db],
  },
  documents: {
    all: (db: string, collection: string) => ["documents", db, collection],
    list: (
      db: string,
      collection: string,
      params: { filter?: string; sort?: string; project?: string; limit?: number; skip?: number }
    ) => ["documents", db, collection, "list", params],
  },
  indexes: {
    all: (db: string, col: string) => ["indexes", db, col],
  },
}