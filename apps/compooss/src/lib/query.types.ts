import type { UseQueryOptions } from "@tanstack/react-query";

/** Query options for TanStack Query hooks (omit queryKey and queryFn). */
export type TQueryOptions<TData> = Omit<
  UseQueryOptions<TData, Error, TData, readonly unknown[]>,
  "queryKey" | "queryFn"
>;
