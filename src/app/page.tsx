"use client";

import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { DatabaseSidebar } from "@/components/DatabaseSidebar";
import { CollectionView } from "@/components/CollectionView";
import { WelcomeView } from "@/components/WelcomeView";
import { ConnectionScreen } from "@/components/ConnectionScreen";
import { CreateDatabaseModal } from "@/components/CreateDatabaseModal";
import { databases as initialDatabases } from "@/data/mockData";
import type { Database } from "@/data/mockData";

export default function Home() {
  const [connected, setConnected] = useState(false);
  const [connectionString, setConnectionString] = useState("");
  const [selectedDb, setSelectedDb] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [databases, setDatabases] = useState<Database[]>(initialDatabases);
  const [createDbOpen, setCreateDbOpen] = useState(false);

  const handleConnect = (connStr: string) => {
    setConnectionString(connStr);
    setConnected(true);
  };

  const handleDisconnect = () => {
    setConnected(false);
    setConnectionString("");
    setSelectedDb(null);
    setSelectedCollection(null);
  };

  const handleSelectCollection = (db: string, collection: string) => {
    setSelectedDb(db);
    setSelectedCollection(collection);
  };

  const handleCreateDatabase = (dbName: string, collectionName: string) => {
    const newDb: Database = {
      name: dbName,
      sizeOnDisk: "0 B",
      collections: [
        { name: collectionName, documentCount: 0, avgDocSize: "0 B", totalSize: "0 B", indexes: 1 },
      ],
    };
    setDatabases(prev => [...prev, newDb]);
    setSelectedDb(dbName);
    setSelectedCollection(collectionName);
  };

  if (!connected) {
    return <ConnectionScreen onConnect={handleConnect} />;
  }

  const currentDb = databases.find((d) => d.name === selectedDb);
  const currentCollection = currentDb?.collections.find((c) => c.name === selectedCollection);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopBar connectionString={connectionString} onDisconnect={handleDisconnect} />
      <div className="flex flex-1 overflow-hidden">
        <DatabaseSidebar
          databases={databases}
          selectedDb={selectedDb}
          selectedCollection={selectedCollection}
          onSelectCollection={handleSelectCollection}
          onCreateDatabase={() => setCreateDbOpen(true)}
        />
        {currentDb && currentCollection ? (
          <CollectionView dbName={currentDb.name} collection={currentCollection} />
        ) : (
          <WelcomeView />
        )}
      </div>
      <CreateDatabaseModal
        open={createDbOpen}
        onClose={() => setCreateDbOpen(false)}
        onCreate={handleCreateDatabase}
      />
    </div>
  );
}
