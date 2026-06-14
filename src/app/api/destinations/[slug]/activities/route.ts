import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

interface BookingActivity {
  name: string;
  imageUrl: string;
  price: number;
  rating: number;
  currency: string;
}

interface RapidAttrSearchDest {
  id?: string;
  ufi?: number;
  dest_type?: string;
}

interface RapidAttraction {
  id?: string;
  name?: string;
  primaryPhoto?: { small?: string; medium?: string };
  representativePrice?: { publicAmount?: number; currency?: string };
  reviewsStats?: { combinedNumericStats?: { average?: number } };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const destination = await prisma.destination.findUnique({
    where: { slug },
    select: { name: true, country: true },
  });

  if (!destination) return NextResponse.json({ data: [] });

  const rapidKey = process.env.RAPIDAPI_KEY;
  const rapidHost =
    process.env.RAPIDAPI_BOOKING_HOST ?? "booking-com15.p.rapidapi.com";

  if (!rapidKey) return NextResponse.json({ data: [] });

  const headers = {
    "x-rapidapi-key": rapidKey,
    "x-rapidapi-host": rapidHost,
  };

  try {
    const query = `${destination.name}, ${destination.country}`;

    // Step 1: resolve attraction destination ID
    const destRes = await fetch(
      `https://${rapidHost}/api/v1/attraction/searchLocation?query=${encodeURIComponent(query)}`,
      { headers, next: { revalidate: 86400 } },
    );

    if (!destRes.ok) return NextResponse.json({ data: [] });

    const destJson = (await destRes.json()) as {
      data?: {
        destinations?: RapidAttrSearchDest[];
        cities?: { id?: string; ufi?: number }[];
      };
    };

    const destList = destJson.data?.destinations ?? destJson.data?.cities ?? [];
    const first = destList[0];
    const attrId = first?.id;

    if (!attrId) return NextResponse.json({ data: [] });

    // Step 2: fetch attractions
    const attrRes = await fetch(
      `https://${rapidHost}/api/v1/attraction/searchAttractions?id=${encodeURIComponent(attrId)}&sortBy=attraction_review_score&page=1`,
      { headers, next: { revalidate: 3600 } },
    );

    if (!attrRes.ok) return NextResponse.json({ data: [] });

    const attrJson = (await attrRes.json()) as {
      data?: {
        products?: RapidAttraction[];
        attractions?: RapidAttraction[];
      };
    };

    const raw = attrJson.data?.products ?? attrJson.data?.attractions ?? [];

    const activities: BookingActivity[] = raw
      .slice(0, 6)
      .map((a) => ({
        name: a.name ?? "Activity",
        imageUrl: a.primaryPhoto?.medium ?? a.primaryPhoto?.small ?? "",
        price: a.representativePrice?.publicAmount ?? 0,
        rating: a.reviewsStats?.combinedNumericStats?.average ?? 4.0,
        currency: a.representativePrice?.currency ?? "INR",
      }))
      .filter((a) => a.name !== "Activity");

    return NextResponse.json({ data: activities });
  } catch {
    return NextResponse.json({ data: [] });
  }
}
