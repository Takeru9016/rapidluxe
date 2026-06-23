import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonials",
  type: "document",
  fields: [
    defineField({ name: "clientName", title: "Client Name", type: "string" }),
    defineField({ name: "clientTitle", title: "Client Title", type: "string" }),
    defineField({ name: "quote", title: "Quote", type: "text", rows: 4 }),
    defineField({ name: "destination", title: "Destination", type: "string" }),
    defineField({
      name: "rating",
      title: "Rating (1–5)",
      type: "number",
      validation: (Rule) => Rule.min(1).max(5).integer(),
    }),
    defineField({ name: "tripDate", title: "Trip Date", type: "string" }),
    defineField({
      name: "image",
      title: "Client Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "imageUrl",
      title: "Client Photo URL",
      type: "string",
      description: "Cloudinary URL — used by the admin upload widget",
    }),
    defineField({
      name: "isFeatured",
      title: "Featured on Homepage",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "clientName", subtitle: "destination" },
  },
});
