import React from "react";
import { PlaygroundShell } from "./playground-shell";

type Props = {
  children: React.ReactNode;
};

/** Masks password in MongoDB URI for safe display (e.g. mongodb://user:xxx@host -> user:***@host). */
function getConnectionDisplayString(uri: string | undefined): string {
  if (!uri) return "No connection";
  try {
    return uri.replace(/^mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/, "mongodb$1://$2:***@");
  } catch {
    return uri;
  }
}

export default function PlaygroundLayout({ children }: Props) {
  const connectionDisplay = getConnectionDisplayString(process.env.MONGO_URI);
  return (
    <PlaygroundShell connectionString={connectionDisplay}>
      {children}
    </PlaygroundShell>
  );
}
