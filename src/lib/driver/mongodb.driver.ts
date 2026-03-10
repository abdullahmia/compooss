import { MongoClient } from "mongodb";
import { connectionStore } from "@/lib/store/connection.store";

const clientCache = new Map<string, MongoClient>();

export async function getClient(connectionId: string): Promise<MongoClient> {
  if (clientCache.has(connectionId)) {
    return clientCache.get(connectionId)!;
  }

  const connection = await connectionStore.findById(connectionId);
  if (!connection) {
    throw new Error(`Connection "${connectionId}" not found`);
  }

  const client = new MongoClient(connection.uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  });

  await client.connect();
  clientCache.set(connectionId, client);
  return client;
}

export async function removeClient(connectionId: string): Promise<void> {
  const client = clientCache.get(connectionId);
  if (client) {
    await client.close();
    clientCache.delete(connectionId);
  }
}

export async function testConnection(uri: string): Promise<void> {
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
  } finally {
    await client.close();
  }
}
