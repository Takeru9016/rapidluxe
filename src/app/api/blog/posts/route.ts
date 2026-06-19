import { type NextRequest, NextResponse } from "next/server";

import { sanityReadClient } from "@/lib/sanity";
import { ALL_POSTS_QUERY } from "@/lib/queries/blog";

export const revalidate = 300;

interface SanityPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string | null;
  readTime: number | null;
  publishedAt: string | null;
  mainImage: { asset: { url: string } } | null;
  author: { name: string; image: { asset: { url: string } } | null } | null;
  category: { title: string; slug: { current: string } } | null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "3", 10), 12);

  const posts = await sanityReadClient.fetch<SanityPost[]>(ALL_POSTS_QUERY);

  const sliced = posts.slice(0, limit).map((p) => ({
    id: p._id,
    title: p.title,
    slug: p.slug?.current ?? "",
    excerpt: p.excerpt ?? "",
    readTime: p.readTime ?? 3,
    publishedAt: p.publishedAt ?? null,
    mainImageUrl: p.mainImage?.asset?.url ?? null,
    author: p.author?.name ?? null,
    authorAvatarUrl: p.author?.image?.asset?.url ?? null,
    category: p.category?.title ?? null,
  }));

  return NextResponse.json({ data: sliced });
}
