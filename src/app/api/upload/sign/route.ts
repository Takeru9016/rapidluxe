import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import { generateSignedUploadParams } from "@/lib/cloudinary";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (user?.role !== "ADMIN")
    return Response.json({ error: "Forbidden" }, { status: 403 });

  const body = (await request.json()) as { folder?: string };
  const params = await generateSignedUploadParams(body.folder ?? "rapidluxe");

  return Response.json({ data: params });
}
