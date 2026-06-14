import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const patchSchema = z.object({ isRead: z.boolean() });

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string } | null)?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body: unknown = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const enquiry = await prisma.enquiry.findUnique({ where: { id } });
  if (!enquiry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.enquiry.update({
    where: { id },
    data: { isRead: parsed.data.isRead },
  });

  return NextResponse.json({ data: updated });
}
