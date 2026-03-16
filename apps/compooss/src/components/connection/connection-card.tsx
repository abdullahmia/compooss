"use client";

import type { SavedConnection } from "@compooss/types";
import { cn } from "@compooss/ui";
import { formatDistanceToNow } from "date-fns";
import {
  Clock,
  Loader2,
  Pencil,
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
      className="bg-card border border-border rounded-lg p-3.5 hover:border-primary/30 transition-colors cursor-pointer group"
      onClick={() => onConnect(connection)}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          className={cn(
            "shrink-0 transition-colors",
            connection.isFavorite
              ? "text-warning hover:text-warning/70"
              : "text-muted-foreground hover:text-warning",
          )}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(connection.id);
          }}
          title={connection.isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <FavIcon
            className={cn(
              "h-4 w-4",
              connection.isFavorite && "fill-warning",
            )}
          />
        </button>

        {connection.color && (
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: connection.color }}
          />
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground truncate">
              {connection.name}
            </span>
            {connection.label && (
              <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded-sm shrink-0">
                {connection.label}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] text-muted-foreground truncate">
              {connection.lastUsedAt
                ? `Used ${formatDistanceToNow(new Date(connection.lastUsedAt), { addSuffix: true })}`
                : "Never used"}
            </span>
            {connection.createdAt && (
              <span className="text-[10px] text-muted-foreground/60 flex items-center gap-0.5 shrink-0">
                <Clock className="h-2.5 w-2.5" />
                {formatDistanceToNow(new Date(connection.createdAt), {
                  addSuffix: true,
                })}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(connection);
            }}
            className="p-1 text-muted-foreground hover:text-foreground rounded-sm transition-all opacity-0 group-hover:opacity-100"
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
            className="p-1 text-muted-foreground hover:text-destructive rounded-sm transition-all opacity-0 group-hover:opacity-100"
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
            className="bg-primary/15 text-primary px-3 py-1 rounded-sm text-xs font-medium hover:bg-primary/25 transition-colors disabled:opacity-50"
          >
            {isConnecting ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              "Connect"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
