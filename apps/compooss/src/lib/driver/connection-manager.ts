import type { MongoClientOptions } from "mongodb";
import type { ConnectionStatus, ConnectionTestResult } from "@compooss/types";
import { MongoDriver } from "./mongodb.driver";

function maskUri(uri: string): string {
  try {
    return uri.replace(
      /^mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/,
      "mongodb$1://$2:***@",
    );
  } catch {
    return uri;
  }
}

class ConnectionManager {
  private static _instance: ConnectionManager | null = null;
  private activeDriver: MongoDriver | null = null;
  private activeUri: string | null = null;

  static getInstance(): ConnectionManager {
    if (!ConnectionManager._instance) {
      ConnectionManager._instance = new ConnectionManager();
    }
    return ConnectionManager._instance;
  }

  async connect(
    uri: string,
    options?: MongoClientOptions,
  ): Promise<ConnectionStatus> {
    if (this.activeDriver) {
      await this.disconnect();
    }

    const driver = new MongoDriver(uri, options);
    const ok = await driver.ping();
    if (!ok) {
      await driver.disconnect();
      throw new Error(
        "Could not connect to MongoDB. Check the connection string and ensure the server is running.",
      );
    }

    this.activeDriver = driver;
    this.activeUri = uri;

    const serverInfo = await driver.getServerInfo();
    return {
      connected: true,
      maskedUri: maskUri(uri),
      serverInfo,
    };
  }

  async disconnect(): Promise<void> {
    if (this.activeDriver) {
      await this.activeDriver.disconnect();
      this.activeDriver = null;
      this.activeUri = null;
    }
  }

  async testConnection(
    uri: string,
    options?: MongoClientOptions,
  ): Promise<ConnectionTestResult> {
    const driver = new MongoDriver(uri, options);
    try {
      const ok = await driver.ping();
      if (!ok) {
        return { ok: false, message: "Ping failed. Check your connection string." };
      }
      const serverInfo = await driver.getServerInfo();
      return { ok: true, message: "Connection successful", serverInfo };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Connection test failed";
      return { ok: false, message };
    } finally {
      await driver.disconnect();
    }
  }

  getActiveDriver(): MongoDriver {
    if (!this.activeDriver) {
      throw new Error("No active MongoDB connection. Connect first.");
    }
    return this.activeDriver;
  }

  isConnected(): boolean {
    return this.activeDriver !== null;
  }

  getStatus(): ConnectionStatus {
    if (!this.activeDriver || !this.activeUri) {
      return { connected: false };
    }
    return {
      connected: true,
      maskedUri: maskUri(this.activeUri),
    };
  }

  getRawUri(): string | null {
    return this.activeUri;
  }
}

const globalForConn = globalThis as unknown as {
  __compooss_connection_manager?: ConnectionManager;
};

export const connectionManager =
  globalForConn.__compooss_connection_manager ??
  ConnectionManager.getInstance();

globalForConn.__compooss_connection_manager = connectionManager;
