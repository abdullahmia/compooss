"use client";

import { useGetDatabases } from "@/lib/services/v2/database/database.service";
import type { TDatabase } from "@/lib/types/database.types";
import {
  Plus,
  RefreshCw,
  Search
} from "lucide-react";
import { useMemo, useState } from "react";
import { CreateDatabaseModal } from "../create-database-modal";
import { IconButton } from "../ui/icon-button/icon-button";
import { SidebarItem } from "./sidebar-item";

export function Sidebar() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<boolean>(false);

  const { data: databases, isLoading } = useGetDatabases();

  const filtered = useMemo(() => {
    return databases?.filter((db) => db?.name?.toLowerCase().includes(search.toLowerCase()));
  }, [databases, search]);

  return (
    <>
      <div className="w-64 bg-sidebar border-r border-border flex flex-col shrink-0 h-full">
        <div className="p-3 border-b border-border flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Databases</span>
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
            <div className="px-3 py-2 text-xs text-muted-foreground">
              Loading...
            </div>
          ) : filtered?.length === 0 ? (
            <div className="px-3 py-2 text-xs text-muted-foreground">
              No databases found
            </div>
          ) : (
            filtered?.map((db: TDatabase) => (
              <SidebarItem key={db.name} db={db} />
            ))
          )}
        </div>

        <div className="p-3 border-t border-border">
          <div className="text-[10px] text-muted-foreground">
            <span className="text-primary font-medium">●</span>{" "}
            {filtered?.length > 0
              ? `Connected — ${filtered?.length} databases`
              : "Not connected"}
          </div>
        </div>
      </div>

      {open && <CreateDatabaseModal onClose={() => setOpen(false)} />}
    </>
  );
}
