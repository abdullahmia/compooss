import type { DocumentRecord, ImportResult } from "@compooss/types";
import { BaseRepository } from "../base.repository";

const EXPORT_HARD_LIMIT = 100_000;

/**
 * Recursively flattens a document into a single-level object using dot notation.
 * Arrays are serialised as JSON strings so they fit in a single CSV cell.
 */
function flattenDocument(
  doc: Record<string, unknown>,
  prefix = "",
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(doc)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (Array.isArray(value)) {
      result[fullKey] = JSON.stringify(value);
    } else if (value !== null && typeof value === "object") {
      Object.assign(result, flattenDocument(value as Record<string, unknown>, fullKey));
    } else {
      result[fullKey] = value === null || value === undefined ? "" : String(value);
    }
  }
  return result;
}

/** Escapes a single CSV cell value (quotes it if needed). */
function csvCell(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/** Serialises an array of documents to a CSV string. */
export function documentsToCsv(docs: DocumentRecord[]): string {
  if (docs.length === 0) return "";

  const flattened = docs.map((d) => flattenDocument(d as Record<string, unknown>));

  // Collect all unique headers in insertion order
  const headerSet = new Set<string>();
  for (const doc of flattened) {
    for (const key of Object.keys(doc)) {
      headerSet.add(key);
    }
  }
  const headers = Array.from(headerSet);

  const lines: string[] = [headers.map(csvCell).join(",")];
  for (const doc of flattened) {
    lines.push(headers.map((h) => csvCell(doc[h] ?? "")).join(","));
  }
  return lines.join("\n");
}

/** Parses a single CSV line, respecting quoted fields. */
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

/** Coerces a raw CSV string value to the most appropriate JS type. */
function coerceValue(raw: string): unknown {
  if (raw === "") return null;
  if (raw === "true") return true;
  if (raw === "false") return false;
  const num = Number(raw);
  if (!Number.isNaN(num) && raw.trim() !== "") return num;
  // Try to parse JSON arrays / objects stored as strings
  if ((raw.startsWith("[") && raw.endsWith("]")) || (raw.startsWith("{") && raw.endsWith("}"))) {
    try {
      return JSON.parse(raw) as unknown;
    } catch {
      // fall through to string
    }
  }
  return raw;
}

/** Parses a CSV string into an array of plain objects. */
export function csvToDocuments(text: string): Record<string, unknown>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(
      headers.map((h, i) => [h.trim(), coerceValue(values[i]?.trim() ?? "")]),
    );
  });
}

export class ExportRepository extends BaseRepository {
  private async getCollection(dbName: string, colName: string) {
    const db = await this.db(dbName);
    return db.collection<DocumentRecord>(colName);
  }

  /**
   * Fetches up to `limit` documents (hard cap: 100 000) and returns them as a
   * plain array. The caller is responsible for serialising to JSON or CSV.
   */
  async fetchForExport(
    dbName: string,
    colName: string,
    filter: Record<string, unknown> = {},
    limit = 0,
  ): Promise<DocumentRecord[]> {
    const col = await this.getCollection(dbName, colName);
    const effectiveLimit = limit > 0 ? Math.min(limit, EXPORT_HARD_LIMIT) : EXPORT_HARD_LIMIT;
    return col.find(filter).limit(effectiveLimit).toArray() as Promise<DocumentRecord[]>;
  }

  /**
   * Bulk-inserts documents parsed from a JSON or CSV import.
   * Strips existing `_id` fields so MongoDB assigns fresh ones.
   * Returns a result summary with counts and per-row errors.
   */
  async importDocuments(
    dbName: string,
    colName: string,
    docs: Record<string, unknown>[],
  ): Promise<ImportResult> {
    const col = await this.getCollection(dbName, colName);

    let inserted = 0;
    let failed = 0;
    const errors: string[] = [];

    // Process in batches of 500 to keep memory usage manageable
    const BATCH = 500;
    for (let i = 0; i < docs.length; i += BATCH) {
      const batch = docs.slice(i, i + BATCH).map(({ _id: _stripped, ...rest }) => rest);
      try {
        const result = await col.insertMany(batch, { ordered: false });
        inserted += result.insertedCount;
      } catch (err: unknown) {
        // insertMany with ordered:false throws a BulkWriteError that still
        // reports the insertedCount for successful docs in the batch.
        const bwe = err as { insertedCount?: number; writeErrors?: Array<{ index: number; errmsg?: string }> };
        inserted += bwe.insertedCount ?? 0;
        if (bwe.writeErrors) {
          for (const we of bwe.writeErrors) {
            failed++;
            errors.push(`Row ${i + we.index + 1}: ${we.errmsg ?? "unknown error"}`);
          }
        } else {
          failed += batch.length - (bwe.insertedCount ?? 0);
          errors.push(`Batch starting at row ${i + 1}: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
    }

    return { inserted, failed, errors };
  }
}

export const exportRepository = new ExportRepository();
