import type { Metadata } from "next";
import {
  BlogPreview,
  DestinationsSection,
  FeaturedPackages,
  FinalCTAStrip,
  Hero,
  HotDealsSection,
  TherapycationIntro,
  Trust,
} from "@/components";

export const metadata: Metadata = {
  title: "Luxury Travel, Curated for India | RapidLuxe",
  description:
    "RapidLuxe designs bespoke Therapycation journeys — luxury travel curated by experts to help you rest, reconnect, and restore.",
  openGraph: {
    title: "Luxury Travel, Curated for India | RapidLuxe",
    description:
      "RapidLuxe designs bespoke Therapycation journeys — luxury travel curated by experts to help you rest, reconnect, and restore.",
  },
};

export default function HomePage() {
  return (
    <main>
      <Hero />
      <TherapycationIntro />
      <FeaturedPackages />
      <DestinationsSection />
      <Trust />
      <BlogPreview />
      <HotDealsSection />
      <FinalCTAStrip />
    </main>
  );
}
