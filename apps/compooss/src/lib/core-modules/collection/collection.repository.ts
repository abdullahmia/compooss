import { CollectionInfo } from "mongodb";
import { BaseRepository } from "../base.repository";
import type {
  Collection,
  CreateCollectionInput,
  DeleteCollectionInput,
} from "@compooss/types";

export class CollectionRepository extends BaseRepository {
  /**
   * Lists all collections inside a database with stats (storage size, data size, document count, avg size, indexes).
   */
  async getCollections(databaseName: string): Promise<Collection[]> {
    const db = await this.db(databaseName);
    const collections = await db.listCollections().toArray();
    const withStats = await Promise.all(
      collections.map(async (col) => {
        const options = (col as CollectionInfo).options ?? {};
        const type = col.type ?? "collection";
        let storageSize = 0;
        let size = 0;
        let documentCount = 0;
        let avgObjSize = 0;
        let indexCount = 0;
        let totalIndexSize = 0;

        try {
          const stats = (await db.command({ collStats: col.name })) as Record<string, unknown> | null;
          if (stats && typeof stats === "object") {
            storageSize = Number(stats.storageSize) || 0;
            size = Number(stats.size) || 0;
            documentCount = Number(stats.count) || 0;
            avgObjSize = Number(stats.avgObjSize) || 0;
            indexCount = Number(stats.nindexes) || 0;
            totalIndexSize = Number(stats.totalIndexSize) || 0;
          }
        } catch {
          documentCount = await db.collection(col.name).countDocuments();
        }

        return {
          name: col.name,
          type,
          documentCount,
          options,
          storageSize,
          size,
          avgObjSize,
          indexCount,
          totalIndexSize,
        };
      }),
    );
    return withStats;
  }

  /**
   * Creates a new collection inside an existing database.
   */
  async createCollection(input: CreateCollectionInput): Promise<Collection> {
    const { databaseName, collectionName } = input;

    const db = await this.db(databaseName);
    const existing = await db
      .listCollections({ name: collectionName })
      .hasNext();

    if (existing) {
      throw new Error(
        `Collection "${collectionName}" already exists in "${databaseName}".`,
      );
    }

    const collection = await db.createCollection(collectionName);

    return {
      name: collection.collectionName,
      type: "collection",
      documentCount: 0,
      options: {},
      storageSize: 0,
      size: 0,
      avgObjSize: 0,
      indexCount: 0,
      totalIndexSize: 0,
    };
  }

  /**
   * Drops a collection from a database.
   */
  async deleteCollection(input: DeleteCollectionInput): Promise<boolean> {
    const { databaseName, collectionName } = input;
    const db = await this.db(databaseName);
    const collection = db.collection(collectionName);
    return collection.drop();
  }
}

export const collectionRepository = new CollectionRepository();
