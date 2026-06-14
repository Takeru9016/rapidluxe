import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

import { sanityWriteClient } from "@/lib/sanity";
import type { AdminPostPayload } from "@/types/blog";

async function requireAdmin() {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string } | null)?.role;
  return role === "admin";
}

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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;

  const post = await sanityWriteClient.fetch<{
    _id: string;
    title: string;
    slug: string | null;
    authorId: string | null;
    categoryId: string | null;
    excerpt: string | null;
    readTime: number | null;
    publishedAt: string | null;
    tags: string[] | null;
    body: unknown[] | null;
    mainImageUrl: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
  } | null>(
    `*[_type == "post" && _id == $id][0] {
      _id,
      title,
      "slug": slug.current,
      "authorId": author._ref,
      "categoryId": category._ref,
      excerpt,
      readTime,
      publishedAt,
      tags,
      body,
      "mainImageUrl": mainImage.asset->url,
      "metaTitle": seo.metaTitle,
      "metaDescription": seo.metaDescription
    }`,
    { id },
  );

  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ data: post });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const data = (await req.json()) as AdminPostPayload;

  const doc = await buildDoc(data);
  const updated = await sanityWriteClient.patch(id).set(doc).commit();

  return NextResponse.json({ data: updated });
}
