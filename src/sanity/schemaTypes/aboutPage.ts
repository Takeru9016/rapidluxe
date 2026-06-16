import { defineField, defineType } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({ name: "headline", title: "Headline", type: "string" }),
    defineField({ name: "subheadline", title: "Subheadline", type: "string" }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "story",
      title: "Company Story",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "mission",
      title: "Mission Statement",
      type: "object",
      fields: [
        defineField({ name: "title", type: "string", title: "Title" }),
        defineField({
          name: "body",
          type: "array",
          title: "Body",
          of: [{ type: "block" }],
        }),
      ],
    }),
    defineField({
      name: "team",
      title: "Team Members",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", type: "string", title: "Name" }),
            defineField({ name: "role", type: "string", title: "Role" }),
            defineField({ name: "bio", type: "text", title: "Bio", rows: 3 }),
            defineField({
              name: "image",
              type: "image",
              title: "Photo",
              options: { hotspot: true },
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "role", media: "image" },
          },
        },
      ],
    }),
    defineField({
      name: "stats",
      title: "Stats",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "number", type: "string", title: "Number" }),
            defineField({ name: "label", type: "string", title: "Label" }),
          ],
          preview: { select: { title: "number", subtitle: "label" } },
        },
      ],
    }),
  ],
  preview: { select: { title: "headline" } },
});
