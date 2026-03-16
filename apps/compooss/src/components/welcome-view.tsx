"use client";

import { useShellPanel } from "@/lib/providers/shell-provider";
import { useGetCollections } from "@/lib/services/v2/collections/collection.service";
import { useGetDatabases } from "@/lib/services/v2/database/database.service";
import { isProtectedDatabase } from "@compooss/types";
import {
  ArrowRight,
  FileText,
  Grid3X3,
  Leaf,
  TerminalSquare,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";

const FEATURES = [
  {
    id: "documents",
    label: "Browse Documents",
    desc: "View and edit documents in list, JSON, or table view",
    icon: FileText,
    action: "navigate" as const,
    tab: "documents" as const,
  },
  // {
  //   id: "indexes",
  //   label: "Manage Indexes",
  //   desc: "Create, drop, and inspect indexes with usage statistics",
  //   icon: ListTree,
  //   action: "navigate" as const,
  //   tab: "indexes" as const,
  // },
  {
    id: "schema",
    label: "Analyze Schema",
    desc: "Detect fields, type distributions, and nested structures",
    icon: Grid3X3,
    action: "navigate" as const,
    tab: "schema" as const,
  },
  // {
  //   id: "validation",
  //   label: "Validation Rules",
  //   desc: "Define JSON Schema validators and detect violations",
  //   icon: ShieldCheck,
  //   action: "navigate" as const,
  //   tab: "validation" as const,
  // },
  // {
  //   id: "aggregation",
  //   label: "Aggregation Pipelines",
  //   desc: "Build pipelines visually with per-stage previews",
  //   icon: GitBranch,
  //   action: "navigate" as const,
  //   tab: "aggregation" as const,
  // },
  {
    id: "shell",
    label: "MongoDB Shell",
    desc: "Run commands, queries, and scripts interactively",
    icon: TerminalSquare,
    action: "shell" as const,
    tab: null,
  },
  // {
  //   id: "connections",
  //   label: "Manage Connections",
  //   desc: "Save, switch, and configure MongoDB connection profiles",
  //   icon: Plug2,
  //   action: "connect" as const,
  //   tab: null,
  // },
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
    const url =
      item.tab && item.tab !== "documents" ? `${path}?tab=${item.tab}` : path;
    router.push(url);
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-background">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Leaf className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-xl font-semibold text-foreground mb-2">Compooss</h1>
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
