import { useQuery } from "@tanstack/react-query";

import type { DestinationEditorial } from "@/types/blog";

export function useDestinationEditorial(slug: string) {
  return useQuery<{ data: DestinationEditorial | null }>({
    queryKey: ["destination-editorial", slug],
    queryFn: async () => {
      const res = await fetch(`/api/destinations/${slug}/editorial`);
      if (!res.ok) throw new Error("Failed to fetch editorial content");
      return res.json() as Promise<{ data: DestinationEditorial | null }>;
    },
    enabled: !!slug,
  });
}
