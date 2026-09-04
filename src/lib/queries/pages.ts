// The only staticPage slugs the Admin Content UI is allowed to create.
// Matches the legal-page routes at src/app/(public)/{terms,privacy,cancellation-policy}
// — creating a document for any other slug through the admin UI would just
// be an orphaned document with no public route to render it.
export const CANONICAL_STATIC_PAGE_SLUGS = [
  "terms",
  "privacy",
  "cancellation-policy",
] as const;

export type CanonicalStaticPageSlug =
  (typeof CANONICAL_STATIC_PAGE_SLUGS)[number];

export function isCanonicalStaticPageSlug(
  slug: string,
): slug is CanonicalStaticPageSlug {
  return (CANONICAL_STATIC_PAGE_SLUGS as readonly string[]).includes(slug);
}

export const STATIC_PAGE_QUERY = `
  *[_type == "staticPage" && slug.current == $slug][0] {
    title,
    subtitle,
    body,
    seo,
    lastUpdated
  }
`;
