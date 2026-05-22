"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { gsap } from "gsap";

import { SearchBar } from "@/components/shared/SearchBar";

export function Hero() {
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!prefersReduced) {
      gsap
        .timeline()
        .fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
        )
        .fromTo(
          h1Ref.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.3"
        )
        .fromTo(
          subRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.4"
        )
        .fromTo(
          searchRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.3"
        )
        .fromTo(
          scrollRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.4 },
          "-=0.2"
        );
    }
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&auto=format&fit=crop&q=80"
          alt="Luxury mountain landscape"
          fill
          className="object-cover"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, #0B0F1A70 0%, transparent 50%, #0B0F1AD9 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <p
          ref={eyebrowRef}
          className="font-(family-name:--font-body) font-medium text-sm tracking-[0.2em] uppercase"
          style={{ color: "var(--color-gold)" }}
        >
          India&apos;s Premier Luxury Travel Experience
        </p>

        <h1
          ref={h1Ref}
          className="mt-4 font-(family-name:--font-display) text-5xl md:text-6xl lg:text-7xl font-light text-white leading-[1.05]"
        >
          Discover the World,
          <br />
          In Quiet Luxury
        </h1>

        <p
          ref={subRef}
          className="mt-6 font-(family-name:--font-body) text-lg max-w-xl mx-auto"
          style={{ color: "var(--color-white-muted)" }}
        >
          Curated packages. Expert guidance. Memories that last a lifetime.
        </p>

        <div ref={searchRef} className="mt-10 max-w-3xl mx-auto">
          <SearchBar variant="hero" />
        </div>

        <div
          ref={scrollRef}
          className="mt-16 flex flex-col items-center gap-2"
        >
          <ChevronDown
            size={24}
            className="animate-bounce"
            style={{ color: "var(--color-white-muted)" }}
          />
          <span
            className="text-xs font-(family-name:--font-body)"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Scroll to explore
          </span>
        </div>
      </div>
    </section>
  );
}
