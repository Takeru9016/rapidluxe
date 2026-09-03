import type { Metadata } from "next";

import CorporatePageClient from "./CorporatePageClient";

export const metadata: Metadata = {
  title: "Corporate Travel",
  description:
    "Tailored corporate travel coordination from RapidLuxe — business travel, executive travel, retreats, offsites, and group travel, planned around your team's priorities.",
  openGraph: {
    title: "Corporate Travel | RapidLuxe",
    description:
      "Tailored corporate travel coordination from RapidLuxe — business travel, executive travel, retreats, offsites, and group travel, planned around your team's priorities.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1200&auto=format&fit=crop&q=80",
        width: 1200,
        height: 800,
        alt: "RapidLuxe corporate travel",
      },
    ],
  },
};

export default function CorporatePage() {
  return <CorporatePageClient />;
}
