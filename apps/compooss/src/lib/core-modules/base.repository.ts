import { connectionManager } from "@/lib/driver/connection-manager";
import type { MongoDriver } from "@/lib/driver/mongodb.driver";
import { serverLogger } from "@/lib/logger/logger.server";

const SLOW_OPERATION_MS = 1000;

export abstract class BaseRepository {
  protected get driver(): MongoDriver {
    return connectionManager.getActiveDriver();
  }

  protected db(dbName: string) {
    return this.driver.getDb(dbName);
  }

  protected async timed<T>(label: string, ctx: Record<string, unknown>, fn: () => Promise<T>): Promise<T> {
    const start = Date.now();
    try {
      const result = await fn();
      const durationMs = Date.now() - start;
      if (durationMs >= SLOW_OPERATION_MS) {
        serverLogger.warn(`slow operation: ${label}`, { ...ctx, durationMs });
      } else {
        serverLogger.debug(label, { ...ctx, durationMs });
      }
      return result;
    } catch (err) {
      serverLogger.error(`operation failed: ${label}`, {
        ...ctx,
        err: err instanceof Error ? { name: err.name, message: err.message } : String(err),
      });
      throw err;
    }
  }
}
