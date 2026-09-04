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

// Every image source the Admin Content UI actually offers goes through the
// CloudinaryUpload widget, which always returns a res.cloudinary.com
// secure_url — so that's the only host this needs to trust.
const ALLOWED_IMAGE_UPLOAD_HOSTS = new Set(["res.cloudinary.com"]);

export interface SanityImageField {
  _type: "image";
  asset: { _type: "reference"; _ref: string };
}

// Shared by every admin write route (posts, authors, about, testimonials)
// that lets an admin paste/pick an image URL and have it stored as a real
// Sanity image asset. Rejects anything that isn't an https URL on the one
// host the admin UI's upload widget actually produces.
export async function uploadSanityImageFromUrl(
  url: string,
): Promise<SanityImageField | undefined> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return undefined;
  }
  if (
    parsed.protocol !== "https:" ||
    !ALLOWED_IMAGE_UPLOAD_HOSTS.has(parsed.hostname)
  ) {
    return undefined;
  }

  const res = await fetch(parsed.toString());
  if (!res.ok) return undefined;
  const buffer = Buffer.from(await res.arrayBuffer());
  const asset = await sanityWriteClient.assets.upload("image", buffer);
  return {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
  };
}

// Used by the author/category delete routes to block deletion of a document
// still referenced by one or more posts. Not a fully atomic guarantee —
// Sanity has no "delete if unreferenced" transaction primitive — but the
// check runs immediately before the delete call with no intervening
// user-driven delay, which is the safest available approach here.
export async function countReferencingPosts(id: string): Promise<number> {
  return sanityWriteClient.fetch<number>(
    `count(*[_type == "post" && references($id)])`,
    { id },
  );
}
