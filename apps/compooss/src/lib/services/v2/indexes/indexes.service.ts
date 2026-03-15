import { apiClient } from "@/lib/config/api.config";
import { ENDPOINTS } from "@/lib/constants";
import { QUERY_KEYS } from "@/lib/constants/query-key.contants";
import { TQueryOptions } from "@/lib/query.types";
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

function getErrorMessage(error: Error): string {
  const payload = (error as Error & { payload?: unknown }).payload;
  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    typeof (payload as { message: unknown }).message === "string"
  ) {
    return (payload as { message: string }).message;
  }
  return error.message;
}

export const useGetIndexes = (
  db: string,
  col: string,
  options?: TQueryOptions<IndexWithStats[]>,
) => {
  return useQuery<IndexWithStats[], Error, IndexWithStats[], readonly unknown[]>(
    {
      queryKey: QUERY_KEYS.indexes.all(db, col),
      queryFn: async () => {
        const response = await apiClient.get<
          ApiResponse<IndexWithStats[]>
        >(ENDPOINTS.indexes.root(db, col));
        return response.data;
      },
      ...options,
    },
  );
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
  options?: { onSuccess?: () => void; onError?: (error: Error) => void },
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateIndexPayload) => {
      const response = await apiClient.post<
        ApiResponse<{ name: string }>,
        CreateIndexPayload
      >(ENDPOINTS.indexes.root(db, col), payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.indexes.all(db, col) });
      options?.onSuccess?.();
      toast.success("Index created successfully.");
    },
    onError: (error: Error) => {
      options?.onError?.(error);
      toast.error(getErrorMessage(error));
    },
  });
};

export const useDropIndex = (
  db: string,
  col: string,
  options?: { onSuccess?: () => void; onError?: (error: Error) => void },
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (indexName: string) => {
      const response = await apiClient.delete<ApiResponse<{ ok: boolean }>>(
        ENDPOINTS.indexes.byName(db, col, indexName),
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.indexes.all(db, col) });
      options?.onSuccess?.();
      toast.success("Index dropped successfully.");
    },
    onError: (error: Error) => {
      options?.onError?.(error);
      toast.error(getErrorMessage(error));
    },
  });
};

export const useHideIndex = (
  db: string,
  col: string,
  options?: { onSuccess?: () => void; onError?: (error: Error) => void },
) => {
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
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.indexes.all(db, col) });
      options?.onSuccess?.();
      toast.success("Index visibility updated.");
    },
    onError: (error: Error) => {
      options?.onError?.(error);
      toast.error(getErrorMessage(error));
    },
  });
};
