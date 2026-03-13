export const ENDPOINTS = {
  databases: {
    root: "/databases",
  },
  collections: {
    root: (db: string) => `/databases/${db}/collections`,
  },
}