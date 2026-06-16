import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import type { PortableTextBlock } from "@portabletext/react";

import { sanityWriteClient } from "@/lib/sanity";

async function requireAdmin() {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string } | null)?.role;
  return role === "admin";
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { slug } = await params;

  const page = await sanityWriteClient.fetch<{
    _id: string;
    slug: string | null;
    title: string | null;
    subtitle: string | null;
    body: PortableTextBlock[] | null;
    lastUpdated: string | null;
  } | null>(
    `*[_type == "staticPage" && slug.current == $slug][0] {
      _id,
      "slug": slug.current,
      title,
      subtitle,
      body,
      lastUpdated
    }`,
    { slug },
  );

  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ data: page });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { slug } = await params;

  const body = (await req.json()) as {
    title?: string;
    subtitle?: string;
    body?: PortableTextBlock[];
  };

  const page = await sanityWriteClient.fetch<{ _id: string } | null>(
    `*[_type == "staticPage" && slug.current == $slug][0] { _id }`,
    { slug },
  );

  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await sanityWriteClient
    .patch(page._id)
    .set({
      ...(body.title !== undefined ? { title: body.title } : {}),
      ...(body.subtitle !== undefined ? { subtitle: body.subtitle } : {}),
      ...(body.body !== undefined ? { body: body.body } : {}),
      lastUpdated: new Date().toISOString(),
    })
    .commit();

  return NextResponse.json({ data: updated });
}
