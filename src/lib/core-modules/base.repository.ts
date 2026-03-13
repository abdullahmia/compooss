import { MongoDriver } from "@/lib/driver/mongodb.driver";
 
/**
 * All repositories extend this class.
 * Provides a shared driver reference and a db() helper.
 */
export abstract class BaseRepository {
  protected readonly driver: MongoDriver;
 
  constructor(driver?: MongoDriver) {
    this.driver = driver ?? MongoDriver.getInstance();
  }
 
  protected db(dbName: string) {
    return this.driver.getDb(dbName);
  }
}
 