"use client";

import { Badge, IconButton } from "@compooss/ui";
import {
  AlertTriangle,
  Code2,
  FileText,
  Grid3X3,
  Loader2,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { AggregationResult } from "@compooss/types";

type Props = {
  results: AggregationResult | null;
  error: string | null;
  isRunning: boolean;
};

type ViewMode = "json" | "table" | "list";

export const ResultViewer: React.FC<Props> = ({ results, error, isRunning }) => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const columns = useMemo(() => {
    if (!results?.documents.length) return [];
    const keys = new Set<string>();
    results.documents.forEach((doc) => {
      Object.keys(doc).forEach((k) => keys.add(k));
    });
    return Array.from(keys);
  }, [results]);

  if (isRunning) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Running aggregation pipeline...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/5 p-4">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-destructive">
              Pipeline Error
            </p>
            <p className="text-xs text-muted-foreground mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
        Run the pipeline to see results here.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/30">
        <div className="flex items-center gap-2">
          <IconButton
            variant={viewMode === "list" ? "active" : "default"}
            size="sm"
            icon={<FileText className="h-3.5 w-3.5" />}
            label="Document view"
            onClick={() => setViewMode("list")}
          />
          <IconButton
            variant={viewMode === "json" ? "active" : "default"}
            size="sm"
            icon={<Code2 className="h-3.5 w-3.5" />}
            label="JSON view"
            onClick={() => setViewMode("json")}
          />
          <IconButton
            variant={viewMode === "table" ? "active" : "default"}
            size="sm"
            icon={<Grid3X3 className="h-3.5 w-3.5" />}
            label="Table view"
            onClick={() => setViewMode("table")}
          />
          <span className="text-xs text-muted-foreground ml-2">
            {results.documents.length} document
            {results.documents.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="subtle" size="sm">
            {results.stageCount} stage{results.stageCount !== 1 ? "s" : ""}
          </Badge>
          <Badge variant="info" size="sm">
            {results.executionTimeMs}ms
          </Badge>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {results.documents.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
            Pipeline returned no documents.
          </div>
        ) : viewMode === "json" ? (
          <pre className="text-xs font-mono text-foreground bg-card p-4 rounded-sm border border-border overflow-auto">
            {JSON.stringify(results.documents, null, 2)}
          </pre>
        ) : viewMode === "table" ? (
          <div className="overflow-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  {columns.map((key) => (
                    <th
                      key={key}
                      className="px-3 py-2 text-left font-medium text-muted-foreground bg-muted/30 whitespace-nowrap"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.documents.map((doc, i) => (
                  <tr
                    key={i}
                    className="border-b border-border hover:bg-muted/20 transition-colors"
                  >
                    {columns.map((key) => (
                      <td
                        key={key}
                        className="px-3 py-2 font-mono text-foreground whitespace-nowrap max-w-[240px] truncate"
                      >
                        {typeof doc[key] === "object"
                          ? JSON.stringify(doc[key])
                          : String(doc[key] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-2">
            {results.documents.map((doc, i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-card/50 overflow-hidden"
              >
                <div className="px-3 py-1.5 border-b border-border bg-muted/30 flex items-center gap-2">
                  <Badge variant="subtle" size="sm" className="tabular-nums">
                    {i + 1}
                  </Badge>
                  {doc._id !== undefined && (
                    <span className="text-[11px] font-mono text-muted-foreground truncate">
                      _id: {typeof doc._id === "object" ? JSON.stringify(doc._id) : String(doc._id)}
                    </span>
                  )}
                </div>
                <pre className="text-[11px] font-mono text-foreground p-3 overflow-auto max-h-[200px] leading-relaxed">
                  {JSON.stringify(doc, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
