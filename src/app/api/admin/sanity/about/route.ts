import { auth } from "@clerk/nextjs/server";
import type { PortableTextBlock } from "@portabletext/react";
import { type NextRequest, NextResponse } from "next/server";

import { sanityWriteClient } from "@/lib/sanity";

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

function makeKey() {
  return Math.random().toString(36).substring(2, 11);
}

export interface AboutPageData {
  headline: string | null;
  subheadline: string | null;
  heroImageUrl: string | null;
  story: PortableTextBlock[] | null;
  missionTitle: string | null;
  missionBody: PortableTextBlock[] | null;
  team: Array<{
    name: string;
    role: string;
    bio: string;
    imageUrl: string | null;
  }>;
  stats: Array<{ number: string; label: string }>;
}

// Public GET — no admin check so the public /about page can read it too.
export async function GET() {
  const page = await sanityWriteClient.fetch<AboutPageData | null>(
    `*[_type == "aboutPage"][0] {
      headline,
      subheadline,
      "heroImageUrl": heroImage.asset->url,
      story,
      "missionTitle": mission.title,
      "missionBody": mission.body,
      "team": team[] {
        name,
        role,
        bio,
        "imageUrl": image.asset->url
      },
      stats[] { number, label }
    }`,
  );

  return NextResponse.json({ data: page });
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = (await req.json()) as Partial<AboutPageData> & {
    heroImageUrl?: string;
    team?: Array<{
      name: string;
      role: string;
      bio: string;
      imageUrl?: string | null;
    }>;
  };

  // Resolve hero image
  const heroImage = body.heroImageUrl
    ? await uploadImageFromUrl(body.heroImageUrl)
    : undefined;

  // Resolve team member images
  const team = body.team
    ? await Promise.all(
        body.team.map(async (m) => {
          const img = m.imageUrl
            ? await uploadImageFromUrl(m.imageUrl)
            : undefined;
          return {
            _type: "object" as const,
            _key: makeKey(),
            name: m.name,
            role: m.role,
            bio: m.bio,
            ...(img ? { image: img } : {}),
          };
        }),
      )
    : undefined;

  const stats = body.stats?.map((s) => ({
    _type: "object" as const,
    _key: makeKey(),
    number: s.number,
    label: s.label,
  }));

  const patchFields: Record<string, unknown> = {};
  if (body.headline !== undefined) patchFields.headline = body.headline;
  if (body.subheadline !== undefined)
    patchFields.subheadline = body.subheadline;
  if (heroImage) patchFields.heroImage = heroImage;
  if (body.story !== undefined) patchFields.story = body.story;
  if (body.missionTitle !== undefined || body.missionBody !== undefined) {
    patchFields.mission = {
      title: body.missionTitle,
      body: body.missionBody,
    };
  }
  if (team !== undefined) patchFields.team = team;
  if (stats !== undefined) patchFields.stats = stats;

  // Upsert: createOrReplace if no doc exists, else patch
  const existing = await sanityWriteClient.fetch<{ _id: string } | null>(
    `*[_type == "aboutPage"][0] { _id }`,
  );

  if (existing) {
    const updated = await sanityWriteClient
      .patch(existing._id)
      .set(patchFields)
      .commit();
    return NextResponse.json({ data: updated });
  }

  const created = await sanityWriteClient.create({
    _type: "aboutPage",
    ...patchFields,
  });
  return NextResponse.json({ data: created }, { status: 201 });
}
