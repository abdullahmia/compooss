"use client";

import { cn } from "@compooss/ui";
import { WORKSPACE_FEATURES } from "@/lib/constants";
import { useShellPanel } from "@/lib/providers/shell-provider";
import { useGetCollections } from "@/lib/services/collections/collection.service";
import { useGetDatabases } from "@/lib/services/database/database.service";
import { isProtectedDatabase } from "@compooss/types";
import { ArrowRight, Database, Leaf, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const WorkspaceWelcome: React.FC = () => {
  const router = useRouter();
  const { data: databases } = useGetDatabases();
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

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

  const handleFeatureClick = (item: (typeof WORKSPACE_FEATURES)[number]) => {
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

  const dbCount = databases?.length ?? 0;
  const collectionCount = collections?.length ?? 0;

  return (
    <div className="flex-1 flex items-center justify-center bg-background">
      <div className="max-w-lg w-full px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 mb-5 shadow-lg shadow-primary/5">
            <Leaf className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight mb-2">
            Welcome to Compooss
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Select a collection from the sidebar, or pick a quick action below
          </p>
        </div>

        {/* Stats bar */}
        {dbCount > 0 && (
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-5 h-5 rounded-md bg-secondary flex items-center justify-center">
                <Database className="h-3 w-3 text-muted-foreground" />
              </div>
              <span className="font-medium text-foreground">{dbCount}</span>
              <span>database{dbCount !== 1 ? "s" : ""}</span>
            </div>
            {collectionCount > 0 && (
              <>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-5 h-5 rounded-md bg-secondary flex items-center justify-center">
                    <Sparkles className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <span className="font-medium text-foreground">{collectionCount}</span>
                  <span>collection{collectionCount !== 1 ? "s" : ""}</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Feature cards */}
        <div className="space-y-3">
          {WORKSPACE_FEATURES.map((item) => {
            const Icon = item.icon;
            const isHovered = hoveredFeature === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleFeatureClick(item)}
                onMouseEnter={() => setHoveredFeature(item.id)}
                onMouseLeave={() => setHoveredFeature(null)}
                className={cn(
                  "group w-full flex items-center gap-4 p-4 rounded-xl border border-border/80 bg-card/50 backdrop-blur-sm",
                  "hover:bg-card hover:shadow-lg hover:shadow-black/5 transition-all duration-200 text-left",
                  item.borderColor,
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 transition-transform duration-200",
                    item.color,
                    isHovered && "scale-110",
                  )}
                >
                  <Icon className={cn("h-5 w-5", item.iconColor)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-0.5">
                    {item.label}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <ArrowRight
                  className={cn(
                    "h-4 w-4 text-muted-foreground/50 shrink-0 transition-all duration-200",
                    isHovered && "text-foreground translate-x-0.5",
                  )}
                />
              </button>
            );
          })}
        </div>

        {/* Hint */}
        <p className="text-center text-[11px] text-muted-foreground/50 mt-8">
          Tip: Use the sidebar to browse databases and collections
        </p>
      </div>
    </div>
  );
};
