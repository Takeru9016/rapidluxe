import { NextResponse } from "next/server";

import { sanityReadClient } from "@/lib/sanity";

export const revalidate = 3600;

export interface TestimonialItem {
  _id: string;
  clientName: string;
  clientTitle: string | null;
  quote: string;
  destination: string | null;
  rating: number;
  tripDate: string | null;
  imageUrl: string | null;
}

export async function GET() {
  const data = await sanityReadClient.fetch<TestimonialItem[]>(
    `*[_type == "testimonial" && isFeatured == true] | order(_createdAt desc) {
      _id,
      clientName,
      clientTitle,
      quote,
      destination,
      rating,
      tripDate,
      "imageUrl": image.asset->url
    }`,
  );

  return NextResponse.json({ data: data ?? [] });
}
