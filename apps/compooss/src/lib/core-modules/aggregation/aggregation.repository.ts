import { BaseRepository } from "../base.repository";
import type { Document } from "mongodb";

export interface RunPipelineOptions {
  maxTimeMS?: number;
  allowDiskUse?: boolean;
  limit?: number;
  sampleSize?: number;
}

export class AggregationRepository extends BaseRepository {
  private async getCollection(databaseName: string, collectionName: string) {
    const db = await this.db(databaseName);
    return db.collection(collectionName);
  }

  async runPipeline(
    databaseName: string,
    collectionName: string,
    pipeline: Document[],
    options: RunPipelineOptions = {},
  ) {
    const col = await this.getCollection(databaseName, collectionName);
    const { limit, sampleSize, ...aggOptions } = options;

    const effectivePipeline = [...pipeline];

    if (sampleSize && sampleSize > 0) {
      effectivePipeline.unshift({ $sample: { size: sampleSize } });
    }

    if (limit && limit > 0) {
      effectivePipeline.push({ $limit: limit });
    }

    const start = performance.now();
    const documents = await col
      .aggregate(effectivePipeline, {
        maxTimeMS: aggOptions.maxTimeMS ?? 60000,
        allowDiskUse: aggOptions.allowDiskUse ?? true,
      })
      .toArray();
    const executionTimeMs = Math.round(performance.now() - start);

    return {
      documents,
      executionTimeMs,
      stageCount: pipeline.length,
    };
  }

  async runPartialPipeline(
    databaseName: string,
    collectionName: string,
    pipeline: Document[],
    upToIndex: number,
    options: RunPipelineOptions = {},
  ) {
    const partial = pipeline.slice(0, upToIndex + 1);
    return this.runPipeline(databaseName, collectionName, partial, options);
  }

  async createView(
    databaseName: string,
    viewName: string,
    collectionName: string,
    pipeline: Document[],
  ) {
    const db = await this.db(databaseName);
    await db.createCollection(viewName, {
      viewOn: collectionName,
      pipeline,
    });
    return { ok: true, viewName };
  }
}

export const aggregationRepository = new AggregationRepository();
