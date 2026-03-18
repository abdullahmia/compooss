"use client";

import type { SavedConnection } from "@compooss/types";
import { cn } from "@compooss/ui";
import { formatDistanceToNow } from "date-fns";
import {
  Clock,
  Loader2,
  Pencil,
  Plug2,
  Star,
  StarOff,
  Trash2,
} from "lucide-react";

interface ConnectionCardProps {
  connection: SavedConnection;
  onConnect: (connection: SavedConnection) => void;
  onEdit: (connection: SavedConnection) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  isConnecting?: boolean;
}

export function ConnectionCard({
  connection,
  onConnect,
  onEdit,
  onDelete,
  onToggleFavorite,
  isConnecting,
}: ConnectionCardProps) {
  const FavIcon = connection.isFavorite ? Star : StarOff;

  return (
    <div
      className="group relative bg-card/60 border border-border/80 rounded-xl p-3.5 hover:bg-card hover:border-primary/20 transition-all duration-200 cursor-pointer"
      onClick={() => onConnect(connection)}
    >
      <div className="flex items-start gap-3">
        {/* Color indicator + Favorite */}
        <div className="flex flex-col items-center gap-1.5 pt-0.5">
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{
              backgroundColor: connection.color || "hsl(var(--muted-foreground))",
              boxShadow: connection.color ? `0 0 0 2px hsl(var(--card)), 0 0 0 3px ${connection.color}40` : undefined,
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium text-foreground truncate">
              {connection.name}
            </span>
            {connection.isFavorite && (
              <Star className="h-3 w-3 fill-warning text-warning shrink-0" />
            )}
            {connection.label && (
              <span className="text-[10px] px-1.5 py-0.5 bg-primary/8 text-primary/80 rounded-md font-medium shrink-0">
                {connection.label}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1">
            {connection.lastUsedAt && (
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Clock className="h-2.5 w-2.5" />
                {formatDistanceToNow(new Date(connection.lastUsedAt), { addSuffix: true })}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(connection.id);
            }}
            className={cn(
              "p-1.5 rounded-lg transition-all",
              connection.isFavorite
                ? "text-warning hover:text-warning/70"
                : "text-muted-foreground/50 hover:text-warning opacity-0 group-hover:opacity-100",
            )}
            title={connection.isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <FavIcon
              className={cn(
                "h-3.5 w-3.5",
                connection.isFavorite && "fill-warning",
              )}
            />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(connection);
            }}
            className="p-1.5 text-muted-foreground/50 hover:text-foreground rounded-lg transition-all opacity-0 group-hover:opacity-100"
            title="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(connection.id);
            }}
            className="p-1.5 text-muted-foreground/50 hover:text-destructive rounded-lg transition-all opacity-0 group-hover:opacity-100"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onConnect(connection);
            }}
            disabled={isConnecting}
            className="ml-1 bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-primary/20 transition-all disabled:opacity-50 flex items-center gap-1.5"
          >
            {isConnecting ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <>
                <Plug2 className="h-3 w-3" />
                Connect
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
