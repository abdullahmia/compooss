import { CollectionInfo } from "mongodb";
import { BaseRepository } from "../base.repository";
import {
  ICollection,
  ICreateCollectionInput,
  IDeleteCollectionInput,
} from "../repository.types";

export class CollectionRepository extends BaseRepository {
  /**
   * Lists all collections inside a database with document counts.
   */
  async getCollections(databaseName: string): Promise<ICollection[]> {
    const db = await this.db(databaseName);
    const collections = await db.listCollections().toArray();
    const withCounts = await Promise.all(
      collections.map(async (col) => {
        const documentCount = await db.collection(col.name).countDocuments();
        return {
          name: col.name,
          type: col.type ?? "collection",
          documentCount,
          options: (col as CollectionInfo).options ?? {},
        };
      }),
    );
    return withCounts;
  }

  /**
   * Creates a new collection inside an existing database.
   */
  async createCollection(input: ICreateCollectionInput): Promise<ICollection> {
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
    };
  }

  /**
   * Drops a collection from a database.
   */
  async deleteCollection(input: IDeleteCollectionInput): Promise<boolean> {
    const { databaseName, collectionName } = input;
    const db = await this.db(databaseName);
    const collection = db.collection(collectionName);
    return collection.drop();
  }
}

export const collectionRepository = new CollectionRepository();
