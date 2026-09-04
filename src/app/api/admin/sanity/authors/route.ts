import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

import {
  countReferencingPosts,
  sanityWriteClient,
  uploadSanityImageFromUrl,
} from "@/lib/sanity";

async function requireAdmin() {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string } | null)?.role;
  return role === "admin";
}

export async function GET() {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const authors = await sanityWriteClient.fetch<
    Array<{
      _id: string;
      name: string;
      role: string | null;
      bio: string | null;
      imageUrl: string | null;
    }>
  >(
    `*[_type == "author"] | order(name asc) {
      _id,
      name,
      role,
      bio,
      "imageUrl": image.asset->url
    }`,
  );

  return NextResponse.json({ data: authors });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = (await req.json()) as {
    name?: string;
    role?: string;
    bio?: string;
    imageUrl?: string;
  };

  if (!body.name?.trim())
    return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const image = body.imageUrl
    ? await uploadSanityImageFromUrl(body.imageUrl)
    : undefined;

  const created = await sanityWriteClient.create({
    _type: "author",
    name: body.name.trim(),
    ...(body.role ? { role: body.role } : {}),
    ...(body.bio ? { bio: body.bio } : {}),
    ...(image ? { image } : {}),
  });
  return NextResponse.json({ data: created }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = (await req.json()) as { id?: string };
  if (!id)
    return NextResponse.json({ error: "id is required" }, { status: 400 });

  // Checked immediately before the delete call, with no intervening
  // user-driven delay, to keep the race window as small as practical —
  // Sanity has no atomic "delete if unreferenced" transaction primitive.
  const referencingPosts = await countReferencingPosts(id);
  if (referencingPosts > 0) {
    return NextResponse.json(
      {
        error: `Cannot delete: referenced by ${referencingPosts} post${referencingPosts === 1 ? "" : "s"}.`,
      },
      { status: 409 },
    );
  }

  await sanityWriteClient.delete(id);
  return NextResponse.json({ data: { id } });
}
