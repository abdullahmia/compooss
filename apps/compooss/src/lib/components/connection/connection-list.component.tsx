"use client";

import type { SavedConnection } from "@compooss/types";
import { cn } from "@compooss/ui";
import { Clock, Search, Star, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ConnectionCard } from "./connection-card.component";

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
      const aTime = a.lastUsedAt ? new Date(a.lastUsedAt).getTime() : 0;
      const bTime = b.lastUsedAt ? new Date(b.lastUsedAt).getTime() : 0;
      return bTime - aTime;
    });
  }, [connections, search, showFavoritesOnly]);

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
        <div className="flex items-center gap-1.5 mb-1.5 px-0.5">
          <span className="text-muted-foreground/50">{icon}</span>
          <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">
            {title}
          </span>
          <span className="text-[10px] text-muted-foreground/30 tabular-nums ml-auto">{items.length}</span>
        </div>
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
      {/* Search + favorites toggle */}
      <div className="px-3 pt-3 pb-3 flex items-center gap-2">
        <div className="relative flex items-center flex-1">
          <Search className="absolute left-3 h-3.5 w-3.5 text-muted-foreground/40 pointer-events-none" />
          <input
            type="text"
            placeholder="Search connections..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-8 bg-secondary/50 text-sm text-foreground placeholder:text-muted-foreground/40 border border-transparent focus:border-primary/20 focus:outline-none rounded-lg pl-9 pr-8 transition-colors"
          />
          {search && (
            <button
              type="button"
              className="absolute right-2.5 text-muted-foreground/40 hover:text-foreground transition-colors"
              onClick={() => setSearch("")}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          title={showFavoritesOnly ? "Show all" : "Favorites only"}
          className={cn(
            "h-8 w-8 flex items-center justify-center rounded-lg transition-all shrink-0",
            showFavoritesOnly
              ? "bg-warning/10 text-warning"
              : "text-muted-foreground/40 hover:text-muted-foreground hover:bg-secondary",
          )}
        >
          <Star className={cn("h-3.5 w-3.5", showFavoritesOnly && "fill-warning")} />
        </button>
      </div>

      <div className="mx-3 border-t border-border/40 mb-0" />

      {/* Connection list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-3 py-3">
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
            {renderSection("All Connections", rest, null)}
          </>
        )}
      </div>
    </div>
  );
};
