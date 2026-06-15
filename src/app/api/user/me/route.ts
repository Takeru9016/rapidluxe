import { auth, clerkClient } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  nationality: z.string().optional().nullable(),
  passportNumber: z.string().optional().nullable(),
});

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      dateOfBirth: true,
      nationality: true,
      passportNumber: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({
    data: {
      ...user,
      dateOfBirth: user.dateOfBirth?.toISOString() ?? null,
      createdAt: user.createdAt.toISOString(),
    },
  });
}

export async function PATCH(req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body: unknown = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.issues },
      { status: 400 },
    );

  const { name, phone, dateOfBirth, nationality, passportNumber } = parsed.data;

  const user = await prisma.user.update({
    where: { clerkId: userId },
    data: {
      name,
      phone: phone ?? null,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      nationality: nationality ?? null,
      passportNumber: passportNumber ?? null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      dateOfBirth: true,
      nationality: true,
      passportNumber: true,
      role: true,
      createdAt: true,
    },
  });

  const nameParts = name.trim().split(/\s+/);
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ") || undefined;

  try {
    const client = await clerkClient();
    await client.users.updateUser(userId, { firstName, lastName });
  } catch (err) {
    console.error("clerk name sync error:", err);
  }

  return NextResponse.json({
    data: {
      ...user,
      dateOfBirth: user.dateOfBirth?.toISOString() ?? null,
      createdAt: user.createdAt.toISOString(),
    },
  });
}
