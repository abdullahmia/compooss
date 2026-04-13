export type ExportFormat = "json" | "csv";

export interface ExportOptions {
  format: ExportFormat;
  /** MongoDB filter object. Defaults to {} (all documents). */
  filter?: Record<string, unknown>;
  /** Max documents to export. 0 = no cap (server applies a hard limit). */
  limit?: number;
}

export interface ImportResult {
  inserted: number;
  failed: number;
  errors: string[];
}
