import { toast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/config/api.config"
import { ENDPOINTS } from "@/lib/constants"
import { QUERY_KEYS } from "@/lib/constants/query-key.contants"
import { TCreateDatabaseInput } from "@/lib/schemas/database.schema"
import { IApiResponse, TDatabase } from "@/lib/types"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useGetDatabases = () => {
  return useQuery({
    queryKey: QUERY_KEYS.databases.all(),
    queryFn: async () => {
      const response = await apiClient.get<IApiResponse<TDatabase[]>>(ENDPOINTS.databases.root);
      return response.data;
    }
  })
}

export const useCreateDatabase = ({
  onSuccess,
  onError,
}) => {
  const { refetch } = useGetDatabases();

  return useMutation({
    mutationFn: async (payload: TCreateDatabaseInput) => {
      const response = await apiClient.post<IApiResponse<TDatabase>>(ENDPOINTS.databases.root, payload);
      return response.data;
    },
    onSuccess: () => {
      refetch();
      onSuccess?.();
      toast({
        title: "Success",
        description: "Database created successfully",
        variant: "success",
      });
    },
    onError: (error) => {
      onError?.(error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  })
}