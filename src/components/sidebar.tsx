"use client";

import type { IDatabase } from "@/lib/types/database.types";
import {
  ChevronDown,
  ChevronRight,
  Database as DbIcon,
  Plus,
  RefreshCw,
  Search,
  Table2,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "./ui/badge/badge";
import { IconButton } from "./ui/icon-button/icon-button";

interface DatabaseSidebarProps {
  databases: IDatabase[];
  selectedDb: string | null;
  selectedCollection: string | null;
  onSelectCollection: (db: string, collection: string) => void;
  onCreateDatabase?: () => void;
}

export function Sidebar({ databases, selectedDb, selectedCollection, onSelectCollection, onCreateDatabase }: DatabaseSidebarProps) {
  const [expandedDbs, setExpandedDbs] = useState<Set<string>>(new Set(["ecommerce"]));
  const [search, setSearch] = useState("");

  const toggleDb = (name: string) => {
    setExpandedDbs((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const filtered = databases.filter(
    (db) =>
      db.name.toLowerCase().includes(search.toLowerCase()) ||
      db.collections.some((c) => c.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="w-64 bg-sidebar border-r border-border flex flex-col shrink-0 h-full">
      {/* Sidebar header */}
      <div className="p-3 border-b border-border flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Databases</span>
        <div className="flex items-center gap-1">
          <IconButton
            variant="toolbar"
            icon={<Plus className="h-3.5 w-3.5" />}
            label="Create Database"
            onClick={onCreateDatabase}
          />
          <IconButton
            variant="toolbar"
            icon={<RefreshCw className="h-3.5 w-3.5" />}
            label="Refresh"
          />
        </div>
      </div>

      {/* Search */}
      <div className="p-2">
        <div className="flex items-center gap-2 bg-secondary rounded-sm px-2 py-1.5">
          <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Filter databases..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-hidden w-full"
          />
        </div>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto scrollbar-thin py-1">
        {filtered.length === 0 ? (
          <div className="px-3 py-2 text-xs text-muted-foreground">
            No databases found
          </div>
        ) : (
          filtered.map((db) => {
            const isExpanded = expandedDbs.has(db.name);
            const filteredCollections = db.collections.filter((c) =>
              c.name.toLowerCase().includes(search.toLowerCase()) ||
              db.name.toLowerCase().includes(search.toLowerCase())
            );

            return (
              <div key={db.name}>
                <button
                  onClick={() => toggleDb(db.name)}
                  className="w-full flex items-center gap-1.5 px-3 py-1.5 text-xs hover:bg-sidebar-accent transition-colors group"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                  <DbIcon className="h-3.5 w-3.5 text-primary" />
                  <span className="font-medium text-sidebar-foreground">
                    {db.name}
                  </span>
                  <Badge variant="subtle" size="sm" className="ml-auto">
                    {db.sizeOnDisk}
                  </Badge>
                </button>

                {isExpanded && (
                  <div className="ml-4">
                    {filteredCollections.map((col) => {
                      const isActive =
                        selectedDb === db.name && selectedCollection === col.name;
                      return (
                        <button
                          key={col.name}
                          onClick={() => onSelectCollection(db.name, col.name)}
                          className={`w-full flex items-center gap-1.5 pl-5 pr-3 py-1.5 text-xs transition-colors ${
                            isActive
                              ? "bg-primary/15 text-primary"
                              : "text-sidebar-foreground hover:bg-sidebar-accent"
                          }`}
                        >
                          <Table2 className="h-3 w-3 shrink-0" />
                          <span className="truncate">{col.name}</span>
                          <Badge variant="subtle" size="sm" className="ml-auto">
                            {col.documentCount.toLocaleString()}
                          </Badge>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <div className="text-[10px] text-muted-foreground">
          <span className="text-primary font-medium">●</span>{" "}
          {databases.length > 0
            ? `Connected — ${databases.length} databases`
            : "Not connected"}
        </div>
      </div>
    </div>
  );
}
