import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { suggestionsQuerySchema } from "@/lib/validations/destination";

export const revalidate = 60;

type SuggestionRow = {
  id: string;
  name: string;
  slug: string;
  type: "destination" | "package";
};

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const raw = {
    q: searchParams.get("q") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
  };

  const parsed = suggestionsQuerySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query", details: parsed.error.issues },
      { status: 400 },
    );
  }

  const { q, limit } = parsed.data;
  const pattern = `${q}%`;

  const results = await prisma.$queryRaw<SuggestionRow[]>`
    SELECT id, name, slug, 'destination'::text AS type
    FROM "Destination"
    WHERE name ILIKE ${pattern}
    LIMIT ${Math.ceil(limit / 2)}

    UNION ALL

    SELECT id, title AS name, slug, 'package'::text AS type
    FROM "Package"
    WHERE status = 'PUBLISHED'
      AND title ILIKE ${pattern}
    LIMIT ${Math.ceil(limit / 2)}

    LIMIT ${limit}
  `;

  return NextResponse.json({ data: results, query: q });
}
