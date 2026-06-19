import {
  Hero,
  FeaturedPackages,
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
      <FeaturedPackages />
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
