import type { PostListItem, BlogCardData } from "@/types/blog";

// Fallbacks for posts authored without an image yet. images.unsplash.com is
// already whitelisted in next.config for the dummy data.
export const BLOG_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=800&auto=format&fit=crop&q=80";
export const BLOG_FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&auto=format&fit=crop&q=80";

export function toBlogCard(p: PostListItem): BlogCardData {
  return {
    id: p._id,
    title: p.title,
    slug: p.slug.current,
    category: p.category?.title ?? "Travel",
    excerpt: p.excerpt ?? "",
    author: p.author?.name ?? "RapidLuxe",
    authorAvatarUrl: p.author?.image?.asset?.url ?? BLOG_FALLBACK_AVATAR,
    imageUrl: p.mainImage?.asset?.url ?? BLOG_FALLBACK_IMAGE,
    readTime: p.readTime ?? 5,
    publishedAt: p.publishedAt ?? new Date().toISOString(),
  };
}
