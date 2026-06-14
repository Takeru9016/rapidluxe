import type { Metadata } from "next";

import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with RapidLuxe — our luxury travel experts are here to help plan your perfect trip or answer any questions.",
  openGraph: {
    title: "Contact Us | RapidLuxe",
    description:
      "Get in touch with RapidLuxe — our luxury travel experts are here to help plan your perfect trip or answer any questions.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&auto=format&fit=crop&q=80",
        width: 1200,
        height: 800,
        alt: "Contact RapidLuxe",
      },
    ],
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
