import { apiClient } from "@/lib/config/api.config";
import { ENDPOINTS } from "@/lib/constants";
import { TCreateCollectionInput } from "@/lib/schemas";
import { TMutationOptions, TQueryOptions } from "@/lib/query.types";
import type { ApiResponse, Collection } from "@compooss/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { COLLECTION_QUERY_KEYS } from "./collection-query.key";

export const useGetCollections = (
  db: string,
  options?: TQueryOptions<Collection[]>,
) =>
  useQuery({
    queryKey: COLLECTION_QUERY_KEYS.list(db),
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Collection[]>>(
        ENDPOINTS.collections.root(db),
      );
      return response.data ?? [];
    },
    enabled: !!db,
    ...options,
  });

export const useCreateCollection = (
  dbName: string,
  options: TMutationOptions<ApiResponse<Collection>, string> = {},
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: async (collectionName: string) =>
      apiClient.post<ApiResponse<Collection>>(
        ENDPOINTS.collections.root(dbName),
        { collectionName },
      ),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: COLLECTION_QUERY_KEYS.list(dbName),
      });
      options.onSuccess?.(data, variables, context);
    },
  });
};

export const useDeleteCollection = (
  dbName: string,
  options: TMutationOptions<ApiResponse<null>, string> = {},
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: async (collectionName: string) =>
      apiClient.delete<ApiResponse<null>>(
        ENDPOINTS.collections.byName(dbName, collectionName),
      ),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: COLLECTION_QUERY_KEYS.list(dbName),
      });
      options.onSuccess?.(data, variables, context);
    },
  });
};
