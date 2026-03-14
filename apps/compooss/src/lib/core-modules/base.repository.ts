import { getMongoDriver, type MongoDriver } from "@/lib/driver/mongodb.driver";

/**
 * All repositories extend this class.
 * Provides a shared driver reference and a db() helper.
 * Driver is resolved lazily so the app can build without MONGO_URI.
 */
export abstract class BaseRepository {
  protected get driver(): MongoDriver {
    return getMongoDriver();
  }

  protected db(dbName: string) {
    return this.driver.getDb(dbName);
  }
}
 