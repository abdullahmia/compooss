import { apiClient } from "@/lib/config/api.config";
import { ENDPOINTS } from "@/lib/constants";
import type {
  AggregationResult,
  ApiResponse,
  RunAggregationInput,
  CreateViewInput,
} from "@compooss/types";
import { useMutation } from "@tanstack/react-query";
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

export const useRunAggregation = (
  db: string,
  col: string,
  options?: {
    onSuccess?: (data: AggregationResult) => void;
    onError?: (error: Error) => void;
  },
) => {
  return useMutation({
    mutationFn: async (
      input: RunAggregationInput & { upToIndex?: number },
    ) => {
      const response = await apiClient.post<
        ApiResponse<AggregationResult>,
        RunAggregationInput & { upToIndex?: number }
      >(ENDPOINTS.aggregation.root(db, col), input);
      return response.data;
    },
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (error: Error) => {
      options?.onError?.(error);
      toast.error(getErrorMessage(error));
    },
  });
};

export const useCreateView = (
  db: string,
  col: string,
  options?: {
    onSuccess?: (data: { ok: boolean; viewName: string }) => void;
    onError?: (error: Error) => void;
  },
) => {
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
      options?.onSuccess?.(data);
      toast.success(`View "${data.viewName}" created successfully.`);
    },
    onError: (error: Error) => {
      options?.onError?.(error);
      toast.error(getErrorMessage(error));
    },
  });
};
