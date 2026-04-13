"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
} from "@compooss/ui";
import { useImportCollection } from "@/lib/services/export/export.service";
import type { ImportResult } from "@compooss/types";
import {
  CheckCircle,
  FileJson,
  FileText,
  Upload,
  X,
  XCircle,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  dbName: string;
  collectionName: string;
};

type ParsedPreview = {
  file: File;
  documentCount: number;
  sampleKeys: string[];
  parseError: string | null;
};

function detectDocumentCount(file: File, text: string): { count: number; keys: string[] } {
  const name = file.name.toLowerCase();
  try {
    if (name.endsWith(".csv")) {
      const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
      const headers = lines[0]?.split(",").map((h) => h.trim().replace(/^"|"$/g, "")) ?? [];
      return { count: Math.max(0, lines.length - 1), keys: headers.slice(0, 8) };
    }
    const parsed: unknown = JSON.parse(text);
    if (Array.isArray(parsed)) {
      const keys = parsed.length > 0 ? Object.keys(parsed[0] as object).slice(0, 8) : [];
      return { count: parsed.length, keys };
    }
    if (typeof parsed === "object" && parsed !== null) {
      return { count: 1, keys: Object.keys(parsed).slice(0, 8) };
    }
  } catch {
    // fall through
  }
  return { count: 0, keys: [] };
}

export const ImportModal: React.FC<Props> = ({
  open,
  onClose,
  dbName,
  collectionName,
}) => {
  const [preview, setPreview] = useState<ParsedPreview | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: importCollection, isPending, error: mutationError } = useImportCollection({
    onSuccess: (data) => {
      setResult(data);
      setPreview(null);
    },
  });

  const processFile = useCallback((file: File) => {
    const name = file.name.toLowerCase();
    const isJson = name.endsWith(".json");
    const isCsv = name.endsWith(".csv");

    if (!isJson && !isCsv) {
      setPreview({
        file,
        documentCount: 0,
        sampleKeys: [],
        parseError: "Unsupported file type. Please upload a .json or .csv file.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) ?? "";
      try {
        const { count, keys } = detectDocumentCount(file, text);
        setPreview({ file, documentCount: count, sampleKeys: keys, parseError: null });
      } catch (err) {
        setPreview({
          file,
          documentCount: 0,
          sampleKeys: [],
          parseError: err instanceof Error ? err.message : "Could not parse file.",
        });
      }
    };
    reader.readAsText(file);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleImport = async () => {
    if (!preview?.file) return;
    await importCollection({ db: dbName, collection: collectionName, file: preview.file });
  };

  const handleClose = () => {
    setPreview(null);
    setResult(null);
    if (inputRef.current) inputRef.current.value = "";
    onClose();
  };

  const isJson = preview?.file.name.toLowerCase().endsWith(".json");

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalContent size="md">
        <ModalHeader
          title="Import documents"
          icon={<Upload className="h-4 w-4" />}
          onClose={handleClose}
        />

        <ModalBody className="space-y-4">
          {/* Result view */}
          {result ? (
            <div className="space-y-3">
              {result.inserted > 0 && (
                <div className="flex items-start gap-2.5 px-3 py-3 rounded-sm bg-green-500/10 border border-green-500/30">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {result.inserted.toLocaleString()} document{result.inserted !== 1 ? "s" : ""} imported successfully
                    </p>
                  </div>
                </div>
              )}
              {result.failed > 0 && (
                <div className="flex items-start gap-2.5 px-3 py-3 rounded-sm bg-destructive/10 border border-destructive/30">
                  <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {result.failed.toLocaleString()} document{result.failed !== 1 ? "s" : ""} failed
                    </p>
                    {result.errors.length > 0 && (
                      <ul className="mt-1.5 space-y-0.5 max-h-32 overflow-y-auto scrollbar-thin">
                        {result.errors.slice(0, 20).map((e, i) => (
                          <li key={i} className="text-xs text-muted-foreground font-mono truncate">
                            {e}
                          </li>
                        ))}
                        {result.errors.length > 20 && (
                          <li className="text-xs text-muted-foreground">
                            …and {result.errors.length - 20} more
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Drop zone */}
              {!preview && (
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => inputRef.current?.click()}
                  className={[
                    "flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-sm px-6 py-10 cursor-pointer transition-colors",
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-border bg-secondary hover:border-primary/50 hover:bg-secondary/80",
                  ].join(" ")}
                >
                  <Upload className="h-7 w-7 text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-sm text-foreground font-medium">Drop a file here or click to browse</p>
                    <p className="text-xs text-muted-foreground mt-1">Supports .json and .csv</p>
                  </div>
                  <input
                    ref={inputRef}
                    type="file"
                    accept=".json,.csv"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              )}

              {/* Preview */}
              {preview && (
                <div className="space-y-3">
                  <div className="flex items-start gap-3 px-3 py-3 rounded-sm border border-border bg-secondary">
                    {isJson ? (
                      <FileJson className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    ) : (
                      <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {preview.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(preview.file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        if (inputRef.current) inputRef.current.value = "";
                      }}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {preview.parseError ? (
                    <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-sm">
                      {preview.parseError}
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                        <span className="text-sm text-foreground">
                          <span className="font-medium">{preview.documentCount.toLocaleString()}</span>{" "}
                          document{preview.documentCount !== 1 ? "s" : ""} detected
                        </span>
                      </div>
                      {preview.sampleKeys.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Fields: {preview.sampleKeys.join(", ")}
                          {preview.sampleKeys.length === 8 ? "…" : ""}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Existing <code className="font-mono">_id</code> fields will be stripped — MongoDB will assign new ones.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {mutationError && (
                <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-sm">
                  {mutationError.message}
                </p>
              )}
            </>
          )}
        </ModalBody>

        <ModalFooter>
          {result ? (
            <Button variant="primary" type="button" onClick={handleClose}>
              Done
            </Button>
          ) : (
            <>
              <Button variant="outline" type="button" onClick={handleClose} disabled={isPending}>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="button"
                icon={<Upload className="h-3.5 w-3.5" />}
                loading={isPending}
                disabled={!preview || !!preview.parseError || preview.documentCount === 0}
                onClick={handleImport}
              >
                {isPending ? "Importing…" : "Import"}
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
