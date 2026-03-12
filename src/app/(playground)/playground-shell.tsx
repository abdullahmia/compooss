"use client";

import { CollectionView } from "@/components/collection-view";
import { CreateDatabaseModal } from "@/components/create-database-modal";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";
import { WelcomeView } from "@/components/welcome-view";
import type { IDatabase } from "@/lib/types/database.types";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface IPlaygroundShellProps {
  initialConnectionString: string;
  initialConnectionError: string | null;
  initialDatabases: IDatabase[];
}

export function PlaygroundShell({
  initialConnectionString,
  initialConnectionError,
  initialDatabases,
}: IPlaygroundShellProps) {
  const [connectionString, setConnectionString] = useState(
    initialConnectionString,
  );
  const [connectionError, setConnectionError] = useState<string | null>(
    initialConnectionError,
  );
  const [selectedDb, setSelectedDb] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null,
  );
  const [databases] = useState<IDatabase[]>(initialDatabases);
  const [createDbOpen, setCreateDbOpen] = useState(false);

  const router = useRouter();

  const handleDisconnect = () => {
    setConnectionString("Not connected");
    setConnectionError(null);
    setSelectedDb(null);
    setSelectedCollection(null);
  };

  const handleSelectCollection = (db: string, collection: string) => {
    setSelectedDb(db);
    setSelectedCollection(collection);
  };

  const handleRefreshConnection = () => {
    router.refresh();
  };

  const currentDb = databases.find((d) => d.name === selectedDb);
  const currentCollection = currentDb?.collections.find(
    (c) => c.name === selectedCollection,
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopBar
        connectionString={connectionString}
        onDisconnect={handleDisconnect}
        onRefreshConnection={handleRefreshConnection}
      />
      {connectionError && (
        <div className="px-4 py-2 bg-destructive/10 border-b border-destructive/30 text-xs text-destructive">
          {connectionError}
        </div>
      )}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          databases={databases}
          selectedDb={selectedDb}
          selectedCollection={selectedCollection}
          onSelectCollection={handleSelectCollection}
          onCreateDatabase={() => setCreateDbOpen(true)}
        />
        {currentDb && currentCollection ? (
          <CollectionView
            dbName={currentDb.name}
            collection={currentCollection}
          />
        ) : (
          <WelcomeView />
        )}
      </div>
      <CreateDatabaseModal
        open={createDbOpen}
        onClose={() => setCreateDbOpen(false)}
        onCreated={() => router.refresh()}
      />
    </div>
  );
}

