import { BaseRepository } from "../base.repository";
import type {
  AnalyzeSchemaInput,
  FieldTypeInfo,
  SchemaAnalysisResult,
  SchemaField,
  ValueSample,
} from "@compooss/types";
import type { Document } from "mongodb";

const DEFAULT_SAMPLE_SIZE = 1000;
const MAX_VALUE_SAMPLES = 20;
const MAX_UNIQUE_TRACKING = 500;

interface FieldStats {
  count: number;
  typeCounts: Map<string, number>;
  valueSamples: Map<string, Map<string, number>>;
  uniqueValues: Set<string>;
  arrayLengths: number[];
  objectIdTimestamps: number[];
}

function createFieldStats(): FieldStats {
  return {
    count: 0,
    typeCounts: new Map(),
    valueSamples: new Map(),
    uniqueValues: new Set(),
    arrayLengths: [],
    objectIdTimestamps: [],
  };
}

function isObjectId(value: unknown): boolean {
  if (typeof value !== "object" || value === null) return false;
  const bsonType = (value as { _bsontype?: string })._bsontype;
  return bsonType === "ObjectId" || bsonType === "ObjectID";
}

function getObjectIdTimestamp(value: unknown): number | null {
  if (!isObjectId(value)) return null;
  const v = value as { getTimestamp?: () => Date; toHexString?: () => string };
  if (typeof v.getTimestamp === "function") {
    return v.getTimestamp().getTime();
  }
  if (typeof v.toHexString === "function") {
    const hex = v.toHexString();
    return parseInt(hex.substring(0, 8), 16) * 1000;
  }
  return null;
}

function getValueType(value: unknown): string {
  if (value === null) return "Null";
  if (Array.isArray(value)) return "Array";
  if (value instanceof Date) return "Date";
  if (isObjectId(value)) return "ObjectId";
  if (typeof value === "string") return "String";
  if (typeof value === "number") return "Number";
  if (typeof value === "boolean") return "Boolean";
  if (typeof value === "object" && value !== null) return "Object";
  return "Unknown";
}

function valueToSampleKey(value: unknown): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "string") return value.length > 80 ? value.slice(0, 80) + "…" : value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value instanceof Date) return value.toISOString();
  if (isObjectId(value)) {
    return String((value as { toString: () => string }).toString());
  }
  if (Array.isArray(value)) return `[${value.length} items]`;
  if (typeof value === "object" && value !== null) return `{${Object.keys(value).length} keys}`;
  return String(value);
}

function recordValue(
  stats: FieldStats,
  type: string,
  sampleKey: string,
  value: unknown,
): void {
  stats.typeCounts.set(type, (stats.typeCounts.get(type) ?? 0) + 1);

  if (stats.uniqueValues.size < MAX_UNIQUE_TRACKING) {
    stats.uniqueValues.add(sampleKey);
  }

  if (!stats.valueSamples.has(type)) stats.valueSamples.set(type, new Map());
  const samples = stats.valueSamples.get(type)!;
  samples.set(sampleKey, (samples.get(sampleKey) ?? 0) + 1);

  if (type === "ObjectId") {
    const ts = getObjectIdTimestamp(value);
    if (ts !== null) stats.objectIdTimestamps.push(ts);
  }

  if (type === "Array" && Array.isArray(value)) {
    stats.arrayLengths.push(value.length);
  }
}

function walkDocument(
  doc: Document,
  prefix: string,
  fieldMap: Map<string, FieldStats>,
): void {
  if (doc === null || doc === undefined) return;

  if (typeof doc !== "object" || Array.isArray(doc)) return;

  for (const [key, value] of Object.entries(doc)) {
    const path = prefix ? `${prefix}.${key}` : key;
    const type = getValueType(value);
    const stats = fieldMap.get(path) ?? createFieldStats();
    stats.count += 1;
    const sampleKey = valueToSampleKey(value);
    recordValue(stats, type, sampleKey, value);
    fieldMap.set(path, stats);

    if (type === "Object" && typeof value === "object" && value !== null && !Array.isArray(value)) {
      walkDocument(value as Document, path, fieldMap);
    } else if (type === "Array" && Array.isArray(value)) {
      const elementPath = `${path}.[]`;
      for (const item of value) {
        const elType = getValueType(item);
        const elStats = fieldMap.get(elementPath) ?? createFieldStats();
        elStats.count += 1;
        const elKey = valueToSampleKey(item);
        recordValue(elStats, elType, elKey, item);
        fieldMap.set(elementPath, elStats);

        if (elType === "Object" && typeof item === "object" && item !== null && !Array.isArray(item)) {
          walkDocument(item as Document, elementPath, fieldMap);
        }
      }
    }
  }
}

