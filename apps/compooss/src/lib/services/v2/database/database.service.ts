import { apiClient } from "@/lib/config/api.config";
import { ENDPOINTS } from "@/lib/constants";
import { QUERY_KEYS } from "@/lib/constants/query-key.contants";
import { TCreateDatabaseInput } from "@/lib/schemas/database.schema";
import type { ApiResponse, Database } from "@compooss/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

function getErrorMessage(error: Error): string {
  const payload = (error as Error & { payload?: unknown }).payload;
  if (payload && typeof payload === "object" && "message" in payload && typeof (payload as { message: unknown }).message === "string") {
    return (payload as { message: string }).message;
  }
  return error.message;
}

export const useGetDatabases = () => {
  return useQuery({
    queryKey: QUERY_KEYS.databases.all(),
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Database[]>>(
        ENDPOINTS.databases.root,
      );
      return response.data;
    },
  });
};

export const useCreateDatabase = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
} = {}) => {
  const { refetch } = useGetDatabases();

  return useMutation({
    mutationFn: async (payload: TCreateDatabaseInput) => {
      const response = await apiClient.post<ApiResponse<Database>>(
        ENDPOINTS.databases.root,
        payload,
      );
      return response.data;
    },
    onSuccess: () => {
      refetch();
      onSuccess?.();
      toast.success("Database created successfully");
    },
    onError: (error) => {
      onError?.(error);
      toast.error(getErrorMessage(error as Error));
    },
  });
};

export const useDeleteDatabase = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
} = {}) => {
  const { refetch } = useGetDatabases();

  return useMutation({
    mutationFn: async (dbName: string) => {
      const response = await apiClient.delete<ApiResponse<null>>(
        ENDPOINTS.databases.byName(dbName),
      );
      return response.data;
    },
    onSuccess: () => {
      refetch();
      onSuccess?.();
      toast.success("Database deleted successfully");
    },
    onError: (error: Error) => {
      onError?.(error);
      toast.error(getErrorMessage(error));
    },
  });
};
