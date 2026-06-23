"use client";

import {
  AlertCircle,
  Bus,
  Car,
  CheckCircle,
  CreditCard,
  Footprints,
  Globe,
  Languages,
  Milestone,
  Ship,
  Stamp,
  ThumbsDown,
  ThumbsUp,
  Train,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import {
  ActivityCard,
  Badge,
  DetailPhotoGrid,
  PackageCard,
  UsefulLinks,
} from "@/components";
import { MapboxMap } from "@/components/shared/MapboxMap";
import { PortableTextBody } from "@/components/shared/PortableTextBody";
import { PackageCardSkeleton } from "@/components/shared/Skeletons";
import { useDestinationEditorial } from "@/hooks/api/useDestinationEditorial";
import {
  useDestination,
  useDestinationActivities,
  useDestinationWeather,
} from "@/hooks/api/useDestinations";
import { usePackages } from "@/hooks/api/usePackages";
import type {
  AvailabilityStatus,
  CrowdLevel,
  TransportType,
  VisaType,
  VisitRecommendation,
} from "@/types/destination";
import type { Activity } from "@/types/package";

// ─── Constants ────────────────────────────────────────────────────────────────

const VISA_LABELS: Record<VisaType, string> = {
  VISA_FREE: "Visa Free",
  VISA_ON_ARRIVAL: "Visa on Arrival",
  E_VISA: "e-Visa",
  VISA_REQUIRED: "Visa Required",
};

const CROWD_BADGE: Record<
  CrowdLevel,
  { variant: "teal" | "gold" | "coral"; label: string }
> = {
  LOW: { variant: "teal", label: "LOW" },
  MEDIUM: { variant: "gold", label: "MEDIUM" },
  HIGH: { variant: "coral", label: "HIGH" },
};

const TRANSPORT_ICONS: Record<
  TransportType,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  Bus: Bus,
  Metro: Train,
  Train: Train,
  Car: Car,
  Taxi: Car,
  Walking: Footprints,
  Shuttle: Bus,
  Ferry: Ship,
  "Cable Car": Milestone,
};

const ABOUT_PARAGRAPHS = (name: string) => [
  `${name} is one of the world's most sought-after destinations, offering an unparalleled blend of natural beauty, cultural richness, and luxurious experiences. From dramatic landscapes to vibrant local traditions, every corner reveals something extraordinary for the discerning traveller.`,
  `The region boasts a diverse tapestry of experiences — from ancient temples and historic palaces to pristine beaches and world-class dining. Local cuisine is a highlight, with flavours that have evolved over centuries of trade and cultural exchange, now enjoyed in settings ranging from humble street stalls to Michelin-starred restaurants.`,
  `Whether you seek adventure, relaxation, or cultural immersion, ${name} delivers with elegance. The best experiences here are often the quieter ones: a sunrise over misty mountains, an afternoon wandering through a centuries-old market, or a private boat ride through secluded waterways far from the crowds.`,
];

