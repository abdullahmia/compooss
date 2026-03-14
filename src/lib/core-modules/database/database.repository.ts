import { BaseRepository } from "../base.repository";
import { ICreateDatabaseInput, IDatabase } from "../repository.types";

export class DatabaseRepository extends BaseRepository {

  /**
   * Returns a list of all databases with size info.
   */
  async getAllDatabases(): Promise<IDatabase[]> {
    return this.driver.listDatabases();
  }

  /**
   * Returns a single database by name, or null if it doesn't exist.
   */
  async getDatabase(databaseName: string): Promise<IDatabase | null> {
    const databases = await this.driver.listDatabases();
    return databases.find((db) => db.name === databaseName) ?? null;
  }

  /**
   * Creates a new database by inserting an initial collection.
   * MongoDB doesn't persist empty databases — a collection is required.
   */
  async createDatabase(input: ICreateDatabaseInput): Promise<IDatabase> {
    const { databaseName, initialCollection } = input;

    const existing = await this.getDatabase(databaseName);
    if (existing) {
      throw new Error(`Database "${databaseName}" already exists.`);
    }

    const db = await this.db(databaseName);
    await db.createCollection(initialCollection);

    const created = await this.getDatabase(databaseName);
    if (!created) {
      throw new Error(`Failed to create database "${databaseName}".`);
    }

    return created;
  }

  /** MongoDB system databases that cannot be dropped. */
  private static readonly PROTECTED_DATABASES = ["admin", "local", "config"];

  /**
   * Drops an entire database and all its collections.
   * Throws if the database is a protected system database (admin, local, config).
   */
  async deleteDatabase(databaseName: string): Promise<boolean> {
    const name = databaseName.toLowerCase();
    if (DatabaseRepository.PROTECTED_DATABASES.includes(name)) {
      throw new Error(`Dropping the '${databaseName}' database is prohibited.`);
    }

    const db = await this.db(databaseName);
    const result = await db.dropDatabase();
    return result;
  }
}

// Singleton export
export const databaseRepository = new DatabaseRepository();