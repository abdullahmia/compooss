"use client";

import type { SavedConnection } from "@compooss/types";
import { IconButton, cn } from "@compooss/ui";
import { ArrowDownAZ, Clock, Search, Star, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ConnectionCard } from "./connection-card.component";

type SortKey = "name" | "lastUsedAt" | "createdAt";

type Props = {
  connections: SavedConnection[];
  onConnect: (connection: SavedConnection) => void;
  onEdit: (connection: SavedConnection) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  connectingId?: string | null;
};

export const ConnectionList: React.FC<Props> = ({
  connections,
  onConnect,
  onEdit,
  onDelete,
  onToggleFavorite,
  connectingId,
}) => {
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
      <div className="mb-5">
        <h3 className="text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2 flex items-center gap-1.5 px-1">
          {icon}
          {title}
          <span className="text-muted-foreground/40 ml-auto tabular-nums">{items.length}</span>
        </h3>
        <div className="space-y-2">
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
      {/* Search & Filters */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-2 bg-secondary/80 rounded-lg px-3 py-2 flex-1 border border-transparent focus-within:border-primary/20 transition-colors">
          <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-hidden w-full"
          />
          {search && (
            <IconButton
              variant="ghost"
              size="sm"
              icon={<X className="h-3 w-3" />}
              label="Clear search"
              onClick={() => setSearch("")}
            />
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={cn(
            "p-2 rounded-lg transition-all border",
            showFavoritesOnly
              ? "bg-warning/10 text-warning border-warning/20"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary border-transparent",
          )}
          title="Filter favorites"
        >
          <Star className={cn("h-3.5 w-3.5", showFavoritesOnly && "fill-warning")} />
        </button>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortKey)}
          className="text-[11px] bg-secondary/80 text-foreground border border-transparent rounded-lg px-2.5 py-2 outline-hidden cursor-pointer hover:bg-secondary transition-colors"
        >
          <option value="lastUsedAt">Recent</option>
          <option value="name">Name</option>
          <option value="createdAt">Created</option>
        </select>
      </div>

      {/* Connection list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-3">
              <Search className="h-4 w-4 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium">No connections found</p>
            <p className="text-xs mt-1 text-muted-foreground/70">
              {search
                ? "Try a different search term"
                : "Create a new connection to get started"}
            </p>
          </div>
        ) : showFavoritesOnly ? (
          <div className="space-y-2">
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
};
