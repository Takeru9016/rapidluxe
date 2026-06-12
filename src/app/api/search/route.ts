import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  checkRateLimit,
  strictLimiter,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { searchQuerySchema } from "@/lib/validations/destination";

type SearchRow = {
  id: string;
  name: string;
  slug: string;
  type: "destination" | "package";
  rank: number;
};

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
  const rl = await checkRateLimit(strictLimiter, ip);
  if (!rl.success) return rateLimitResponse(rl.reset);

  const { searchParams } = req.nextUrl;
  const raw = {
    q: searchParams.get("q") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
  };

  const parsed = searchQuerySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query", details: parsed.error.issues },
      { status: 400 },
    );
  }

  const { q, limit } = parsed.data;

  const results = await prisma.$queryRaw<SearchRow[]>`
    SELECT
      id,
      name,
      slug,
      'destination'::text AS type,
      ts_rank(
        to_tsvector('english', name || ' ' || country || ' ' || COALESCE(description, '')),
        plainto_tsquery('english', ${q})
      ) AS rank
    FROM "Destination"
    WHERE to_tsvector('english', name || ' ' || country || ' ' || COALESCE(description, ''))
      @@ plainto_tsquery('english', ${q})

    UNION ALL

    SELECT
      id,
      title AS name,
      slug,
      'package'::text AS type,
      ts_rank(
        to_tsvector('english', title || ' ' || description),
        plainto_tsquery('english', ${q})
      ) AS rank
    FROM "Package"
    WHERE status = 'PUBLISHED'
      AND to_tsvector('english', title || ' ' || description)
        @@ plainto_tsquery('english', ${q})

    ORDER BY rank DESC
    LIMIT ${limit}
  `;

  return NextResponse.json({ data: results, query: q });
}
