import { checkConnectionHealth } from "@/lib/services/connection/connection.service";
import { PlaygroundShell } from "./playground-shell";

export default async function Home() {
  let connectionString = "Checking connection…";
  let connectionError: string | null = null;

  try {
    const health = await checkConnectionHealth();
    connectionString = health.message;

    if (health.ok) {
    } else {
      connectionError = health.message;
    }
  } catch {
    connectionString = "Cannot connect to MongoDB";
    connectionError =
      "Cannot connect to MongoDB. Ensure the database is running and the connection string is correct.";
  }

  return (
    <PlaygroundShell
      initialConnectionString={connectionString}
      initialConnectionError={connectionError}
    />
  );
}
