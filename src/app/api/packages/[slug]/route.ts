import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

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
        select: { name: true, slug: true, country: true, continent: true },
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

  const pkg = await prisma.package.update({
    where: { slug },
    data: parsed.data,
  });

  return NextResponse.json({ data: pkg });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string } | null)?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { slug } = await params;

  const pkg = await prisma.package.update({
    where: { slug },
    data: { status: "ARCHIVED" },
  });

  return NextResponse.json({ data: pkg });
}
