import { toast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/config/api.config";
import { ENDPOINTS } from "@/lib/constants";
import { QUERY_KEYS } from "@/lib/constants/query-key.contants";
import { TQueryOptions } from "@/lib/query.types";
import type { ApiResponse, Document, PaginatedResult } from "@compooss/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function getErrorMessage(error: Error): string {
  const payload = (error as Error & { payload?: unknown }).payload;
  if (payload && typeof payload === "object" && "message" in payload && typeof (payload as { message: unknown }).message === "string") {
    return (payload as { message: string }).message;
  }
  return error.message;
}

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
    queryKey: QUERY_KEYS.documents.list(db, collection, queryParams),
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
    ...queryOptions,
  });
};

type AddDocumentVariables = { db: string; collection: string; payload: Record<string, unknown> };

export const useAddDocument = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
} = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ db, collection, payload }: AddDocumentVariables) => {
      const response = await apiClient.post<ApiResponse<unknown>>(
        ENDPOINTS.documents.all(db, collection),
        payload,
      );
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["documents", variables.db, variables.collection],
      });
      onSuccess?.();
      toast({
        title: "Success",
        description: "Document(s) added successfully",
        variant: "success",
      });
    },
    onError: (error: Error) => {
      onError?.(error);
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    },
  });
};

export const useUpdateDocument = (
  db: string,
  collection: string,
  options?: { onSuccess?: () => void; onError?: (error: Error) => void },
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      documentId,
      payload,
    }: {
      documentId: string;
      payload: Record<string, unknown>;
    }) => {
      const response = await apiClient.patch<ApiResponse<unknown>>(
        ENDPOINTS.documents.byId(db, collection, documentId),
        { body: payload },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["documents", db, collection],
      });
      options?.onSuccess?.();
      toast({
        title: "Success",
        description: "Document updated successfully",
        variant: "success",
      });
    },
    onError: (error: Error) => {
      options?.onError?.(error);
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    },
  });
};

export const useDeleteDocument = (
  db: string,
  collection: string,
  options?: { onSuccess?: () => void; onError?: (error: Error) => void },
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documentId: string) => {
      const response = await apiClient.delete<ApiResponse<null>>(
        ENDPOINTS.documents.byId(db, collection, documentId),
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["documents", db, collection],
      });
      options?.onSuccess?.();
      toast({
        title: "Success",
        description: "Document deleted successfully",
        variant: "success",
      });
    },
    onError: (error: Error) => {
      options?.onError?.(error);
      toast({
        title: "Error",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    },
  });
};