import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

interface PexelsPhoto {
  id: number;
  src: { medium: string; large: string };
  alt: string;
}

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (user?.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = req.nextUrl;
  const q = searchParams.get("q");
  const perPage = searchParams.get("per_page") ?? "9";

  if (!q) {
    return NextResponse.json(
      { error: "Missing query param 'q'" },
      { status: 400 },
    );
  }

  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=${encodeURIComponent(perPage)}`,
    { headers: { Authorization: process.env.PEXELS_API_KEY! } },
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Pexels search failed" },
      { status: res.status },
    );
  }

  const data = (await res.json()) as { photos: PexelsPhoto[] };
  const photos = data.photos.map((p) => ({
    id: p.id,
    src: { medium: p.src.medium, large: p.src.large },
    alt: p.alt,
  }));

  return NextResponse.json({ data: photos });
}
