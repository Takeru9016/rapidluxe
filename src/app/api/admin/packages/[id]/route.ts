import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string } | null)?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const pkg = await prisma.package.findUnique({
    where: { id },
    include: {
      destination: { select: { id: true, name: true, country: true } },
    },
  });

  if (!pkg) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  return NextResponse.json({ data: pkg });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string } | null)?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const bookings = await prisma.booking.count({ where: { packageId: id } });
  if (bookings > 0) {
    return NextResponse.json(
      {
        error:
          "Cannot delete — package has bookings linked to it. Cancel or reassign bookings first.",
      },
      { status: 400 },
    );
  }

  try {
    await prisma.package.delete({ where: { id } });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return NextResponse.json(
        {
          error:
            "Cannot delete — package has reviews, wishlist entries, or deals linked to it. Remove those first.",
        },
        { status: 400 },
      );
    }
    throw error;
  }

  return NextResponse.json({ success: true });
}
