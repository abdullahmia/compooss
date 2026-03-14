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
}