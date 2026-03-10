"use client";

import type { Collection } from "@/data/mockData";
import { BarChart3, Code2, FileText, Grid3X3, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { AggregationsTab } from "./collection-tabs/aggregations-tab";
import { DocumentsTab } from "./collection-tabs/documents-tab";
import { ExplainTab } from "./collection-tabs/explain-tab";
import { IndexesTab } from "./collection-tabs/indexex-tab";
import { SchemaTab } from "./collection-tabs/schema-tab";
import { ValidationTab } from "./collection-tabs/validation-tab";
import { Badge } from "./ui/badge/badge";
import { Tabs } from "./ui/tabs/tabs";

type ViewTab = "documents" | "aggregations" | "schema" | "explain" | "indexes" | "validation";

interface CollectionViewProps {
  dbName: string;
  collection: Collection;
}

export function CollectionView({ dbName, collection }: CollectionViewProps) {
  const [activeTab, setActiveTab] = useState<ViewTab>("documents");

  const tabs: { id: ViewTab; label: string; icon: React.ReactNode }[] = [
    { id: "documents", label: "Documents", icon: <FileText className="h-3.5 w-3.5" /> },
    { id: "aggregations", label: "Aggregations", icon: <BarChart3 className="h-3.5 w-3.5" /> },
    { id: "schema", label: "Schema", icon: <Grid3X3 className="h-3.5 w-3.5" /> },
    { id: "explain", label: "Explain Plan", icon: <Code2 className="h-3.5 w-3.5" /> },
    { id: "indexes", label: "Indexes", icon: <Grid3X3 className="h-3.5 w-3.5" /> },
    { id: "validation", label: "Validation", icon: <ShieldCheck className="h-3.5 w-3.5" /> },
  ];

  const handleTabChange = (id: ViewTab) => {
    setActiveTab(id);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "documents":
        return <DocumentsTab dbName={dbName} collectionName={collection.name} />;
      case "aggregations":
        return <AggregationsTab />;
      case "schema":
        return <SchemaTab />;
      case "explain":
        return <ExplainTab />;
      case "indexes":
        return <IndexesTab />;
      case "validation":
        return <ValidationTab />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-card/50">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-foreground">{dbName}.{collection.name}</h2>
          <Badge>{collection.documentCount.toLocaleString()} docs</Badge>
          <Badge variant="subtle" size="sm">
            {collection.totalSize} • {collection.indexes} indexes • Avg: {collection.avgDocSize}
          </Badge>
        </div>
      </div>

      <Tabs
        variant="underline"
        items={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {renderTabContent()}
    </div>
  );
}
