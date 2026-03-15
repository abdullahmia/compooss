import React, { Suspense } from "react";
import { WorkspaceShell } from "./workspace-shell";

type Props = {
  children: React.ReactNode;
};

/** Masks password in MongoDB URI for safe display (e.g. mongodb://user:xxx@host -> user:***@host). */
function maskConnectionUri(uri: string | undefined): string {
  if (!uri) return "No connection";
  try {
    return uri.replace(/^mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/, "mongodb$1://$2:***@");
  } catch {
    return uri;
  }
}

export default function WorkspaceLayout({ children }: Props) {
  const connectionDisplay = maskConnectionUri(
    process.env.MONGODB_URI ?? process.env.MONGO_URI,
  );
  return (
    <Suspense>
      <WorkspaceShell connectionString={connectionDisplay}>
        {children}
      </WorkspaceShell>
    </Suspense>
  );
}
