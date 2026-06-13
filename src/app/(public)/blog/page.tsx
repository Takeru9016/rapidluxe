import { sanityReadClient } from "@/lib/sanity";
import { ALL_POSTS_QUERY } from "@/lib/queries/blog";
import { toBlogCard } from "@/lib/blog";
import type { PostListItem } from "@/types/blog";

import { BlogList } from "./BlogList";

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await sanityReadClient.fetch<PostListItem[]>(ALL_POSTS_QUERY);
  const cards = (posts ?? []).map(toBlogCard);

  return <BlogList posts={cards} />;
}
