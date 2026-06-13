import { createClient, type SanityClient } from "@sanity/client";
import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";

import { apiVersion, dataset, projectId } from "@/sanity/env";

// Public read client — safe in server components. Cached at the CDN.
export const sanityReadClient: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

// Write client — SERVER ONLY. Never import in client components.
export const sanityWriteClient: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const builder = createImageUrlBuilder({ projectId, dataset });

export const urlFor = (source: SanityImageSource) => builder.image(source);
