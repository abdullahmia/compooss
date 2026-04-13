"use client";

import { ENDPOINTS } from "@/lib/constants";
import type { TMutationOptions } from "@/lib/query.types";
import { COLLECTION_QUERY_KEYS } from "@/lib/services/collections/collection-query.key";
import { DOCUMENTS_QUERY_KEYS } from "@/lib/services/documents/documents-query.key";
import type { ExportFormat, ImportResult } from "@compooss/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type ExportVariables = {
  db: string;
  collection: string;
  format: ExportFormat;
  /** Current filter as a JSON string, e.g. '{"status":"active"}' */
  filter?: string;
  /** 0 = all (server hard-cap applies) */
  limit?: number;
};

/**
 * Fetches the export file and triggers a browser download.
 * Uses raw fetch because the response is a binary/text file, not JSON.
 */
export const useExportCollection = (
  options: TMutationOptions<void, ExportVariables> = {},
) => {
  return useMutation({
    ...options,
    mutationFn: async ({ db, collection, format, filter, limit }: ExportVariables) => {
      const params = new URLSearchParams({ format });
      if (filter && filter.trim() !== "{}" && filter.trim() !== "") {
        params.set("filter", filter);
      }
      if (limit && limit > 0) {
        params.set("limit", String(limit));
      }

      const url = `${ENDPOINTS.export.root(db, collection)}?${params.toString()}`;
      const res = await fetch(`/api${url}`);

      if (!res.ok) {
        const text = await res.text();
        let message = `Export failed (${res.status})`;
        try {
          const json = JSON.parse(text) as { message?: string };
          if (json.message) message = json.message;
        } catch {
          // ignore
        }
        throw new Error(message);
      }

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `${collection}-export.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    },
  });
};

export type ImportVariables = {
  db: string;
  collection: string;
  file: File;
};

/**
 * Uploads a JSON or CSV file and inserts the parsed documents.
 * Returns an ImportResult with inserted/failed counts and error messages.
 */
export const useImportCollection = (
  options: TMutationOptions<ImportResult, ImportVariables> = {},
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: async ({ db, collection, file }: ImportVariables) => {
      const formData = new FormData();
      formData.append("file", file);

      const url = `/api${ENDPOINTS.import.root(db, collection)}`;
      const res = await fetch(url, { method: "POST", body: formData });

      const json = (await res.json()) as { data: ImportResult; message: string };

      if (!res.ok) {
        throw new Error(json.message ?? `Import failed (${res.status})`);
      }

      return json.data;
    },
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({
        queryKey: DOCUMENTS_QUERY_KEYS.list(variables.db, variables.collection),
      });
      queryClient.invalidateQueries({
        queryKey: COLLECTION_QUERY_KEYS.list(variables.db),
      });
      options.onSuccess?.(data, variables, context, mutation);
    },
  });
};
