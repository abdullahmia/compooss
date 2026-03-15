"use client";

import type { Database } from "@compooss/types";
import { DatabaseBackupIcon, ChevronRight } from "lucide-react";
import Link from "next/link";

export interface DatabaseCardProps {
  db: Database;
  isSystem: boolean;
}

export function DatabaseCard({ db, isSystem }: DatabaseCardProps) {
  return (
    <Link
      href={`/databases/${encodeURIComponent(db.name)}`}
      className="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-card/80 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <DatabaseBackupIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground truncate">
                {db.name}
              </span>
              {isSystem && (
                <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                  System
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
              {db.sizeOnDisk ?? "0 B"}
            </p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>
    </Link>
  );
}
