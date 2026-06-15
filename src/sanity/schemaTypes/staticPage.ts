import { defineField, defineType } from "sanity";

export const staticPage = defineType({
  name: "staticPage",
  title: "Static Page",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      type: "slug",
      title: "Page slug",
      options: { source: "title" },
      validation: (R) => R.required(),
    }),
    defineField({ name: "title", type: "string", title: "Page Title" }),
    defineField({
      name: "subtitle",
      type: "string",
      title: "Subtitle (optional)",
    }),
    defineField({
      name: "body",
      type: "array",
      title: "Content",
      of: [{ type: "block" }, { type: "image" }],
    }),
    defineField({
      name: "seo",
      type: "object",
      title: "SEO",
      fields: [
        defineField({ name: "metaTitle", type: "string", title: "Meta Title" }),
        defineField({
          name: "metaDescription",
          type: "text",
          title: "Meta Description",
          rows: 2,
        }),
      ],
    }),
    defineField({
      name: "lastUpdated",
      type: "datetime",
      title: "Last Updated",
    }),
  ],
});
