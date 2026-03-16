export interface AggregationStage {
  id: string;
  stageOperator: string;
  value: string;
  enabled: boolean;
  collapsed: boolean;
}

export interface AggregationResult {
  documents: Record<string, unknown>[];
  executionTimeMs: number;
  stageCount: number;
}

export interface SavedPipeline {
  id: string;
  name: string;
  namespace: string;
  stages: AggregationStage[];
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
}

export interface StageTemplate {
  operator: string;
  label: string;
  description: string;
  snippet: string;
  category: "filter" | "transform" | "group" | "join" | "output" | "other";
}

export interface RunAggregationInput {
  pipeline: Record<string, unknown>[];
  options?: AggregationOptions;
}

export interface AggregationOptions {
  maxTimeMS?: number;
  sampleSize?: number;
  limit?: number;
  allowDiskUse?: boolean;
}

export interface CreateViewInput {
  viewName: string;
  pipeline: Record<string, unknown>[];
}
