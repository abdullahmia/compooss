import { apiClient } from "@/lib/config/api.config";
import { ENDPOINTS } from "@/lib/constants";
import { DOCUMENTS_QUERY_KEYS } from "./documents-query.key";
import { TQueryOptions, TMutationOptions } from "@/lib/query.types";
import type { ApiResponse, Document, PaginatedResult } from "@compooss/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type TDocumentsQueryParams = {
  filter?: string;
  sort?: string;
  project?: string;
  limit?: number;
  skip?: number;
};

const defaultQueryParams: Required<TDocumentsQueryParams> = {
  filter: "{}",
  sort: "{}",
  project: "{}",
  limit: 20,
  skip: 0,
};

export const useGetDocuments = (
  db: string,
  collection: string,
  options?: TQueryOptions<PaginatedResult<Document>> & { queryParams?: TDocumentsQueryParams },
) => {
  const { queryParams: rawParams, ...queryOptions } = options ?? {};
  const queryParams = { ...defaultQueryParams, ...rawParams };

  return useQuery<PaginatedResult<Document>, Error, PaginatedResult<Document>, readonly unknown[]>({
    queryKey: DOCUMENTS_QUERY_KEYS.list(db, collection, queryParams),
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("filter", queryParams.filter);
      params.set("sort", queryParams.sort);
      params.set("project", queryParams.project);
      params.set("limit", String(queryParams.limit));
      params.set("skip", String(queryParams.skip));
      const url = `${ENDPOINTS.documents.all(db, collection)}?${params.toString()}`;
      const response = await apiClient.get<ApiResponse<PaginatedResult<Document>>>(url);
      return response.data;
    },
    enabled: !!db && !!collection,
    ...queryOptions,
  });
};

type AddDocumentVariables = { db: string; collection: string; payload: Record<string, unknown> };

export const useAddDocument = (options: TMutationOptions<unknown, AddDocumentVariables> = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: async ({ db, collection, payload }: AddDocumentVariables) => {
      const response = await apiClient.post<ApiResponse<unknown>>(
        ENDPOINTS.documents.all(db, collection),
        payload,
      );
      return response.data;
    },
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({
        queryKey: DOCUMENTS_QUERY_KEYS.list(variables.db, variables.collection),
      });
      options.onSuccess?.(data, variables, context, mutation);
    },
  });
};

type UpdateDocumentVariables = { documentId: string; payload: Record<string, unknown> };

export const useUpdateDocument = (
  db: string,
  collection: string,
  options: TMutationOptions<unknown, UpdateDocumentVariables> = {},
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: async ({ documentId, payload }: UpdateDocumentVariables) => {
      const response = await apiClient.patch<ApiResponse<unknown>>(
        ENDPOINTS.documents.byId(db, collection, documentId),
        { body: payload },
      );
      return response.data;
    },
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({
        queryKey: DOCUMENTS_QUERY_KEYS.list(db, collection),
      });
      options.onSuccess?.(data, variables, context, mutation);
    },
  });
};

export const useDeleteDocument = (
  db: string,
  collection: string,
  options: TMutationOptions<null, string> = {},
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: async (documentId: string) => {
      const response = await apiClient.delete<ApiResponse<null>>(
        ENDPOINTS.documents.byId(db, collection, documentId),
      );
      return response.data;
    },
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({
        queryKey: DOCUMENTS_QUERY_KEYS.list(db, collection),
      });
      options.onSuccess?.(data, variables, context, mutation);
    },
  });
};
