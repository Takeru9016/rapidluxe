export const STATIC_PAGE_QUERY = `
  *[_type == "staticPage" && slug.current == $slug][0] {
    title,
    subtitle,
    body,
    seo,
    lastUpdated
  }
`;
