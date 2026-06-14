import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { MonthlyWeather } from "@/types/destination";

export const revalidate = 86400;

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Sinusoidal seasonal offset for northern hemisphere — inverted for southern
function tempForMonth(
  monthIndex: number,
  baseTemp: number,
  lat: number,
): number {
  const amplitude = Math.min(18, Math.abs(lat) * 0.4);
  // Peak in July (index 6) for northern hemisphere, January (0) for southern
  const peakMonth = lat >= 0 ? 6 : 0;
  const offset = ((monthIndex - peakMonth) / 12) * 2 * Math.PI;
  return Math.round((baseTemp + amplitude * Math.cos(offset)) * 10) / 10;
}

function rainfallForMonth(monthIndex: number, lat: number): number {
  // Simple seasonal estimate — tropical = fairly uniform, temperate = summer-heavy
  const tropicalBias = Math.max(0, 1 - Math.abs(lat) / 30);
  const base = 60 + tropicalBias * 120;
  const peak = lat >= 0 ? 6 : 0;
  const offset = ((monthIndex - peak) / 12) * 2 * Math.PI;
  return Math.round(base + (1 - tropicalBias) * 80 * Math.cos(offset));
}

function rating(temp: number, rainfall: number): number {
  const tempScore =
    temp >= 18 && temp <= 28 ? 5 : temp < 10 || temp > 36 ? 2 : 3;
  const rainScore =
    rainfall < 40 ? 5 : rainfall < 100 ? 4 : rainfall < 180 ? 3 : 2;
  return Math.round((tempScore + rainScore) / 2);
}

interface OWMCurrentResponse {
  main?: { temp?: number; humidity?: number };
  rain?: { "1h"?: number };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const destination = await prisma.destination.findUnique({
    where: { slug },
    select: { lat: true, lng: true, name: true },
  });

  if (!destination?.lat || !destination?.lng) {
    return NextResponse.json({ data: [] });
  }

  const { lat, lng } = destination;

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) return NextResponse.json({ data: [] });

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`,
      { next: { revalidate: 86400 } },
    );

    if (!res.ok) return NextResponse.json({ data: [] });

    const current = (await res.json()) as OWMCurrentResponse;
    const currentTemp = current.main?.temp ?? 24;
    const currentHumidity = current.main?.humidity ?? 70;
    const now = new Date();
    const currentMonthIdx = now.getMonth();

    const data: MonthlyWeather[] = MONTHS.map((month, idx) => {
      const temp = tempForMonth(idx, currentTemp, lat);
      const rainfall = rainfallForMonth(idx, lat);
      const humidity =
        idx === currentMonthIdx
          ? currentHumidity
          : Math.round(currentHumidity + (rainfall - 80) * 0.1);

      return {
        month,
        temp,
        rainfall: Math.max(5, rainfall),
        humidity: Math.min(95, Math.max(30, humidity)),
        rating: rating(temp, rainfall),
      };
    });

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ data: [] });
  }
}
