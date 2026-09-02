import type { Metadata } from "next";

import PackagesPageClient from "./PackagesPageClient";

export const metadata: Metadata = {
  title: "Journeys",
  description:
    "Browse handpicked luxury Journeys — beaches, mountains, heritage, and more. Curated for discerning Indian travellers.",
  openGraph: {
    title: "Journeys | RapidLuxe",
    description:
      "Browse handpicked luxury Journeys — beaches, mountains, heritage, and more. Curated for discerning Indian travellers.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&auto=format&fit=crop&q=80",
        width: 1200,
        height: 800,
        alt: "Luxury RapidLuxe Journeys",
      },
    ],
  },
};

export default function PackagesPage() {
  return <PackagesPageClient />;
}
