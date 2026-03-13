import { apiClient } from "@/lib/config/api.config";
import { ENDPOINTS } from "@/lib/constants";
import { QUERY_KEYS } from "@/lib/constants/query-key.contants";
import { IApiResponse, TQueryOptions } from "@/lib/types";
import { TCollection } from "@/lib/types/collections.types";
import { useQuery } from "@tanstack/react-query";

export const useGetCollections = (
  db: string,
  options?: TQueryOptions<TCollection[]>,
) => {
  return useQuery<TCollection[], Error, TCollection[], readonly unknown[]>({
    queryKey: QUERY_KEYS.collections.all(db),
    queryFn: async () => {
      const response = await apiClient.get<IApiResponse<TCollection[]>>(ENDPOINTS.collections.root(db));
      return response.data;
    },
    ...options,
  })
}