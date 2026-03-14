import type { DocumentRecord } from "./document";
import type { PaginationOptions } from "./document";

export interface CreateDatabaseInput {
  /** Name of the new database */
  databaseName: string;
  /** MongoDB won't persist a DB without at least one collection */
  initialCollection: string;
}

export interface CreateCollectionInput {
  databaseName: string;
  collectionName: string;
}

export interface DeleteCollectionInput {
  databaseName: string;
  collectionName: string;
}

export interface GetDocumentsInput {
  databaseName: string;
  collectionName: string;
  pagination: PaginationOptions;
}

export interface FilterDocumentsInput {
  databaseName: string;
  collectionName: string;
  filter: DocumentRecord;
  pagination: PaginationOptions;
}

/** Query documents with filter, sort, project, skip, limit (MongoDB-style). */
export interface QueryDocumentsInput {
  databaseName: string;
  collectionName: string;
  /** MongoDB filter object */
  filter: DocumentRecord;
  /** MongoDB sort spec, e.g. { name: 1, age: -1 } */
  sort?: DocumentRecord;
  /** MongoDB projection, e.g. { name: 1, _id: 0 } */
  project?: DocumentRecord;
  skip: number;
  limit: number;
}

export interface AddDocumentInput {
  databaseName: string;
  collectionName: string;
  document: DocumentRecord;
}

export interface UpdateDocumentInput {
  databaseName: string;
  collectionName: string;
  /** MongoDB string ObjectId */
  documentId: string;
  /** Partial fields to update (uses $set) */
  payload: DocumentRecord;
}

export interface DeleteDocumentInput {
  databaseName: string;
  collectionName: string;
  documentId: string;
}
