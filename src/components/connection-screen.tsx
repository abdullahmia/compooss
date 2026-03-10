"use client";

import { Clock, Leaf, Plus, Star, StarOff, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button/button";

interface SavedConnection {
  id: string;
  name: string;
  connectionString: string;
  lastUsed: string;
  favorite: boolean;
}

const defaultConnections: SavedConnection[] = [
  { id: "1", name: "Local Development", connectionString: "mongodb://localhost:27017", lastUsed: "2 hours ago", favorite: true },
  { id: "2", name: "Staging Server", connectionString: "mongodb+srv://staging.cluster.mongodb.net", lastUsed: "3 days ago", favorite: false },
];

interface ConnectionScreenProps {
  onConnect: (connectionString: string) => void;
}

export function ConnectionScreen({ onConnect }: ConnectionScreenProps) {
  const [connections, setConnections] = useState<SavedConnection[]>(defaultConnections);
  const [connectionString, setConnectionString] = useState("mongodb://localhost:27017");
  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName] = useState("");

  const handleConnect = () => {
    if (connectionString.trim()) {
      onConnect(connectionString);
    }
  };

  const toggleFavorite = (id: string) => {
    setConnections(prev => prev.map(c => c.id === id ? { ...c, favorite: !c.favorite } : c));
  };

  const removeConnection = (id: string) => {
    setConnections(prev => prev.filter(c => c.id !== id));
  };

  const handleSaveNew = () => {
    if (newName.trim() && connectionString.trim()) {
      setConnections(prev => [...prev, {
        id: Date.now().toString(),
        name: newName,
        connectionString,
        lastUsed: "Just now",
        favorite: false,
      }]);
      setShowNewForm(false);
      setNewName("");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Minimal top bar */}
      <div className="h-11 flex items-center gap-2 px-4 bg-topbar border-b border-border shrink-0">
        <Leaf className="h-5 w-5 text-primary" />
        <span className="font-semibold text-sm text-foreground tracking-tight">Compooss</span>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <Leaf className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">New Connection</h1>
            <p className="text-sm text-muted-foreground">
              Connect to a MongoDB deployment
            </p>
          </div>

          {/* Connection URI input */}
          <div className="bg-card border border-border rounded-lg p-5 mb-6">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
              Connection String
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={connectionString}
                onChange={(e) => setConnectionString(e.target.value)}
                className="flex-1 bg-secondary text-sm font-mono text-foreground px-4 py-2.5 rounded-sm border border-border focus:border-primary focus:ring-1 focus:ring-primary/30 outline-hidden transition-colors placeholder:text-muted-foreground"
                placeholder="mongodb://localhost:27017"
              />
              <Button onClick={handleConnect}>
                Connect
              </Button>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <Button variant="ghost"
                icon={<Plus className="h-3 w-3" />}
                onClick={() => setShowNewForm(!showNewForm)}>
                Save as favorite
              </Button>
            </div>

            {showNewForm && (
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Connection name"
                  className="flex-1 bg-secondary text-xs text-foreground px-3 py-2 rounded-sm border border-border focus:border-primary outline-hidden transition-colors placeholder:text-muted-foreground"
                />
                <button
                  onClick={handleSaveNew}
                  className="bg-primary/15 text-primary px-4 py-2 rounded-sm text-xs font-medium hover:bg-primary/25 transition-colors"
                >
                  Save
                </button>
              </div>
            )}
          </div>

          {/* Saved connections */}
          {connections.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Saved Connections
              </h3>
              <div className="space-y-2">
                {connections.map((conn) => (
                  <div
                    key={conn.id}
                    className="bg-card border border-border rounded-lg p-4 hover:border-primary/30 transition-colors group cursor-pointer"
                    onClick={() => { setConnectionString(conn.connectionString); }}
                    onDoubleClick={() => onConnect(conn.connectionString)}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(conn.id); }}
                        className="text-muted-foreground hover:text-warning transition-colors"
                      >
                        {conn.favorite ? (
                          <Star className="h-4 w-4 fill-warning text-warning" />
                        ) : (
                          <StarOff className="h-4 w-4" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{conn.name}</span>
                        </div>
                        <span className="text-xs font-mono text-muted-foreground truncate block mt-0.5">
                          {conn.connectionString}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {conn.lastUsed}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeConnection(conn.id); }}
                          className="p-1 text-muted-foreground hover:text-destructive rounded-sm opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); onConnect(conn.connectionString); }}
                          className="bg-primary/15 text-primary px-3 py-1 rounded-sm text-xs font-medium hover:bg-primary/25 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          Connect
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
