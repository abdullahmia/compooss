import { IApiResponse } from "../types";

export function createApiResponse<TData>(
  data: TData,
  message: string,
  status: number,
): IApiResponse<TData> {
  return {
    status,
    message,
    data,
  };
}




