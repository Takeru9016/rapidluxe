import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { createPackageSchema } from "@/lib/validations/package";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const pkg = await prisma.package.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      destination: {
        select: {
          name: true,
          slug: true,
          country: true,
          continent: true,
          lat: true,
          lng: true,
        },
      },
      _count: { select: { reviews: true } },
    },
  });

  if (!pkg) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  return NextResponse.json({ data: pkg });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string } | null)?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { slug } = await params;
  const body: unknown = await req.json();
  const parsed = createPackageSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.issues },
      { status: 400 },
    );
  }

  const current = await prisma.package.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!current) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  const { destinationId, ...rest } = parsed.data;

  if (rest.slug && rest.slug !== slug) {
    const collision = await prisma.package.findUnique({
      where: { slug: rest.slug },
      select: { id: true },
    });
    if (collision && collision.id !== current.id) {
      return NextResponse.json(
        { error: "This slug is already in use by another package." },
        { status: 409 },
      );
    }
  }

  try {
    const pkg = await prisma.package.update({
      where: { slug },
      data: {
        ...rest,
        ...(destinationId
          ? { destination: { connect: { id: destinationId } } }
          : {}),
      },
    });
    return NextResponse.json({ data: pkg });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "This slug is already in use by another package." },
        { status: 409 },
      );
    }
    throw error;
  }
}
