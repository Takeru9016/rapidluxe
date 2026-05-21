"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { dummyPackages } from "@/lib/dummy/packages";
import { PackageCard } from "@/components/cards/PackageCard";
import type { Package } from "@/types/package";

gsap.registerPlugin(ScrollTrigger);

type Tab = "Trending" | "Luxury" | "Budget";

const TABS: Tab[] = ["Trending", "Luxury", "Budget"];

function filterPackages(tab: Tab): Package[] {
  if (tab === "Luxury") {
    return dummyPackages.filter((p) => p.tags.includes("Luxury"));
  }
  if (tab === "Budget") {
    return dummyPackages.filter((p) => p.pricePerPerson < 100000);
  }
  return [...dummyPackages].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
}

export function FeaturedPackages() {
  const [activeTab, setActiveTab] = useState<Tab>("Trending");
  const [packages, setPackages] = useState<Package[]>(() => filterPackages("Trending"));
  const gridRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
      }
    );
  }, []);

  useEffect(() => {
    const filtered = filterPackages(activeTab);
    setPackages(filtered);

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !gridRef.current) return;

    const cards = gridRef.current.querySelectorAll<HTMLElement>(":scope > *");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
    );
  }, [activeTab]);

  return (
    <section ref={sectionRef} className="py-20 md:py-32">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 text-center mb-12">
        <p
          className="font-[family-name:var(--font-body)] text-sm tracking-widest uppercase"
          style={{ color: "var(--color-gold)" }}
        >
          Featured Packages
        </p>

        <h2
          className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-white mt-2"
        >
          Handpicked Journeys for You
        </h2>

        {/* Tabs */}
        <div className="mt-8 flex gap-2 justify-center">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="font-[family-name:var(--font-body)] font-medium text-sm px-5 py-2 rounded-full transition-colors cursor-pointer"
              style={
                activeTab === tab
                  ? {
                      backgroundColor: "var(--color-gold)",
                      color: "var(--color-navy)",
                    }
                  : {
                      border: "1px solid var(--color-navy-border)",
                      color: "var(--color-white-muted)",
                    }
              }
              onMouseEnter={(e) => {
                if (activeTab !== tab) {
                  (e.currentTarget as HTMLButtonElement).style.color = "white";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab) {
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "var(--color-white-muted)";
                }
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} package={pkg} variant="default" />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <Link href="/packages">
          <button
            className="font-[family-name:var(--font-body)] font-medium text-sm px-8 py-3 rounded-lg transition-colors cursor-pointer"
            style={{
              border: "1px solid var(--color-gold)",
              color: "var(--color-gold)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "color-mix(in srgb, var(--color-gold) 10%, transparent)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
            }}
          >
            View All Packages →
          </button>
        </Link>
      </div>
    </section>
  );
}
