import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

import { countReferencingPosts, sanityWriteClient } from "@/lib/sanity";

async function requireAdmin() {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string } | null)?.role;
  return role === "admin";
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;

  // Checked immediately before the delete call, with no intervening
  // user-driven delay, to keep the race window as small as practical —
  // Sanity has no atomic "delete if unreferenced" transaction primitive.
  const referencingPosts = await countReferencingPosts(id);
  if (referencingPosts > 0) {
    return NextResponse.json(
      {
        error: `Cannot delete: referenced by ${referencingPosts} post${referencingPosts === 1 ? "" : "s"}.`,
      },
      { status: 409 },
    );
  }

  await sanityWriteClient.delete(id);
  return NextResponse.json({ data: { id } });
}
