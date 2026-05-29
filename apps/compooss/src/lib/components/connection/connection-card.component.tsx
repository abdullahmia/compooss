"use client";

import type { SavedConnection } from "@compooss/types";
import { Button, IconButton, cn } from "@compooss/ui";
import { formatDistanceToNow } from "date-fns";
import { Clock, Pencil, Plug2, Star, StarOff, Trash2 } from "lucide-react";

type Props = {
  connection: SavedConnection;
  onConnect: (connection: SavedConnection) => void;
  onEdit: (connection: SavedConnection) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  isConnecting?: boolean;
};

export const ConnectionCard: React.FC<Props> = ({
  connection,
  onConnect,
  onEdit,
  onDelete,
  onToggleFavorite,
  isConnecting,
}) => {
  const FavIcon = connection.isFavorite ? Star : StarOff;

  return (
    <div
      className="group relative rounded-xl border border-border/70 bg-card/50 hover:bg-card hover:border-border hover:shadow-sm transition-all duration-150 cursor-pointer overflow-hidden"
      onClick={() => onConnect(connection)}
    >
      {/* Color strip */}
      {connection.color && (
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl"
          style={{ backgroundColor: connection.color }}
        />
      )}

      <div className={cn("flex items-center gap-3 px-3.5 py-3", connection.color && "pl-5")}>
        {/* Color dot (when no strip, still show dot) */}
        {!connection.color && (
          <div className="w-2 h-2 rounded-full bg-border shrink-0" />
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[13px] font-medium text-foreground truncate leading-tight">
              {connection.name}
            </span>
            {connection.isFavorite && (
              <Star className="h-3 w-3 fill-warning text-warning shrink-0" />
            )}
            {connection.label && (
              <span className="text-[10px] px-1.5 py-px bg-primary/8 text-primary/70 rounded font-medium shrink-0 border border-primary/10">
                {connection.label}
              </span>
            )}
          </div>
          {connection.lastUsedAt && (
            <span className="text-[11px] text-muted-foreground/60 flex items-center gap-1">
              <Clock className="h-2.5 w-2.5" />
              {formatDistanceToNow(new Date(connection.lastUsedAt), { addSuffix: true })}
            </span>
          )}
        </div>

        {/* Actions — visible on hover */}
        <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <IconButton
            icon={
              <FavIcon
                className={cn(
                  "h-3.5 w-3.5",
                  connection.isFavorite && "fill-warning text-warning",
                )}
              />
            }
            label={connection.isFavorite ? "Unfavorite" : "Favorite"}
            className={cn(
              "rounded-lg",
              !connection.isFavorite && "text-muted-foreground/50 hover:text-warning",
            )}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(connection.id);
            }}
          />
          <IconButton
            icon={<Pencil className="h-3.5 w-3.5" />}
            label="Edit"
            className="rounded-lg text-muted-foreground/50 hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(connection);
            }}
          />
          <IconButton
            variant="danger"
            icon={<Trash2 className="h-3.5 w-3.5" />}
            label="Delete"
            className="rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(connection.id);
            }}
          />
        </div>

        <Button
          variant="soft"
          size="sm"
          icon={<Plug2 className="h-3 w-3" />}
          loading={isConnecting}
          className="rounded-lg shrink-0 ml-1"
          onClick={(e) => {
            e.stopPropagation();
            onConnect(connection);
          }}
        >
          Connect
        </Button>
      </div>
    </div>
  );
};
