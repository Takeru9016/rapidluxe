import {
  Hero,
  TrustBar,
  FeaturedPackages,
  DestinationsSection,
  HotDealsSection,
  HowItWorks,
  TravelerCarousel,
  BlogPreview,
  FAQAccordion,
  FinalCTAStrip,
  Newsletter,
} from "@/components";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <TrustBar />
      <FeaturedPackages />
      <DestinationsSection />
      <HotDealsSection />
      <HowItWorks />
      <TravelerCarousel />
      <BlogPreview />
      <FAQAccordion />
      <FinalCTAStrip />
      <Newsletter />
    </main>
  );
}
