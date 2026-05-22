"use client";

import Link from "next/link";
import { Zap } from "lucide-react";

import { dummyDeals } from "@/lib/dummy/deals";
import { dummyPackages } from "@/lib/dummy/packages";

import { DealCard } from "@/components/cards/DealCard";
import { CountdownTimer } from "@/components/shared/CountdownTimer";

const activeDeals = dummyDeals.filter((d) => d.isActive);

const globalExpiry = activeDeals.reduce<Date>(
  (earliest, deal) => (deal.expiresAt < earliest ? deal.expiresAt : earliest),
  activeDeals[0].expiresAt
);

const dealsWithPackages = activeDeals
  .slice(0, 3)
  .map((deal) => {
    const pkg = dummyPackages.find((p) => p.id === deal.packageId);
    return pkg ? { ...deal, package: pkg } : null;
  })
  .filter((d): d is NonNullable<typeof d> => d !== null);

export function HotDealsSection() {
  return (
    <section
      className="py-20 md:py-32"
      style={{
        backgroundColor: "color-mix(in srgb, var(--color-navy-surface) 40%, transparent)",
      }}
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-2">
            <Zap
              size={24}
              style={{ color: "var(--color-gold)", fill: "var(--color-gold)" }}
            />
            <h2
              className="font-(family-name:--font-display) text-4xl text-white"
            >
              Hot Deals &amp; Flash Sales
            </h2>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            <span
              className="font-(family-name:--font-body) text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Offers end in:
            </span>
            <CountdownTimer variant="blocks" expiresAt={globalExpiry} />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dealsWithPackages.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link href="/deals">
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
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              }}
            >
              See All Deals →
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
