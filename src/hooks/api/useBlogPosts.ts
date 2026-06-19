import { useQuery } from "@tanstack/react-query";

export interface BlogPostPreview {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  readTime: number;
  publishedAt: string | null;
  mainImageUrl: string | null;
  author: string | null;
  authorAvatarUrl: string | null;
  category: string | null;
}

export function useBlogPosts(limit = 3) {
  return useQuery<{ data: BlogPostPreview[] }>({
    queryKey: ["blog-posts", limit],
    queryFn: async () => {
      const res = await fetch(`/api/blog/posts?limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch blog posts");
      return res.json() as Promise<{ data: BlogPostPreview[] }>;
    },
    staleTime: 1000 * 60 * 5,
  });
}
