"use client";

import { JsonEditor } from "@/components/json-editor";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@compooss/ui";
import {
  useAddDocument,
  useUpdateDocument,
} from "@/lib/services/documents/documents.service";
import { useEffect, useState } from "react";

const NEW_DOCUMENT_TEMPLATE = "{}";

function stripJsonComments(raw: string): string {
  let result = "";
  let i = 0;
  while (i < raw.length) {
    if (raw[i] === '"') {
      const start = i;
      i++;
      while (i < raw.length && raw[i] !== '"') {
        if (raw[i] === "\\") i++;
        i++;
      }
      i++;
      result += raw.slice(start, i);
    } else if (raw[i] === "/" && raw[i + 1] === "/") {
      while (i < raw.length && raw[i] !== "\n") i++;
    } else if (raw[i] === "/" && raw[i + 1] === "*") {
      i += 2;
      while (i < raw.length && !(raw[i] === "*" && raw[i + 1] === "/")) i++;
      i += 2;
    } else {
      result += raw[i];
      i++;
    }
  }
  return result;
}

export type DocumentFormMode = "add" | "edit";

type DocumentFormModalProps = {
  open: boolean;
  onClose: () => void;
  mode: DocumentFormMode;
  dbName: string;
  collectionName: string;
  /** Required for edit mode: the document _id (string). */
  documentId?: string;
  /** Initial JSON. For add mode defaults to "{}". For edit mode must be provided when opening. */
  initialJson?: string;
};

export function DocumentFormModal({
  open,
  onClose,
  mode,
  dbName,
  collectionName,
  documentId,
  initialJson,
}: DocumentFormModalProps) {
  const [json, setJson] = useState(NEW_DOCUMENT_TEMPLATE);
  const [error, setError] = useState<string | null>(null);

  const { mutateAsync: addDocument, isPending: isAdding } = useAddDocument({
    onSuccess: () => {
      onClose();
      setJson(NEW_DOCUMENT_TEMPLATE);
      setError(null);
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const { mutateAsync: updateDocument, isPending: isUpdating } =
    useUpdateDocument(dbName, collectionName, {
      onSuccess: () => {
        onClose();
        setError(null);
      },
      onError: (err) => {
        console.error(err);
      },
    });

  const isPending = isAdding || isUpdating;

  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => {
      setError(null);
      if (mode === "edit" && initialJson != null) {
        setJson(initialJson);
      } else if (mode === "add") {
        setJson(NEW_DOCUMENT_TEMPLATE);
      }
    });
    return () => cancelAnimationFrame(id);
  }, [open, mode, initialJson]);

  const handleSubmit = async () => {
    setError(null);
    try {
      const cleaned = stripJsonComments(json).trim();
      if (!cleaned) {
        setError(
          mode === "add"
            ? "Document JSON cannot be empty."
            : "Updated document JSON cannot be empty.",
        );
        return;
      }

      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        setError("Provide a single JSON object, not an array.");
        return;
      }
      if (!parsed || typeof parsed !== "object") {
        setError("Document must be a JSON object.");
        return;
      }

      if (mode === "add") {
        await addDocument({
          db: dbName,
          collection: collectionName,
          payload: parsed,
        });
      } else {
        if (!documentId) {
          setError("Missing document id.");
          return;
        }
        const incomingId = (parsed as Record<string, unknown>)._id;
        if (
          incomingId !== undefined &&
          incomingId !== null &&
          String(incomingId) !== String(documentId)
        ) {
          setError("`_id` is read-only and cannot be changed during edit.");
          return;
        }
        const { _id: _, ...payload } = parsed as Record<string, unknown>;
        if (Object.keys(payload).length === 0) {
          setError("Update must contain at least one field besides _id.");
          return;
        }
        await updateDocument({ documentId, payload });
      }
    } catch (err) {
      let message = "Invalid JSON. Please check the syntax.";
      if (err instanceof Error) {
        const payload = (err as Error & { payload?: unknown }).payload;
        if (
          payload &&
          typeof payload === "object" &&
          "message" in payload &&
          typeof (payload as { message: unknown }).message === "string"
        ) {
          message = (payload as { message: string }).message;
        } else {
          message = err.message;
        }
      }
      setError(message);
    }
  };

  const title =
    mode === "add"
      ? `Add documents to ${dbName}.${collectionName}`
      : `Edit document in ${dbName}.${collectionName}`;

  const description =
    mode === "add" ? (
      <>
        Paste one or more MongoDB documents as JSON. Comments are allowed and
        will be ignored. An <code>_id</code> will be generated if missing.
      </>
    ) : (
      <>
        Edit the document JSON below. The <code>_id</code> field is treated as
        read-only and must not be changed.
      </>
    );

  const submitLabel = mode === "add" ? "Insert" : "Save";

  return (
    <Modal open={open} onClose={onClose}>
      <ModalContent size="lg">
        <ModalHeader title={title} onClose={onClose} />
        <ModalBody>
          <p className="text-xs text-muted-foreground">{description}</p>
          <div className="mt-2">
            <JsonEditor value={json} onChange={setJson} />
          </div>
          {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            className="text-xs px-3 py-1.5 rounded-sm border border-border text-muted-foreground hover:bg-muted transition-colors"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </button>
          <button
            type="button"
            className="text-xs px-3 py-1.5 rounded-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending
              ? mode === "add"
                ? "Inserting…"
                : "Saving…"
              : submitLabel}
          </button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
