"use client";

import { connectionDB } from "@/lib/db/connection-db";
import { useConnection } from "@/lib/providers/connection-provider";
import type { SavedConnection } from "@compooss/types";
import { Leaf } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ConnectionForm } from "./connection-form";
import type { TConnectionForm } from "@/lib/schemas/connection.schema";
import { ConnectionList } from "./connection-list";

export function ConnectionPage() {
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

    await connectionDB.save(saved);

    try {
      await connect(saved);
      toast.success(`Connected to ${saved.name}`);
      router.push("/");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Connection failed",
      );
      await loadConnections();
    }
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
      await connect(connection);
      toast.success(`Connected to ${connection.name}`);
      router.push("/");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Connection failed",
      );
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

  const formDefaults: Partial<TConnectionForm> | undefined =
    editingConnection
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

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="h-11 flex items-center gap-2 px-4 bg-topbar border-b border-border shrink-0">
        <Leaf className="h-5 w-5 text-primary" />
        <span className="font-semibold text-sm text-foreground tracking-tight">
          Compooss
        </span>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Form */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-xl font-bold text-foreground mb-1">
                {editingConnection
                  ? `Edit: ${editingConnection.name}`
                  : "New Connection"}
              </h1>
              <p className="text-xs text-muted-foreground">
                Connect to a MongoDB deployment
              </p>
              {editingConnection && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-xs text-primary hover:text-primary/80 mt-1"
                >
                  Cancel editing
                </button>
              )}
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

        {/* Right: Saved connections list */}
        {connections.length > 0 && (
          <div className="w-96 border-l border-border bg-sidebar p-4 overflow-hidden flex flex-col">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Saved Connections ({connections.length})
            </h2>
            <ConnectionList
              connections={connections}
              onConnect={handleConnect}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleFavorite={handleToggleFavorite}
              connectingId={connectingId}
            />
          </div>
        )}
      </div>
    </div>
  );
}
