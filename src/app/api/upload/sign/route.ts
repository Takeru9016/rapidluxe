import { auth } from "@clerk/nextjs/server";

import { generateSignedUploadParams } from "@/lib/cloudinary";

export async function POST(request: Request) {
  const { userId, sessionClaims } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  if (sessionClaims?.metadata?.role !== "admin")
    return Response.json({ error: "Forbidden" }, { status: 403 });

  const body = (await request.json()) as { folder?: string };
  const params = await generateSignedUploadParams(body.folder ?? "rapidluxe");

  return Response.json({ data: params });
}
