import type { ApiResponse } from "@compooss/types";

export function createApiResponse<TData>(
  data: TData,
  message: string,
  status: number,
): ApiResponse<TData> {
  return {
    status,
    message,
    data,
  };
}




