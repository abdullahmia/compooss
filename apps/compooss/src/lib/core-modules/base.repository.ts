import { connectionManager } from "@/lib/driver/connection-manager";
import type { MongoDriver } from "@/lib/driver/mongodb.driver";

/**
 * All repositories extend this class.
 * Provides a shared driver reference via the ConnectionManager
 * and a db() helper. Throws if no active connection exists.
 */
export abstract class BaseRepository {
  protected get driver(): MongoDriver {
    return connectionManager.getActiveDriver();
  }

  protected db(dbName: string) {
    return this.driver.getDb(dbName);
  }
}
