"use client";

import { updateDocument } from "@/data/mockData";
import { useGetDocuments } from "@/lib/services/v2/documents/documents.service";
import {
  ChevronLeft,
  ChevronRight,
  Code2,
  FileText,
  Grid3X3,
} from "lucide-react";
import { useParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import { JsonDocument } from "../../json-document";
import { JsonEditor } from "../../json-editor";
import { QueryBar } from "../../query-bar";
import { IconButton } from "../../ui/icon-button/icon-button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "../../ui/modal/modal";
import { AddDocument } from "./add-document";

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

type TSimpleFilter = {
  path: string;
  value: string | number | boolean | null;
};

function stripJsonComments(raw: string): string {
  return raw.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
}

function parseFilterQuery(raw: string): TSimpleFilter[] {
  const trimmed = raw.trim();
  if (!trimmed || trimmed === "{}" || trimmed === "{ }") {
    return [];
  }

  if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) {
    throw new Error("Filter must be in the form `{ field: value }`.");
  }

  const inner = trimmed.slice(1, -1);
  const parts = inner
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  const filters: TSimpleFilter[] = [];

  for (const part of parts) {
    const match = part.match(/^([\w.]+)\s*:\s*(.+)$/);
    if (!match) {
      throw new Error(
        "Invalid filter segment. Use `field: value` pairs separated by commas.",
      );
    }
    const [, path, rawValue] = match;

    let value: string | number | boolean | null = rawValue.trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    } else if (/^(true|false)$/i.test(value)) {
      value = /^true$/i.test(value);
    } else if (/^null$/i.test(value)) {
      value = null;
    } else if (!Number.isNaN(Number(value))) {
      value = Number(value);
    }

    filters.push({ path, value });
  }

  return filters;
}

function matchesFilters(doc: any, filters: TSimpleFilter[]): boolean {
  if (filters.length === 0) return true;

  return filters.every(({ path, value }) => {
    const segments = path.split(".");
    let current: any = doc;

    for (const seg of segments) {
      if (current == null || typeof current !== "object") return false;
      current = current[seg];
    }

    if (value === null) {
      return current == null;
    }

    if (typeof value === "boolean") {
      return Boolean(current) === value;
    }

    if (typeof value === "number") {
      return Number(current) === value;
    }

    // string: case-insensitive contains match
    return String(current ?? "")
      .toLowerCase()
      .includes(String(value).toLowerCase());
  });
}

