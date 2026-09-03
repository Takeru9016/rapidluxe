// GROQ queries for Sanity-managed blog + destination editorial content.

export const ALL_POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  readTime,
  publishedAt,
  mainImage { asset-> { url } },
  author-> { name, image { asset-> { url } } },
  category-> { title, slug }
}`;

export const POST_BY_SLUG_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  excerpt,
  readTime,
  publishedAt,
  mainImage { asset-> { url } },
  author-> { name, role, bio, image { asset-> { url } } },
  category-> { title },
  body,
  tags,
  seo
}`;

// Other posts, excluding the one currently being viewed — for "Related Articles".
export const RELATED_POSTS_QUERY = `*[_type == "post" && slug.current != $slug] | order(publishedAt desc) [0...3] {
  _id,
  title,
  slug,
  excerpt,
  readTime,
  publishedAt,
  mainImage { asset-> { url } },
  author-> { name, image { asset-> { url } } },
  category-> { title, slug }
}`;

// Slugs only — used by sitemap.ts to list individual article URLs.
export const ALL_POST_SLUGS_QUERY = `*[_type == "post" && defined(slug.current)] {
  "slug": slug.current,
  publishedAt
}`;

export const DESTINATION_EDITORIAL_QUERY = `*[_type == "destination" && slug.current == $slug][0] {
  about,
  travelTips,
  featuredImage { asset-> { url } },
  seo
}`;
