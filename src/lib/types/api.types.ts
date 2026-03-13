import { UseQueryOptions } from "@tanstack/react-query";
import { TCollection } from "./collections.types";

export interface IApiResponse<TData = unknown> {
  status: number;
  message: string;
  data: TData;
}

export type TQueryOptions = Omit<
  UseQueryOptions<TCollection[], Error, TCollection[], readonly unknown[]>,
  "queryKey" | "queryFn"
>;