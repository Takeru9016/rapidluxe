import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";
import { sanityWriteClient } from "@/lib/sanity";

async function requireAdmin(): Promise<boolean> {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string } | null)?.role;
  return role === "admin";
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await req.json()) as {
    name: string;
    slug: string;
    country: string;
    continent: string;
    imageUrl?: string;
    bestTimeFrom?: string;
    bestTimeTo?: string;
    visaType?: string;
    currency?: string;
    language?: string;
    lat?: number;
    lng?: number;
    countryCode?: string;
    crowdLevel?: string;
    whenToVisit?: unknown;
    howToGetThere?: unknown;
    about?: string;
    travelTips?: string;
    metaTitle?: string;
    metaDescription?: string;
  };

  if (!body.name || !body.slug || !body.country || !body.continent) {
    return NextResponse.json(
      { error: "name, slug, country, continent are required" },
      { status: 400 },
    );
  }

  const existing = await prisma.destination.findUnique({
    where: { slug: body.slug },
  });
  if (existing) {
    return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
  }

  const destination = await prisma.destination.create({
    data: {
      name: body.name,
      slug: body.slug,
      country: body.country,
      continent: body.continent,
      imageUrl: body.imageUrl ?? null,
      bestTimeFrom: body.bestTimeFrom ?? null,
      bestTimeTo: body.bestTimeTo ?? null,
      visaType: body.visaType ?? null,
      currency: body.currency ?? null,
      language: body.language ?? null,
      lat: body.lat ?? null,
      lng: body.lng ?? null,
      countryCode: body.countryCode ?? null,
      crowdLevel: (body.crowdLevel ??
        null) as Prisma.DestinationCreateInput["crowdLevel"],
      whenToVisit: body.whenToVisit ?? undefined,
      howToGetThere: body.howToGetThere ?? undefined,
    },
  });

  await sanityWriteClient.create({
    _type: "destination",
    slug: { _type: "slug", current: body.slug },
    about: body.about ?? "",
    travelTips: body.travelTips ?? "",
    seo: {
      metaTitle: body.metaTitle ?? null,
      metaDescription: body.metaDescription ?? null,
    },
  });

  return NextResponse.json({ data: destination }, { status: 201 });
}
