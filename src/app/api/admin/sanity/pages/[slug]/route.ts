import { auth } from "@clerk/nextjs/server";
import type { PortableTextBlock } from "@portabletext/react";
import { type NextRequest, NextResponse } from "next/server";

import { isCanonicalStaticPageSlug } from "@/lib/queries/pages";
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

  const fields = {
    ...(body.title !== undefined ? { title: body.title } : {}),
    ...(body.subtitle !== undefined ? { subtitle: body.subtitle } : {}),
    ...(body.body !== undefined ? { body: body.body } : {}),
    lastUpdated: new Date().toISOString(),
  };

  const page = await sanityWriteClient.fetch<{ _id: string } | null>(
    `*[_type == "staticPage" && slug.current == $slug][0] { _id }`,
    { slug },
  );

  if (page) {
    const updated = await sanityWriteClient
      .patch(page._id)
      .set(fields)
      .commit();
    return NextResponse.json({ data: updated });
  }

  // No document exists yet for this slug — only create one for a canonical
  // static-page slug (i.e. one with an actual public route to render it).
  // Any other slug would just be an orphaned document.
  if (!isCanonicalStaticPageSlug(slug)) {
    return NextResponse.json(
      { error: `"${slug}" is not a recognized static page slug` },
      { status: 400 },
    );
  }

  const created = await sanityWriteClient.create({
    _type: "staticPage",
    slug: { _type: "slug", current: slug },
    ...fields,
  });
  return NextResponse.json({ data: created }, { status: 201 });
}
