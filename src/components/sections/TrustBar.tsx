"use client";

import { useSiteContent } from "@/hooks/api/useSiteContent";

const FALLBACK_STATS = [
  { number: "27", label: "Countries Explored" },
  { number: "500+", label: "Happy Travellers" },
  { number: "100%", label: "Bespoke Journeys" },
  { number: "2hrs", label: "Response Time" },
];

export function TrustBar() {
  const { data } = useSiteContent();
  const stats = data?.trustBarStats?.length
    ? data.trustBarStats
    : FALLBACK_STATS;

  return (
    <section className="border-y py-12 bg-(--color-navy-surface) border-(--color-navy-border)">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x md:divide-(--color-navy-border)">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-2 md:px-8"
            >
              <span
                className="font-mono text-4xl font-bold"
                style={{ color: "var(--color-gold)" }}
              >
                {stat.number}
              </span>
              <span
                className="font-sans text-sm uppercase tracking-wider text-center"
                style={{ color: "var(--color-white-muted)" }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
