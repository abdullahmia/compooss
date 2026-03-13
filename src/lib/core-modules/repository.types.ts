
export interface IDatabase {
  name: string;
  sizeOnDisk: string;
  sizeOnDiskRaw: number;
}

export interface ICreateDatabaseInput {
  /** Name of the new database */
  databaseName: string;
  /** MongoDB won't persist a DB without at least one collection */
  initialCollection: string;
}


export interface ICollection {
  name: string;
  type: string;
  options: Record<string, unknown>;
}

export interface ICreateCollectionInput {
  databaseName: string;
  collectionName: string;
}

export interface IDeleteCollectionInput {
  databaseName: string;
  collectionName: string;
}


export type DocumentRecord = Record<string, unknown>;

export interface IPaginationOptions {
  page: number;
  limit: number;
}

export interface IPaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface IGetDocumentsInput {
  databaseName: string;
  collectionName: string;
  pagination: IPaginationOptions;
}

export interface IFilterDocumentsInput {
  databaseName: string;
  collectionName: string;
  filter: DocumentRecord;
  pagination: IPaginationOptions;
}

export interface IAddDocumentInput {
  databaseName: string;
  collectionName: string;
  document: DocumentRecord;
}

export interface IUpdateDocumentInput {
  databaseName: string;
  collectionName: string;
  /** MongoDB string ObjectId */
  documentId: string;
  /** Partial fields to update (uses $set) */
  payload: DocumentRecord;
}

export interface IDeleteDocumentInput {
  databaseName: string;
  collectionName: string;
  documentId: string;
}