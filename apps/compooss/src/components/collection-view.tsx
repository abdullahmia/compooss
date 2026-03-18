"use client";

import { useGetCollections } from "@/lib/services/collections/collection.service";
import { isProtectedDatabase } from "@compooss/types";
import { BarChart3, FileText, Grid3X3, ShieldCheck } from "lucide-react";
import { Suspense, useState } from "react";
import { AggregationsTab } from "./collection-tabs/aggregations/aggregations-tab";
import { DocumentsTab } from "./collection-tabs/documents/documents-tab";
import { ExplainTab } from "./collection-tabs/explain-tab";
import { IndexesTab } from "./collection-tabs/indexex-tab";
import { SchemaTab } from "./collection-tabs/schema-tab";
import { ValidationTab } from "./collection-tabs/validation-tab";
import { Badge, Tabs } from "@compooss/ui";

function formatSize(bytes: number): string {
  if (bytes <= 0 || Number.isNaN(bytes)) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

type ViewTab =
  | "documents"
  | "aggregations"
  | "schema"
  | "explain"
  | "indexes"
  | "validation";

const VALID_TABS: ViewTab[] = [
  "documents",
  "aggregations",
  "schema",
  "explain",
  "indexes",
  "validation",
];

interface CollectionViewProps {
  dbName: string;
  collectionName: string;
  initialTab?: string;
}

export function CollectionView({
  dbName,
  collectionName,
  initialTab,
}: CollectionViewProps) {
  const [activeTab, setActiveTab] = useState<ViewTab>(() => {
    if (initialTab && VALID_TABS.includes(initialTab as ViewTab)) {
      return initialTab as ViewTab;
    }
    return "documents";
  });
  const { data: collections } = useGetCollections(dbName);
  const collection = collections?.find((c) => c.name === collectionName);

  const tabs: { id: ViewTab; label: string; icon: React.ReactNode }[] = [
    {
      id: "documents",
      label: "Documents",
      icon: <FileText className="h-3.5 w-3.5" />,
    },
    {
      id: "aggregations",
      label: "Aggregations",
      icon: <BarChart3 className="h-3.5 w-3.5" />,
    },
    {
      id: "schema",
      label: "Schema",
      icon: <Grid3X3 className="h-3.5 w-3.5" />,
    },
    {
      id: "indexes",
      label: "Indexes",
      icon: <Grid3X3 className="h-3.5 w-3.5" />,
    },
    {
      id: "validation",
      label: "Validation",
      icon: <ShieldCheck className="h-3.5 w-3.5" />,
    },
  ];

  const handleTabChange = (id: string) => {
    setActiveTab(id as ViewTab);
  };

  const readOnly = isProtectedDatabase(dbName);

  const renderTabContent = () => {
    switch (activeTab) {
      case "documents":
        return <DocumentsTab readOnly={readOnly} />;
      case "aggregations":
        return <AggregationsTab />;
      case "schema":
        return <SchemaTab />;
      case "explain":
        return <ExplainTab />;
      case "indexes":
        return <IndexesTab readOnly={readOnly} />;
      case "validation":
        return <ValidationTab readOnly={readOnly} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-card/50">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-foreground">
            {dbName}.{collectionName}
          </h2>
          <Badge>
            {collection?.documentCount.toLocaleString()} docs
          </Badge>
          <Badge variant="subtle" size="sm">
            {collection ? formatSize(collection.size) : "-"} • {collection?.indexCount ?? 0}{" "}
            indexes • Avg: {collection ? formatSize(collection.avgObjSize) : "-"}
          </Badge>
        </div>
      </div>

      <Tabs
        variant="underline"
        items={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center p-8 text-muted-foreground text-sm">
            Loading…
          </div>
        }
      >
        {renderTabContent()}
      </Suspense>
    </div>
  );
}
