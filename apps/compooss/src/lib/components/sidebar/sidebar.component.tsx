"use client";

import { useConnection } from "@/lib/providers/connection-provider";
import { useGetDatabases } from "@/lib/services/database/database.service";
import type { Database } from "@compooss/types";
import { DatabaseSidebarSkeleton, IconButton } from "@compooss/ui";
import { AlertTriangle, Plus, RefreshCw, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { CreateDatabaseModal } from "@/lib/components/databases/create-database-modal.component";
import { SidebarItem } from "@/lib/components/sidebar/sidebar-item.component";

/** Parses pathname to get the active database name (e.g. /databases/foo/... -> foo). */
function getActiveDbNameFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/databases\/([^/]+)/);
  return match ? match[1] : null;
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const activeDbName = getActiveDbNameFromPath(pathname ?? "");
  const { activeConnection } = useConnection();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<boolean>(false);
  const [expandedDbNames, setExpandedDbNames] = useState<Set<string>>(
    () => new Set(),
  );

  const handleToggleExpand = useCallback((dbName: string) => {
    setExpandedDbNames((prev) => {
      const next = new Set(prev);
      if (next.has(dbName)) next.delete(dbName);
      else next.add(dbName);
      return next;
    });
  }, []);

  const {
    data: databases,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useGetDatabases();

  const filtered = useMemo(() => {
    return databases?.filter((db) =>
      db?.name?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [databases, search]);

  return (
    <>
      <div className="w-64 bg-sidebar border-r border-border flex flex-col shrink-0 h-full">
        <div className="p-3 border-b border-border flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Databases
          </span>
          <div className="flex items-center gap-1">
            <IconButton
              variant="toolbar"
              icon={<Plus className="h-3.5 w-3.5" />}
              label="Create Database"
              onClick={() => setOpen(true)}
            />
            <IconButton
              variant="toolbar"
              icon={<RefreshCw className="h-3.5 w-3.5" />}
              label="Refresh"
            />
          </div>
        </div>

        <div className="p-2">
          <div className="flex items-center gap-2 bg-secondary rounded-sm px-2 py-1.5">
            <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Filter databases..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-hidden w-full"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin py-1">
          {isLoading ? (
            <DatabaseSidebarSkeleton />
          ) : isError ? (
            <div className="px-3 py-6 flex flex-col items-center text-center">
              <AlertTriangle className="h-5 w-5 text-destructive mb-2" />
              <p className="text-xs font-medium text-destructive mb-1">
                Connection failed
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
                Could not reach the database server. Check your connection
                string.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                disabled={isRefetching}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-primary-foreground bg-primary rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-3 w-3 ${isRefetching ? "animate-spin" : ""}`}
                />
                {isRefetching ? "Retrying…" : "Retry"}
              </button>
            </div>
          ) : filtered?.length === 0 ? (
            <div className="px-3 py-2 text-xs text-muted-foreground">
              No databases found
            </div>
          ) : (
            filtered?.map((db: Database) => (
              <SidebarItem
                key={db.name}
                db={db}
                isExpanded={
                  expandedDbNames.has(db.name) || activeDbName === db.name
                }
                onToggleExpand={() => handleToggleExpand(db.name)}
              />
            ))
          )}
        </div>

        <div className="p-3 border-t border-border">
          <div className="text-[10px] text-muted-foreground flex items-center gap-1.5">
            {isError ? (
              <>
                <span className="text-destructive font-medium">●</span>{" "}
                Disconnected
              </>
            ) : (filtered?.length ?? 0) > 0 ? (
              <>
                {activeConnection?.color ? (
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: activeConnection.color }}
                  />
                ) : (
                  <span className="text-primary font-medium">●</span>
                )}
                {`Connected — ${filtered?.length ?? 0} databases`}
              </>
            ) : (
              <>
                <span className="text-muted-foreground font-medium">●</span> Not
                connected
              </>
            )}
          </div>
        </div>
      </div>

      {open && <CreateDatabaseModal onClose={() => setOpen(false)} />}
    </>
  );
};
