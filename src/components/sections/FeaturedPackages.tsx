"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { usePackages } from "@/hooks/api/usePackages";
import type { ApiPackage } from "@/hooks/api/usePackages";

import { PackageCard } from "@/components/cards/PackageCard";
import { PackageCardSkeleton } from "@/components/shared/Skeletons";

import type { Package } from "@/types/package";

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
    <section ref={sectionRef} className="py-20 md:py-32">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 text-center mb-12">
        <p
          className="font-(family-name:--font-body) text-sm tracking-widest uppercase"
          style={{ color: "var(--color-gold)" }}
        >
          Featured Packages
        </p>
        <h2 className="font-(family-name:--font-display) text-4xl md:text-5xl text-white mt-2">
          Handpicked Journeys for You
        </h2>
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
              <PackageCard
                key={pkg.id}
                package={pkg as unknown as Package}
                variant="default"
              />
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <Link href="/packages">
          <button
            className="font-(family-name:--font-body) font-medium text-sm px-8 py-3 rounded-lg transition-colors cursor-pointer"
            style={{
              border: "1px solid var(--color-gold)",
              color: "var(--color-gold)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "color-mix(in srgb, var(--color-gold) 10%, transparent)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "transparent";
            }}
          >
            View All Packages →
          </button>
        </Link>
      </div>
    </section>
  );
}
