import { NextRequest, NextResponse } from "next/server";

import { sanityReadClient } from "@/lib/sanity";
import { DESTINATION_EDITORIAL_QUERY } from "@/lib/queries/blog";
import type { DestinationEditorial } from "@/types/blog";

export const revalidate = 3600;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const editorial = await sanityReadClient.fetch<DestinationEditorial | null>(
    DESTINATION_EDITORIAL_QUERY,
    { slug },
  );

  return NextResponse.json({ data: editorial });
}
