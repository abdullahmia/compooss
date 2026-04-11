import { apiClient } from "@/lib/config/api.config";
import { ENDPOINTS } from "@/lib/constants";
import { INDEXES_QUERY_KEYS } from "./indexes-query.key";
import { TQueryOptions, TMutationOptions } from "@/lib/query.types";
import type {
  ApiResponse,
  IndexDefinition,
  IndexField,
} from "@compooss/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export type IndexWithStats = IndexDefinition & {
  usage?: { ops: number; since: string };
};

export const useGetIndexes = (
  db: string,
  col: string,
  options?: TQueryOptions<IndexWithStats[]>,
) => {
  return useQuery<IndexWithStats[], Error, IndexWithStats[], readonly unknown[]>({
    queryKey: INDEXES_QUERY_KEYS.all(db, col),
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<IndexWithStats[]>>(
        ENDPOINTS.indexes.root(db, col),
      );
      return response.data ?? [];
    },
    enabled: !!db && !!col,
    ...options,
  });
};

export type CreateIndexPayload = {
  fields: IndexField[];
  name?: string;
  unique?: boolean;
  sparse?: boolean;
  hidden?: boolean;
  expireAfterSeconds?: number;
  partialFilterExpression?: Record<string, unknown>;
};

export const useCreateIndex = (
  db: string,
  col: string,
  options: TMutationOptions<{ name: string }, CreateIndexPayload> = {},
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: async (payload: CreateIndexPayload) => {
      const response = await apiClient.post<
        ApiResponse<{ name: string }>,
        CreateIndexPayload
      >(ENDPOINTS.indexes.root(db, col), payload);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: INDEXES_QUERY_KEYS.all(db, col) });
      options.onSuccess?.(data, variables, context);
    },
  });
};

export const useDropIndex = (
  db: string,
  col: string,
  options: TMutationOptions<{ ok: boolean }, string> = {},
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: async (indexName: string) => {
      const response = await apiClient.delete<ApiResponse<{ ok: boolean }>>(
        ENDPOINTS.indexes.byName(db, col, indexName),
      );
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: INDEXES_QUERY_KEYS.all(db, col) });
      options.onSuccess?.(data, variables, context);
    },
  });
};

export const useHideIndex = (db: string, col: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      indexName,
      hidden,
    }: { indexName: string; hidden: boolean }) => {
      const response = await apiClient.patch<
        ApiResponse<{ ok: boolean; hidden: boolean }>,
        { hidden: boolean }
      >(ENDPOINTS.indexes.byName(db, col, indexName), { body: { hidden } });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INDEXES_QUERY_KEYS.all(db, col) });
      toast.success("Index visibility updated.");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
