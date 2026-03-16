'use server';

import { collectionRepository } from "@/lib/core-modules/collection/collection.repository";
import { formatSize } from "@/lib/driver/mongodb.driver";
import { connectionManager } from "@/lib/driver/connection-manager";
import type { CollectionSummary, Database, DatabaseDetail } from "@compooss/types";
import { CollectionInfo } from "mongodb";

export const getDatabases = async (): Promise<Pick<Database, "name" | "sizeOnDisk">[]> => {
  const summaries = await connectionManager.getActiveDriver().listDatabases();

  return summaries.map((summary) => ({
    name: summary.name,
    sizeOnDisk: summary.sizeOnDisk,
  }));
};

export const getDatabaseCollections = async (dbName: string): Promise<CollectionSummary[]> => {
  const db = await connectionManager.getActiveDriver().getDb(dbName);
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
  const stats = await collectionRepository.getCollectionStats(dbName, collectionName);
  return {
    name: collectionName,
    documentCount: stats.documentCount,
    totalSize: formatSize(stats.size),
    avgDocSize: formatSize(stats.avgObjSize),
    indexes: stats.indexCount,
  };
};

export const getDatabasesWithCollections = async (): Promise<
  DatabaseDetail[]
> => {
  const summaries = await connectionManager.getActiveDriver().listDatabases();

  const databases: DatabaseDetail[] = [];

  for (const summary of summaries) {
    const db = await connectionManager.getActiveDriver().getDb(summary.name);
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
  const db = await connectionManager.getActiveDriver().getDb(dbName);

  const existing = await db
    .listCollections({ name: collectionName }, { nameOnly: true })
    .toArray();

  if (existing.length === 0) {
    await db.createCollection(collectionName);
  }
};

