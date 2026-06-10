"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { dummyTravelers } from "@/lib/dummy/travelers";

const DESKTOP_VISIBLE = 3;
const INTERVAL_MS = 4000;

export function TravelerCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const maxIndex = dummyTravelers.length - DESKTOP_VISIBLE;

  const next = useCallback(() => {
    setActiveIndex((i) => (i >= maxIndex ? 0 : i + 1));
  }, [maxIndex]);

  const prev = useCallback(() => {
    setActiveIndex((i) => (i <= 0 ? maxIndex : i - 1));
  }, [maxIndex]);

  useEffect(() => {
    if (isHovered) return;
    intervalRef.current = setInterval(next, INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, next]);

  const translateX = `translateX(calc(-${activeIndex} * (100% / ${DESKTOP_VISIBLE}) - ${activeIndex} * 24px / ${DESKTOP_VISIBLE}))`;

  return (
    <section className="py-20 md:py-32">
      {/* Header */}
      <div className="text-center mb-12 px-4">
        <p
          className="text-xs tracking-widest uppercase"
          style={{ fontFamily: "var(--font-body)", color: "var(--color-gold)" }}
        >
          Real Traveler Stories
        </p>
        <h2
          className="text-4xl md:text-5xl text-white mt-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Memories Made With RapidLuxe
        </h2>
      </div>

      {/* Carousel */}
      <div
        className="relative max-w-7xl mx-auto px-4 md:px-8 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Track */}
        <div
          className="flex transition-transform duration-500 ease-out gap-6"
          style={{ transform: translateX }}
        >
          {dummyTravelers.map((traveler) => (
            <div
              key={traveler.name}
              className="shrink-0 w-full md:w-[calc(33.333%-16px)] relative aspect-3/4 rounded-2xl overflow-hidden"
            >
              <Image
                src={traveler.imageUrl}
                alt={`${traveler.name} at ${traveler.destination}`}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-[#0B1120]/90 via-[#0B1120]/20 to-transparent" />
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p
                  className="text-xl text-white font-light"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {traveler.name}
                </p>
                <p
                  className="text-sm mt-1"
                  style={{ fontFamily: "var(--font-body)", color: "var(--color-gold)" }}
                >
                  📍 {traveler.destination}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Prev arrow */}
        <button
          onClick={prev}
          aria-label="Previous"
          className="hidden md:flex absolute left-10 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full items-center justify-center border transition-colors duration-200"
          style={{
            backgroundColor: "var(--color-navy-surface)",
            borderColor: "var(--color-navy-border)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-gold)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--color-navy-border)")}
        >
          <ChevronLeft size={18} className="text-white" />
        </button>

        {/* Next arrow */}
        <button
          onClick={next}
          aria-label="Next"
          className="hidden md:flex absolute right-10 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full items-center justify-center border transition-colors duration-200"
          style={{
            backgroundColor: "var(--color-navy-surface)",
            borderColor: "var(--color-navy-border)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-gold)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--color-navy-border)")}
        >
          <ChevronRight size={18} className="text-white" />
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === activeIndex ? "24px" : "8px",
              height: "8px",
              backgroundColor:
                i === activeIndex ? "var(--color-gold)" : "var(--color-navy-border)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
