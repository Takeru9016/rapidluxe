import { useQuery } from "@tanstack/react-query";

export interface SiteSettings {
  social_instagram?: string;
  social_facebook?: string;
  social_youtube?: string;
  social_twitter?: string;
  social_whatsapp?: string;
  [key: string]: string | undefined;
}

export function useSiteSettings() {
  return useQuery<SiteSettings>({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      return res.json() as Promise<SiteSettings>;
    },
    staleTime: 1000 * 60 * 60,
  });
}
