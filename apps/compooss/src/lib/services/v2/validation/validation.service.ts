import { apiClient } from "@/lib/config/api.config";
import { ENDPOINTS } from "@/lib/constants";
import { QUERY_KEYS } from "@/lib/constants/query-key.contants";
import { TQueryOptions } from "@/lib/query.types";
import type {
  ApiResponse,
  CollectionValidation,
  ValidationCheckResult,
  ValidationLevel,
  ValidationAction,
} from "@compooss/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export const useGetValidation = (
  db: string,
  col: string,
  options?: TQueryOptions<CollectionValidation>,
) => {
  return useQuery<CollectionValidation, Error, CollectionValidation, readonly unknown[]>({
    queryKey: QUERY_KEYS.validation.all(db, col),
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<CollectionValidation>>(
        ENDPOINTS.validation.root(db, col),
      );
      return response.data;
    },
    ...options,
  });
};

export type UpdateValidationPayload = {
  validator: Record<string, unknown>;
  validationLevel: ValidationLevel;
  validationAction: ValidationAction;
};

export const useUpdateValidation = (
  db: string,
  col: string,
  options?: { onSuccess?: () => void; onError?: (error: Error) => void },
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateValidationPayload) => {
      const response = await apiClient.put<
        ApiResponse<{ ok: boolean }>,
        UpdateValidationPayload
      >(ENDPOINTS.validation.root(db, col), { body: payload });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.validation.all(db, col),
      });
      options?.onSuccess?.();
      toast.success("Validation rules updated.");
    },
    onError: (error: Error) => {
      options?.onError?.(error);
      toast.error(getErrorMessage(error));
    },
  });
};

export type CheckValidationPayload = {
  sampleSize?: number;
};

export const useCheckValidation = (
  db: string,
  col: string,
  options?: {
    onSuccess?: (data: ValidationCheckResult) => void;
    onError?: (error: Error) => void;
  },
) => {
  return useMutation({
    mutationFn: async (payload: CheckValidationPayload = {}) => {
      const response = await apiClient.post<
        ApiResponse<ValidationCheckResult>,
        CheckValidationPayload
      >(ENDPOINTS.validation.root(db, col), payload);
      return response.data;
    },
    onSuccess: (data) => {
      options?.onSuccess?.(data);
      toast.success("Validation check completed.");
    },
    onError: (error: Error) => {
      options?.onError?.(error);
      toast.error(getErrorMessage(error));
    },
  });
};
