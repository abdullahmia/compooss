import { apiClient } from "@/lib/config/api.config";
import { ENDPOINTS } from "@/lib/constants";
import { SCHEMA_QUERY_KEYS } from "./schema-query.key";
import { TMutationOptions } from "@/lib/query.types";
import type { ApiResponse, SchemaAnalysisResult } from "@compooss/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type AnalyzeSchemaPayload = { sampleSize?: number };

export const useAnalyzeSchema = (
  db: string,
  col: string,
  options: TMutationOptions<SchemaAnalysisResult, AnalyzeSchemaPayload> = {},
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: async (payload: AnalyzeSchemaPayload = {}) => {
      const response = await apiClient.post<
        ApiResponse<SchemaAnalysisResult>,
        AnalyzeSchemaPayload
      >(ENDPOINTS.schema.root(db, col), payload);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(SCHEMA_QUERY_KEYS.all(db, col), data);
      options.onSuccess?.(data, variables, context);
    },
  });
};
