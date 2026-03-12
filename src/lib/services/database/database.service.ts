'use server';

import { mongoDriver } from "@/lib/driver/mongodb.driver";
import type {
  ICollectionSummary,
  IDatabase,
} from "@/lib/types/database.types";

export const getDatabases = async (): Promise<IDatabase[]> => {
  const summaries = await mongoDriver.listDatabases();

  return summaries.map((summary) => ({
    name: summary.name,
    sizeOnDisk: summary.sizeOnDisk,
    collections: [],
  }));
};

export const getDatabasesWithCollections = async (): Promise<
  IDatabase[]
> => {
  const summaries = await mongoDriver.listDatabases();

  const databases: IDatabase[] = [];

  for (const summary of summaries) {
    const db = await mongoDriver.getDb(summary.name);
    const collectionsCursor = db.listCollections(
      {},
      { nameOnly: true },
    );
    const collectionsRaw = await collectionsCursor.toArray();

    const collections: ICollectionSummary[] = collectionsRaw.map(
      (col) => ({
        name: col.name,
        documentCount: 0,
        avgDocSize: "-",
        totalSize: "-",
        indexes: 0,
      }),
    );

    databases.push({
      name: summary.name,
      sizeOnDisk: summary.sizeOnDisk,
      collections,
    });
  }

  return databases;
};

export interface ICreateDatabaseInput {
  dbName: string;
  collectionName: string;
}

export const createDatabase = async ({
  dbName,
  collectionName,
}: ICreateDatabaseInput): Promise<void> => {
  const db = await mongoDriver.getDb(dbName);

  const existing = await db
    .listCollections({ name: collectionName }, { nameOnly: true })
    .toArray();

  if (existing.length === 0) {
    await db.createCollection(collectionName);
  }
};

