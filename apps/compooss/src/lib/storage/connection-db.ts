import type { SavedConnection } from "@compooss/types";
import { type DBSchema, type IDBPDatabase, openDB } from "idb";

const DB_NAME = "compooss-connections";
const DB_VERSION = 1;
const STORE_NAME = "connections";

interface CompoossDB extends DBSchema {
  connections: {
    key: string;
    value: SavedConnection;
    indexes: {
      "by-favorite": number;
      "by-pinned": number;
      "by-lastUsedAt": string;
      "by-name": string;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<CompoossDB>> | null = null;

function getDB(): Promise<IDBPDatabase<CompoossDB>> {
  if (!dbPromise) {
    dbPromise = openDB<CompoossDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("by-favorite", "isFavorite");
        store.createIndex("by-pinned", "isPinned");
        store.createIndex("by-lastUsedAt", "lastUsedAt");
        store.createIndex("by-name", "name");
      },
    });
  }
  return dbPromise;
}

export const connectionDB = {
  async getAll(): Promise<SavedConnection[]> {
    const db = await getDB();
    return db.getAll(STORE_NAME);
  },

  async getById(id: string): Promise<SavedConnection | undefined> {
    const db = await getDB();
    return db.get(STORE_NAME, id);
  },

  async save(connection: SavedConnection): Promise<void> {
    const db = await getDB();
    await db.put(STORE_NAME, connection);
  },

  async update(
    id: string,
    updates: Partial<SavedConnection>,
  ): Promise<SavedConnection | undefined> {
    const db = await getDB();
    const existing = await db.get(STORE_NAME, id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    await db.put(STORE_NAME, updated);
    return updated;
  },

  async delete(id: string): Promise<void> {
    const db = await getDB();
    await db.delete(STORE_NAME, id);
  },

  async getRecent(limit = 5): Promise<SavedConnection[]> {
    const all = await this.getAll();
    return all
      .filter((c: SavedConnection) => c.lastUsedAt !== null)
      .sort(
        (a: SavedConnection, b: SavedConnection) =>
          new Date(b.lastUsedAt!).getTime() -
          new Date(a.lastUsedAt!).getTime(),
      )
      .slice(0, limit);
  },

  async getFavorites(): Promise<SavedConnection[]> {
    const db = await getDB();
    return db.getAllFromIndex(STORE_NAME, "by-favorite", IDBKeyRange.only(1));
  },

  async search(query: string): Promise<SavedConnection[]> {
    const all = await this.getAll();
    const q = query.toLowerCase();
    return all.filter(
      (c: SavedConnection) =>
        c.name.toLowerCase().includes(q) ||
        (c.label && c.label.toLowerCase().includes(q)),
    );
  },

  async markUsed(id: string): Promise<void> {
    await this.update(id, { lastUsedAt: new Date().toISOString() });
  },
};
