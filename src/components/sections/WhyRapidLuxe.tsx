"use client";

import { Sparkles, Heart, Globe, Shield, type LucideIcon } from "lucide-react";

import { useSiteContent } from "@/hooks/api/useSiteContent";

const ICON_MAP: Record<string, LucideIcon> = { Sparkles, Heart, Globe, Shield };

function CardSkeleton() {
  return (
    <div className="rounded-2xl p-6 border animate-pulse bg-(--color-navy-surface) border-(--color-navy-border)">
      <div className="h-7 w-7 rounded mb-5 mt-4 bg-(--color-navy-border)" />
      <div className="h-6 w-3/4 rounded mb-3 bg-(--color-navy-border)" />
      <div className="space-y-2">
        <div className="h-4 rounded bg-(--color-navy-border)" />
        <div className="h-4 w-5/6 rounded bg-(--color-navy-border)" />
      </div>
    </div>
  );
}

export function WhyRapidLuxe() {
  const { data, isLoading } = useSiteContent();
  const points = data?.whyRapidluxePoints ?? [];

  if (!isLoading && points.length === 0) return null;

  return (
    <section className="py-20 md:py-32">
      <div className="text-center mb-16 px-4">
        <p
          className="text-xs tracking-widest uppercase"
          style={{ fontFamily: "var(--font-body)", color: "var(--color-gold)" }}
        >
          The RapidLuxe Difference
        </p>
        <h2
          className="text-4xl md:text-5xl text-white mt-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Why Travel With Us
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
            : points.map((point) => {
                const Icon = ICON_MAP[point.icon] ?? Sparkles;
                return (
                  <div
                    key={point.title}
                    className="relative rounded-2xl p-6 border overflow-hidden bg-(--color-navy-surface) border-(--color-navy-border)"
                  >
                    <div
                      className="absolute top-0 left-6 right-6 h-[3px] rounded-b-full"
                      style={{ backgroundColor: "var(--color-gold)" }}
                    />
                    <Icon
                      size={28}
                      className="mt-4 mb-5"
                      style={{ color: "var(--color-gold)" }}
                    />
                    <h3
                      className="text-xl text-white mb-3"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {point.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        fontFamily: "var(--font-body)",
                        color: "var(--color-white-muted)",
                      }}
                    >
                      {point.description}
                    </p>
                  </div>
                );
              })}
        </div>
      </div>
    </section>
  );
}
