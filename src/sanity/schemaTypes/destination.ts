import { defineType, defineField, defineArrayMember } from "sanity";

// Editorial content only. Structured data (slug, country, packages, etc.)
// lives in Postgres. The two records are linked by the shared `slug`.
export const destination = defineType({
  name: "destination",
  title: "Destination (Editorial)",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      title: "Slug (must match DB slug)",
      type: "slug",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "about",
      title: "About (rich text)",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "travelTips",
      title: "Editor's Travel Tips",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({ name: "metaTitle", title: "Meta Title", type: "string" }),
        defineField({
          name: "metaDescription",
          title: "Meta Description",
          type: "text",
          rows: 2,
        }),
      ],
    }),
  ],
  preview: { select: { title: "slug.current" } },
});
