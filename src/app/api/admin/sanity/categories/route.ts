import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

import { sanityWriteClient } from "@/lib/sanity";

async function requireAdmin() {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string } | null)?.role;
  return role === "admin";
}

export async function GET() {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const categories = await sanityWriteClient.fetch<
    Array<{
      _id: string;
      title: string;
      slug: string | null;
      description: string | null;
      postCount: number;
    }>
  >(
    `*[_type == "category"] | order(title asc) {
      _id,
      title,
      "slug": slug.current,
      description,
      "postCount": count(*[_type == "post" && references(^._id)])
    }`,
  );

  return NextResponse.json({ data: categories });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = (await req.json()) as {
    title?: string;
    slug?: string;
    description?: string;
  };

  if (!body.title?.trim())
    return NextResponse.json({ error: "Title is required" }, { status: 400 });

  const slug =
    body.slug?.trim() ||
    body.title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const created = await sanityWriteClient.create({
    _type: "category",
    title: body.title.trim(),
    slug: { _type: "slug" as const, current: slug },
    ...(body.description ? { description: body.description } : {}),
  });
  return NextResponse.json({ data: created }, { status: 201 });
}
