'use server';

import { mongoDriver } from "@/lib/driver/mongodb.driver";
import type { DatabaseDetail } from "@compooss/types";

export interface IConnectionHealth {
  ok: boolean;
  message: string;
}

export async function checkConnectionHealth(): Promise<IConnectionHealth> {
  try {
    await mongoDriver.ping();
    return {
      ok: true,
      message: "Connected to MongoDB",
    };
  } catch {
    return {
      ok: false,
      message:
        "Cannot connect to MongoDB. Ensure the database is running and the connection string is correct.",
    };
  }
}

export const getDatabases = async (): Promise<DatabaseDetail[]> => {
  const summaries = await mongoDriver.listDatabases();
  return summaries.map((summary) => ({
    name: summary.name,
    sizeOnDisk: summary.sizeOnDisk,
    collections: [],
  }));
}