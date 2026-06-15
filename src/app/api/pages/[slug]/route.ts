import { NextResponse } from "next/server";
import { sanityReadClient } from "@/lib/sanity";
import { STATIC_PAGE_QUERY } from "@/lib/queries/pages";
import type { StaticPageData } from "@/types/staticPage";

export const revalidate = 3600;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const page = await sanityReadClient.fetch<StaticPageData | null>(
    STATIC_PAGE_QUERY,
    { slug },
  );

  if (!page) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  return NextResponse.json(page);
}
