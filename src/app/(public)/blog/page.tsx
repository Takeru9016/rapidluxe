import type { Metadata } from "next";

import { sanityReadClient } from "@/lib/sanity";
import { ALL_POSTS_QUERY } from "@/lib/queries/blog";
import { toBlogCard } from "@/lib/blog";
import type { PostListItem } from "@/types/blog";

import { BlogList } from "./BlogList";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Travel Journal",
  description:
    "Expert travel guides, destination inspiration, and insider tips from the RapidLuxe team. Curated for the discerning Indian traveller.",
  openGraph: {
    title: "Travel Journal | RapidLuxe",
    description:
      "Expert travel guides, destination inspiration, and insider tips from the RapidLuxe team. Curated for the discerning Indian traveller.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&auto=format&fit=crop&q=80",
        width: 1200,
        height: 800,
        alt: "RapidLuxe Travel Journal",
      },
    ],
  },
};

export default async function BlogPage() {
  const posts = await sanityReadClient.fetch<PostListItem[]>(ALL_POSTS_QUERY);
  const cards = (posts ?? []).map(toBlogCard);

  return <BlogList posts={cards} />;
}
