export const FAQ_PAGE_QUERY = `
  *[_type == "faqPage"][0] {
    title,
    subtitle,
    seo,
    categories[] {
      title,
      items[] {
        question,
        answer
      }
    }
  }
`;
