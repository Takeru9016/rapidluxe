"use client";

import { use } from "react";
import Image from "next/image";
import { Globe, CreditCard, Languages, Stamp } from "lucide-react";

import { dummyDestinations } from "@/lib/dummy/destinations";
import { dummyPackages } from "@/lib/dummy/packages";

import type { Activity } from "@/types/package";
import type { VisaType } from "@/types/destination";

import { ActivityCard, MapEmbed, PackageCard } from "@/components";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const VISA_LABELS: Record<VisaType, string> = {
  VISA_FREE: "Visa Free",
  VISA_ON_ARRIVAL: "Visa on Arrival",
  E_VISA: "e-Visa",
  VISA_REQUIRED: "Visa Required",
};

const WEATHER_DATA: { month: string; high: number; low: number; rain: number }[] =
  [
    { month: "Jan", high: 30, low: 22, rain: 45 },
    { month: "Feb", high: 31, low: 23, rain: 30 },
    { month: "Mar", high: 33, low: 24, rain: 35 },
    { month: "Apr", high: 34, low: 25, rain: 55 },
    { month: "May", high: 33, low: 25, rain: 120 },
    { month: "Jun", high: 31, low: 24, rain: 160 },
    { month: "Jul", high: 29, low: 23, rain: 180 },
    { month: "Aug", high: 29, low: 23, rain: 170 },
    { month: "Sep", high: 30, low: 23, rain: 140 },
    { month: "Oct", high: 31, low: 23, rain: 105 },
    { month: "Nov", high: 31, low: 23, rain: 75 },
    { month: "Dec", high: 30, low: 22, rain: 55 },
  ];

const TRAVEL_TIPS = [
  "Book accommodation and internal transfers at least 60 days in advance during peak season.",
  "Carry a mix of local currency and USD — ATMs may be sparse in rural areas.",
  "Purchase comprehensive travel insurance that covers medical evacuation before departure.",
  "Respect local customs and dress codes, especially at religious or heritage sites.",
];

