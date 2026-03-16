"use client";

import type { SavedConnection } from "@compooss/types";
import { ArrowDownAZ, Clock, Filter, Search, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { ConnectionCard } from "./connection-card";

type SortKey = "name" | "lastUsedAt" | "createdAt";

interface ConnectionListProps {
  connections: SavedConnection[];
  onConnect: (connection: SavedConnection) => void;
  onEdit: (connection: SavedConnection) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  connectingId?: string | null;
}

export function ConnectionList({
  connections,
  onConnect,
  onEdit,
  onDelete,
  onToggleFavorite,
  connectingId,
}: ConnectionListProps) {
  const [search, setSearch] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>("lastUsedAt");

  const filtered = useMemo(() => {
    let result = connections;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.label && c.label.toLowerCase().includes(q)),
      );
    }

    if (showFavoritesOnly) {
      result = result.filter((c) => c.isFavorite);
    }

    return [...result].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "lastUsedAt") {
        const aTime = a.lastUsedAt
          ? new Date(a.lastUsedAt).getTime()
          : 0;
        const bTime = b.lastUsedAt
          ? new Date(b.lastUsedAt).getTime()
          : 0;
        return bTime - aTime;
      }
      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    });
  }, [connections, search, showFavoritesOnly, sortBy]);

  const favorites = useMemo(
    () => filtered.filter((c) => c.isFavorite),
    [filtered],
  );
  const recent = useMemo(
    () =>
      filtered
        .filter((c) => c.lastUsedAt && !c.isFavorite)
        .slice(0, 5),
    [filtered],
  );
  const rest = useMemo(
    () =>
      filtered.filter(
        (c) =>
          !c.isFavorite &&
          !recent.some((r) => r.id === c.id),
      ),
    [filtered, recent],
  );

  const renderSection = (
    title: string,
    items: SavedConnection[],
    icon: React.ReactNode,
  ) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-4">
        <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
          {icon}
          {title}
        </h3>
        <div className="space-y-1.5">
          {items.map((conn) => (
            <ConnectionCard
              key={conn.id}
              connection={conn}
              onConnect={onConnect}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleFavorite={onToggleFavorite}
              isConnecting={connectingId === conn.id}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-2 bg-secondary rounded-sm px-2.5 py-1.5 flex-1">
          <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search connections..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-hidden w-full"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={`p-1.5 rounded-sm transition-colors ${showFavoritesOnly ? "bg-warning/15 text-warning" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
          title="Filter favorites"
        >
          <Filter className="h-3.5 w-3.5" />
        </button>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortKey)}
          className="text-[11px] bg-secondary text-foreground border-none rounded-sm px-2 py-1.5 outline-hidden cursor-pointer"
        >
          <option value="lastUsedAt">Recent</option>
          <option value="name">Name</option>
          <option value="createdAt">Created</option>
        </select>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No connections found</p>
            <p className="text-xs mt-1">
              {search
                ? "Try a different search term"
                : "Create a new connection to get started"}
            </p>
          </div>
        ) : showFavoritesOnly ? (
          <div className="space-y-1.5">
            {filtered.map((conn) => (
              <ConnectionCard
                key={conn.id}
                connection={conn}
                onConnect={onConnect}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleFavorite={onToggleFavorite}
                isConnecting={connectingId === conn.id}
              />
            ))}
          </div>
        ) : (
          <>
            {renderSection(
              "Favorites",
              favorites,
              <Star className="h-3 w-3" />,
            )}
            {renderSection(
              "Recent",
              recent,
              <Clock className="h-3 w-3" />,
            )}
            {renderSection(
              "All Connections",
              rest,
              <ArrowDownAZ className="h-3 w-3" />,
            )}
          </>
        )}
      </div>
    </div>
  );
}
