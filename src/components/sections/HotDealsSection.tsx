"use client";

import { Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DealCard } from "@/components/cards/DealCard";
import { CountdownTimer } from "@/components/shared/CountdownTimer";
import { useDeals } from "@/hooks/api/useDeals";

export function HotDealsSection() {
  const { data, isError } = useDeals();
  const deals = (data?.data ?? []).slice(0, 3);

  if (isError) {
    return (
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <p
            className="font-(family-name:--font-body) text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Couldn&apos;t load today&apos;s deals. Please refresh the page.
          </p>
        </div>
      </section>
    );
  }

  if (deals.length === 0) return null;

  const globalExpiry = new Date(
    deals.reduce(
      (earliest, deal) =>
        deal.expiresAt < earliest ? deal.expiresAt : earliest,
      deals[0].expiresAt,
    ),
  );

  return (
    <section
      className="py-20 md:py-32"
      style={{
        backgroundColor:
          "color-mix(in srgb, var(--color-navy-surface) 40%, transparent)",
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
            <h2 className="font-(family-name:--font-display) text-4xl text-white">
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
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Button variant="outline-gold" className="font-sans" asChild>
            <Link href="/deals">See All Deals →</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
