"use client";

import { TYPE_COLORS } from "@/lib/constants";
import type { SchemaNode } from "@/lib/types/diagram.type";
import { Handle, Position, type NodeProps } from "@xyflow/react";

export const SchemaFieldNode: React.FC<NodeProps<SchemaNode>> = ({ data }) => {
  const primaryType = data.types[0];
  const typeColor = primaryType
    ? (TYPE_COLORS[primaryType.type] ?? "var(--color-muted-foreground)")
    : "var(--color-muted-foreground)";

  return (
    <div className="bg-card border border-border rounded-md px-3 py-2 min-w-[140px] shadow-sm select-none">
      <Handle type="target" position={Position.Top} className="!bg-border" />
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-foreground truncate max-w-[100px]">
          {data.name}
        </span>
        {primaryType && (
          <span
            className="text-[10px] font-mono shrink-0"
            style={{ color: typeColor }}
          >
            {primaryType.type}
          </span>
        )}
      </div>
      {data.frequency < 1 && (
        <div className="mt-1.5 h-1 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary/60"
            style={{ width: `${Math.round(data.frequency * 100)}%` }}
          />
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-border" />
    </div>
  );
};
