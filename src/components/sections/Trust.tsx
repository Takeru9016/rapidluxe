"use client";

import { HowItWorks } from "@/components/sections/HowItWorks";
import { Testimonials } from "@/components/sections/Testimonials";
import { TrustBar } from "@/components/sections/TrustBar";

export function Trust() {
  return (
    <section aria-labelledby="trust-heading" className="py-20 md:py-32">
      <div className="text-center mb-16 px-4">
        <p
          className="text-xs tracking-widest uppercase"
          style={{ fontFamily: "var(--font-body)", color: "var(--color-gold)" }}
        >
          Why Travelers Trust Us
        </p>
        <h2
          id="trust-heading"
          className="text-4xl md:text-5xl text-white mt-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Proven, Personal, and Real
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-16">
        <TrustBar />
      </div>

      <div className="mb-20">
        <Testimonials />
      </div>

      <HowItWorks />
    </section>
  );
}
