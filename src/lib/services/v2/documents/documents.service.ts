import { toast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/config/api.config";
import { ENDPOINTS } from "@/lib/constants";
import { QUERY_KEYS } from "@/lib/constants/query-key.contants";
import { IApiResponse, TQueryOptions } from "@/lib/types";
import { TGetDocumentsResponse } from "@/lib/types/document.types";
import { useMutation, useQuery } from "@tanstack/react-query";

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
}

export const useAddDocument = ({
  onSuccess,
  onError,
}) => {
  const { refetch } = useGetDocuments("", "", {
    enabled: false
  })

  return useMutation({
    mutationFn: async ({ db, collection, payload }: { db: string, collection: string, payload: any }) => {
      const response = await apiClient.post<IApiResponse<any>>(
        ENDPOINTS.documents.all(db, collection),
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      refetch();
      onSuccess?.();
      toast({
        title: "Success",
        description: "Document(s) added successfully",
        variant: "success",
      });
    },
    onError: (error) => {
      onError?.(error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  })
}