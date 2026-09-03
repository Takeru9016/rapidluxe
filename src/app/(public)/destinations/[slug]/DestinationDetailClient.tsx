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
import Image from "next/image";
import Link from "next/link";
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
import { describeWeather } from "@/lib/whenToVisit";
import type {
  AvailabilityStatus,
  TransportType,
  VisaType,
  VisitRecommendation,
} from "@/types/destination";
import type { Activity } from "@/types/package";

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const VISA_LABELS: Record<VisaType, string> = {
  VISA_FREE: "Visa Free",
  VISA_ON_ARRIVAL: "Visa on Arrival",
  E_VISA: "e-Visa",
  VISA_REQUIRED: "Visa Required",
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

const TRAVEL_TIPS = [
  "Book accommodation and internal transfers at least 60 days in advance during peak season.",
  "Carry a mix of local currency and USD — ATMs may be sparse in rural areas.",
  "Purchase comprehensive travel insurance that covers medical evacuation before departure.",
  "Respect local customs and dress codes, especially at religious or heritage sites.",
];

interface VisitRow {
  month: string;
  weather?: { temp: number; rainfall: number };
  availability?: AvailabilityStatus;
  recommendation?: VisitRecommendation;
}

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
  const hasWhenToVisitData =
    monthlyWeather.length > 0 || (dest?.whenToVisit?.length ?? 0) > 0;
  const allMonths: VisitRow[] = hasWhenToVisitData
    ? MONTHS.map((month) => {
        const stored = dest?.whenToVisit?.find((m) => m.month === month) as
          | {
              crowdLevel?: string;
              availability?: string;
              recommendation?: string;
              recommended?: boolean;
            }
          | undefined;
        const w = monthlyWeather.find((m) => m.month === month);
        const availability =
          stored?.availability && stored.availability !== ""
            ? (stored.availability as AvailabilityStatus)
            : undefined;
        const recommendation: VisitRecommendation | undefined =
          stored?.recommendation === "Recommended" ||
          stored?.recommendation === "Not recommended"
            ? stored.recommendation
            : stored?.recommended === true
              ? "Recommended"
              : undefined;
        return { month, weather: w, availability, recommendation };
      })
    : [];
  const visibleMonths = showAllMonths ? allMonths : allMonths.slice(0, 6);
  const hasAnyAvailability = allMonths.some((m) => m.availability);
  const hasAnyRecommendation = allMonths.some((m) => m.recommendation);
  const bestTimeLabel =
    dest?.bestMonths && dest.bestMonths.length > 0
      ? dest.bestMonths.length === 1
        ? dest.bestMonths[0]
        : `${dest.bestMonths[0]}–${dest.bestMonths[dest.bestMonths.length - 1]}`
      : "Year-round";

  if (destLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
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
      </div>
    );
  }

  if (!dest) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="font-display text-2xl text-(--color-white) mb-2">
          Destination not found
        </p>
        <p className="font-sans text-sm text-(--color-text-secondary)">
          The destination you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* ── 1. DETAIL PHOTO GRID ──────────────────────────────────────────── */}
      {images.length > 0 ? (
        <DetailPhotoGrid images={images} alt={dest.name} priority />
      ) : (
        <div className="w-full h-64 md:h-[480px] bg-linear-to-br from-(--color-navy-surface) to-(--color-navy-border) flex items-center justify-center">
          <Globe className="w-12 h-12 text-(--color-gold)/30" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* ── 0. BREADCRUMB + H1 ────────────────────────────────────────────── */}
        <div className="pt-6 md:pt-8">
          <nav aria-label="Breadcrumb" className="mb-3">
            <ol className="flex items-center gap-2 text-sm font-sans text-(--color-text-secondary)">
              <li>
                <Link
                  href="/destinations"
                  className="hover:text-white transition-colors"
                >
                  Destinations
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-(--color-white)">
                {dest.name}
              </li>
            </ol>
          </nav>
          <h1 className="font-display text-3xl md:text-5xl text-(--color-white)">
            {dest.name}
          </h1>
          {dest.country && (
            <p className="mt-1 text-sm font-sans text-(--color-text-secondary)">
              {dest.country}
            </p>
          )}
        </div>

        {/* ── 2. QUICK FACTS ────────────────────────────────────────────────── */}
        <section className="py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-(--color-navy-surface) rounded-xl p-4 text-center border border-(--color-navy-border)">
              <Globe size={20} className="mx-auto mb-2 text-(--color-gold)" />
              <p className="font-sans text-xs text-(--color-text-secondary) uppercase tracking-wider mb-1">
                Best Time
              </p>
              <p className="font-['Cormorant_Garamond'] text-lg text-(--color-white)">
                {bestTimeLabel}
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
              <p className="font-['Cormorant_Garamond'] text-lg text-(--color-white)">
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
              <p className="font-['Cormorant_Garamond'] text-lg text-(--color-white) leading-tight">
                {dest.language ?? "—"}
              </p>
            </div>

            <div className="bg-(--color-navy-surface) rounded-xl p-4 text-center border border-(--color-navy-border)">
              <Stamp size={20} className="mx-auto mb-2 text-(--color-gold)" />
              <p className="font-sans text-xs text-(--color-text-secondary) uppercase tracking-wider mb-1">
                Visa for Indians
              </p>
              <p className="font-['Cormorant_Garamond'] text-lg text-(--color-white)">
                {dest.visaType ? VISA_LABELS[dest.visaType as VisaType] : "—"}
              </p>
            </div>
          </div>
        </section>

        {/* ── 3. ABOUT ──────────────────────────────────────────────────────── */}
        <section className="py-12 border-t border-(--color-navy-border)">
          <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-(--color-white) mb-8">
            About {dest.name}
          </h2>
          {editorial?.about?.length ? (
            <PortableTextBody
              value={editorial.about}
              className="space-y-5 max-w-3xl"
            />
          ) : (
            <p className="text-sm font-sans text-(--color-text-secondary) italic">
              Editorial coverage for {dest.name} is coming soon.
            </p>
          )}
        </section>

        {/* ── 4. PACKAGES ───────────────────────────────────────────────────── */}
        <section className="py-12 border-t border-(--color-navy-border)">
          <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-(--color-white) mb-8">
            Journeys to {dest.name}
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
            <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-(--color-white) mb-8">
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
                        <Image
                          src={act.imageUrl}
                          alt={act.name}
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <p className="font-sans font-medium text-(--color-white) mb-1 line-clamp-2">
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
            <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-(--color-white) mb-2">
              When to visit
            </h2>
            <p className="font-sans text-sm text-(--color-text-secondary) mb-8">
              Monthly weather at a glance.
            </p>

            <div className="overflow-x-auto rounded-xl border border-(--color-navy-border)">
              <table className="w-full">
                <thead>
                  <tr className="bg-(--color-navy-border)/30">
                    <th className="font-sans text-xs text-(--color-text-secondary) uppercase tracking-wide px-4 py-3 text-left">
                      Month
                    </th>
                    <th className="font-sans text-xs text-(--color-text-secondary) uppercase tracking-wide px-4 py-3 text-left hidden md:table-cell">
                      Weather
                    </th>
                    {monthlyWeather.length > 0 && (
                      <th className="font-sans text-xs text-(--color-text-secondary) uppercase tracking-wide px-4 py-3 text-left hidden lg:table-cell">
                        Temp
                      </th>
                    )}
                    {hasAnyAvailability && (
                      <th className="font-sans text-xs text-(--color-text-secondary) uppercase tracking-wide px-4 py-3 text-left">
                        Availability
                      </th>
                    )}
                    {hasAnyRecommendation && (
                      <th className="font-sans text-xs text-(--color-text-secondary) uppercase tracking-wide px-4 py-3 text-left">
                        Our Recommendation
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {visibleMonths.map((row) => (
                    <tr
                      key={row.month}
                      className="border-b border-(--color-navy-border) hover:bg-white/5 transition-colors"
                    >
                      <td className="font-sans font-medium text-(--color-white) px-4 py-4 whitespace-nowrap">
                        {row.month}
                      </td>
                      <td className="font-sans text-sm text-(--color-white-muted) px-4 py-4 hidden md:table-cell max-w-xs">
                        {row.weather
                          ? describeWeather(
                              row.weather.temp,
                              row.weather.rainfall,
                            )
                          : "—"}
                      </td>
                      {monthlyWeather.length > 0 && (
                        <td className="font-mono text-xs text-(--color-gold) px-4 py-4 hidden lg:table-cell whitespace-nowrap">
                          {row.weather ? `${row.weather.temp}°C` : "—"}
                        </td>
                      )}
                      {hasAnyAvailability && (
                        <td className="px-4 py-4">
                          {row.availability && (
                            <div className="flex items-center gap-1.5">
                              <AvailabilityIcon status={row.availability} />
                              <span className="font-sans text-sm text-(--color-white-muted)">
                                {row.availability}
                              </span>
                            </div>
                          )}
                        </td>
                      )}
                      {hasAnyRecommendation && (
                        <td className="px-4 py-4">
                          {row.recommendation && (
                            <div className="flex items-center gap-1.5">
                              <RecommendationIcon value={row.recommendation} />
                              <span className="font-sans text-sm text-(--color-white-muted) hidden sm:inline">
                                {row.recommendation}
                              </span>
                            </div>
                          )}
                        </td>
                      )}
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
            <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-(--color-white) mb-8">
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
                        <span className="font-sans font-medium text-(--color-white)">
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
          <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-(--color-white) mb-8">
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
    </div>
  );
}
