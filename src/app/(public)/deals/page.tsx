"use client";

import { useMemo } from "react";
import { Zap, Bird, Clock } from "lucide-react";

import { dummyDeals } from "@/lib/dummy/deals";
import { dummyPackages } from "@/lib/dummy/packages";

import type { Deal } from "@/types/deal";
import type { Package } from "@/types/package";

import { DealCard } from "@/components/cards/DealCard";
import { CountdownTimer } from "@/components/shared/CountdownTimer";

type EnrichedDeal = Deal & { package: Package };

function enrichDeals(type: Deal["type"]): EnrichedDeal[] {
  return dummyDeals
    .filter((d) => d.type === type && d.isActive)
    .map((d) => {
      const pkg = dummyPackages.find((p) => p.id === d.packageId);
      if (!pkg) return null;
      return { ...d, package: pkg };
    })
    .filter((d): d is EnrichedDeal => d !== null);
}

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  deals: EnrichedDeal[];
  bg?: string;
}

function DealsSection({ icon, title, deals, bg }: SectionProps) {
  if (deals.length === 0) return null;

  return (
    <section className={bg}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-(--color-gold)">{icon}</span>
          <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white">
            {title}
          </h2>
          <span className="ml-2 inline-flex items-center justify-center w-7 h-7 rounded-full bg-(--color-coral)/15 text-(--color-coral) text-xs font-sans font-semibold">
            {deals.length}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function DealsPage() {
  const flashDeals = useMemo(() => enrichDeals("FLASH_SALE"), []);
  const earlyBirdDeals = useMemo(() => enrichDeals("EARLY_BIRD"), []);
  const lastMinuteDeals = useMemo(() => enrichDeals("LAST_MINUTE"), []);

  const earliest = useMemo(() => {
    const all = [...flashDeals, ...earlyBirdDeals, ...lastMinuteDeals];
    if (all.length === 0) return new Date(Date.now() + 24 * 60 * 60 * 1000);
    return all.reduce(
      (min, d) => (d.expiresAt < min ? d.expiresAt : min),
      all[0].expiresAt,
    );
  }, [flashDeals, earlyBirdDeals, lastMinuteDeals]);

  return (
    <main className="min-h-screen bg-(--color-navy)">
      {/* Banner */}
      <div className="py-16 bg-linear-to-r from-(--color-coral)/10 via-transparent to-(--color-gold)/10 border-y border-(--color-coral)/20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-['Cormorant_Garamond'] text-4xl md:text-6xl text-white mb-6">
            ⚡ Flash Sales &amp; Limited Offers
          </h1>
          <p className="font-sans text-(--color-text-secondary) mb-8">
            Deals end in:
          </p>
          <div className="flex justify-center">
            <CountdownTimer variant="blocks" expiresAt={earliest} />
          </div>
        </div>
      </div>

      {/* Flash Sales */}
      <DealsSection
        icon={<Zap size={24} />}
        title="Flash Sales"
        deals={flashDeals}
      />

      {/* Early Bird */}
      <DealsSection
        icon={<Bird size={24} />}
        title="Early Bird Deals"
        deals={earlyBirdDeals}
        bg="bg-(--color-navy-surface)"
      />

      {/* Last Minute */}
      <DealsSection
        icon={<Clock size={24} />}
        title="Last Minute Deals"
        deals={lastMinuteDeals}
      />
    </main>
  );
}
