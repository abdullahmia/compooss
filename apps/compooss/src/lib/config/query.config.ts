import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes
      gcTime: 5 * 60 * 1000,
      // Data is considered fresh for 30 seconds
      staleTime: 30 * 1000,
      // Avoid refetching on every window focus to keep UI calm
      refetchOnWindowFocus: false,
      // Only refetch on reconnect if data is stale
      refetchOnReconnect: "always",
      // Retry a couple of times on transient errors
      retry: 2,
      // Use suspense-friendly behavior if needed later
      refetchOnMount: "always",
    },
    mutations: {
      // Mutations can be retried once on transient failures
      retry: 1,
    },
  },
});

