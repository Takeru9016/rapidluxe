import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";
import { sanityWriteClient } from "@/lib/sanity";
import { updateDestinationSchema } from "@/lib/validations/destination";

async function requireAdmin(): Promise<boolean> {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string } | null)?.role;
  return role === "admin";
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const destination = await prisma.destination.findUnique({ where: { id } });
  if (!destination) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ data: destination });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const packages = await prisma.package.count({
    where: { destinationId: id },
  });
  if (packages > 0) {
    return NextResponse.json(
      {
        error:
          "Cannot delete — destination has packages linked to it. Delete or reassign packages first.",
      },
      { status: 400 },
    );
  }

  const deleted = await prisma.destination.delete({ where: { id } });

  revalidatePath("/api/destinations");
  revalidatePath(`/api/destinations/${deleted.slug}`);
  revalidatePath("/sitemap.xml");

  return NextResponse.json({ success: true });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const raw: unknown = await req.json();
  const parsed = updateDestinationSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.issues },
      { status: 400 },
    );
  }
  const body = parsed.data;

  const existing = await prisma.destination.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (body.slug !== undefined && body.slug !== existing.slug) {
    const collision = await prisma.destination.findUnique({
      where: { slug: body.slug },
      select: { id: true },
    });
    if (collision && collision.id !== existing.id) {
      return NextResponse.json(
        { error: "This slug is already in use by another destination." },
        { status: 409 },
      );
    }
  }

  let destination: Prisma.DestinationGetPayload<Record<string, never>>;
  try {
    destination = await prisma.destination.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.slug !== undefined && { slug: body.slug }),
        ...(body.country !== undefined && { country: body.country }),
        ...(body.continent !== undefined && { continent: body.continent }),
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
        ...(body.images !== undefined && { images: body.images }),
        ...(body.bestMonths !== undefined && { bestMonths: body.bestMonths }),
        ...(body.visaType !== undefined && { visaType: body.visaType }),
        ...(body.currency !== undefined && { currency: body.currency }),
        ...(body.language !== undefined && { language: body.language }),
        ...(body.lat !== undefined && { lat: body.lat }),
        ...(body.lng !== undefined && { lng: body.lng }),
        ...(body.countryCode !== undefined && {
          countryCode: body.countryCode,
        }),
        ...(body.crowdLevel !== undefined && { crowdLevel: body.crowdLevel }),
        ...(body.whenToVisit !== undefined && {
          whenToVisit: body.whenToVisit as Prisma.InputJsonValue,
        }),
        ...(body.howToGetThere !== undefined && {
          howToGetThere: body.howToGetThere as Prisma.InputJsonValue,
        }),
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "This slug is already in use by another destination." },
        { status: 409 },
      );
    }
    throw error;
  }

  const slug = body.slug ?? existing.slug;
  const sanityDocs = await sanityWriteClient.fetch<Array<{ _id: string }>>(
    `*[_type == "destination" && slug.current == $slug]{ _id }`,
    { slug: existing.slug },
  );

  const sanityPatch: Record<string, unknown> = {};
  if (body.about !== undefined) sanityPatch.about = body.about;
  if (body.travelTips !== undefined) sanityPatch.travelTips = body.travelTips;
  if (body.metaTitle !== undefined || body.metaDescription !== undefined) {
    sanityPatch.seo = {
      metaTitle: body.metaTitle ?? null,
      metaDescription: body.metaDescription ?? null,
    };
  }
  if (body.slug !== undefined)
    sanityPatch.slug = { _type: "slug", current: body.slug };

  if (Object.keys(sanityPatch).length > 0) {
    if (sanityDocs.length > 0) {
      await sanityWriteClient
        .patch(sanityDocs[0]._id)
        .set(sanityPatch)
        .commit();
    } else {
      await sanityWriteClient.create({
        _type: "destination",
        slug: { _type: "slug", current: slug },
        ...sanityPatch,
      });
    }
  }

  revalidatePath("/api/destinations");
  revalidatePath(`/api/destinations/${existing.slug}`);
  if (body.slug !== undefined && body.slug !== existing.slug) {
    revalidatePath(`/api/destinations/${body.slug}`);
    revalidatePath("/sitemap.xml");
  }

  return NextResponse.json({ data: destination });
}
