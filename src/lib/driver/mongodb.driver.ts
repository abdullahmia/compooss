import { Admin, Db, MongoClient } from "mongodb";

export interface IDatabaseSummary {
  name: string;
  sizeOnDisk: string;
}

export class MongoDriver {
  private static instance: MongoDriver | null = null;
  private clientPromise: Promise<MongoClient> | null = null;
  private uri: string;

  private constructor(uri: string) {
    this.uri = uri;
  }

  static getInstance(): MongoDriver {
    if (!MongoDriver.instance) {
      const uri = process.env.MONGO_URI;
      if (!uri) {
        throw new Error(
          "MongoDB connection is not configured. Set the MONGO_URI environment variable."
        );
      }
      MongoDriver.instance = new MongoDriver(uri);
    }
    return MongoDriver.instance;
  }

  // Reset singleton — useful for testing or reconnecting
  static resetInstance(): void {
    MongoDriver.instance = null;
  }

  private async getClient(): Promise<MongoClient> {
    if (!this.clientPromise) {
      const client = new MongoClient(this.uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
      });
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

  async ping(): Promise<void> {
    const client = await this.getClient();
    await client.db("admin").command({ ping: 1 });
  }

  getDb(dbName: string): Promise<Db> {
    return this.getClient().then((client) => client.db(dbName));
  }

  getAdmin(): Promise<Admin> {
    return this.getClient().then((client) => client.db().admin());
  }

  async listDatabases(): Promise<IDatabaseSummary[]> {
    const admin = await this.getAdmin();
    const { databases } = await admin.listDatabases();

    return databases.map((db) => ({
      name: db.name,
      sizeOnDisk: MongoDriver.formatSize(
        typeof db.sizeOnDisk === "number" ? db.sizeOnDisk : 0
      ),
    }));
  }

  private static formatSize(bytes: number): string {
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

export const mongoDriver = MongoDriver.getInstance();