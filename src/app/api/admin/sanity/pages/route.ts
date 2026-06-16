import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { sanityWriteClient } from "@/lib/sanity";

async function requireAdmin() {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string } | null)?.role;
  return role === "admin";
}

export async function GET() {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const pages = await sanityWriteClient.fetch<
    Array<{
      _id: string;
      slug: string | null;
      title: string | null;
      subtitle: string | null;
      lastUpdated: string | null;
    }>
  >(
    `*[_type == "staticPage"] | order(slug.current asc) {
      _id,
      "slug": slug.current,
      title,
      subtitle,
      lastUpdated
    }`,
  );

  return NextResponse.json({ data: pages });
}
