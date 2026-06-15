"use client";

import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { gsap } from "gsap";

export function Hero() {
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!prefersReduced) {
      gsap
        .timeline()
        .fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        )
        .fromTo(
          h1Ref.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.3",
        )
        .fromTo(
          subRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.4",
        )
        .fromTo(
          scrollRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.4 },
          "-=0.2",
        );
    }
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          preload="metadata"
          className="absolute inset-0 w-full h-full object-fill"
          poster="/hero-poster.jpg"
        >
          <source
            src={process.env.NEXT_PUBLIC_HERO_VIDEO_URL}
            type="video/mp4"
          />
        </video>
        {/* Base layer — consistent darkening over any video frame or theme */}
        <div className="absolute inset-0 bg-[#0B0F1A]/50" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, #0B0F1A80 0%, rgba(11,15,26,0.2) 45%, rgba(11,15,26,0.2) 55%, #0B0F1AE0 100%)",
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
          style={{ textShadow: "0 2px 24px rgba(11,15,26,0.6)" }}
        >
          Discover the World,
          <br />
          In Quiet Luxury
        </h1>

        <p
          ref={subRef}
          className="mt-6 font-(family-name:--font-body) text-lg max-w-xl mx-auto text-white/80"
          style={{ textShadow: "0 1px 12px rgba(11,15,26,0.5)" }}
        >
          Curated packages. Expert guidance. Memories that last a lifetime.
        </p>
      </div>

      {/* Scroll indicator — pinned to bottom of section */}
      <div
        ref={scrollRef}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <ChevronDown size={24} className="animate-bounce text-white/60" />
        <span className="text-xs font-(family-name:--font-body) text-white/50">
          Scroll to explore
        </span>
      </div>
    </section>
  );
}
