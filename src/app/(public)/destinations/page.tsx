"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { dummyDestinations } from "@/lib/dummy/destinations";

import type { Continent } from "@/types/destination";

import { DestinationCard } from "@/components";

type FilterTab = "ALL" | Continent;

const TABS: { label: string; value: FilterTab }[] = [
  { label: "All", value: "ALL" },
  { label: "Asia", value: "ASIA" },
  { label: "Europe", value: "EUROPE" },
  { label: "Africa", value: "AFRICA" },
  { label: "Americas", value: "AMERICAS" },
  { label: "Middle East", value: "MIDDLE_EAST" },
  { label: "Oceania", value: "OCEANIA" },
];

const PACKAGE_COUNT_BY_DESTINATION: Record<string, number> = {
  "dest-bali": 4,
  "dest-maldives": 3,
  "dest-kerala": 5,
  "dest-switzerland": 2,
  "dest-santorini": 2,
  "dest-dubai": 6,
  "dest-rajasthan": 3,
  "dest-singapore": 2,
};

const VALID_CONTINENTS = new Set<string>(["ASIA", "EUROPE", "AFRICA", "AMERICAS", "MIDDLE_EAST", "OCEANIA"]);

export default function DestinationsPage() {
  const searchParams = useSearchParams();
  const continentParam = searchParams.get("continent") ?? "";
  const initialTab: FilterTab = VALID_CONTINENTS.has(continentParam)
    ? (continentParam as FilterTab)
    : "ALL";

  const [activeTab, setActiveTab] = useState<FilterTab>(initialTab);

  useEffect(() => {
    const param = searchParams.get("continent") ?? "";
    setActiveTab(VALID_CONTINENTS.has(param) ? (param as FilterTab) : "ALL");
  }, [searchParams]);

  const filtered =
    activeTab === "ALL"
      ? dummyDestinations
      : dummyDestinations.filter((d) => d.continent === activeTab);

  return (
    <>
      <main>
        {/* HERO */}
        <section className="relative h-64 md:h-80 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&auto=format&fit=crop&q=80"
            alt="Explore destinations — mountain landscape"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-b from-[#0B0F1A]/40 via-[#0B0F1A]/30 to-[#0B0F1A]/80" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl lg:text-6xl text-white font-semibold tracking-wide leading-tight">
              Explore Destinations
            </h1>
            <p className="mt-3 text-base md:text-lg text-(--color-white-muted) font-sans max-w-xl">
              Discover the world&apos;s most extraordinary places, curated for
              the discerning traveller.
            </p>
          </div>
        </section>

        {/* CONTENT */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          {/* CONTINENT FILTER */}
          <div className="mb-10">
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as FilterTab)}
            >
              <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent p-0">
                {TABS.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="rounded-full border border-(--color-gold)/30 px-5 py-2 text-sm font-sans font-medium text-(--color-white-muted) transition-all duration-200 cursor-pointer data-[state=active]:bg-(--color-gold) data-[state=active]:text-(--color-navy) data-[state=active]:border-(--color-gold) data-[state=inactive]:hover:border-(--color-gold)/60 data-[state=inactive]:hover:text-white"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* GRID */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map((destination) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  packageCount={PACKAGE_COUNT_BY_DESTINATION[destination.id] ?? 2}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="font-['Cormorant_Garamond'] text-2xl text-(--color-white-muted)">
                No destinations in this region yet.
              </p>
              <p className="mt-2 text-sm font-sans text-(--color-white-muted)/60">
                We&apos;re constantly expanding. Check back soon.
              </p>
            </div>
          )}
        </section>
      </main>

    </>
  );
}
