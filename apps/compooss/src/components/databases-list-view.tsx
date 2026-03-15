"use client";

import {
  Button,
  DatabasesListSkeleton,
  EmptyState,
} from "@compooss/ui";
import { useGetDatabases } from "@/lib/services/v2/database/database.service";
import type { Database } from "@compooss/types";
import { isProtectedDatabase } from "@compooss/types";
import { DatabaseBackupIcon, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { CreateDatabaseModal } from "./create-database-modal";
import { DatabaseCard } from "./database-card";

export function DatabasesListView() {
  const { data: databases, isLoading } = useGetDatabases();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const { userDatabases, systemDatabases } = useMemo(() => {
    const list = databases ?? [];
    const user: Database[] = [];
    const system: Database[] = [];
    for (const db of list) {
      if (isProtectedDatabase(db.name)) system.push(db);
      else user.push(db);
    }
    return { userDatabases: user, systemDatabases: system };
  }, [databases]);

  return (
    <>
      <div className="flex flex-1 flex-col h-full overflow-hidden bg-background">
        <div className="px-4 py-3 border-b border-border bg-card/50">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-base font-semibold text-foreground">
                Databases
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                All databases on this MongoDB server
              </p>
            </div>
            <Button
              variant="primary"
              icon={<Plus className="h-3.5 w-3.5" />}
              onClick={() => setCreateModalOpen(true)}
            >
              Create database
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-8">
          {isLoading ? (
            <DatabasesListSkeleton />
          ) : !databases?.length ? (
            <EmptyState
              icon={<DatabaseBackupIcon className="h-12 w-12 text-muted-foreground" />}
              title="No databases yet"
              description="Create your first database to start storing collections and documents."
              primaryAction={{
                label: "Create database",
                onClick: () => setCreateModalOpen(true),
              }}
            />
          ) : (
            <>
              {userDatabases.length > 0 && (
                <section>
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    User databases
                  </h2>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {userDatabases.map((db) => (
                      <DatabaseCard
                        key={db.name}
                        db={db}
                        isSystem={isProtectedDatabase(db.name)}
                      />
                    ))}
                  </div>
                </section>
              )}
              {systemDatabases.length > 0 && (
                <section>
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    System databases
                  </h2>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {systemDatabases.map((db) => (
                      <DatabaseCard
                        key={db.name}
                        db={db}
                        isSystem={isProtectedDatabase(db.name)}
                      />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>

      {createModalOpen && (
        <CreateDatabaseModal onClose={() => setCreateModalOpen(false)} />
      )}
    </>
  );
}
