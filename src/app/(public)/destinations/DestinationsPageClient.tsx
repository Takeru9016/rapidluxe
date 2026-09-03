"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

import { DestinationCard } from "@/components";
import { DestinationCardSkeleton } from "@/components/shared/Skeletons";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDestinations } from "@/hooks/api/useDestinations";

import type { Continent, Destination } from "@/types/destination";

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

const VALID_CONTINENTS = new Set<string>([
  "ASIA",
  "EUROPE",
  "AFRICA",
  "AMERICAS",
  "MIDDLE_EAST",
  "OCEANIA",
]);

function DestinationsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const continentParam = searchParams.get("continent") ?? "";
  const initialTab: FilterTab = VALID_CONTINENTS.has(continentParam)
    ? (continentParam as FilterTab)
    : "ALL";

  const [activeTab, setActiveTab] = useState<FilterTab>(initialTab);

  useEffect(() => {
    const param = searchParams.get("continent") ?? "";
    setActiveTab(VALID_CONTINENTS.has(param) ? (param as FilterTab) : "ALL");
  }, [searchParams]);

  function handleTabChange(v: string) {
    const next = v as FilterTab;
    setActiveTab(next);
    const params = new URLSearchParams(searchParams.toString());
    if (next === "ALL") params.delete("continent");
    else params.set("continent", next);
    const qs = params.toString();
    router.push(qs ? `/destinations?${qs}` : "/destinations", {
      scroll: false,
    });
  }

  const { data, isLoading } = useDestinations(
    activeTab === "ALL" ? undefined : (activeTab as Continent),
  );

  const destinations = data?.data ?? [];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <h2 className="font-display text-2xl md:text-3xl text-white mb-6">
        Browse by Region
      </h2>

      <div className="mb-16">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="flex w-full flex-wrap h-auto gap-3 bg-transparent p-0">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex-none rounded-full border border-(--color-gold)/30 px-5 py-2.5 text-sm font-sans font-medium text-(--color-white-muted) transition-all duration-200 cursor-pointer data-[state=active]:bg-(--color-gold) data-[state=active]:text-[#1B2A41] data-[state=active]:border-(--color-gold) data-[state=inactive]:hover:border-(--color-gold)/60 data-[state=inactive]:hover:text-white"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <DestinationCardSkeleton key={i} />
          ))}
        </div>
      ) : destinations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {destinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination as unknown as Destination}
              packageCount={destination._count.packages}
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
  );
}

function SeasonalDiscovery() {
  const { data } = useDestinations();
  const destinations = data?.data ?? [];

  const currentMonth = useMemo(
    () => new Date().toLocaleString("en-US", { month: "long" }),
    [],
  );

  const inSeason = destinations.filter((d) =>
    d.bestMonths?.includes(currentMonth),
  );

  if (inSeason.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 pb-12">
      <h2 className="font-display text-xl md:text-2xl text-white mb-1">
        Best Time to Go
      </h2>
      <p className="text-sm font-sans text-(--color-white-muted) mb-4">
        Destinations at their best this {currentMonth}.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {inSeason.map((d) => (
          <DestinationCard
            key={d.id}
            destination={d as unknown as Destination}
            packageCount={d._count.packages}
          />
        ))}
      </div>
    </section>
  );
}

export default function DestinationsPageClient() {
  return (
    <>
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
        <div className="absolute inset-0 bg-linear-to-b from-[#1B2A41]/40 via-[#1B2A41]/30 to-[#1B2A41]/80" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl lg:text-6xl text-white font-semibold tracking-wide leading-tight">
            Explore Destinations
          </h1>
          <p className="mt-3 text-base md:text-lg text-(--color-white-muted) font-sans max-w-xl">
            Discover the world&apos;s most extraordinary places, curated for the
            discerning traveller.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <Suspense fallback={null}>
        <DestinationsContent />
      </Suspense>

      {/* SEASONAL DISCOVERY */}
      <SeasonalDiscovery />
    </>
  );
}
