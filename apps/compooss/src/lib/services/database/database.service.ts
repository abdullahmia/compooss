'use server';

import { mongoDriver } from "@/lib/driver/mongodb.driver";
import type { CollectionSummary, Database, DatabaseDetail } from "@compooss/types";
import { CollectionInfo } from "mongodb";

export const getDatabases = async (): Promise<Pick<Database, "name" | "sizeOnDisk">[]> => {
  const summaries = await mongoDriver.listDatabases();

  return summaries.map((summary) => ({
    name: summary.name,
    sizeOnDisk: summary.sizeOnDisk,
  }));
};

export const getDatabaseCollections = async (dbName: string): Promise<CollectionSummary[]> => {
  const db = await mongoDriver.getDb(dbName);
  const collections = await db.listCollections().toArray();
  return collections.map((collection: CollectionInfo) => ({
    name: collection.name,
    // TODO: Implement these
    documentCount: 0,
    avgDocSize: "-",
    totalSize: "-",
    indexes: 0,
  }));
};

export const getCollectionSummary = async (dbName: string, collectionName: string): Promise<CollectionSummary> => {
  const db = await mongoDriver.getDb(dbName);
  const collection = await db.collection(collectionName);
  const documentCount = await collection.countDocuments();
  return {
    name: collectionName,
    documentCount,
    avgDocSize: "-",
    totalSize: "-",
    indexes: 0,
  };
};

export const getDatabasesWithCollections = async (): Promise<
  DatabaseDetail[]
> => {
  const summaries = await mongoDriver.listDatabases();

  const databases: DatabaseDetail[] = [];

  for (const summary of summaries) {
    const db = await mongoDriver.getDb(summary.name);
    const collectionsCursor = db.listCollections(
      {},
      { nameOnly: true },
    );
    const collectionsRaw = await collectionsCursor.toArray();

    const collections: CollectionSummary[] = collectionsRaw.map(
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

export const createDatabase = async ({
  dbName,
  collectionName,
}: { dbName: string; collectionName: string }): Promise<void> => {
  const db = await mongoDriver.getDb(dbName);

  const existing = await db
    .listCollections({ name: collectionName }, { nameOnly: true })
    .toArray();

  if (existing.length === 0) {
    await db.createCollection(collectionName);
  }
};

