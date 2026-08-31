"use client";

import { useSiteContent } from "@/hooks/api/useSiteContent";

/**
 * Renders only real, Sanity-backed stats. No invented fallback values —
 * if none exist yet, this renders nothing rather than fabricate numbers.
 */
export function TrustBar() {
  const { data } = useSiteContent();
  const stats = data?.trustBarStats ?? [];

  if (stats.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x md:divide-(--color-navy-border) py-10 border-y border-(--color-navy-border)">
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
  );
}
