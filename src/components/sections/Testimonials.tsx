"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import type { TestimonialItem } from "@/app/api/content/testimonials/route";

const INTERVAL_MS = 5000;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          fill={i < rating ? "var(--color-gold)" : "none"}
          style={{
            color:
              i < rating ? "var(--color-gold)" : "var(--color-navy-border)",
          }}
        />
      ))}
    </div>
  );
}

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data, isLoading } = useQuery<{ data: TestimonialItem[] }>({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const res = await fetch("/api/content/testimonials");
      if (!res.ok) throw new Error("Failed");
      return res.json() as Promise<{ data: TestimonialItem[] }>;
    },
    staleTime: 1000 * 60 * 60,
  });

  const testimonials = data?.data ?? [];
  const count = testimonials.length;

  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % Math.max(count, 1));
  }, [count]);

  const prev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + Math.max(count, 1)) % Math.max(count, 1));
  }, [count]);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (isHovered || count < 2 || prefersReduced) return;
    intervalRef.current = setInterval(next, INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, next, count]);

  if (isLoading || count === 0) return null;

  const current = testimonials[activeIndex];

  return (
    <>
      <div
        className="max-w-3xl mx-auto px-4 md:px-8"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative bg-(--color-navy-surface) border border-(--color-navy-border) rounded-2xl p-8 md:p-12 text-center">
          {/* Quote mark */}
          <span
            className="text-7xl leading-none select-none"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-gold)",
              opacity: 0.3,
            }}
          >
            &ldquo;
          </span>

          <StarRating rating={current.rating} />

          <blockquote
            className="mt-4 text-xl md:text-2xl text-white font-light leading-relaxed"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {current.quote}
          </blockquote>

          <div className="mt-6 flex flex-col items-center gap-1">
            <p className="font-sans font-semibold text-white text-sm">
              {current.clientName}
            </p>
            {current.clientTitle && (
              <p className="font-sans text-xs text-(--color-text-secondary)">
                {current.clientTitle}
              </p>
            )}
            {current.destination && (
              <p
                className="font-sans text-xs mt-1"
                style={{ color: "var(--color-gold)" }}
              >
                📍 {current.destination}
                {current.tripDate ? ` · ${current.tripDate}` : ""}
              </p>
            )}
          </div>

          {/* Nav arrows */}
          {count > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous testimonial"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center border border-(--color-navy-border) text-(--color-white-muted) hover:border-(--color-gold) hover:text-(--color-gold) transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={next}
                aria-label="Next testimonial"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center border border-(--color-navy-border) text-(--color-white-muted) hover:border-(--color-gold) hover:text-(--color-gold) transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        {count > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === activeIndex ? "24px" : "8px",
                  height: "8px",
                  backgroundColor:
                    i === activeIndex
                      ? "var(--color-gold)"
                      : "var(--color-navy-border)",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
