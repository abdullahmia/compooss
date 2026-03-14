export interface Collection {
  name: string;
  type: string;
  documentCount: number;
  options: Record<string, unknown>;
  /** Storage size in bytes (disk space allocated). */
  storageSize: number;
  /** Data size in bytes (uncompressed document data). */
  size: number;
  /** Average document size in bytes. */
  avgObjSize: number;
  /** Number of indexes. */
  indexCount: number;
  /** Total index size in bytes. */
  totalIndexSize: number;
}
