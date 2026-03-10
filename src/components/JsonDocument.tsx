"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, Copy, Pencil, Trash2, FileText } from "lucide-react";
import type { MongoDocument } from "@/data/mockData";

interface JsonDocumentProps {
  document: MongoDocument;
  index: number;
}

function JsonValue({ value, depth = 0 }: { value: any; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 0);

  if (value === null) return <span className="text-json-null font-mono text-xs">null</span>;
  if (typeof value === "boolean") return <span className="text-json-boolean font-mono text-xs">{value.toString()}</span>;
  if (typeof value === "number") return <span className="text-json-number font-mono text-xs">{value}</span>;
  if (typeof value === "string") return <span className="text-json-string font-mono text-xs">"{value}"</span>;

  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-muted-foreground font-mono text-xs">[ ]</span>;
    return (
      <span>
        <button onClick={() => setExpanded(!expanded)} className="inline-flex items-center text-muted-foreground hover:text-foreground">
          {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          <span className="text-xs font-mono ml-0.5">Array({value.length})</span>
        </button>
        {expanded && (
          <div className="ml-4 border-l border-border/50 pl-3">
            {value.map((item, i) => (
              <div key={i} className="py-0.5">
                <span className="text-json-number font-mono text-xs mr-2">{i}</span>
                <span className="text-muted-foreground mr-1">:</span>
                <JsonValue value={item} depth={depth + 1} />
              </div>
            ))}
          </div>
        )}
      </span>
    );
  }

  if (typeof value === "object") {
    const keys = Object.keys(value);
    if (keys.length === 0) return <span className="text-muted-foreground font-mono text-xs">{"{ }"}</span>;
    
    if (keys.length === 1 && keys[0] === "$oid") {
      return <span className="text-json-string font-mono text-xs">ObjectId("{value.$oid}")</span>;
    }
    if (keys.length === 1 && keys[0] === "$date") {
      return <span className="text-json-string font-mono text-xs">ISODate("{value.$date}")</span>;
    }

    return (
      <span>
        <button onClick={() => setExpanded(!expanded)} className="inline-flex items-center text-muted-foreground hover:text-foreground">
          {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          <span className="text-xs font-mono ml-0.5">Object({keys.length})</span>
        </button>
        {expanded && (
          <div className="ml-4 border-l border-border/50 pl-3">
            {keys.map((key) => (
              <div key={key} className="py-0.5">
                <span className="text-json-key font-mono text-xs">{key}</span>
                <span className="text-muted-foreground mx-1">:</span>
                <JsonValue value={value[key]} depth={depth + 1} />
              </div>
            ))}
          </div>
        )}
      </span>
    );
  }

  return <span className="text-foreground font-mono text-xs">{String(value)}</span>;
}

export function JsonDocument({ document, index }: JsonDocumentProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="border border-border rounded-lg bg-card mb-3 group shadow-xs hover:border-primary/20 transition-colors">
      {/* Card header - Compass style with green left accent */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/30 rounded-t-lg relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary" />
        <button onClick={() => setExpanded(!expanded)} className="text-muted-foreground hover:text-foreground ml-1">
          {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </button>
        <FileText className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs font-mono text-json-string truncate">
          ObjectId("{document._id}")
        </span>
        
        <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-sm transition-colors" title="Clone Document">
            <Copy className="h-3 w-3" />
          </button>
          <button className="p-1.5 text-muted-foreground hover:text-primary hover:bg-secondary rounded-sm transition-colors" title="Edit Document">
            <Pencil className="h-3 w-3" />
          </button>
          <button className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-secondary rounded-sm transition-colors" title="Delete Document">
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
      
      {expanded && (
        <div className="px-5 py-4">
          {Object.entries(document).map(([key, value]) => (
            <div key={key} className="py-0.5 flex items-start">
              <span className="text-json-key font-mono text-xs min-w-[100px] shrink-0">{key}</span>
              <span className="text-muted-foreground mx-1.5">:</span>
              <JsonValue value={value} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
