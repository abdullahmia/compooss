import { UseQueryOptions } from "@tanstack/react-query";

export interface IApiResponse<TData = unknown> {
  status: number;
  message: string;
  data: TData;
}

export type TQueryOptions<TData> = Omit<
  UseQueryOptions<TData, Error, TData, readonly unknown[]>,
  "queryKey" | "queryFn"
>;