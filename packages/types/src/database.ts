export interface CollectionSummary {
  name: string;
  documentCount: number;
  avgDocSize: string;
  totalSize: string;
  indexes: number;
}

/** Database list item (name + size). Backend may include sizeOnDiskRaw. */
export interface Database {
  name: string;
  sizeOnDisk: string;
  sizeOnDiskRaw?: number;
}

/** Database with embedded collection summaries (e.g. for detail view). */
export interface DatabaseDetail {
  name: string;
  collections: CollectionSummary[];
  sizeOnDisk: string;
}
