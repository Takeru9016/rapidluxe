import { BlogPreview } from "@/components/sections/BlogPreview";
import { DestinationsSection } from "@/components/sections/DestinationsSection";
import { FeaturedPackages } from "@/components/sections/FeaturedPackages";
import { Hero } from "@/components/sections/Hero";
import { HotDealsSection } from "@/components/sections/HotDealsSection";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Newsletter } from "@/components/sections/Newsletter";
import { Testimonials } from "@/components/sections/Testimonials";
import { TrustBar } from "@/components/sections/TrustBar";

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustBar/>
      <FeaturedPackages/>
      <DestinationsSection/>
      <HotDealsSection/>
      <HowItWorks/>
      <Testimonials/>
      <BlogPreview/>
      <Newsletter/>
    </main>
  );
}
