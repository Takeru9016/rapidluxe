import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

export async function GET() {
  const rows = await prisma.siteSettings.findMany();
  const settings = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return NextResponse.json(settings);
}
