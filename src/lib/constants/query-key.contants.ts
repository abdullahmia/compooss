

export const QUERY_KEYS = {
  databases: {
    all: () => ["databases"],
  },
  collections: {
    all: (db: string) => ["collections", db],
  },
  documents: {
    all: (db: string, collection: string) => ["documents", db, collection],
  },
}