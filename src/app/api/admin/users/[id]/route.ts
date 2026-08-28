import { auth, clerkClient } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const actionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("role"), role: z.enum(["ADMIN", "USER"]) }),
  z.object({ action: z.literal("suspend") }),
  z.object({ action: z.literal("unsuspend") }),
]);

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string } | null)?.role;
  if (role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, clerkId: true, role: true },
  });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body: unknown = await req.json();
  const parsed = actionSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const client = await clerkClient();

  if (parsed.data.action === "role") {
    // Clerk publicMetadata.role is authoritative for every route guard
    // (proxy.ts + all /api/admin/* routes read sessionClaims.metadata.role).
    // DB role is a synchronized mirror only, updated here for immediate
    // display consistency in the admin users table.
    await client.users.updateUserMetadata(user.clerkId, {
      publicMetadata: { role: parsed.data.role.toLowerCase() },
    });

    const updated = await prisma.user.update({
      where: { id },
      data: { role: parsed.data.role },
      select: { id: true, name: true, email: true, role: true },
    });
    return NextResponse.json({ data: updated });
  }

  if (parsed.data.action === "suspend") {
    await client.users.banUser(user.clerkId);
    return NextResponse.json({ suspended: true });
  }

  await client.users.unbanUser(user.clerkId);
  return NextResponse.json({ suspended: false });
}
