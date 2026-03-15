import { apiClient } from "@/lib/config/api.config";
import { ENDPOINTS } from "@/lib/constants";
import { QUERY_KEYS } from "@/lib/constants/query-key.contants";
import type { ApiResponse, SchemaAnalysisResult } from "@compooss/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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

export type AnalyzeSchemaPayload = { sampleSize?: number };

export const useAnalyzeSchema = (
  db: string,
  col: string,
  options?: { onSuccess?: (data: SchemaAnalysisResult) => void; onError?: (error: Error) => void },
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: AnalyzeSchemaPayload = {}) => {
      const response = await apiClient.post<
        ApiResponse<SchemaAnalysisResult>,
        AnalyzeSchemaPayload
      >(ENDPOINTS.schema.root(db, col), payload);
      return response.data;
    },
    onSuccess: (data, _variables) => {
      queryClient.setQueryData(QUERY_KEYS.schema.all(db, col), data);
      options?.onSuccess?.(data);
      toast.success("Schema analysis completed.");
    },
    onError: (error: Error) => {
      options?.onError?.(error);
      toast.error(getErrorMessage(error));
    },
  });
};
