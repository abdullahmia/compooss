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

function resolveDockerHost(uri: string): string | null {
  try {
    const url = new URL(uri);
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
      url.hostname = "mongo";
      return url.toString();
    }
    return null;
  } catch {
    return null;
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
    let ok = await driver.ping();
    let resolvedUri: string | undefined;

    if (!ok) {
      await driver.disconnect();
      const fallback = resolveDockerHost(uri);
      if (fallback) {
        const fallbackDriver = new MongoDriver(fallback, options);
        const fallbackOk = await fallbackDriver.ping();
        if (!fallbackOk) {
          await fallbackDriver.disconnect();
          throw new Error(
            "Could not connect to MongoDB. Check the connection string and ensure the server is running.",
          );
        }
        this.activeDriver = fallbackDriver;
        this.activeUri = fallback;
        resolvedUri = fallback;
        ok = true;
      } else {
        throw new Error(
          "Could not connect to MongoDB. Check the connection string and ensure the server is running.",
        );
      }
    } else {
      this.activeDriver = driver;
      this.activeUri = uri;
    }

    const serverInfo = await this.activeDriver.getServerInfo();
    return {
      connected: true,
      maskedUri: maskUri(this.activeUri!),
      ...(resolvedUri && { resolvedUri }),
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
      if (ok) {
        const serverInfo = await driver.getServerInfo();
        return { ok: true, message: "Connection successful", serverInfo };
      }

      const fallback = resolveDockerHost(uri);
      if (!fallback) {
        return { ok: false, message: "Ping failed. Check your connection string." };
      }

      await driver.disconnect();
      const fallbackDriver = new MongoDriver(fallback, options);
      try {
        const fallbackOk = await fallbackDriver.ping();
        if (!fallbackOk) {
          return { ok: false, message: "Ping failed. Check your connection string." };
        }
        const serverInfo = await fallbackDriver.getServerInfo();
        return { ok: true, message: "Connection successful", resolvedUri: fallback, serverInfo };
      } finally {
        await fallbackDriver.disconnect();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Connection test failed";
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
