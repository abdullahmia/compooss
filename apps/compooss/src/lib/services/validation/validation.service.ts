import { apiClient } from "@/lib/config/api.config";
import { ENDPOINTS } from "@/lib/constants";
import { VALIDATION_QUERY_KEYS } from "./validation-query.key";
import { TQueryOptions, TMutationOptions } from "@/lib/query.types";
import type {
  ApiResponse,
  CollectionValidation,
  ValidationCheckResult,
  ValidationLevel,
  ValidationAction,
} from "@compooss/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetValidation = (
  db: string,
  col: string,
  options?: TQueryOptions<CollectionValidation>,
) => {
  return useQuery<CollectionValidation, Error, CollectionValidation, readonly unknown[]>({
    queryKey: VALIDATION_QUERY_KEYS.all(db, col),
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<CollectionValidation>>(
        ENDPOINTS.validation.root(db, col),
      );
      return response.data;
    },
    enabled: !!db && !!col,
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
  options: TMutationOptions<{ ok: boolean }, UpdateValidationPayload> = {},
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: async (payload: UpdateValidationPayload) => {
      const response = await apiClient.put<
        ApiResponse<{ ok: boolean }>,
        UpdateValidationPayload
      >(ENDPOINTS.validation.root(db, col), { body: payload });
      return response.data;
    },
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({
        queryKey: VALIDATION_QUERY_KEYS.all(db, col),
      });
      options.onSuccess?.(data, variables, context, mutation);
    },
  });
};

export type CheckValidationPayload = {
  sampleSize?: number;
};

export const useCheckValidation = (
  db: string,
  col: string,
  options: TMutationOptions<ValidationCheckResult, CheckValidationPayload | undefined> = {},
) => {
  return useMutation({
    ...options,
    mutationFn: async (payload: CheckValidationPayload | undefined = {}) => {
      const response = await apiClient.post<
        ApiResponse<ValidationCheckResult>,
        CheckValidationPayload
      >(ENDPOINTS.validation.root(db, col), payload);
      return response.data;
    },
    onSuccess: (data, variables, context, mutation) => {
      options.onSuccess?.(data, variables, context, mutation);
    },
  });
};
