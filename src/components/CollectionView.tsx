"use client";

import { useState, useMemo } from "react";
import { FileText, BarChart3, Grid3X3, Code2, ShieldCheck, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { QueryBar } from "./QueryBar";
import { JsonDocument } from "./JsonDocument";
import { getDocuments } from "@/data/mockData";
import type { Collection } from "@/data/mockData";

type ViewTab = "documents" | "aggregations" | "schema" | "explain" | "indexes" | "validation";

interface CollectionViewProps {
  dbName: string;
  collection: Collection;
}

function getFieldsFromDocs(docs: any[]): string[] {
  const fields = new Set<string>();
  const extract = (obj: any, prefix = "") => {
    if (!obj || typeof obj !== "object") return;
    for (const key of Object.keys(obj)) {
      const path = prefix ? `${prefix}.${key}` : key;
      fields.add(path);
      if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
        extract(obj[key], path);
      }
    }
  };
  docs.forEach(doc => extract(doc));
  return Array.from(fields).sort();
}

export function CollectionView({ dbName, collection }: CollectionViewProps) {
  const [activeTab, setActiveTab] = useState<ViewTab>("documents");
  const [viewMode, setViewMode] = useState<"list" | "json" | "table">("list");
  const documents = getDocuments(dbName, collection.name);

  const fieldSuggestions = useMemo(() => getFieldsFromDocs(documents), [documents]);

  const tabs: { id: ViewTab; label: string; icon: React.ReactNode }[] = [
    { id: "documents", label: "Documents", icon: <FileText className="h-3.5 w-3.5" /> },
    { id: "aggregations", label: "Aggregations", icon: <BarChart3 className="h-3.5 w-3.5" /> },
    { id: "schema", label: "Schema", icon: <Grid3X3 className="h-3.5 w-3.5" /> },
    { id: "explain", label: "Explain Plan", icon: <Code2 className="h-3.5 w-3.5" /> },
    { id: "indexes", label: "Indexes", icon: <Grid3X3 className="h-3.5 w-3.5" /> },
    { id: "validation", label: "Validation", icon: <ShieldCheck className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Collection header */}
      <div className="px-4 py-3 border-b border-border bg-card/50">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-foreground">{dbName}.{collection.name}</h2>
          <span className="text-[10px] px-2 py-0.5 rounded-sm bg-primary/15 text-primary font-medium">
            {collection.documentCount.toLocaleString()} docs
          </span>
          <span className="text-[10px] text-muted-foreground">
            {collection.totalSize} • {collection.indexes} indexes • Avg: {collection.avgDocSize}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border bg-tab-inactive">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-primary text-primary bg-tab-active"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "documents" && (
        <>
          <QueryBar onRunQuery={() => {}} fieldSuggestions={fieldSuggestions} />

          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/30">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-sm text-xs transition-colors ${viewMode === 'list' ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}
              >
                <FileText className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode("json")}
                className={`p-1.5 rounded-sm text-xs transition-colors ${viewMode === 'json' ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}
              >
                <Code2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-sm text-xs transition-colors ${viewMode === 'table' ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}
              >
                <Grid3X3 className="h-3.5 w-3.5" />
              </button>
              <span className="text-xs text-muted-foreground ml-2">
                Displaying {documents.length} of {collection.documentCount.toLocaleString()} documents
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors">
                <Plus className="h-3.5 w-3.5" />
                Add Data
              </button>
              <div className="flex items-center gap-1 ml-3">
                <button className="p-1 text-muted-foreground hover:text-foreground rounded-sm hover:bg-secondary transition-colors">
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <span className="text-xs text-muted-foreground">1 – {documents.length}</span>
                <button className="p-1 text-muted-foreground hover:text-foreground rounded-sm hover:bg-secondary transition-colors">
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Document list */}
          <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-0">
            {viewMode === "list" && documents.map((doc, i) => (
              <JsonDocument key={doc._id} document={doc} index={i} />
            ))}
            {viewMode === "json" && (
              <pre className="text-xs font-mono text-foreground bg-card p-4 rounded-sm border border-border overflow-auto">
                {JSON.stringify(documents, null, 2)}
              </pre>
            )}
            {viewMode === "table" && (
              <div className="overflow-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      {documents.length > 0 && Object.keys(documents[0]).map((key) => (
                        <th key={key} className="px-3 py-2 text-left font-medium text-muted-foreground bg-muted/30 whitespace-nowrap">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc) => (
                      <tr key={doc._id} className="border-b border-border hover:bg-muted/20 transition-colors">
                        {Object.values(doc).map((val, i) => (
                          <td key={i} className="px-3 py-2 font-mono text-foreground whitespace-nowrap max-w-[200px] truncate">
                            {typeof val === "object" ? JSON.stringify(val) : String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab !== "documents" && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
              {tabs.find(t => t.id === activeTab)?.icon}
            </div>
            <p className="text-sm text-muted-foreground">{tabs.find(t => t.id === activeTab)?.label}</p>
            <p className="text-xs text-muted-foreground mt-1">Coming soon</p>
          </div>
        </div>
      )}
    </div>
  );
}
