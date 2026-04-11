"use client";

import type { ShellEntry } from "@compooss/types";
import { useEffect, useRef } from "react";

type Props = {
  entries: ShellEntry[];
};

function formatResult(result: unknown): string {
  if (result === null || result === undefined) return "null";
  if (typeof result === "string") return result;
  try {
    return JSON.stringify(result, null, 2);
  } catch {
    return String(result);
  }
}

function ResultBlock({ entry }: { entry: ShellEntry }) {
  const { response } = entry;
  const isError = response.type === "error";
  const isInfo = response.type === "info" || response.type === "switchDb";
  const formatted = formatResult(response.result);

  return (
    <div className="font-mono text-xs leading-relaxed">
      <div className="flex items-start gap-1.5">
        <span className="text-emerald-400 shrink-0 select-none">
          {entry.database}&gt;
        </span>
        <span className="text-foreground whitespace-pre-wrap break-all">
          {entry.command}
        </span>
      </div>

      {formatted && formatted !== "__clear__" && (
        <div
          className={`mt-0.5 pl-4 whitespace-pre-wrap break-all ${
            isError
              ? "text-red-400"
              : isInfo
                ? "text-muted-foreground italic"
                : "text-foreground/80"
          }`}
        >
          {formatted}
        </div>
      )}

      {response.executionTimeMs > 0 && !isInfo && (
        <div className="pl-4 text-muted-foreground/50 text-[10px] mt-0.5">
          {response.executionTimeMs.toFixed(0)}ms
        </div>
      )}
    </div>
  );
}

export const ShellOutput: React.FC<Props> = ({ entries }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [entries]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-3 space-y-2 bg-[#1e1e1e] min-h-0"
    >
      {entries.length === 0 && (
        <div className="text-muted-foreground/50 text-xs font-mono">
          MongoDB Shell — type <span className="text-foreground/60">help</span>{" "}
          for commands
        </div>
      )}
      {entries.map((entry) => (
        <ResultBlock key={entry.id} entry={entry} />
      ))}
    </div>
  );
};