export const DocumentsTab: React.FC = () => {
  const [viewMode, setViewMode] = useState<"list" | "json" | "table">("list");
  const [page, setPage] = useState(1);
  const [filterError, setFilterError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<TSimpleFilter[]>([]);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [editJson, setEditJson] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const pageSize = 25;

  const params = useParams();
  const dbName = (params?.dbName as string) ?? "";
  const collectionName = (params?.collectionName as string) ?? "";
  const { data } = useGetDocuments(dbName ?? "", collectionName ?? "", {
    enabled: !!dbName && !!collectionName,
  });
  const documents = useMemo(() => data?.data ?? [], [data]);
  const filteredDocs = useMemo(
    () => documents.filter((doc) => matchesFilters(doc, activeFilters)),
    [documents, activeFilters],
  );

  const total = filteredDocs.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, pageCount);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);
  const pageDocs = filteredDocs.slice(startIndex, endIndex);

  const fieldSuggestions = useMemo(
    () => getFieldsFromDocs(documents),
    [documents],
  );

  const handlePrev = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setPage((prev) => Math.min(pageCount, prev + 1));
  };

  const handleRunQuery = (rawQuery: string) => {
    try {
      const filters = parseFilterQuery(rawQuery);
      setActiveFilters(filters);
      setFilterError(null);
      setPage(1);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Invalid filter. Please check the syntax.";
      setFilterError(message);
    }
  };

  const handleOpenEdit = (doc: any) => {
    setEditingDocId(doc._id);
    setEditJson(JSON.stringify(doc, null, 2));
    setEditError(null);
  };

  const handleSaveEdit = () => {
    if (!editingDocId) return;
    try {
      setIsSavingEdit(true);
      setEditError(null);

      const cleaned = stripJsonComments(editJson).trim();
      if (!cleaned) {
        throw new Error("Updated document JSON cannot be empty.");
      }

      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        throw new Error(
          "Edit expects a single document JSON object, not an array.",
        );
      }
      if (!parsed || typeof parsed !== "object") {
        throw new Error("Edited document must be a JSON object.");
      }

      const incomingId = (parsed as any)._id;
      if (
        incomingId !== undefined &&
        incomingId !== null &&
        incomingId !== editingDocId
      ) {
        throw new Error(
          "`_id` is read-only and cannot be changed during edit.",
        );
      }

      const updated = { ...parsed, _id: editingDocId };
      updateDocument(dbName, collectionName, editingDocId, updated);
      setEditingDocId(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to parse edited document JSON. Please check the syntax.";
      setEditError(message);
    } finally {
      setIsSavingEdit(false);
    }
  };

  return (
    <>
      <QueryBar
        onRunQuery={handleRunQuery}
        fieldSuggestions={fieldSuggestions}
      />

      {filterError && (
        <div className="px-4 py-2 text-xs text-destructive bg-destructive/10 border-b border-destructive/30">
          {filterError}
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
            Displaying {total === 0 ? "0" : `${startIndex + 1}–${endIndex}`} of{" "}
            {total.toLocaleString()} documents
          </span>
        </div>
        <div className="flex items-center gap-2">
          <AddDocument
            dbName={dbName ?? ""}
            collectionName={collectionName ?? ""}
          />
          <div className="flex items-center ml-3">
            <IconButton
              variant="default"
              size="sm"
              icon={<ChevronLeft className="h-3.5 w-3.5" />}
              label="Previous page"
              onClick={handlePrev}
              disabled={currentPage === 1}
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
              disabled={currentPage === pageCount || total === 0}
            />
          </div>
        </div>
      </div>

      {/* Document list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-0">
        {viewMode === "list" &&
          (pageDocs.length > 0 ? (
            pageDocs.map((doc, i) => (
              <JsonDocument
                key={doc._id}
                document={doc}
                index={startIndex + i}
                onEdit={handleOpenEdit}
              />
            ))
          ) : (
            <div className="text-xs text-muted-foreground px-1 py-2">
              No documents match the current filter.
            </div>
          ))}
        {viewMode === "json" && (
          <pre className="text-xs font-mono text-foreground bg-card p-4 rounded-sm border border-border overflow-auto">
            {JSON.stringify(pageDocs, null, 2)}
          </pre>
        )}
        {viewMode === "table" && (
          <div className="overflow-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  {pageDocs.length > 0 &&
                    Object.keys(pageDocs[0]).map((key) => (
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
                {pageDocs.map((doc) => (
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

      <Modal open={editingDocId !== null} onClose={() => setEditingDocId(null)}>
        <ModalContent size="lg">
          <ModalHeader
            title={`Edit document in ${dbName}.${collectionName}`}
            onClose={() => setEditingDocId(null)}
          />
          <ModalBody>
            <p className="text-xs text-muted-foreground">
              Edit the document JSON below. The <code>_id</code> field is
              treated as read-only and must not be changed.
            </p>
            <div className="mt-2">
              <JsonEditor value={editJson} onChange={setEditJson} />
            </div>
            {editError && (
              <p className="mt-2 text-xs text-destructive">{editError}</p>
            )}
          </ModalBody>
          <ModalFooter>
            <button
              type="button"
              className="text-xs px-3 py-1.5 rounded-sm border border-border text-muted-foreground hover:bg-muted transition-colors"
              onClick={() => setEditingDocId(null)}
              disabled={isSavingEdit}
            >
              Cancel
            </button>
            <button
              type="button"
              className="text-xs px-3 py-1.5 rounded-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleSaveEdit}
              disabled={isSavingEdit}
            >
              {isSavingEdit ? "Saving…" : "Save changes"}
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
