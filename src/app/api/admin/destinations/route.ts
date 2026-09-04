import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { sanityWriteClient } from "@/lib/sanity";
import { createDestinationSchema } from "@/lib/validations/destination";

async function requireAdmin(): Promise<boolean> {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string } | null)?.role;
  return role === "admin";
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body: unknown = await req.json();
  const parsed = createDestinationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.issues },
      { status: 400 },
    );
  }
  const data = parsed.data;

  const existing = await prisma.destination.findUnique({
    where: { slug: data.slug },
  });
  if (existing) {
    return NextResponse.json(
      { error: "This slug is already in use by another destination." },
      { status: 409 },
    );
  }

  const destination = await prisma.destination.create({
    data: {
      name: data.name,
      slug: data.slug,
      country: data.country,
      continent: data.continent,
      imageUrl: data.imageUrl ?? null,
      images: data.images ?? [],
      bestMonths: data.bestMonths ?? [],
      visaType: data.visaType ?? null,
      currency: data.currency ?? null,
      language: data.language ?? null,
      lat: data.lat ?? null,
      lng: data.lng ?? null,
      countryCode: data.countryCode ?? null,
      crowdLevel: data.crowdLevel ?? null,
      whenToVisit: data.whenToVisit ?? undefined,
      howToGetThere: data.howToGetThere ?? undefined,
    },
  });

  await sanityWriteClient.create({
    _type: "destination",
    slug: { _type: "slug", current: data.slug },
    about: data.about ?? "",
    travelTips: data.travelTips ?? "",
    seo: {
      metaTitle: data.metaTitle ?? null,
      metaDescription: data.metaDescription ?? null,
    },
  });

  revalidatePath("/api/destinations");
  revalidatePath("/sitemap.xml");

  return NextResponse.json({ data: destination }, { status: 201 });
}
