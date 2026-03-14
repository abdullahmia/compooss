export const ENDPOINTS = {
  databases: {
    root: "/databases",
    byName: (dbName: string) => `/databases/${dbName}`,
  },
  collections: {
    root: (db: string) => `/databases/${db}/collections`,
  },
  documents: {
    all: (db: string, collection: string) => `/databases/${db}/collections/${collection}/documents`,
  },
}