const ABOUT_PARAGRAPHS = (name: string) => [
  `${name} is one of the world's most sought-after destinations, offering an unparalleled blend of natural beauty, cultural richness, and luxurious experiences. From dramatic landscapes to vibrant local traditions, every corner reveals something extraordinary for the discerning traveller.`,
  `The region boasts a diverse tapestry of experiences — from ancient temples and historic palaces to pristine beaches and world-class dining. Local cuisine is a highlight, with flavours that have evolved over centuries of trade and cultural exchange, now enjoyed in settings ranging from humble street stalls to Michelin-starred restaurants.`,
  `Whether you seek adventure, relaxation, or cultural immersion, ${name} delivers with elegance. The best experiences here are often the quieter ones: a sunrise over misty mountains, an afternoon wandering through a centuries-old market, or a private boat ride through secluded waterways far from the crowds.`,
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const dest =
    dummyDestinations.find((d) => d.slug === slug) ?? dummyDestinations[0];

  const packages = dummyPackages.filter((p) => p.destinationId === dest.id);

  const activities: Activity[] = packages
    .flatMap((p) => p.activities ?? [])
    .slice(0, 6);

  return (
    <>
      <main>
        {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
        <section className="relative min-h-[60vh] overflow-hidden">
          {dest.imageUrl ? (
            <Image
              src={dest.imageUrl}
              alt={dest.name}
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-[#0B0F1A]" />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-[#0B0F1A]/90 via-[#0B0F1A]/30 to-[#0B0F1A]/20" />

          <div className="absolute bottom-0 left-0 px-6 md:px-12 pb-10">
            <p className="font-sans text-sm md:text-base text-(--color-gold) tracking-widest uppercase mb-2">
              {dest.continent.replace("_", " ")}
            </p>
            <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl lg:text-7xl text-white font-semibold leading-none">
              {dest.name}
            </h1>
            <p className="mt-2 font-sans text-base md:text-lg text-(--color-white-muted)">
              {dest.country}
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* ── 2. QUICK FACTS ──────────────────────────────────────────────── */}
          <section className="py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-(--color-navy-surface) rounded-xl p-4 text-center border border-(--color-navy-border)">
                <Globe size={20} className="mx-auto mb-2 text-(--color-gold)" />
                <p className="font-sans text-xs text-(--color-text-secondary) uppercase tracking-wider mb-1">
                  Best Time
                </p>
                <p className="font-['Cormorant_Garamond'] text-lg text-white">
                  {dest.bestTimeFrom && dest.bestTimeTo
                    ? `${dest.bestTimeFrom} – ${dest.bestTimeTo}`
                    : "Year-round"}
                </p>
              </div>

              <div className="bg-(--color-navy-surface) rounded-xl p-4 text-center border border-(--color-navy-border)">
                <CreditCard
                  size={20}
                  className="mx-auto mb-2 text-(--color-gold)"
                />
                <p className="font-sans text-xs text-(--color-text-secondary) uppercase tracking-wider mb-1">
                  Currency
                </p>
                <p className="font-['Cormorant_Garamond'] text-lg text-white">
                  {dest.currency ?? "—"}
                </p>
              </div>

              <div className="bg-(--color-navy-surface) rounded-xl p-4 text-center border border-(--color-navy-border)">
                <Languages
                  size={20}
                  className="mx-auto mb-2 text-(--color-gold)"
                />
                <p className="font-sans text-xs text-(--color-text-secondary) uppercase tracking-wider mb-1">
                  Language
                </p>
                <p className="font-['Cormorant_Garamond'] text-lg text-white leading-tight">
                  {dest.language ?? "—"}
                </p>
              </div>

              <div className="bg-(--color-navy-surface) rounded-xl p-4 text-center border border-(--color-navy-border)">
                <Stamp size={20} className="mx-auto mb-2 text-(--color-gold)" />
                <p className="font-sans text-xs text-(--color-text-secondary) uppercase tracking-wider mb-1">
                  Visa for Indians
                </p>
                <p className="font-['Cormorant_Garamond'] text-lg text-white">
                  {dest.visaType ? VISA_LABELS[dest.visaType] : "—"}
                </p>
              </div>
            </div>
          </section>

          {/* ── 3. ABOUT ─────────────────────────────────────────────────────── */}
          <section className="py-12 border-t border-(--color-navy-border)">
            <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white mb-8">
              About {dest.name}
            </h2>
            {/* Phase 2E: replace with Sanity Portable Text content */}
            <div className="space-y-5 max-w-3xl">
              {ABOUT_PARAGRAPHS(dest.name).map((para, i) => (
                <p
                  key={i}
                  className="font-sans text-base text-(--color-white-muted) leading-relaxed"
                >
                  {para}
                </p>
              ))}
            </div>
          </section>

          {/* ── 4. PACKAGES ──────────────────────────────────────────────────── */}
          {packages.length > 0 && (
            <section className="py-12 border-t border-(--color-navy-border)">
              <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white mb-8">
                Packages to {dest.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                  <PackageCard key={pkg.id} package={pkg} />
                ))}
              </div>
            </section>
          )}

          {/* ── 5. THINGS TO DO ──────────────────────────────────────────────── */}
          {activities.length > 0 && (
            <section className="py-12 border-t border-(--color-navy-border)">
              <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white mb-8">
                Things To Do in {dest.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activities.map((activity, i) => (
                  <ActivityCard key={i} activity={activity} />
                ))}
              </div>
            </section>
          )}

          {/* ── 6. WEATHER ───────────────────────────────────────────────────── */}
          <section className="py-12 border-t border-(--color-navy-border)">
            <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white mb-8">
              Weather in {dest.name}
            </h2>
            <div className="overflow-x-auto rounded-xl border border-(--color-navy-border)">
              <table className="w-full text-sm font-sans">
                <thead>
                  <tr className="bg-(--color-navy-surface) border-b border-(--color-navy-border)">
                    <th className="px-4 py-3 text-left text-(--color-text-secondary) font-medium">
                      Month
                    </th>
                    <th className="px-4 py-3 text-center text-(--color-text-secondary) font-medium">
                      High (°C)
                    </th>
                    <th className="px-4 py-3 text-center text-(--color-text-secondary) font-medium">
                      Low (°C)
                    </th>
                    <th className="px-4 py-3 text-center text-(--color-text-secondary) font-medium">
                      Rainfall (mm)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {WEATHER_DATA.map((row, i) => (
                    <tr
                      key={row.month}
                      className={
                        i % 2 === 0
                          ? "bg-[#0B0F1A]"
                          : "bg-(--color-navy-surface)"
                      }
                    >
                      <td className="px-4 py-3 text-white font-medium">
                        {row.month}
                      </td>
                      <td className="px-4 py-3 text-center text-(--color-white-muted)">
                        {row.high}°
                      </td>
                      <td className="px-4 py-3 text-center text-(--color-white-muted)">
                        {row.low}°
                      </td>
                      <td className="px-4 py-3 text-center font-['JetBrains_Mono'] text-(--color-text-secondary)">
                        {row.rain}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── 7. MAP ───────────────────────────────────────────────────────── */}
          <section className="py-8 border-t border-(--color-navy-border)">
            <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white mb-6">
              Map
            </h2>
            <MapEmbed label={dest.name} height="h-96" />
          </section>

          {/* ── 8. TRAVEL TIPS ───────────────────────────────────────────────── */}
          <section className="py-12 border-t border-(--color-navy-border)">
            <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white mb-8">
              Travel Tips
            </h2>
            {/* Phase 2E: replace with Sanity content */}
            <ul className="space-y-4 max-w-2xl">
              {TRAVEL_TIPS.map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1 shrink-0 w-5 h-5 rounded-full bg-(--color-gold)/15 border border-(--color-gold)/40 flex items-center justify-center">
                    <span className="font-['JetBrains_Mono'] text-xs text-(--color-gold)">
                      {i + 1}
                    </span>
                  </span>
                  <p className="font-sans text-base text-(--color-white-muted) leading-relaxed">
                    {tip}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </>
  );
}
