export type ExportFormat = "json" | "csv";

/**
 * Controls how BSON types are serialised in a JSON export.
 * Mirrors MongoDB Compass's three Extended JSON variants.
 *
 * - "default":   legacy v1 EJSON (e.g. Long → $numberLong, plain Int32/Double).
 * - "relaxed":   v2 relaxed — numbers serialise as plain JS numbers (loses > 2^53).
 * - "canonical": v2 canonical — every numeric type is fully tagged.
 */
export type JsonExportMode = "default" | "relaxed" | "canonical";

export interface ExportOptions {
  format: ExportFormat;
  /** Only used when format === "json". Defaults to "default" (legacy v1). */
  jsonMode?: JsonExportMode;
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
