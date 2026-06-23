import type { MongoClientOptions } from "mongodb";
import type { ConnectionStatus, ConnectionTestResult } from "@compooss/types";
import {
  classifyMongoError,
  isAuthError,
  maskUri,
  resolveDockerHost,
} from "@/lib/utils/connection.util";
import { MongoDriver } from "./mongodb.driver";

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
    let resolvedUri: string | undefined;

    try {
      await driver.ping();
      this.activeDriver = driver;
      this.activeUri = uri;
    } catch (err) {
      await driver.disconnect();

      if (isAuthError(err)) {
        throw new Error(classifyMongoError(err));
      }

      const fallback = resolveDockerHost(uri);
      if (!fallback) {
        throw new Error(classifyMongoError(err));
      }

      const fallbackDriver = new MongoDriver(fallback, options);
      try {
        await fallbackDriver.ping();
      } catch (fallbackErr) {
        await fallbackDriver.disconnect();
        throw new Error(classifyMongoError(fallbackErr));
      }

      this.activeDriver = fallbackDriver;
      this.activeUri = fallback;
      resolvedUri = fallback;
    }

    const serverInfo = await this.activeDriver!.getServerInfo();
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
      await driver.ping();
      const serverInfo = await driver.getServerInfo();
      return { ok: true, message: "Connection successful", serverInfo };
    } catch (err) {
      if (isAuthError(err)) {
        return { ok: false, message: classifyMongoError(err) };
      }

      const fallback = resolveDockerHost(uri);
      if (!fallback) {
        return { ok: false, message: classifyMongoError(err) };
      }

      await driver.disconnect();
      const fallbackDriver = new MongoDriver(fallback, options);
      try {
        await fallbackDriver.ping();
        const serverInfo = await fallbackDriver.getServerInfo();
        return { ok: true, message: "Connection successful", resolvedUri: fallback, serverInfo };
      } catch (fallbackErr) {
        return { ok: false, message: classifyMongoError(fallbackErr) };
      } finally {
        await fallbackDriver.disconnect();
      }
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
