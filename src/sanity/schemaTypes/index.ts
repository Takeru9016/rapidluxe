import { type SchemaTypeDefinition } from "sanity";

import { post } from "./post";
import { author } from "./author";
import { category } from "./category";
import { destination } from "./destination";
import { staticPage } from "./staticPage";
import { aboutPage } from "./aboutPage";
import { siteContent } from "./siteContent";
import { testimonial } from "./testimonial";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    post,
    author,
    category,
    destination,
    staticPage,
    aboutPage,
    siteContent,
    testimonial,
  ],
};
