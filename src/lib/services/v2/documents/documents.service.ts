import { toast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/config/api.config";
import { ENDPOINTS } from "@/lib/constants";
import { QUERY_KEYS } from "@/lib/constants/query-key.contants";
import { IApiResponse, TQueryOptions } from "@/lib/types";
import { TGetDocumentsResponse } from "@/lib/types/document.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function getErrorMessage(error: Error): string {
  const payload = (error as Error & { payload?: unknown }).payload;
  if (payload && typeof payload === "object" && "message" in payload && typeof (payload as { message: unknown }).message === "string") {
    return (payload as { message: string }).message;
  }
  return error.message;
}

export const useGetDocuments = (
  db: string,
  collection: string,
  options?: TQueryOptions<TGetDocumentsResponse>,
) => {
  return useQuery<TGetDocumentsResponse, Error, TGetDocumentsResponse, readonly unknown[]>({
    queryKey: QUERY_KEYS.documents.all(db, collection),
    queryFn: async () => {
      const response = await apiClient.get<IApiResponse<TGetDocumentsResponse>>(
        ENDPOINTS.documents.all(db, collection),
      );
      return response.data;
    },
    ...options,
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
      const response = await apiClient.post<IApiResponse<unknown>>(
        ENDPOINTS.documents.all(db, collection),
        payload,
      );
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.documents.all(variables.db, variables.collection),
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

export const useDeleteDocument = (
  db: string,
  collection: string,
  options?: { onSuccess?: () => void; onError?: (error: Error) => void },
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documentId: string) => {
      const response = await apiClient.delete<IApiResponse<null>>(
        ENDPOINTS.documents.byId(db, collection, documentId),
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.documents.all(db, collection),
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