import { apiClient } from "@/lib/config/api.config";
import { ENDPOINTS } from "@/lib/constants";
import { TCreateDatabaseFormData } from "@/lib/schemas";
import { TMutationOptions } from "@/lib/query.types";
import type { ApiResponse, Database } from "@compooss/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DATABASE_QUERY_KEYS } from "./database-query.key";

export const useGetDatabases = () =>
  useQuery({
    queryKey: DATABASE_QUERY_KEYS.all(),
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Database[]>>(
        ENDPOINTS.databases.root,
      );
      return res.data ?? [];
    },
    retry: 1,
    retryDelay: 2000,
  });

export const useCreateDatabase = (
  options: TMutationOptions<ApiResponse<Database>, TCreateDatabaseFormData> = {},
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: async (payload: TCreateDatabaseFormData) =>
      apiClient.post<ApiResponse<Database>>(ENDPOINTS.databases.root, payload),
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: DATABASE_QUERY_KEYS.all() });
      options.onSuccess?.(data, variables, context, mutation);
    },
  });
};

export const useDeleteDatabase = (
  options: TMutationOptions<ApiResponse<null>, string> = {},
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: async (dbName: string) =>
      apiClient.delete<ApiResponse<null>>(ENDPOINTS.databases.byName(dbName)),
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({ queryKey: DATABASE_QUERY_KEYS.all() });
      options.onSuccess?.(data, variables, context, mutation);
    },
  });
};
