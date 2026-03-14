"use client";

import { EmptyState } from "@/components/empty-state";
import { getDocumentId, JsonDocumentSkeleton } from "@/components/json-document";
import { useGetDocuments } from "@/lib/services/v2/documents/documents.service";
import {
  ChevronLeft,
  ChevronRight,
  Code2,
  FileText,
  Grid3X3,
} from "lucide-react";
import { useParams } from "next/navigation";
import React, { useCallback, useMemo, useState } from "react";
import { JsonDocument } from "../../json-document";
import { defaultState, QueryBar, type QueryBarState } from "../../query-bar";
import { IconButton } from "../../ui/icon-button/icon-button";
import { AddDocument } from "./add-document";
import { DocumentFormModal } from "./document-form-modal";

function getFieldsFromDocs(docs: any[]): string[] {
  const fields = new Set<string>();
  const extract = (obj: any, prefix = "") => {
    if (!obj || typeof obj !== "object") return;
    for (const key of Object.keys(obj)) {
      const path = prefix ? `${prefix}.${key}` : key;
      fields.add(path);
      if (
        typeof obj[key] === "object" &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        extract(obj[key], path);
      }
    }
  };
  docs.forEach((doc) => extract(doc));
  return Array.from(fields).sort();
}

type DocumentsTabProps = { readOnly?: boolean };

export const DocumentsTab: React.FC<DocumentsTabProps> = ({ readOnly = false }) => {
  const [viewMode, setViewMode] = useState<"list" | "json" | "table">("list");
  const [queryParams, setQueryParams] = useState<QueryBarState>(defaultState);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<{
    id: string;
    json: string;
  } | null>(null);

  const params = useParams();
  const dbName = (params?.dbName as string) ?? "";
  const collectionName = (params?.collectionName as string) ?? "";
  const { data, error: queryError, isError, isLoading } = useGetDocuments(dbName ?? "", collectionName ?? "", {
    enabled: !!dbName && !!collectionName,
    queryParams: {
      filter: queryParams.filter,
      sort: queryParams.sort,
      project: queryParams.project,
      limit: queryParams.limit,
      skip: queryParams.skip,
    },
  });

  const documents = useMemo(() => data?.data ?? [], [data]);
  const total = data?.total ?? 0;
  const currentPage = data?.page ?? 1;
  const pageCount = Math.max(1, data?.totalPages ?? 1);
  const hasNextPage = data?.hasNextPage ?? false;
  const hasPrevPage = data?.hasPrevPage ?? false;
  const startIndex = total === 0 ? 0 : (currentPage - 1) * (data?.limit ?? queryParams.limit) + 1;
  const endIndex = total === 0 ? 0 : Math.min(startIndex + documents.length - 1, total);

  const fieldSuggestions = useMemo(
    () => getFieldsFromDocs(documents),
    [documents],
  );

  const handleRunQuery = useCallback((state: QueryBarState) => {
    setQueryParams(state);
  }, []);

  const handlePrev = useCallback(() => {
    setQueryParams((prev) => ({
      ...prev,
      skip: Math.max(0, prev.skip - prev.limit),
    }));
  }, []);

  const handleNext = useCallback(() => {
    setQueryParams((prev) => ({
      ...prev,
      skip: prev.skip + prev.limit,
    }));
  }, []);

  const handleOpenEdit = (doc: Record<string, unknown>) => {
    setEditingDocument({
      id: getDocumentId(doc),
      json: JSON.stringify(doc, null, 2),
    });
  };

  return (
    <>
      <QueryBar
        onRunQuery={handleRunQuery}
        fieldSuggestions={fieldSuggestions}
      />

      {isError && queryError && (
        <div className="px-4 py-2 text-xs text-destructive bg-destructive/10 border-b border-destructive/30">
          {queryError.message}
        </div>
      )}

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
            Displaying {total === 0 ? "0" : `${startIndex}–${endIndex}`} of{" "}
            {total.toLocaleString()} documents
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!readOnly && (
            <AddDocument
              dbName={dbName ?? ""}
              collectionName={collectionName ?? ""}
              open={addModalOpen}
              onOpenChange={setAddModalOpen}
            />
          )}
          <div className="flex items-center ml-3">
            <IconButton
              variant="default"
              size="sm"
              icon={<ChevronLeft className="h-3.5 w-3.5" />}
              label="Previous page"
              onClick={handlePrev}
              disabled={!hasPrevPage}
            />
            <span className="text-xs text-muted-foreground px-2">
              {currentPage} / {pageCount}
            </span>
            <IconButton
              variant="default"
              size="sm"
              icon={<ChevronRight className="h-3.5 w-3.5" />}
              label="Next page"
              onClick={handleNext}
              disabled={!hasNextPage || total === 0}
            />
          </div>
        </div>
      </div>

      {/* Document content: list / json / table */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-0">
        {isLoading ? (
          viewMode === "list" ? (
            Array.from({ length: 5 }).map((_, i) => (
              <JsonDocumentSkeleton key={i} />
            ))
          ) : (
            <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
              Loading documents…
            </div>
          )
        ) : documents.length === 0 ? (
          <EmptyState
            title="No documents"
            description="No documents match the current filter. Try adjusting the filter or add a new document."
            primaryAction={
              !readOnly
                ? { label: "Add document", onClick: () => setAddModalOpen(true) }
                : undefined
            }
          />
        ) : viewMode === "list" ? (
          documents.map((doc, i) => (
            <JsonDocument
              key={doc._id}
              document={doc}
              index={startIndex - 1 + i}
              onEdit={readOnly ? undefined : handleOpenEdit}
              dbName={readOnly ? undefined : dbName}
              collectionName={readOnly ? undefined : collectionName}
              readOnly={readOnly}
            />
          ))
        ) : viewMode === "json" ? (
          <pre className="text-xs font-mono text-foreground bg-card p-4 rounded-sm border border-border overflow-auto">
            {JSON.stringify(documents, null, 2)}
          </pre>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  {Object.keys(documents[0]).map((key) => (
                    <th
                      key={key}
                      className="px-3 py-2 text-left font-medium text-muted-foreground bg-muted/30 whitespace-nowrap"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr
                    key={doc._id}
                    className="border-b border-border hover:bg-muted/20 transition-colors"
                  >
                    {Object.values(doc).map((val, i) => (
                      <td
                        key={i}
                        className="px-3 py-2 font-mono text-foreground whitespace-nowrap max-w-[200px] truncate"
                      >
                        {typeof val === "object"
                          ? JSON.stringify(val)
                          : String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!readOnly && (
        <DocumentFormModal
          open={editingDocument !== null}
          onClose={() => setEditingDocument(null)}
          mode="edit"
          dbName={dbName}
          collectionName={collectionName}
          documentId={editingDocument?.id}
          initialJson={editingDocument?.json}
        />
      )}
    </>
  );
};
