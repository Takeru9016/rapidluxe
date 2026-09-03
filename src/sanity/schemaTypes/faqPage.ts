import { defineField, defineType } from "sanity";

export const faqPage = defineType({
  name: "faqPage",
  title: "FAQ Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Page Title (optional)",
      description: 'Defaults to "Frequently Asked Questions" if left blank.',
    }),
    defineField({
      name: "subtitle",
      type: "string",
      title: "Subtitle (optional)",
    }),
    defineField({
      name: "categories",
      title: "Categories",
      description:
        "Per 13-FAQ.md, expected categories: Booking Process, Quotes & Payments, Journeys, Changes & Cancellations, Documents, Support. Order here controls display order.",
      type: "array",
      of: [
        {
          type: "object",
          name: "faqCategory",
          fields: [
            defineField({
              name: "title",
              type: "string",
              title: "Category Title",
              validation: (R) => R.required(),
            }),
            defineField({
              name: "items",
              title: "Questions",
              type: "array",
              of: [
                {
                  type: "object",
                  name: "faqItem",
                  fields: [
                    defineField({
                      name: "question",
                      type: "string",
                      title: "Question",
                      validation: (R) => R.required(),
                    }),
                    defineField({
                      name: "answer",
                      type: "text",
                      title: "Answer",
                      rows: 4,
                      validation: (R) => R.required(),
                    }),
                  ],
                  preview: {
                    select: { title: "question" },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: { title: "title", items: "items" },
            prepare({ title, items }) {
              return {
                title,
                subtitle: `${(items as unknown[] | undefined)?.length ?? 0} question(s)`,
              };
            },
          },
        },
      ],
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
  ],
  preview: {
    prepare() {
      return { title: "FAQ Page" };
    },
  },
});
