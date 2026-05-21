import { Hero, TrustBar, FeaturedPackages, DestinationsSection, HotDealsSection, HowItWorks, Testimonials, BlogPreview, Newsletter } from "@/components";

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustBar />
      <FeaturedPackages />
      <DestinationsSection />
      <HotDealsSection />
      <HowItWorks />
      <Testimonials />
      <BlogPreview />
      <Newsletter />
    </main>
  );
}
