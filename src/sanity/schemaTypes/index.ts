import { type SchemaTypeDefinition } from "sanity";

import { aboutPage } from "./aboutPage";
import { author } from "./author";
import { category } from "./category";
import { destination } from "./destination";
import { faqPage } from "./faqPage";
import { post } from "./post";
import { siteContent } from "./siteContent";
import { staticPage } from "./staticPage";
import { testimonial } from "./testimonial";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    post,
    author,
    category,
    destination,
    staticPage,
    aboutPage,
    faqPage,
    siteContent,
    testimonial,
  ],
};
