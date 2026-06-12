"use client";

import { QueryClient } from "@tanstack/react-query";

let queryClientInstance: QueryClient | undefined;

export function getQueryClient() {
  if (typeof window === "undefined") {
    return new QueryClient({
      defaultOptions: { queries: { staleTime: 60 * 1000 } },
    });
  }
  if (!queryClientInstance) {
    queryClientInstance = new QueryClient({
      defaultOptions: { queries: { staleTime: 60 * 1000, retry: 1 } },
    });
  }
  return queryClientInstance;
}
