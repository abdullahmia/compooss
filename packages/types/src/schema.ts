export interface SchemaAnalysisResult {
  totalDocuments: number;
  sampleSize: number;
  analyzedAt: string;
  fields: SchemaField[];
}

export interface SchemaField {
  path: string;
  name: string;
  depth: number;
  count: number;
  frequency: number;
  types: FieldTypeInfo[];
  hasMultipleTypes: boolean;
  children?: SchemaField[];
  uniqueCount?: number;
  arrayStats?: ArrayStats;
  objectIdDates?: ObjectIdDates;
}

export interface ArrayStats {
  minLength: number;
  maxLength: number;
  avgLength: number;
}

export interface ObjectIdDates {
  first: string;
  last: string;
}

export interface FieldTypeInfo {
  type: string;
  count: number;
  percentage: number;
  values?: ValueSample[];
}

export interface ValueSample {
  value: string;
  count: number;
}

export interface AnalyzeSchemaInput {
  databaseName: string;
  collectionName: string;
  sampleSize?: number;
}
