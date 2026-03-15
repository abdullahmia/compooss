import { Admin, Db, MongoClient, MongoClientOptions } from "mongodb";
import type { Database } from "@compooss/types";

export interface IMongoDriverOptions {
  maxPoolSize?: number;
  serverSelectionTimeoutMS?: number;
  connectTimeoutMS?: number;
}

export class MongoDriver {
  private static instance: MongoDriver | null = null;
  private clientPromise: Promise<MongoClient> | null = null;
  private readonly uri: string;
  private readonly options: MongoClientOptions;

  private constructor(uri: string, options: IMongoDriverOptions = {}) {
    this.uri = uri;
    this.options = {
      maxPoolSize: options.maxPoolSize ?? 10,
      serverSelectionTimeoutMS: options.serverSelectionTimeoutMS ?? 5000,
      connectTimeoutMS: options.connectTimeoutMS ?? 10000,
    };
  }

  static getInstance(options?: IMongoDriverOptions): MongoDriver {
    if (!MongoDriver.instance) {
      const uri =
        process.env.MONGODB_URI ?? process.env.MONGO_URI;
      if (!uri) {
        throw new Error(
          "MongoDB connection is not configured. Set the MONGO_URI or MONGODB_URI environment variable."
        );
      }
      MongoDriver.instance = new MongoDriver(uri, options);
    }
    return MongoDriver.instance;
  }

  static resetInstance(): void {
    MongoDriver.instance = null;
  }

  private async getClient(): Promise<MongoClient> {
    if (!this.clientPromise) {
      const client = new MongoClient(this.uri, this.options);
      this.clientPromise = client.connect().then(() => {
        // Clean up on process termination
        process.once("SIGINT", () => this.disconnect());
        process.once("SIGTERM", () => this.disconnect());
        return client;
      });
    }
    return this.clientPromise;
  }

  async disconnect(): Promise<void> {
    if (this.clientPromise) {
      const client = await this.clientPromise;
      await client.close();
      this.clientPromise = null;
      MongoDriver.instance = null;
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

let _driver: MongoDriver | null = null;
export function getMongoDriver(): MongoDriver {
  if (!_driver) _driver = MongoDriver.getInstance();
  return _driver;
}
export const mongoDriver = new Proxy({} as MongoDriver, {
  get(_, prop: string) {
    const driver = getMongoDriver();
    const value = (driver as unknown as Record<string, unknown>)[prop];
    if (typeof value === "function") {
      return value.bind(driver);
    }
    return value;
  },
});