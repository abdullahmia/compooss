"use client";

import { DIAGRAM_EDGE_COLORS } from "@/lib/constants";
import { Button } from "@compooss/ui";
import { Loader2, ScanSearch } from "lucide-react";

type Props = {
  collectionCount: number;
  isAnalyzing: boolean;
  analyzeTriggered: boolean;
  onAnalyzeAll: () => void;
};

export const ERDiagramToolbar: React.FC<Props> = ({
  collectionCount,
  isAnalyzing,
  analyzeTriggered,
  onAnalyzeAll,
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-card/50 shrink-0">
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground">
          {collectionCount} collection{collectionCount !== 1 ? "s" : ""}
        </span>
        {analyzeTriggered && (
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground/40">|</span>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: DIAGRAM_EDGE_COLORS.objectid }}
              />
              ObjectId ref
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: DIAGRAM_EDGE_COLORS.name }}
              />
              Name match
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: DIAGRAM_EDGE_COLORS.suffix }}
              />
              Suffix match
            </div>
          </div>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onAnalyzeAll}
        disabled={isAnalyzing}
        icon={
          isAnalyzing ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <ScanSearch className="h-3.5 w-3.5" />
          )
        }
      >
        {isAnalyzing ? "Analyzing…" : analyzeTriggered ? "Re-analyze" : "Analyze relationships"}
      </Button>
    </div>
  );
};
