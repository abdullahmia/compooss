import { apiClient } from "@/lib/config/api.config";
import { ENDPOINTS } from "@/lib/constants";
import { TMutationOptions } from "@/lib/query.types";
import type {
  AggregationResult,
  ApiResponse,
  RunAggregationInput,
  CreateViewInput,
} from "@compooss/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useRunAggregation = (
  db: string,
  col: string,
  options: TMutationOptions<AggregationResult, RunAggregationInput & { upToIndex?: number }> = {},
) => {
  return useMutation({
    ...options,
    mutationFn: async (
      input: RunAggregationInput & { upToIndex?: number },
    ) => {
      const response = await apiClient.post<
        ApiResponse<AggregationResult>,
        RunAggregationInput & { upToIndex?: number }
      >(ENDPOINTS.aggregation.root(db, col), input);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      options.onSuccess?.(data, variables, context);
    },
  });
};

export const useCreateView = (db: string, col: string) => {
  return useMutation({
    mutationFn: async (input: CreateViewInput) => {
      const response = await apiClient.post<
        ApiResponse<{ ok: boolean; viewName: string }>,
        CreateViewInput & { action: "createView" }
      >(ENDPOINTS.aggregation.root(db, col), {
        ...input,
        action: "createView",
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(`View "${data.viewName}" created successfully.`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
