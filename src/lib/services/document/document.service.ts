'use server';

import { MongoDocument } from "@/data/mockData";
import { mongoDriver } from "@/lib/driver/mongodb.driver";

export const getDocuments = async (
  dbName: string,
  collectionName: string,
): Promise<MongoDocument[]> => {
  const db = await mongoDriver.getDb(dbName);
  const collection = db.collection<MongoDocument>(collectionName);
  const documents = await collection.find<MongoDocument>({}).toArray();
  return documents;
}

export const addDocuments = async (
  dbName: string,
  collectionName: string,
  document: MongoDocument,
): Promise<void> => {
  const db = await mongoDriver.getDb(dbName);
  const collection = db.collection<MongoDocument>(collectionName);
  await collection.insertOne(document);
}