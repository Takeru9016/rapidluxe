import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

import { sanityWriteClient } from "@/lib/sanity";
import type { AdminPostPayload } from "@/types/blog";

async function requireAdmin() {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string } | null)?.role;
  return role === "admin";
}

// Upload an image from a URL into Sanity and return an image-field reference.
async function uploadImageFromUrl(url: string) {
  const res = await fetch(url);
  if (!res.ok) return undefined;
  const buffer = Buffer.from(await res.arrayBuffer());
  const asset = await sanityWriteClient.assets.upload("image", buffer);
  return {
    _type: "image" as const,
    asset: { _type: "reference" as const, _ref: asset._id },
  };
}

// Inline image blocks arrive from the editor as { _type: "image", url }.
// Upload each url to Sanity and replace it with a proper asset reference.
async function uploadBodyImages(body: AdminPostPayload["body"]) {
  if (!body) return body;
  return Promise.all(
    body.map(async (block) => {
      const b = block as { _type?: string; url?: string };
      if (b._type === "image" && b.url) {
        const image = await uploadImageFromUrl(b.url);
        if (image) {
          const next: Record<string, unknown> = { ...b, ...image };
          delete next.url;
          return next;
        }
      }
      return block;
    }),
  );
}

// Build the Sanity document fields shared by create + update.
async function buildDoc(data: AdminPostPayload) {
  const doc: Record<string, unknown> = {};

  if (data.title !== undefined) doc.title = data.title;
  if (data.slug !== undefined) doc.slug = { _type: "slug", current: data.slug };
  if (data.authorId) doc.author = { _type: "reference", _ref: data.authorId };
  if (data.categoryId)
    doc.category = { _type: "reference", _ref: data.categoryId };
  if (data.excerpt !== undefined) doc.excerpt = data.excerpt;
  if (data.readTime !== undefined) doc.readTime = data.readTime;
  if (data.publishedAt)
    doc.publishedAt = new Date(data.publishedAt).toISOString();
  if (data.tags !== undefined) doc.tags = data.tags;
  if (data.body !== undefined) doc.body = await uploadBodyImages(data.body);
  if (data.metaTitle !== undefined || data.metaDescription !== undefined) {
    doc.seo = {
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
    };
  }
  if (data.mainImageUrl) {
    const image = await uploadImageFromUrl(data.mainImageUrl);
    if (image) doc.mainImage = image;
  }

  return doc;
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const data = (await req.json()) as AdminPostPayload;
  if (!data.title || !data.slug) {
    return NextResponse.json(
      { error: "Title and slug are required" },
      { status: 400 },
    );
  }

  const doc = await buildDoc(data);
  const created = await sanityWriteClient.create({ _type: "post", ...doc });

  return NextResponse.json({ data: created }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id, ...data } = (await req.json()) as AdminPostPayload & {
    id?: string;
  };
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const doc = await buildDoc(data);
  const updated = await sanityWriteClient.patch(id).set(doc).commit();

  return NextResponse.json({ data: updated });
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = (await req.json()) as { id?: string };
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  await sanityWriteClient.delete(id);

  return NextResponse.json({ data: { id } });
}
