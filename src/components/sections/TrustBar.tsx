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
    <section
      className="border-y py-8"
      style={{
        backgroundColor:
          "color-mix(in srgb, var(--color-navy-surface) 60%, transparent)",
        borderColor: "var(--color-navy-border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex overflow-x-auto gap-8 pb-2 md:grid md:grid-cols-4 md:overflow-visible md:pb-0">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col md:flex-row items-center gap-3 shrink-0"
            >
              <div className="flex flex-col items-center md:items-start">
                <span
                  className="font-mono text-xl font-bold"
                  style={{ color: "var(--color-gold)" }}
                >
                  {stat.number}
                </span>
                <span
                  className="text-sm"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--color-white-muted)",
                  }}
                >
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
