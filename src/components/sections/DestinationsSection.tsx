"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { dummyDestinations } from "@/lib/dummy/destinations";

import { DestinationCard } from "@/components/cards/DestinationCard";

gsap.registerPlugin(ScrollTrigger);

export function DestinationsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !headerRef.current) return;

    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 80%",
          once: true,
        },
      }
    );
  }, []);

  function scroll(direction: "prev" | "next") {
    scrollRef.current?.scrollBy({
      left: direction === "next" ? 300 : -300,
      behavior: "smooth",
    });
  }

  return (
    <section className="py-20 md:py-32">
      {/* Header */}
      <div
        ref={headerRef}
        className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-end mb-10"
      >
        <div>
          <p
            className="font-[family-name:var(--font-body)] text-sm tracking-widest uppercase"
            style={{ color: "var(--color-gold)" }}
          >
            Top Destinations
          </p>
          <h2
            className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-white mt-2"
          >
            Explore the World
          </h2>
        </div>

        {/* Desktop arrows */}
        <div className="hidden md:flex gap-2">
          {(["prev", "next"] as const).map((dir) => {
            const Icon = dir === "prev" ? ChevronLeft : ChevronRight;
            return (
              <button
                key={dir}
                onClick={() => scroll(dir)}
                aria-label={dir === "prev" ? "Scroll left" : "Scroll right"}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                style={{
                  border: "1px solid var(--color-navy-border)",
                  color: "var(--color-white-muted)",
                }}
                onMouseEnter={(e) => {
                  const btn = e.currentTarget;
                  btn.style.color = "var(--color-gold)";
                  btn.style.borderColor = "var(--color-gold)";
                }}
                onMouseLeave={(e) => {
                  const btn = e.currentTarget;
                  btn.style.color = "var(--color-white-muted)";
                  btn.style.borderColor = "var(--color-navy-border)";
                }}
              >
                <Icon size={18} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile: stacked grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 gap-6 md:hidden">
        {dummyDestinations.map((dest) => (
          <DestinationCard key={dest.id} destination={dest} />
        ))}
      </div>

      {/* Desktop: horizontal scroll */}
      <div
        ref={scrollRef}
        className="hidden md:flex gap-6 max-w-7xl mx-auto px-4 md:px-8 overflow-x-auto pb-4 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {dummyDestinations.map((dest) => (
          <div key={dest.id} className="flex-shrink-0 w-72">
            <DestinationCard destination={dest} />
          </div>
        ))}
      </div>
    </section>
  );
}