const TRAVEL_TIPS = [
  "Book accommodation and internal transfers at least 60 days in advance during peak season.",
  "Carry a mix of local currency and USD — ATMs may be sparse in rural areas.",
  "Purchase comprehensive travel insurance that covers medical evacuation before departure.",
  "Respect local customs and dress codes, especially at religious or heritage sites.",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function AvailabilityIcon({ status }: { status: AvailabilityStatus }) {
  if (status === "Open")
    return <CheckCircle size={16} className="text-(--color-teal) shrink-0" />;
  if (status === "Closed")
    return <XCircle size={16} className="text-(--color-coral) shrink-0" />;
  return <AlertCircle size={16} className="text-(--color-gold) shrink-0" />;
}

function RecommendationIcon({ value }: { value: VisitRecommendation }) {
  if (value === "Recommended")
    return <ThumbsUp size={16} className="text-(--color-teal) shrink-0" />;
  return <ThumbsDown size={16} className="text-(--color-coral) shrink-0" />;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DestinationDetailClient({ slug }: { slug: string }) {
  const [showAllMonths, setShowAllMonths] = useState(false);

  const { data: destData, isLoading: destLoading } = useDestination(slug);
  const { data: pkgsData, isLoading: pkgsLoading } = usePackages({
    destination: slug,
    limit: 50,
  });
  const { data: editorialData } = useDestinationEditorial(slug);
  const { data: weatherData } = useDestinationWeather(slug);
  const { data: activitiesData } = useDestinationActivities(slug);

  const editorial = editorialData?.data;
  const dest = destData?.data;
  const packages = pkgsData?.data ?? [];
  const liveActivities = activitiesData?.data ?? [];
  const fallbackActivities: Activity[] = packages
    .flatMap((p) => (p.activities as Activity[]) ?? [])
    .slice(0, 6);
  const monthlyWeather = weatherData?.data ?? [];

  const heroImageUrl = editorial?.featuredImage?.asset?.url ?? null;
  const images =
    dest?.images && dest.images.length > 0
      ? dest.images
      : heroImageUrl
        ? [heroImageUrl]
        : dest?.imageUrl
          ? [dest.imageUrl]
          : [];
  const allMonths = dest?.whenToVisit ?? [];
  const visibleMonths = showAllMonths ? allMonths : allMonths.slice(0, 6);

  if (destLoading) {
    return (
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-(--color-navy-surface) rounded-xl p-4 h-24 animate-pulse border border-(--color-navy-border)"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <PackageCardSkeleton key={i} />
          ))}
        </div>
      </main>
    );
  }

  if (!dest) {
    return (
      <main className="flex flex-col items-center justify-center py-32 text-center">
        <p className="font-display text-2xl text-white mb-2">
          Destination not found
        </p>
        <p className="font-sans text-sm text-(--color-text-secondary)">
          The destination you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
      </main>
    );
  }

  return (
    <main>
      {/* ── 1. DETAIL PHOTO GRID ──────────────────────────────────────────── */}
      {images.length > 0 ? (
        <DetailPhotoGrid images={images} alt={dest.name} priority />
      ) : (
        <div className="w-full h-64 md:h-[480px] bg-linear-to-br from-(--color-navy-surface) to-(--color-navy-border) flex items-center justify-center">
          <Globe className="w-12 h-12 text-(--color-gold)/30" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* ── 2. QUICK FACTS ────────────────────────────────────────────────── */}
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
                {dest.visaType ? VISA_LABELS[dest.visaType as VisaType] : "—"}
              </p>
            </div>
          </div>
        </section>

        {/* ── 3. ABOUT ──────────────────────────────────────────────────────── */}
        <section className="py-12 border-t border-(--color-navy-border)">
          <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white mb-8">
            About {dest.name}
          </h2>
          {editorial?.about?.length ? (
            <PortableTextBody
              value={editorial.about}
              className="space-y-5 max-w-3xl"
            />
          ) : (
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
          )}
        </section>

        {/* ── 4. PACKAGES ───────────────────────────────────────────────────── */}
        <section className="py-12 border-t border-(--color-navy-border)">
          <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white mb-8">
            Packages to {dest.name}
          </h2>
          {pkgsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <PackageCardSkeleton key={i} />
              ))}
            </div>
          ) : packages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <PackageCard key={pkg.id} package={pkg} />
              ))}
            </div>
          ) : null}
        </section>

        {/* ── 5. THINGS TO DO ───────────────────────────────────────────────── */}
        {(liveActivities.length > 0 || fallbackActivities.length > 0) && (
          <section className="py-12 border-t border-(--color-navy-border)">
            <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white mb-8">
              Things To Do in {dest.name}
            </h2>
            {liveActivities.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {liveActivities.map((act, i) => (
                  <div
                    key={i}
                    className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) overflow-hidden hover:border-(--color-gold)/30 transition-colors"
                  >
                    {act.imageUrl && (
                      <div className="h-40 bg-(--color-navy-border)/40 relative overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={act.imageUrl}
                          alt={act.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <p className="font-sans font-medium text-white mb-1 line-clamp-2">
                        {act.name}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-mono text-xs text-(--color-gold)">
                          ★ {act.rating.toFixed(1)}
                        </span>
                        {act.price > 0 && (
                          <span className="font-sans text-xs text-(--color-white-muted)">
                            From {act.currency} {act.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fallbackActivities.map((activity, i) => (
                  <ActivityCard key={i} activity={activity} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── 6. WHEN TO VISIT TABLE ────────────────────────────────────────── */}
        {allMonths.length > 0 && (
          <section className="py-12 border-t border-(--color-navy-border)">
            <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white mb-2">
              When to visit
            </h2>
            <p className="font-sans text-sm text-(--color-text-secondary) mb-8">
              We&apos;ve analysed crowd patterns to identify the best months.
            </p>

            <div className="overflow-x-auto rounded-xl border border-(--color-navy-border)">
              <table className="w-full">
                <thead>
                  <tr className="bg-(--color-navy-border)/30">
                    <th className="font-sans text-xs text-(--color-text-secondary) uppercase tracking-wide px-4 py-3 text-left">
                      Month
                    </th>
                    <th className="font-sans text-xs text-(--color-text-secondary) uppercase tracking-wide px-4 py-3 text-left">
                      Crowd Level
                    </th>
                    <th className="font-sans text-xs text-(--color-text-secondary) uppercase tracking-wide px-4 py-3 text-left hidden md:table-cell">
                      Weather
                    </th>
                    {monthlyWeather.length > 0 && (
                      <th className="font-sans text-xs text-(--color-text-secondary) uppercase tracking-wide px-4 py-3 text-left hidden lg:table-cell">
                        Temp
                      </th>
                    )}
                    <th className="font-sans text-xs text-(--color-text-secondary) uppercase tracking-wide px-4 py-3 text-left">
                      Availability
                    </th>
                    <th className="font-sans text-xs text-(--color-text-secondary) uppercase tracking-wide px-4 py-3 text-left">
                      Our Recommendation
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleMonths.map((row) => (
                    <tr
                      key={row.month}
                      className="border-b border-(--color-navy-border) hover:bg-white/5 transition-colors"
                    >
                      <td className="font-sans font-medium text-white px-4 py-4 whitespace-nowrap">
                        {row.month}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={[
                            "font-mono text-xs px-2 py-0.5 rounded-full",
                            row.crowdLevel === "LOW" &&
                              "bg-(--color-teal)/20 text-(--color-teal) border border-(--color-teal)/30",
                            row.crowdLevel === "MEDIUM" &&
                              "bg-(--color-gold)/20 text-(--color-gold) border border-(--color-gold)/30",
                            row.crowdLevel === "HIGH" &&
                              "bg-(--color-coral)/20 text-(--color-coral) border border-(--color-coral)/30",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          {row.crowdLevel &&
                          CROWD_BADGE[row.crowdLevel as CrowdLevel]
                            ? CROWD_BADGE[row.crowdLevel as CrowdLevel].label
                            : "—"}
                        </span>
                      </td>
                      <td className="font-sans text-sm text-(--color-white-muted) px-4 py-4 hidden md:table-cell max-w-xs">
                        {row.weather}
                      </td>
                      {monthlyWeather.length > 0 &&
                        (() => {
                          const w = monthlyWeather.find(
                            (m) => m.month === row.month,
                          );
                          return (
                            <td className="font-mono text-xs text-(--color-gold) px-4 py-4 hidden lg:table-cell whitespace-nowrap">
                              {w ? `${w.temp}°C` : "—"}
                            </td>
                          );
                        })()}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <AvailabilityIcon
                            status={row.availability as AvailabilityStatus}
                          />
                          <span className="font-sans text-sm text-(--color-white-muted)">
                            {row.availability}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <RecommendationIcon
                            value={row.recommendation as VisitRecommendation}
                          />
                          <span className="font-sans text-sm text-(--color-white-muted) hidden sm:inline">
                            {row.recommendation}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {allMonths.length > 6 && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setShowAllMonths((v) => !v)}
                  className="font-sans text-sm text-(--color-gold) hover:text-(--color-gold-light) transition-colors bg-transparent border-0 cursor-pointer"
                >
                  {showAllMonths
                    ? "Show fewer ↑"
                    : `Show all ${allMonths.length} months ↓`}
                </button>
              </div>
            )}
          </section>
        )}

        {/* ── 7. HOW TO GET THERE ───────────────────────────────────────────── */}
        {dest.howToGetThere && dest.howToGetThere.length > 0 && (
          <section className="py-12 border-t border-(--color-navy-border)">
            <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white mb-8">
              How to get there
            </h2>
            <div className="max-w-3xl space-y-0">
              {dest.howToGetThere.map((option) => {
                const Icon = TRANSPORT_ICONS[option.type as TransportType];
                return (
                  <div
                    key={option.name}
                    className="flex items-start gap-4 py-4 border-b border-(--color-navy-border) last:border-0"
                  >
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-(--color-navy-surface) border border-(--color-navy-border) flex items-center justify-center">
                      {Icon && (
                        <Icon size={20} className="text-(--color-gold)" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-sans font-medium text-white">
                          {option.name}
                        </span>
                        {option.isRecommended && (
                          <Badge variant="teal" size="sm">
                            Recommended
                          </Badge>
                        )}
                      </div>
                      <p className="font-sans text-sm text-(--color-white-muted) leading-relaxed">
                        {option.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── 8. TRAVEL TIPS ────────────────────────────────────────────────── */}
        <section className="py-12 border-t border-(--color-navy-border)">
          <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white mb-8">
            Travel Tips
          </h2>
          {editorial?.travelTips?.length ? (
            <PortableTextBody
              value={editorial.travelTips}
              className="space-y-4 max-w-2xl"
            />
          ) : (
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
          )}
        </section>

        {/* ── 9. MAP ────────────────────────────────────────────────────────── */}
        <section className="py-8 border-t border-(--color-navy-border)">
          <MapboxMap lat={dest.lat} lng={dest.lng} zoom={10} className="h-96" />
        </section>

        {/* ── 10. TRAVEL ESSENTIALS ─────────────────────────────────────────── */}
        <UsefulLinks />
      </div>
    </main>
  );
}
