import {
  MongoParseError,
  MongoServerError,
  MongoServerSelectionError,
} from "mongodb";

export function classifyMongoError(err: unknown): string {
  if (err instanceof MongoServerError && err.code === 18) {
    return "Authentication failed. Check the username and password in your connection string.";
  }
  if (err instanceof MongoServerSelectionError) {
    return "Could not reach the server. Check the host and port.";
  }
  if (err instanceof MongoParseError) {
    return "Invalid connection string format.";
  }
  return err instanceof Error ? err.message : "Connection failed.";
}

export function isAuthError(err: unknown): boolean {
  return err instanceof MongoServerError && err.code === 18;
}

export function maskUri(uri: string): string {
  try {
    return uri.replace(
      /^mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/,
      "mongodb$1://$2:***@",
    );
  } catch {
    return uri;
  }
}

export function resolveDockerHost(uri: string): string | null {
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
