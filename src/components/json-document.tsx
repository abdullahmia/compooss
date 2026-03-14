"use client";

import type { MongoDocument } from "@/data/mockData";
import { useDeleteDocument } from "@/lib/services/v2/documents/documents.service";
import {
  ChevronDown,
  ChevronRight,
  Copy,
  FileText,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { IconButton } from "./ui/icon-button/icon-button";
import { toast } from "sonner";

/** Normalize document _id to string (handles { $oid: "..." } or plain string). */
export function getDocumentId(doc: { _id?: unknown }): string {
  const id = doc._id;
  if (id === undefined || id === null) return "";
  if (typeof id === "object" && "$oid" in (id as object)) {
    const oid = (id as { $oid: string }).$oid;
    return typeof oid === "string" ? oid : "";
  }
  return String(id);
}

interface JsonDocumentProps {
  document: MongoDocument;
  index: number;
  onEdit?: (document: MongoDocument) => void;
  onDeleted?: () => void;
  /** Required for delete. If not provided, delete button is hidden or disabled. */
  dbName?: string;
  collectionName?: string;
  /** When true, edit and delete actions are hidden (e.g. for system databases). */
  readOnly?: boolean;
}

function JsonValue({ value, depth = 0 }: { value: any; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 0);

  if (value === null)
    return <span className="text-json-null font-mono text-xs">null</span>;
  if (typeof value === "boolean")
    return (
      <span className="text-json-boolean font-mono text-xs">
        {value.toString()}
      </span>
    );
  if (typeof value === "number")
    return <span className="text-json-number font-mono text-xs">{value}</span>;
  if (typeof value === "string")
    return (
      <span className="text-json-string font-mono text-xs">
        &quot;{value}&quot;
      </span>
    );

  if (Array.isArray(value)) {
    if (value.length === 0)
      return (
        <span className="text-muted-foreground font-mono text-xs">[ ]</span>
      );
    return (
      <span>
        <button
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center text-muted-foreground hover:text-foreground"
        >
          {expanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
          <span className="text-xs font-mono ml-0.5">
            Array({value.length})
          </span>
        </button>
        {expanded && (
          <div className="ml-4 border-l border-border/50 pl-3">
            {value.map((item, i) => (
              <div key={i} className="py-0.5">
                <span className="text-json-number font-mono text-xs mr-2">
                  {i}
                </span>
                <span className="text-muted-foreground mr-1">:</span>
                <JsonValue value={item} depth={depth + 1} />
              </div>
            ))}
          </div>
        )}
      </span>
    );
  }

  if (typeof value === "object") {
    const keys = Object.keys(value);
    if (keys.length === 0)
      return (
        <span className="text-muted-foreground font-mono text-xs">{"{ }"}</span>
      );

    if (keys.length === 1 && keys[0] === "$oid") {
      return (
        <span className="text-json-string font-mono text-xs">
          ObjectId(&quot;{value.$oid}&quot;)
        </span>
      );
    }
    if (keys.length === 1 && keys[0] === "$date") {
      return (
        <span className="text-json-string font-mono text-xs">
          ISODate(&quot;{value.$date}&quot;)
        </span>
      );
    }

    return (
      <span>
        <button
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center text-muted-foreground hover:text-foreground"
        >
          {expanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
          <span className="text-xs font-mono ml-0.5">
            Object({keys.length})
          </span>
        </button>
        {expanded && (
          <div className="ml-4 border-l border-border/50 pl-3">
            {keys.map((key) => (
              <div key={key} className="py-0.5">
                <span className="text-json-key font-mono text-xs">{key}</span>
                <span className="text-muted-foreground mx-1">:</span>
                <JsonValue value={value[key]} depth={depth + 1} />
              </div>
            ))}
          </div>
        )}
      </span>
    );
  }

  return (
    <span className="text-foreground font-mono text-xs">{String(value)}</span>
  );
}

export function JsonDocument({
  document,
  onEdit,
  onDeleted,
  dbName,
  collectionName,
  readOnly = false,
}: JsonDocumentProps) {
  const [expanded, setExpanded] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const docId = getDocumentId(document);
  const canDelete = !readOnly && !!(dbName && collectionName && docId);

  const { mutateAsync: deleteDocument, isPending: isDeleting } =
    useDeleteDocument(dbName ?? "", collectionName ?? "", {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        onDeleted?.();
      },
    });

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(document, null, 2));
    toast.success("Document copied to clipboard");
  };

  const handleDeleteClick = () => {
    if (canDelete) setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!canDelete) return;
    await deleteDocument(docId);
  };

  return (
    <div className="border border-border rounded-lg bg-card mb-3 group shadow-xs hover:border-primary/20 transition-colors">
      {/* Document header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/30 rounded-t-lg relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary" />
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-muted-foreground hover:text-foreground ml-1"
        >
          {expanded ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </button>
        <FileText className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs font-mono text-json-string truncate">
          ObjectId(&quot;{getDocumentId(document)}&quot;)
        </span>

        <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <IconButton
            variant="default"
            size="md"
            icon={<Copy className="h-3 w-3" />}
            label="Copy Document"
            onClick={handleCopy}
          />
          {!readOnly && (
            <IconButton
              variant="default"
              size="md"
              icon={<Pencil className="h-3 w-3" />}
              label="Edit Document"
              onClick={() => onEdit?.(document)}
            />
          )}
          {canDelete && (
            <IconButton
              variant="danger"
              size="md"
              icon={<Trash2 className="h-3 w-3" />}
              label="Delete Document"
              onClick={handleDeleteClick}
            />
          )}
        </div>
      </div>

      {expanded && (
        <div className="px-5 py-4">
          {Object.entries(document).map(([key, value]) => (
            <div key={key} className="py-0.5 flex items-start">
              <span className="text-json-key font-mono text-xs min-w-[100px] shrink-0">
                {key}
              </span>
              <span className="text-muted-foreground mx-1.5">:</span>
              <JsonValue value={value} />
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation bar at the bottom */}
      {showDeleteConfirm && (
        <div className="px-4 py-3 border-t border-border bg-destructive/10 rounded-b-lg flex items-center justify-between gap-3">
          <p className="text-xs text-foreground">
            Delete this document? This action cannot be undone.
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
              className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded-sm border border-border hover:bg-muted transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="px-3 py-1.5 text-xs font-medium bg-destructive text-destructive-foreground rounded-sm hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
