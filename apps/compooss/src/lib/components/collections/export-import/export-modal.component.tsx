"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
} from "@compooss/ui";
import { useExportCollection } from "@/lib/services/export/export.service";
import type { ExportFormat } from "@compooss/types";
import { Download, FileJson, FileText } from "lucide-react";
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  dbName: string;
  collectionName: string;
  /** Current query-bar filter string, e.g. '{"status":"active"}' */
  currentFilter?: string;
  /** Total documents that match the current filter */
  totalDocuments?: number;
};

type LimitMode = "all" | "custom";

export const ExportModal: React.FC<Props> = ({
  open,
  onClose,
  dbName,
  collectionName,
  currentFilter,
  totalDocuments = 0,
}) => {
  const [format, setFormat] = useState<ExportFormat>("json");
  const [applyFilter, setApplyFilter] = useState(false);
  const [limitMode, setLimitMode] = useState<LimitMode>("all");
  const [customLimit, setCustomLimit] = useState("1000");

  const hasActiveFilter =
    !!currentFilter &&
    currentFilter.trim() !== "{}" &&
    currentFilter.trim() !== "";

  const { mutateAsync: exportCollection, isPending, error } = useExportCollection({
    onSuccess: onClose,
  });

  const handleExport = async () => {
    const limit = limitMode === "custom" ? Math.max(1, parseInt(customLimit, 10) || 1000) : 0;
    await exportCollection({
      db: dbName,
      collection: collectionName,
      format,
      filter: applyFilter && hasActiveFilter ? currentFilter : undefined,
      limit,
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalContent size="md">
        <ModalHeader
          title="Export collection"
          icon={<Download className="h-4 w-4" />}
          onClose={onClose}
        />

        <ModalBody className="space-y-5">
          {/* Format */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Format</p>
            <div className="grid grid-cols-2 gap-2">
              {(["json", "csv"] as ExportFormat[]).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setFormat(fmt)}
                  className={[
                    "flex items-center gap-2.5 px-3 py-3 rounded-sm border text-sm font-medium transition-colors text-left",
                    format === fmt
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-secondary text-foreground hover:border-primary/50",
                  ].join(" ")}
                >
                  {fmt === "json" ? (
                    <FileJson className="h-4 w-4 shrink-0" />
                  ) : (
                    <FileText className="h-4 w-4 shrink-0" />
                  )}
                  <span className="uppercase">{fmt}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              {format === "json"
                ? "Exports a JSON array of documents. Nested fields are preserved."
                : "Exports a flat CSV. Nested fields use dot notation; arrays are serialised as JSON strings."}
            </p>
          </div>

          {/* Filter */}
          {hasActiveFilter && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Filter</p>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={applyFilter}
                  onChange={(e) => setApplyFilter(e.target.checked)}
                  className="mt-0.5 accent-primary"
                />
                <span className="text-sm text-foreground leading-tight">
                  Apply current filter
                  <span className="block text-xs text-muted-foreground font-mono mt-0.5 truncate max-w-xs">
                    {currentFilter}
                  </span>
                </span>
              </label>
            </div>
          )}

          {/* Limit */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Documents to export</p>
            <div className="space-y-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="limit"
                  value="all"
                  checked={limitMode === "all"}
                  onChange={() => setLimitMode("all")}
                  className="accent-primary"
                />
                <span className="text-sm text-foreground">
                  All matching documents
                  {totalDocuments > 0 && (
                    <span className="text-xs text-muted-foreground ml-1.5">
                      ({totalDocuments.toLocaleString()} total)
                    </span>
                  )}
                </span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="limit"
                  value="custom"
                  checked={limitMode === "custom"}
                  onChange={() => setLimitMode("custom")}
                  className="accent-primary"
                />
                <span className="text-sm text-foreground">First</span>
                <input
                  type="number"
                  min={1}
                  max={100000}
                  value={customLimit}
                  onChange={(e) => setCustomLimit(e.target.value)}
                  disabled={limitMode !== "custom"}
                  className="w-24 h-7 text-sm font-mono px-2 rounded-sm border border-border bg-secondary text-foreground focus:border-primary focus:ring-1 focus:ring-primary/30 outline-hidden disabled:opacity-50"
                />
                <span className="text-sm text-foreground">documents</span>
              </label>
            </div>
          </div>

          {error && (
            <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-sm">
              {error.message}
            </p>
          )}

          <p className="text-xs text-muted-foreground">
            Server hard-cap: 100 000 documents per export.
          </p>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" type="button" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="button"
            icon={<Download className="h-3.5 w-3.5" />}
            loading={isPending}
            onClick={handleExport}
          >
            {isPending ? "Exporting…" : "Export"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
