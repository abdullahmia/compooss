import { checkConnectionHealth } from "@/lib/services/connection/connection.service";
import { getDatabasesWithCollections } from "@/lib/services/database/database.service";
import type { IDatabase } from "@/lib/types/database.types";
import { PlaygroundShell } from "./playground-shell";

export default async function Home() {
  let connectionString = "Checking connection…";
  let connectionError: string | null = null;
  let databases: IDatabase[] = [];

  try {
    const health = await checkConnectionHealth();
    connectionString = health.message;

    if (health.ok) {
      databases = await getDatabasesWithCollections();
    } else {
      connectionError = health.message;
      databases = [];
    }
  } catch {
    connectionString = "Cannot connect to MongoDB";
    connectionError =
      "Cannot connect to MongoDB. Ensure the database is running and the connection string is correct.";
    databases = [];
  }

  return (
    <PlaygroundShell
      initialConnectionString={connectionString}
      initialConnectionError={connectionError}
      initialDatabases={databases}
    />
  );
}
