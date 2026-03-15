import { BaseRepository } from "../base.repository";
import type {
  CreateIndexInput,
  DropIndexInput,
  HideIndexInput,
  IndexDefinition,
  IndexUsageStats,
} from "@compooss/types";

export class IndexRepository extends BaseRepository {
  /**
   * Lists all indexes on a collection (from listIndexes).
   */
  async getIndexes(
    databaseName: string,
    collectionName: string,
  ): Promise<IndexDefinition[]> {
    const db = await this.db(databaseName);
    const collection = db.collection(collectionName);
    const cursor = collection.listIndexes();
    const raw = await cursor.toArray();
    return raw.map((idx) => {
      const desc = idx as Record<string, unknown>;
      return {
        name: String(desc.name ?? ""),
        key: (desc.key as Record<string, number | string>) ?? {},
        v: typeof desc.v === "number" ? desc.v : undefined,
        unique: desc.unique === true,
        sparse: desc.sparse === true,
        hidden: desc.hidden === true,
        expireAfterSeconds:
          typeof desc.expireAfterSeconds === "number"
            ? desc.expireAfterSeconds
            : undefined,
        partialFilterExpression:
          desc.partialFilterExpression &&
          typeof desc.partialFilterExpression === "object"
            ? (desc.partialFilterExpression as Record<string, unknown>)
            : undefined,
        weights:
          desc.weights && typeof desc.weights === "object"
            ? (desc.weights as Record<string, number>)
            : undefined,
        default_language:
          typeof desc.default_language === "string"
            ? desc.default_language
            : undefined,
        "2dsphereIndexVersion":
          typeof desc["2dsphereIndexVersion"] === "number"
            ? desc["2dsphereIndexVersion"]
            : undefined,
        ...desc,
      } as IndexDefinition;
    });
  }

  /**
   * Returns index usage statistics via $indexStats aggregation.
   */
  async getIndexStats(
    databaseName: string,
    collectionName: string,
  ): Promise<IndexUsageStats[]> {
    const db = await this.db(databaseName);
    const collection = db.collection(collectionName);
    const cursor = collection.aggregate([{ $indexStats: {} }]);
    const raw = await cursor.toArray();
    return raw.map((item) => {
      const r = item as Record<string, unknown>;
      const accesses = r.accesses as { ops?: number; since?: string } | undefined;
      return {
        name: String(r.name ?? ""),
        key:
          r.key && typeof r.key === "object"
            ? (r.key as Record<string, number | string>)
            : undefined,
        host: typeof r.host === "string" ? r.host : undefined,
        accesses: {
          ops: typeof accesses?.ops === "number" ? accesses.ops : 0,
          since:
            typeof accesses?.since === "string"
              ? accesses.since
              : new Date().toISOString(),
        },
      } as IndexUsageStats;
    });
  }

  /**
   * Creates an index with the given key spec and options.
   */
  async createIndex(input: CreateIndexInput): Promise<{ name: string }> {
    const {
      databaseName,
      collectionName,
      fields,
      name: indexName,
      unique,
      sparse,
      hidden,
      expireAfterSeconds,
      partialFilterExpression,
    } = input;

    const key: Record<string, number | string> = {};
    for (const { field, direction } of fields) {
      key[field] = direction;
    }

    const db = await this.db(databaseName);
    const collection = db.collection(collectionName);

    const options: Record<string, unknown> = {};
    if (indexName) options.name = indexName;
    if (unique === true) options.unique = true;
    if (sparse === true) options.sparse = true;
    if (hidden === true) options.hidden = true;
    if (typeof expireAfterSeconds === "number")
      options.expireAfterSeconds = expireAfterSeconds;
    if (
      partialFilterExpression &&
      typeof partialFilterExpression === "object" &&
      Object.keys(partialFilterExpression).length > 0
    ) {
      options.partialFilterExpression = partialFilterExpression;
    }
    const createdName = await collection.createIndex(
      key as Parameters<typeof collection.createIndex>[0],
      options as Parameters<typeof collection.createIndex>[1],
    );
    return { name: createdName };
  }

  /**
   * Drops an index by name. Fails if index is _id_.
   */
  async dropIndex(input: DropIndexInput): Promise<{ ok: boolean }> {
    const { databaseName, collectionName, indexName } = input;
    if (indexName === "_id_") {
      throw new Error("Cannot drop the default _id_ index.");
    }
    const db = await this.db(databaseName);
    const collection = db.collection(collectionName);
    await collection.dropIndex(indexName);
    return { ok: true };
  }

  /**
   * Hides or unhides an index (collMod).
   */
  async hideIndex(input: HideIndexInput): Promise<{ ok: boolean }> {
    const { databaseName, collectionName, indexName, hidden } = input;
    const db = await this.db(databaseName);
    await db.command({
      collMod: collectionName,
      index: { name: indexName, hidden },
    });
    return { ok: true };
  }
}

export const indexRepository = new IndexRepository();
