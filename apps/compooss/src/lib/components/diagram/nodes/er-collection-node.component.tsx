"use client";

import { DIAGRAM_ER_MAX_FIELDS_HEIGHT, TYPE_COLORS } from "@/lib/constants";
import type { ERNode } from "@/lib/types/diagram.type";
import type { SchemaField } from "@compooss/types";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { ChevronDown, ChevronRight, KeyRound } from "lucide-react";
import { useState } from "react";

const TYPE_LABELS: Record<string, string> = {
  String: "string",
  Number: "number",
  Boolean: "bool",
  Date: "date",
  ObjectId: "objectId",
  Object: "{}",
  Array: "[]",
  Null: "null",
  Double: "double",
  Int32: "int32",
  Int64: "int64",
  Decimal128: "decimal",
  BinData: "binary",
};

function shortType(types: SchemaField["types"]): string {
  if (!types.length) return "—";
  const t = types[0].type;
  return TYPE_LABELS[t] ?? t.toLowerCase();
}

type FieldRowProps = {
  field: SchemaField;
  indent?: boolean;
};

const FieldRow: React.FC<FieldRowProps> = ({ field, indent = false }) => {
  const [open, setOpen] = useState(false);
  const isId = field.name === "_id";
  const isObject = field.types.some((t) => t.type === "Object");
  const isArray = field.types.some((t) => t.type === "Array");
  const hasChildren = (field.children?.length ?? 0) > 0;
  const typeColor = field.types[0]
    ? (TYPE_COLORS[field.types[0].type] ?? "var(--color-muted-foreground)")
    : "var(--color-muted-foreground)";

  return (
    <>
      <div
        className={[
          "flex items-center justify-between px-3 h-8 gap-2",
          "hover:bg-muted/40 transition-colors",
          indent ? "pl-6 border-l-2 border-muted ml-3" : "",
        ].join(" ")}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          {isId && (
            <KeyRound className="h-3 w-3 shrink-0 text-emerald-500" />
          )}
          <span className="text-xs font-mono text-foreground truncate">
            {field.name}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span
            className="text-[10px] font-mono"
            style={{ color: typeColor }}
          >
            {isArray ? "[]" : isObject ? "{}" : shortType(field.types)}
          </span>
          {hasChildren && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpen((v) => !v);
              }}
              className="p-0.5 text-muted-foreground hover:text-foreground rounded"
            >
              {open ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          )}
        </div>
      </div>
      {hasChildren && open &&
        field.children!.map((child) => (
          <FieldRow key={child.path} field={child} indent />
        ))}
    </>
  );
};

export const ERCollectionNode: React.FC<NodeProps<ERNode>> = ({ data }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={[
        "bg-card rounded-lg shadow-sm overflow-hidden border-l-4",
        data.isAnalyzed ? "border-l-emerald-500" : "border-l-muted-foreground/30",
        "border border-border",
      ].join(" ")}
      style={{ minWidth: 220 }}
    >
      <Handle type="target" position={Position.Top} className="!bg-primary" />

      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-muted/40 border-b border-border">
        <span className="text-sm font-bold text-foreground flex-1 truncate">
          {data.label}
        </span>
        <span className="text-[10px] text-muted-foreground tabular-nums">
          {data.docCount.toLocaleString()}
        </span>
        {data.isAnalyzed && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCollapsed((v) => !v);
            }}
            className="p-0.5 text-muted-foreground hover:text-foreground rounded"
          >
            {collapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
        )}
      </div>

      {/* Fields — nowheel prevents canvas zoom when scrolling inside the node */}
      {!collapsed && data.fields.length > 0 && (
        <div
          className="py-1 overflow-y-auto nowheel"
          style={{ maxHeight: DIAGRAM_ER_MAX_FIELDS_HEIGHT }}
        >
          {data.fields.map((field) => (
            <FieldRow key={field.path} field={field} />
          ))}
        </div>
      )}

      {!data.isAnalyzed && (
        <div className="px-3 py-2 text-[10px] text-muted-foreground/60 italic">
          not analyzed
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-primary" />
    </div>
  );
};
