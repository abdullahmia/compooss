"use server";

import { connectionManager } from "@/lib/driver/connection-manager";
import type { DatabaseDetail } from "@compooss/types";

export interface IConnectionHealth {
  ok: boolean;
  message: string;
}

export async function checkConnectionHealth(): Promise<IConnectionHealth> {
  try {
    const driver = connectionManager.getActiveDriver();
    await driver.ping();
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
  const driver = connectionManager.getActiveDriver();
  const summaries = await driver.listDatabases();
  return summaries.map((summary) => ({
    name: summary.name,
    sizeOnDisk: summary.sizeOnDisk,
    collections: [],
  }));
};