function buildTypeInfo(
  typeCounts: Map<string, number>,
  total: number,
  valueSamples: Map<string, Map<string, number>>,
): FieldTypeInfo[] {
  const result: FieldTypeInfo[] = [];
  for (const [type, count] of typeCounts) {
    const percentage = total > 0 ? Math.round((count / total) * 1000) / 10 : 0;
    const samples = valueSamples.get(type);
    let values: ValueSample[] | undefined;
    if (samples && samples.size > 0) {
      values = Array.from(samples.entries())
        .map(([value, cnt]) => ({ value, count: cnt }))
        .sort((a, b) => b.count - a.count)
        .slice(0, MAX_VALUE_SAMPLES);
    }
    result.push({ type, count, percentage, values });
  }
  result.sort((a, b) => b.percentage - a.percentage);
  return result;
}

function pathToName(path: string): string {
  const last = path.split(".").pop();
  if (last === "[]") return "[]";
  return last ?? path;
}

function pathDepth(path: string): number {
  if (!path) return 0;
  return path.split(".").filter(Boolean).length;
}

function buildTree(fieldMap: Map<string, FieldStats>, sampleSize: number): SchemaField[] {
  const paths = Array.from(fieldMap.keys());
  const pathSet = new Set(paths);
  const byPrefix = new Map<string, string[]>();

  for (const p of paths) {
    const lastDot = p.lastIndexOf(".");
    if (lastDot === -1) continue;
    const parent = p.slice(0, lastDot);
    if (!pathSet.has(parent)) continue;
    const list = byPrefix.get(parent) ?? [];
    if (!list.includes(p)) list.push(p);
    byPrefix.set(parent, list);
  }

  function toField(path: string): SchemaField {
    const stats = fieldMap.get(path)!;
    const total = stats.count;
    const types = buildTypeInfo(stats.typeCounts, total, stats.valueSamples);
    const hasMultipleTypes = types.length > 1;
    const childrenPaths = (byPrefix.get(path) ?? []).sort();
    const children = childrenPaths.length > 0 ? childrenPaths.map(toField) : undefined;

    const field: SchemaField = {
      path,
      name: pathToName(path),
      depth: pathDepth(path),
      count: total,
      frequency: sampleSize > 0 ? Math.round((total / sampleSize) * 1000) / 1000 : 0,
      types,
      hasMultipleTypes,
      children: children?.length ? children : undefined,
      uniqueCount: stats.uniqueValues.size,
    };

    if (stats.arrayLengths.length > 0) {
      const lengths = stats.arrayLengths;
      const sum = lengths.reduce((a, b) => a + b, 0);
      field.arrayStats = {
        minLength: Math.min(...lengths),
        maxLength: Math.max(...lengths),
        avgLength: Math.round((sum / lengths.length) * 10) / 10,
      };
    }

    if (stats.objectIdTimestamps.length > 0) {
      const sorted = stats.objectIdTimestamps.sort((a, b) => a - b);
      field.objectIdDates = {
        first: new Date(sorted[0]).toISOString(),
        last: new Date(sorted[sorted.length - 1]).toISOString(),
      };
    }

    return field;
  }

  const rootPaths = paths.filter((p) => {
    const lastDot = p.lastIndexOf(".");
    if (lastDot === -1) return true;
    const parent = p.slice(0, lastDot);
    return !pathSet.has(parent);
  });
  return rootPaths.map(toField).filter((f) => fieldMap.has(f.path));
}

export class SchemaRepository extends BaseRepository {
  private async getCollection(databaseName: string, collectionName: string) {
    const db = await this.db(databaseName);
    return db.collection<Document>(collectionName);
  }

  async analyzeSchema(input: AnalyzeSchemaInput): Promise<SchemaAnalysisResult> {
    const { databaseName, collectionName, sampleSize = DEFAULT_SAMPLE_SIZE } = input;
    const col = await this.getCollection(databaseName, collectionName);
    const totalDocuments = await col.countDocuments({});

    const size = Math.min(sampleSize, Math.max(0, totalDocuments));
    const pipeline = size > 0 ? [{ $sample: { size } }] : [];
    const docs = pipeline.length > 0 ? await col.aggregate(pipeline).toArray() : [];

    const fieldMap = new Map<string, FieldStats>();
    for (const doc of docs) {
      walkDocument(doc, "", fieldMap);
    }

    const fields = buildTree(fieldMap, docs.length);
    return {
      totalDocuments,
      sampleSize: docs.length,
      analyzedAt: new Date().toISOString(),
      fields,
    };
  }
}

export const schemaRepository = new SchemaRepository();
