import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

interface BookingHotel {
  name: string;
  stars: number;
  rating: number;
  price: number;
  imageUrl: string;
  location: string;
}

interface RapidDestResult {
  dest_id?: string;
  search_type?: string;
  city_name?: string;
  label?: string;
}

interface RapidHotelProperty {
  name?: string;
  reviewScore?: number;
  reviewScoreWord?: string;
  photoUrls?: string[];
  accuratePropertyClass?: number;
  wishlistName?: string;
  rankingPosition?: number;
}

interface RapidHotelPriceBreakdown {
  grossPrice?: { value?: number };
}

interface RapidHotel {
  property?: RapidHotelProperty;
  priceBreakdown?: RapidHotelPriceBreakdown;
}

function getToday() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

function getTomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const pkg = await prisma.package.findUnique({
    where: { slug },
    select: { destination: { select: { name: true, country: true } } },
  });

  if (!pkg?.destination) {
    return NextResponse.json({ data: [] });
  }

  const { name, country } = pkg.destination;
  const query = `${name}, ${country}`;

  const rapidKey = process.env.RAPIDAPI_KEY;
  const rapidHost =
    process.env.RAPIDAPI_BOOKING_HOST ?? "booking-com15.p.rapidapi.com";

  if (!rapidKey) {
    return NextResponse.json({ data: [] });
  }

  const headers = {
    "x-rapidapi-key": rapidKey,
    "x-rapidapi-host": rapidHost,
  };

  try {
    const destRes = await fetch(
      `https://${rapidHost}/api/v1/hotels/searchDestination?query=${encodeURIComponent(query)}`,
      { headers, next: { revalidate: 3600 } },
    );

    if (!destRes.ok) {
      return NextResponse.json({ data: [] });
    }

    const destJson = (await destRes.json()) as {
      data?: RapidDestResult[];
    };

    const destinations = destJson.data ?? [];
    const cityDest =
      destinations.find(
        (d) => d.search_type === "city" || d.search_type === "landmark",
      ) ?? destinations[0];

    if (!cityDest?.dest_id) {
      return NextResponse.json({ data: [] });
    }

    const hotelsUrl = `https://${rapidHost}/api/v1/hotels/searchHotels?dest_id=${encodeURIComponent(cityDest.dest_id)}&search_type=${encodeURIComponent(cityDest.search_type ?? "city")}&arrival_date=${getToday()}&departure_date=${getTomorrow()}&adults=2&room_qty=1&units=metric&languagecode=en-us&currency_code=INR&page_number=1`;

    const hotelsRes = await fetch(hotelsUrl, {
      headers,
      next: { revalidate: 3600 },
    });

    if (!hotelsRes.ok) {
      return NextResponse.json({ data: [] });
    }

    const hotelsJson = (await hotelsRes.json()) as {
      data?: { hotels?: RapidHotel[] };
    };

    const rawHotels = hotelsJson.data?.hotels ?? [];

    const hotels: BookingHotel[] = rawHotels
      .slice(0, 3)
      .map((h) => ({
        name: h.property?.name ?? "Hotel",
        stars: h.property?.accuratePropertyClass ?? 4,
        rating: h.property?.reviewScore ?? 8,
        price: h.priceBreakdown?.grossPrice?.value ?? 0,
        imageUrl: h.property?.photoUrls?.[0] ?? "",
        location: cityDest.city_name ?? name,
      }))
      .filter((h) => h.name !== "Hotel");

    return NextResponse.json({ data: hotels });
  } catch {
    return NextResponse.json({ data: [] });
  }
}
