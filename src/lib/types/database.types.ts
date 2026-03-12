export interface ICollectionSummary {
  name: string;
  documentCount: number;
  avgDocSize: string;
  totalSize: string;
  indexes: number;
}

export interface IDatabase {
  name: string;
  collections: ICollectionSummary[];
  sizeOnDisk: string;
}

