import type { PortableTextBlock } from "@portabletext/react";

// ── Sanity raw shapes (as returned by the GROQ projections in lib/queries/blog) ──

export interface SanityImageAsset {
  asset: { url: string | null } | null;
}

export interface SanitySlug {
  current: string;
}

export interface PostAuthor {
  name: string;
  role: string | null;
  bio: string | null;
  image: SanityImageAsset | null;
}

export interface PostCategory {
  title: string;
  slug: SanitySlug | null;
}

export interface PostListItem {
  _id: string;
  title: string;
  slug: SanitySlug;
  excerpt: string | null;
  readTime: number | null;
  publishedAt: string | null;
  mainImage: SanityImageAsset | null;
  author: Pick<PostAuthor, "name" | "image"> | null;
  category: PostCategory | null;
}

export interface PostDetail {
  _id: string;
  title: string;
  slug: SanitySlug;
  excerpt: string | null;
  readTime: number | null;
  publishedAt: string | null;
  mainImage: SanityImageAsset | null;
  author: PostAuthor | null;
  category: Pick<PostCategory, "title"> | null;
  body: PortableTextBlock[] | null;
  tags: string[] | null;
  seo: SeoFields | null;
}

export interface SeoFields {
  metaTitle: string | null;
  metaDescription: string | null;
}

export interface DestinationEditorial {
  about: PortableTextBlock[] | null;
  travelTips: PortableTextBlock[] | null;
  featuredImage: SanityImageAsset | null;
  seo: SeoFields | null;
}

// ── Flat view-model used by the public blog list / card UI ──

export interface BlogCardData {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  author: string;
  authorAvatarUrl: string;
  imageUrl: string;
  readTime: number;
  publishedAt: string;
}

// ── Admin blog API payload (matches the Sanity post schema) ──

export interface AdminPostPayload {
  title: string;
  slug: string;
  authorId?: string;
  categoryId?: string;
  excerpt?: string;
  readTime?: number;
  publishedAt?: string;
  tags?: string[];
  body?: PortableTextBlock[];
  mainImageUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
}
