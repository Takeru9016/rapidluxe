import { defineField, defineType } from "sanity";

export const siteContent = defineType({
  name: "siteContent",
  title: "Site Content",
  type: "document",
  fields: [
    defineField({
      name: "howItWorksSteps",
      title: "How It Works Steps",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "stepNumber",
              type: "string",
              title: "Step Number",
            }),
            defineField({ name: "title", type: "string", title: "Title" }),
            defineField({
              name: "description",
              type: "text",
              title: "Description",
              rows: 3,
            }),
          ],
          preview: { select: { title: "title", subtitle: "stepNumber" } },
        },
      ],
    }),
    defineField({
      name: "whyRapidluxePoints",
      title: "Why RapidLuxe Points",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", type: "string", title: "Title" }),
            defineField({
              name: "description",
              type: "text",
              title: "Description",
              rows: 3,
            }),
            defineField({
              name: "icon",
              type: "string",
              title: "Icon",
              description:
                'Lucide icon name e.g. "Sparkles", "Heart", "Globe", "Shield"',
            }),
          ],
          preview: { select: { title: "title" } },
        },
      ],
    }),
    defineField({
      name: "trustBarStats",
      title: "Trust Bar Stats",
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
  preview: { prepare: () => ({ title: "Site Content" }) },
});
