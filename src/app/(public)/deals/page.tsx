import type { Metadata } from "next";

import DealsPageClient from "./DealsPageClient";

export const metadata: Metadata = {
  title: "Flash Sales & Limited Deals",
  description:
    "Limited-time offers on luxury travel packages — flash sales, early bird deals, and last-minute escapes. Book before they're gone.",
  openGraph: {
    title: "Flash Sales & Limited Deals | RapidLuxe",
    description:
      "Limited-time offers on luxury travel packages — flash sales, early bird deals, and last-minute escapes. Book before they're gone.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&auto=format&fit=crop&q=80",
        width: 1200,
        height: 800,
        alt: "Luxury travel deals",
      },
    ],
  },
};

export default function DealsPage() {
  return <DealsPageClient />;
}
