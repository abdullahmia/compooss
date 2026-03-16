export const ENDPOINTS = {
  databases: {
    root: "/databases",
    byName: (dbName: string) => `/databases/${dbName}`,
  },
  collections: {
    root: (db: string) => `/databases/${db}/collections`,
    byName: (db: string, colName: string) => `/databases/${db}/collections/${colName}`,
  },
  documents: {
    all: (db: string, collection: string) => `/databases/${db}/collections/${collection}/documents`,
    byId: (db: string, collection: string, docId: string) =>
      `/databases/${db}/collections/${collection}/documents/${encodeURIComponent(docId)}`,
  },
  indexes: {
    root: (db: string, col: string) =>
      `/databases/${db}/collections/${col}/indexes`,
    byName: (db: string, col: string, indexName: string) =>
      `/databases/${db}/collections/${col}/indexes/${encodeURIComponent(indexName)}`,
  },
  schema: {
    root: (db: string, col: string) =>
      `/databases/${db}/collections/${col}/schema`,
  },
  validation: {
    root: (db: string, col: string) =>
      `/databases/${db}/collections/${col}/validation`,
  },
  aggregation: {
    root: (db: string, col: string) =>
      `/databases/${db}/collections/${col}/aggregate`,
  },
}