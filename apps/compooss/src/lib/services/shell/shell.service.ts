import { apiClient } from "@/lib/config/api.config";
import { ENDPOINTS } from "@/lib/constants";
import type { ApiResponse, ShellRequest, ShellResponse } from "@compooss/types";
import { useMutation } from "@tanstack/react-query";

export const useExecuteCommand = (options?: {
  onSuccess?: (data: ShellResponse) => void;
  onError?: (error: Error) => void;
}) => {
  return useMutation({
    mutationFn: async (input: ShellRequest) => {
      const response = await apiClient.post<
        ApiResponse<ShellResponse>,
        ShellRequest
      >(ENDPOINTS.shell.eval, input);
      return response.data;
    },
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
};
