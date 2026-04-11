import type { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";

/** Query options for TanStack Query hooks (omit queryKey and queryFn). */
export type TQueryOptions<TData> = Omit<
  UseQueryOptions<TData, Error, TData, readonly unknown[]>,
  "queryKey" | "queryFn"
>;

/** Mutation options for TanStack Query hooks (omit mutationFn). */
export type TMutationOptions<TData, TVariables = unknown> = Omit<
  UseMutationOptions<TData, Error, TVariables>,
  "mutationFn"
>;
