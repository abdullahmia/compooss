import { Admin, Db, MongoClient, MongoClientOptions } from "mongodb";
import type { Database } from "@compooss/types";

export class MongoDriver {
  private clientPromise: Promise<MongoClient> | null = null;
  private readonly uri: string;
  private readonly options: MongoClientOptions;

  constructor(uri: string, options: MongoClientOptions = {}) {
    this.uri = uri;
    this.options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      ...options,
    };
  }

  getUri(): string {
    return this.uri;
  }

  private async getClient(): Promise<MongoClient> {
    if (!this.clientPromise) {
      const client = new MongoClient(this.uri, this.options);
      this.clientPromise = client.connect().then(() => client);
    }
    return this.clientPromise;
  }

  async disconnect(): Promise<void> {
    if (this.clientPromise) {
      const client = await this.clientPromise;
      await client.close();
      this.clientPromise = null;
    }
  }

  async ping(): Promise<boolean> {
    try {
      const client = await this.getClient();
      await client.db("admin").command({ ping: 1 });
      return true;
    } catch {
      return false;
    }
  }

  async isConnected(): Promise<boolean> {
    return this.ping();
  }

  async getDb(dbName: string): Promise<Db> {
    const client = await this.getClient();
    return client.db(dbName);
  }

  async getAdmin(): Promise<Admin> {
    const client = await this.getClient();
    return client.db().admin();
  }

  async getServerInfo(): Promise<{ version?: string; host?: string }> {
    try {
      const client = await this.getClient();
      const info = await client.db("admin").command({ buildInfo: 1 });
      const hello = await client.db("admin").command({ hello: 1 });
      return {
        version: info.version,
        host: hello.me ?? hello.primary,
      };
    } catch {
      return {};
    }
  }

  async listDatabases(): Promise<Database[]> {
    const admin = await this.getAdmin();
    const { databases } = await admin.listDatabases();

    return databases.map((db) => {
      const raw = typeof db.sizeOnDisk === "number" ? db.sizeOnDisk : 0;
      return {
        name: db.name,
        sizeOnDisk: MongoDriver.formatSize(raw),
        sizeOnDiskRaw: raw,
      } satisfies Database;
    });
  }

  static formatSize(bytes: number): string {
    if (bytes <= 0 || Number.isNaN(bytes)) return "0 B";
    const units = ["B", "KB", "MB", "GB", "TB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex += 1;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }
}

