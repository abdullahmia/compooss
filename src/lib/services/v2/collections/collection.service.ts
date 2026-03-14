import { apiClient } from "@/lib/config/api.config";
import { ENDPOINTS } from "@/lib/constants";
import { QUERY_KEYS } from "@/lib/constants/query-key.contants";
import { IApiResponse, TQueryOptions } from "@/lib/types";
import { TCollection } from "@/lib/types/collections.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function getErrorMessage(error: Error): string {
  const payload = (error as Error & { payload?: unknown }).payload;
  if (payload && typeof payload === "object" && "message" in payload && typeof (payload as { message: unknown }).message === "string") {
    return (payload as { message: string }).message;
  }
  return error.message;
}

export const useGetCollections = (
  db: string,
  options?: TQueryOptions<TCollection[]>,
) => {
  return useQuery<TCollection[], Error, TCollection[], readonly unknown[]>({
    queryKey: QUERY_KEYS.collections.all(db),
    queryFn: async () => {
      const response = await apiClient.get<IApiResponse<TCollection[]>>(ENDPOINTS.collections.root(db));
      return response.data;
    },
    ...options,
  });
};

export const useDeleteCollection = (dbName: string, options?: { onSuccess?: () => void; onError?: (error: Error) => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (collectionName: string) => {
      const response = await apiClient.delete<IApiResponse<null>>(
        ENDPOINTS.collections.byName(dbName, collectionName),
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.collections.all(dbName) });
      options?.onSuccess?.();
      toast.success("Collection deleted successfully.");
    },
    onError: (error: Error) => {
      options?.onError?.(error);
      toast.error(getErrorMessage(error));
    },
  });
};