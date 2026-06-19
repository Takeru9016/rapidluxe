import { useQuery } from "@tanstack/react-query";

import type { SiteContentResponse } from "@/app/api/content/site/route";

export type { SiteContentResponse };

export function useSiteContent() {
  return useQuery<SiteContentResponse>({
    queryKey: ["site-content"],
    queryFn: async () => {
      const res = await fetch("/api/content/site");
      if (!res.ok) throw new Error("Failed to fetch site content");
      return res.json() as Promise<SiteContentResponse>;
    },
    staleTime: 1000 * 60 * 60,
  });
}
