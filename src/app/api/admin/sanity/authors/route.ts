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

  const authors = await sanityWriteClient.fetch<
    Array<{ _id: string; name: string; role: string | null }>
  >(
    `*[_type == "author"] | order(name asc) {
      _id,
      name,
      "role": role
    }`,
  );

  return NextResponse.json({ data: authors });
}
