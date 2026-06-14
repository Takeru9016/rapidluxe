import type { Metadata } from "next";

import DestinationsPageClient from "./DestinationsPageClient";

export const metadata: Metadata = {
  title: "Explore Destinations",
  description:
    "Discover the world's most extraordinary destinations — from Bali to Santorini, curated for the discerning Indian traveller.",
  openGraph: {
    title: "Explore Destinations | RapidLuxe",
    description:
      "Discover the world's most extraordinary destinations — from Bali to Santorini, curated for the discerning Indian traveller.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop&q=80",
        width: 1200,
        height: 800,
        alt: "Explore destinations",
      },
    ],
  },
};

export default function DestinationsPage() {
  return <DestinationsPageClient />;
}
