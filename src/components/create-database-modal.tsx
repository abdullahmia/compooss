"use client";

import { useState } from "react";
import { X, Database } from "lucide-react";

interface CreateDatabaseModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (dbName: string, collectionName: string) => void;
}

export function CreateDatabaseModal({ open, onClose, onCreate }: CreateDatabaseModalProps) {
  const [dbName, setDbName] = useState("");
  const [collectionName, setCollectionName] = useState("");

  if (!open) return null;

  const handleCreate = () => {
    if (dbName.trim() && collectionName.trim()) {
      onCreate(dbName.trim(), collectionName.trim());
      setDbName("");
      setCollectionName("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-background/10 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Create Database</h2>
          </div>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground rounded-sm hover:bg-secondary transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Database Name</label>
            <input
              type="text"
              value={dbName}
              onChange={(e) => setDbName(e.target.value)}
              placeholder="e.g. my_database"
              className="w-full bg-secondary text-sm font-mono text-foreground px-3 py-2 rounded-sm border border-border focus:border-primary focus:ring-1 focus:ring-primary/30 outline-hidden transition-colors placeholder:text-muted-foreground"
              autoFocus
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Collection Name</label>
            <input
              type="text"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              placeholder="e.g. my_collection"
              className="w-full bg-secondary text-sm font-mono text-foreground px-3 py-2 rounded-sm border border-border focus:border-primary focus:ring-1 focus:ring-primary/30 outline-hidden transition-colors placeholder:text-muted-foreground"
            />
          </div>
          <div className="bg-secondary/50 border border-border rounded-sm p-3">
            <p className="text-[11px] text-muted-foreground">
              Before MongoDB can save your new database, a collection name must also be specified at the time of creation.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground rounded-sm border border-border hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!dbName.trim() || !collectionName.trim()}
            className="px-4 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Create Database
          </button>
        </div>
      </div>
    </div>
  );
}
