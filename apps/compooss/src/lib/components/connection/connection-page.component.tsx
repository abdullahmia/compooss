"use client";

import { connectionDB } from "@/lib/storage/connection-db";
import { useConnection } from "@/lib/providers/connection-provider";
import { apiClient } from "@/lib/config/api.config";
import { ENDPOINTS } from "@/lib/constants";
import type { SavedConnection } from "@compooss/types";
import { Leaf } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ConnectionForm } from "./connection-form.component";
import type { TConnectionForm } from "@/lib/schemas/connection.schema";
import { ConnectionList } from "./connection-list.component";

export const ConnectionPage: React.FC = () => {
  const router = useRouter();
  const { connect, testConnection, isConnecting } = useConnection();
  const [connections, setConnections] = useState<SavedConnection[]>([]);
  const [editingConnection, setEditingConnection] =
    useState<SavedConnection | null>(null);
  const [connectingId, setConnectingId] = useState<string | null>(null);

  const loadConnections = useCallback(async () => {
    const all = await connectionDB.getAll();
    setConnections(all);
  }, []);

  useEffect(() => {
    loadConnections();
  }, [loadConnections]);

  const handleFormSubmit = async (data: TConnectionForm) => {
    try {
      const result = await testConnection(data.connectionString);
      if (!result.ok) {
        toast.error(result.message || "Connection test failed");
        return;
      }
    } catch {
      toast.error("Connection test failed");
      return;
    }

    const id = editingConnection?.id ?? crypto.randomUUID();
    const now = new Date().toISOString();

    const saved: SavedConnection = {
      id,
      name: data.connectionName,
      uri: data.connectionString,
      color: data.color,
      label: data.label,
      isFavorite: data.isFavorite,
      isPinned: editingConnection?.isPinned ?? false,
      authType: data.authType,
      authConfig: data.authConfig,
      tlsConfig: data.tlsConfig,
      advancedConfig: data.advancedConfig,
      createdAt: editingConnection?.createdAt ?? now,
      lastUsedAt: now,
    };

    try {
      await connect(saved);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Connection failed");
      return;
    }

    try {
      await apiClient.get(ENDPOINTS.databases.root);
    } catch {
      toast.error("Unable to reach the database. Please check your connection string.");
      return;
    }

    await connectionDB.save(saved);
    toast.success(`Connected to ${saved.name}`);
    router.push("/");
  };

  const handleTest = async (uri: string) => {
    try {
      return await testConnection(uri);
    } catch {
      return { ok: false, message: "Test failed" };
    }
  };

  const handleConnect = async (connection: SavedConnection) => {
    setConnectingId(connection.id);
    try {
      const result = await testConnection(connection.uri);
      if (!result.ok) {
        toast.error(result.message || "Connection test failed");
        return;
      }

      await connect(connection);
      toast.success(`Connected to ${connection.name}`);
      router.push("/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Connection failed");
    } finally {
      setConnectingId(null);
    }
  };

  const handleEdit = (connection: SavedConnection) => {
    setEditingConnection(connection);
  };

  const handleDelete = async (id: string) => {
    await connectionDB.delete(id);
    if (editingConnection?.id === id) setEditingConnection(null);
    await loadConnections();
    toast.success("Connection removed");
  };

  const handleToggleFavorite = async (id: string) => {
    const conn = connections.find((c) => c.id === id);
    if (!conn) return;
    await connectionDB.update(id, { isFavorite: !conn.isFavorite });
    await loadConnections();
  };

  const handleCancelEdit = () => {
    setEditingConnection(null);
  };

  const formDefaults: Partial<TConnectionForm> | undefined = editingConnection
    ? {
        connectionString: editingConnection.uri,
        connectionName: editingConnection.name,
        isFavorite: editingConnection.isFavorite,
        color: editingConnection.color,
        label: editingConnection.label,
        authType: editingConnection.authType,
        authConfig: editingConnection.authConfig,
        tlsConfig: editingConnection.tlsConfig,
        advancedConfig: editingConnection.advancedConfig,
      }
    : undefined;

  const hasConnections = connections.length > 0;

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Topbar */}
      <div className="h-11 flex items-center justify-between px-4 bg-topbar border-b border-border shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-primary/15 flex items-center justify-center">
            <Leaf className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="font-semibold text-sm text-foreground tracking-tight">
            Compooss
          </span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main content area */}
        <div className="flex-1 overflow-y-auto relative flex items-center justify-center">
          {/* Subtle background glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/[0.03] rounded-full blur-[100px]" />
          </div>

          <div className="relative z-10 max-w-xl w-full mx-auto px-6 py-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 mb-4">
                <Leaf className="h-7 w-7 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1.5">
                {editingConnection
                  ? `Edit Connection`
                  : "New Connection"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {editingConnection
                  ? (
                    <span>
                      Editing <span className="text-foreground font-medium">{editingConnection.name}</span>
                      {" · "}
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        Cancel
                      </button>
                    </span>
                  )
                  : "Connect to your MongoDB deployment"}
              </p>
            </div>

            <ConnectionForm
              key={editingConnection?.id ?? "new"}
              defaultValues={formDefaults}
              onSubmit={handleFormSubmit}
              onTest={handleTest}
              isConnecting={isConnecting}
              editMode={!!editingConnection}
            />
          </div>
        </div>

        {/* Right sidebar: Saved connections */}
        {hasConnections && (
          <div className="w-[380px] border-l border-border bg-sidebar flex flex-col shrink-0">
            <div className="px-4 pt-4 pb-3 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Saved Connections
                </h2>
                <span className="text-[11px] text-muted-foreground/60 tabular-nums">
                  {connections.length}
                </span>
              </div>
            </div>
            <div className="flex-1 overflow-hidden p-3">
              <ConnectionList
                connections={connections}
                onConnect={handleConnect}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleFavorite={handleToggleFavorite}
                connectingId={connectingId}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
