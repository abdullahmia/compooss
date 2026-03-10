import { getDocuments } from "@/data/mockData"
import { ChevronLeft, ChevronRight, Code2, FileText, Grid3X3, Plus } from "lucide-react"
import React, { useMemo, useState } from "react"
import { JsonDocument } from "../json-document"
import { QueryBar } from "../query-bar"
import { IconButton } from "../ui/icon-button/icon-button"

type Props = {
  dbName: string
  collectionName: string
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

export const DocumentsTab: React.FC<Props> = ({dbName, collectionName }) => {
  const [viewMode, setViewMode] = useState<"list" | "json" | "table">("list");
  const documents = getDocuments(dbName, collectionName);
  const fieldSuggestions = useMemo(() => getFieldsFromDocs(documents), [documents]);

  return <>
  <QueryBar onRunQuery={() => { }} fieldSuggestions={fieldSuggestions} />

  {/* Toolbar */}
  <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/30">
    <div className="flex items-center gap-2">
      <IconButton
        variant={viewMode === "list" ? "active" : "default"}
        icon={<FileText className="h-3.5 w-3.5" />}
        label="List view"
        onClick={() => setViewMode("list")}
      />
      <IconButton
        variant={viewMode === "json" ? "active" : "default"}
        size="md"
        icon={<Code2 className="h-3.5 w-3.5" />}
        label="JSON view"
        onClick={() => setViewMode("json")}
      />
      <IconButton
        variant={viewMode === "table" ? "active" : "default"}
        size="md"
        icon={<Grid3X3 className="h-3.5 w-3.5" />}
        label="Table view"
        onClick={() => setViewMode("table")}
      />
      <span className="text-xs text-muted-foreground ml-2">
        Displaying {documents.length} of {documents.length.toLocaleString()} documents
      </span>
    </div>
    <div className="flex items-center gap-2">
      <button className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors">
        <Plus className="h-3.5 w-3.5" />
        Add Data
      </button>
      <div className="flex items-center ml-3">
        <IconButton
          variant="default"
          size="sm"
          icon={<ChevronLeft className="h-3.5 w-3.5" />}
          label="Previous page"
        />
        <span className="text-xs text-muted-foreground px-2">1 – 20</span>
        <IconButton
          variant="default"
          size="sm"
          icon={<ChevronRight className="h-3.5 w-3.5" />}
          label="Next page"
        />
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
}