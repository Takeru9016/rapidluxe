import {
  Hero,
  TrustBar,
  FeaturedPackages,
  WhyRapidLuxe,
  DestinationsSection,
  HotDealsSection,
  HowItWorks,
  Testimonials,
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
      <WhyRapidLuxe />
      <DestinationsSection />
      <HotDealsSection />
      <HowItWorks />
      <Testimonials />
      <BlogPreview />
      <FAQAccordion />
      <FinalCTAStrip />
      <Newsletter />
    </main>
  );
}
