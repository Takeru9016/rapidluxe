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

  let image:
    | { _type: "image"; asset: { _type: "reference"; _ref: string } }
    | undefined;

  if (body.imageUrl) {
    const res = await fetch(body.imageUrl);
    if (res.ok) {
      const buffer = Buffer.from(await res.arrayBuffer());
      const asset = await sanityWriteClient.assets.upload("image", buffer);
      image = {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
      };
    }
  }

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

  await sanityWriteClient.delete(id);
  return NextResponse.json({ data: { id } });
}
