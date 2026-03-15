/** Single field in an index key spec (direction or special type). */
export type IndexDirection = 1 | -1 | "text" | "2dsphere" | "2d" | "hashed";

export interface IndexField {
  field: string;
  direction: IndexDirection;
}

/** Shape returned by MongoDB collection.indexes() / listIndexes. */
export interface IndexDefinition {
  name: string;
  key: Record<string, number | string>;
  v?: number;
  unique?: boolean;
  sparse?: boolean;
  hidden?: boolean;
  expireAfterSeconds?: number;
  partialFilterExpression?: Record<string, unknown>;
  weights?: Record<string, number>;
  default_language?: string;
  "2dsphereIndexVersion"?: number;
  [key: string]: unknown;
}

/** Result of $indexStats aggregation stage. */
export interface IndexUsageStats {
  name: string;
  key?: Record<string, number | string>;
  host?: string;
  accesses: {
    ops: number;
    since: string;
  };
}
