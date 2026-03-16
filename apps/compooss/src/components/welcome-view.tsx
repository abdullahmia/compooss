"use client";

import { useGetDatabases } from "@/lib/services/v2/database/database.service";
import { useGetCollections } from "@/lib/services/v2/collections/collection.service";
import { isProtectedDatabase } from "@compooss/types";
import { ArrowRight, FileText, Grid3X3, Leaf, TerminalSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
import { useShellPanel } from "@/lib/providers/shell-provider";

const FEATURES = [
  {
    id: "documents",
    label: "Browse Documents",
    desc: "View and edit documents in list, JSON, or table view",
    icon: FileText,
    action: "navigate" as const,
    tab: "documents" as const,
  },
  {
    id: "schema",
    label: "Manage Schema",
    desc: "Analyze and validate your collection schema",
    icon: Grid3X3,
    action: "navigate" as const,
    tab: "schema" as const,
  },
  {
    id: "shell",
    label: "Run Query",
    desc: "Open the MongoDB shell to run commands and scripts",
    icon: TerminalSquare,
    action: "shell" as const,
    tab: null,
  },
] as const;

export function WelcomeView() {
  const router = useRouter();
  const { data: databases } = useGetDatabases();

  const firstDbName = useMemo(() => {
    const list = databases ?? [];
    const nonProtected = list.find((db) => !isProtectedDatabase(db.name));
    return nonProtected?.name ?? list[0]?.name ?? null;
  }, [databases]);

  const { data: collections } = useGetCollections(firstDbName ?? "", {
    enabled: !!firstDbName,
  });

  const firstCollectionName = useMemo(
    () => collections?.[0]?.name ?? null,
    [collections],
  );

  const canNavigate = !!firstDbName && !!firstCollectionName;

  const { open: openShell } = useShellPanel();

  const handleFeatureClick = (item: (typeof FEATURES)[number]) => {
    if (item.action === "shell") {
      openShell();
      return;
    }
    if (!canNavigate) {
      toast.info(
        "Create a database and collection from the sidebar to get started.",
      );
      return;
    }
    const path = `/databases/${firstDbName}/collections/${firstCollectionName}`;
    const url = item.tab === "schema" ? `${path}?tab=schema` : path;
    router.push(url);
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-background">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Leaf className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-xl font-semibold text-foreground mb-2">
          Compooss
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Select a collection from the sidebar to explore your data, run
          queries, and manage documents.
        </p>
        <div className="space-y-3 text-left">
          {FEATURES.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleFeatureClick(item)}
                className="w-full flex items-start gap-3 p-3 rounded-lg bg-card border border-border hover:border-primary/30 hover:bg-card/80 transition-colors cursor-pointer text-left"
              >
                <Icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground">
                    {item.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
