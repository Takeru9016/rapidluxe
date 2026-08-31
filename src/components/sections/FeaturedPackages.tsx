"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { PackageCard } from "@/components/cards/PackageCard";
import { PackageCardSkeleton } from "@/components/shared/Skeletons";
import { Button } from "@/components/ui/button";
import type { ApiPackage } from "@/hooks/api/usePackages";
import { usePackages } from "@/hooks/api/usePackages";

gsap.registerPlugin(ScrollTrigger);

export function FeaturedPackages() {
  const gridRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const { data, isLoading } = usePackages({ sort: "featured", limit: 6 });
  const packages: ApiPackage[] = data?.data ?? [];

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced || !sectionRef.current) return;

    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      },
    );
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced || !gridRef.current) return;

    const cards = gridRef.current.querySelectorAll<HTMLElement>(":scope > *");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" },
    );
  }, [packages]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="featured-journeys-heading"
      className="py-20 md:py-32"
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 text-center mb-12">
        <p
          className="font-sans text-sm tracking-widest uppercase"
          style={{ color: "var(--color-gold)" }}
        >
          Featured Journeys
        </p>
        <h2
          id="featured-journeys-heading"
          className="font-(family-name:--font-display) text-4xl md:text-5xl text-white mt-2"
        >
          Curated for Rest, Reconnection &amp; Celebration
        </h2>
        <p
          className="font-sans text-sm mt-4 max-w-xl mx-auto"
          style={{ color: "var(--color-text-secondary)" }}
        >
          A handpicked selection, chosen by our travel experts rather than an
          algorithm.
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <PackageCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} package={pkg} variant="default" />
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <Button variant="outline-gold" className="font-sans" asChild>
          <Link href="/packages">View All Journeys →</Link>
        </Button>
      </div>
    </section>
  );
}
