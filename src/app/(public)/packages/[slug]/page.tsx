"use client";

import { use, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Users,
  Plane,
  Heart,
  ChevronRight,
  Check,
  X,
  Minus,
  Plus,
  MessageSquare,
  Sparkles,
} from "lucide-react";

import { dummyPackages } from "@/lib/dummy/packages";
import { dummyDestinations } from "@/lib/dummy/destinations";
import { dummyReviews } from "@/lib/dummy/reviews";
import { dummyDeals } from "@/lib/dummy/deals";
import { formatPrice, calculateGST, formatDate } from "@/lib/utils";

import { useWishlistStore } from "@/store/wishlistStore";

import { DetailPhotoGrid } from "@/components/shared/DetailPhotoGrid";
import { AttributeQualityBadges } from "@/components/shared/AttributeQualityBadges";
import { MultiPlatformRatings } from "@/components/shared/MultiPlatformRatings";
import { ReviewSummaryCards } from "@/components/shared/ReviewSummaryCards";
import { Rating } from "@/components/shared/Rating";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { MapEmbed } from "@/components/shared/MapEmbed";
import { ReviewForm } from "@/components/shared/ReviewForm";
import { HotelCard } from "@/components/cards/HotelCard";
import { ActivityCard } from "@/components/cards/ActivityCard";
import { ReviewCard } from "@/components/cards/ReviewCard";
import { PackageCard } from "@/components/cards/PackageCard";
import { Badge } from "@/components/shared/Badge";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";

// ─── Constants ────────────────────────────────────────────────────────────────

const DUMMY_RATINGS: Record<string, number> = {
  "pkg-bali": 4.8,
  "pkg-maldives": 4.9,
  "pkg-kerala": 4.6,
  "pkg-switzerland": 4.7,
  "pkg-santorini": 4.8,
  "pkg-dubai": 4.5,
  "pkg-rajasthan": 4.7,
  "pkg-singapore": 4.6,
};

const USER_MAP: Record<string, { name: string; avatarUrl?: string }> = {
  "user-001": { name: "Priya Sharma" },
  "user-002": { name: "Rohan Mehta" },
  "user-003": { name: "Ananya Patel" },
  "user-004": { name: "Vikram Nair" },
  "user-005": { name: "Sneha Iyer" },
  "user-006": { name: "Aditya Gupta" },
  "user-007": { name: "Kavya Reddy" },
  "user-008": { name: "Arjun Singh" },
};

const PROVIDERS = ["Headout", "Klook"] as const;

// ─── ProviderBookingCard ───────────────────────────────────────────────────────

function ProviderBookingCard({ activityName, index }: { activityName: string; index: number }) {
  const provider = PROVIDERS[index % PROVIDERS.length];
  return (
    // Phase 3A: replace href with real provider URL
    <div className="bg-(--color-navy-surface) rounded-xl p-4 border border-(--color-navy-border) mt-2 hover:border-(--color-gold)/30 transition-colors flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="font-sans text-xs text-(--color-text-secondary)">{provider}</span>
        <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-(--color-teal)/15 text-(--color-teal) border border-(--color-teal)/25">
          RECOMMENDED
        </span>
      </div>
      <a
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Book ${activityName} on ${provider}`}
        onClick={(e) => e.preventDefault()}
        className="flex items-center gap-1 font-sans text-xs font-medium text-(--color-gold) border border-(--color-gold)/40 px-2.5 py-1 rounded-lg hover:bg-(--color-gold)/10 hover:border-(--color-gold) transition-colors"
      >
        BOOK ↗
      </a>
    </div>
  );
}

// ─── RatingBarBreakdown ───────────────────────────────────────────────────────

function RatingBarBreakdown({ avgRating, total }: { avgRating: number; total: number }) {
  const bars = [
    { label: "5★", pct: 58 },
    { label: "4★", pct: 27 },
    { label: "3★", pct: 9 },
    { label: "2★", pct: 4 },
    { label: "1★", pct: 2 },
  ];
  return (
    <div className="bg-(--color-navy-surface) border border-(--color-navy-border) rounded-xl p-5 mb-6">
      <div className="flex items-center gap-6">
        <div className="text-center shrink-0">
          <p className="font-mono text-4xl font-semibold text-(--color-gold)">{avgRating.toFixed(1)}</p>
          <Rating rating={avgRating} size="sm" showCount={false} className="justify-center mt-1" />
          <p className="font-sans text-xs text-(--color-text-secondary) mt-1">{total} reviews</p>
        </div>
        <div className="flex-1 flex flex-col gap-1.5">
          {bars.map((b) => (
            <div key={b.label} className="flex items-center gap-2">
              <span className="font-mono text-xs text-(--color-text-secondary) w-5 shrink-0">{b.label}</span>
              <div className="flex-1 h-1.5 bg-(--color-navy-border) rounded-full overflow-hidden">
                <div
                  className="h-full bg-(--color-gold) rounded-full"
                  style={{ width: `${b.pct}%` }}
                />
              </div>
              <span className="font-mono text-xs text-(--color-text-secondary) w-7 text-right shrink-0">
                {b.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const pkg = dummyPackages.find((p) => p.slug === slug) ?? dummyPackages[0];
  const destination = dummyDestinations.find((d) => d.id === pkg.destinationId);
  const reviews = dummyReviews
    .filter((r) => r.packageId === pkg.id && r.isApproved)
    .map((r) => ({ ...r, user: USER_MAP[r.userId] ?? { name: "Traveller" } }));
  const similarPackages = dummyPackages
    .filter((p) => p.id !== pkg.id && p.status === "PUBLISHED")
    .slice(0, 3);

  const avgRating = DUMMY_RATINGS[pkg.id] ?? 4.5;

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const { toggle, has } = useWishlistStore();
  const isWishlisted = has(pkg.id);

  const searchParams = useSearchParams();
  const activeDeal = useMemo(() => {
    const dealId = searchParams.get("deal");
    if (!dealId) return null;
    return (
      dummyDeals.find(
        (d) => d.id === dealId && d.packageId === pkg.id && d.isActive,
      ) ?? null
    );
  }, [searchParams, pkg.id]);

  const effectivePrice = activeDeal
    ? Math.round(pkg.pricePerPerson * (1 - activeDeal.discountPct / 100))
    : pkg.pricePerPerson;
  const effectiveOriginalPrice = activeDeal
    ? pkg.pricePerPerson
    : pkg.originalPrice;

  const travelers = adults + children;
  const subtotal = effectivePrice * travelers;
  const { gst, total } = calculateGST(subtotal);

  // Highlights derived from first 4 itinerary days
  const highlights = pkg.itinerary.slice(0, 4).map((d) => d.title);

  const includedActivities = pkg.activities.filter((a) => a.included);
  const optionalActivities = pkg.activities.filter((a) => !a.included);

  return (
    <>
      {/* Deal banner */}
      {activeDeal && (
        <div className="bg-linear-to-r from-(--color-coral)/15 via-(--color-coral)/5 to-(--color-gold)/10 border-b border-(--color-coral)/30 py-3 text-center">
          <p className="font-sans text-sm text-(--color-white-muted)">
            <span className="text-(--color-coral) font-semibold">
              ⚡ {activeDeal.discountPct}% off
            </span>{" "}
            applied — deal expires in{" "}
            <span className="font-mono text-(--color-coral)">
              {Math.ceil(
                (activeDeal.expiresAt.getTime() - Date.now()) /
                  (1000 * 60 * 60 * 24),
              )}
              d
            </span>
          </p>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="border-b border-(--color-navy-border) bg-(--color-navy-surface)">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs font-sans text-(--color-text-secondary)">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight size={12} className="shrink-0" />
            <Link
              href="/packages"
              className="hover:text-white transition-colors"
            >
              Packages
            </Link>
            <ChevronRight size={12} className="shrink-0" />
            <span className="text-(--color-white-muted) truncate max-w-[200px]">
              {destination?.name ?? pkg.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 pb-24 lg:pb-12">
        <div className="flex gap-8 items-start">
          {/* ── Left Column ─────────────────────────────── */}
          <div className="flex-1 min-w-0 flex flex-col gap-0">
            {/* Detail Photo Grid */}
            <DetailPhotoGrid images={pkg.images} alt={pkg.title} priority />

            {/* Title block */}
            <div className="mt-8">
              {destination && (
                <div className="mb-3">
                  <Badge variant="teal" size="sm">
                    {destination.name}, {destination.country}
                  </Badge>
                </div>
              )}

              <h1 className="font-display text-3xl md:text-4xl font-light text-white mb-4">
                {pkg.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-4 text-sm text-(--color-text-secondary)">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-(--color-gold) shrink-0" />
                  {pkg.durationNights} nights
                </span>
                <span className="flex items-center gap-1.5">
                  <Users size={14} className="text-(--color-gold) shrink-0" />
                  {pkg.minGroupSize}–{pkg.maxGroupSize} pax
                </span>
                {pkg.includesFlights && (
                  <span className="flex items-center gap-1.5 text-(--color-teal)">
                    <Plane size={14} className="shrink-0" />
                    Flights included
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-4">
                <Rating
                  rating={avgRating}
                  reviewCount={reviews.length}
                  size="md"
                  showCount
                />
                <button
                  onClick={() => toggle(pkg.id)}
                  className="flex items-center gap-1.5 text-sm text-(--color-text-secondary) hover:text-white transition-colors"
                >
                  <Heart
                    size={18}
                    className={
                      isWishlisted
                        ? "fill-(--color-coral) text-(--color-coral)"
                        : ""
                    }
                  />
                  {isWishlisted ? "Saved" : "Save"}
                </button>
              </div>
            </div>

            {/* Attribute quality strip */}
            {pkg.attributes && pkg.attributes.length > 0 && (
              <AttributeQualityBadges attributes={pkg.attributes} className="mt-4" />
            )}

            {/* Multi-platform ratings row */}
            {pkg.platformRatings && pkg.platformRatings.length > 0 && (
              <MultiPlatformRatings ratings={pkg.platformRatings} className="mt-3" />
            )}

            {/* ── Tabs ─────────────────────────────────── */}
            <Tabs defaultValue="overview" className="mt-8">
              <TabsList
                variant="line"
                className="w-full border-b border-(--color-navy-border) rounded-none bg-transparent p-0 h-auto gap-0 flex"
              >
                {(
                  [
                    "overview",
                    "itinerary",
                    "hotels",
                    "activities",
                    "reviews",
                  ] as const
                ).map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="capitalize flex-1 px-3 py-3 rounded-none border-b-2 border-transparent bg-transparent text-(--color-text-secondary) hover:text-white transition-colors data-active:border-(--color-gold) data-active:text-(--color-gold) data-active:bg-transparent text-xs md:text-sm"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* ── Overview ── */}
              <TabsContent value="overview" className="mt-6 flex flex-col gap-6">
                {/* Highlights grid */}
                {highlights.length > 0 && (
                  <div>
                    <h3 className="font-display text-lg text-white mb-3 flex items-center gap-2">
                      <Sparkles size={16} className="text-(--color-gold)" />
                      Trip Highlights
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {highlights.map((h, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2.5 bg-(--color-navy-surface) border border-(--color-navy-border) rounded-xl px-4 py-3"
                        >
                          <span className="font-mono text-xs text-(--color-gold) bg-(--color-gold)/10 px-1.5 py-0.5 rounded shrink-0">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="font-sans text-sm text-(--color-white-muted) leading-snug">
                            {h}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <p className="font-sans text-(--color-white-muted) leading-relaxed">
                  {pkg.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-(--color-navy-surface) border border-(--color-navy-border) rounded-xl p-5">
                    <h3 className="font-display text-lg text-white mb-4">
                      What&apos;s Included
                    </h3>
                    <ul className="flex flex-col gap-2.5">
                      {pkg.inclusions.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-(--color-white-muted)"
                        >
                          <Check
                            size={14}
                            className="text-(--color-teal) shrink-0 mt-0.5"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-(--color-navy-surface) border border-(--color-navy-border) rounded-xl p-5">
                    <h3 className="font-display text-lg text-white mb-4">
                      Not Included
                    </h3>
                    <ul className="flex flex-col gap-2.5">
                      {pkg.exclusions.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-(--color-white-muted)"
                        >
                          <X
                            size={14}
                            className="text-(--color-coral) shrink-0 mt-0.5"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {pkg.cancellationPolicy &&
                  pkg.cancellationPolicy.length > 0 && (
                    <div className="bg-(--color-navy-surface) border border-(--color-navy-border) rounded-xl p-5">
                      <h3 className="font-display text-lg text-white mb-4">
                        Cancellation Policy
                      </h3>
                      <ul className="flex flex-col gap-3">
                        {pkg.cancellationPolicy.map((policy, i) => (
                          <li
                            key={i}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-(--color-white-muted)">
                              {policy.daysBeforeDeparture > 0
                                ? `${policy.daysBeforeDeparture}+ days before departure`
                                : "On departure day or no-show"}
                            </span>
                            <span
                              className={
                                policy.refundPercent > 0
                                  ? "font-mono text-(--color-teal)"
                                  : "font-mono text-(--color-coral)"
                              }
                            >
                              {policy.refundPercent}% refund
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Phase 3A: replace with Mapbox interactive map */}
                <MapEmbed
                  label={destination?.name ?? pkg.title}
                  height="h-64"
                />
              </TabsContent>

              {/* ── Itinerary ── */}
              <TabsContent value="itinerary" className="mt-6">
                <Accordion
                  type="multiple"
                  className="border border-(--color-navy-border) rounded-xl overflow-hidden bg-(--color-navy-surface)"
                >
                  {pkg.itinerary.map((day) => (
                    <AccordionItem
                      key={day.day}
                      value={`day-${day.day}`}
                      className="border-(--color-navy-border) px-5"
                    >
                      <AccordionTrigger className="py-4 hover:no-underline text-white">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-(--color-gold) bg-(--color-gold)/10 px-2 py-1 rounded-md w-14 text-center shrink-0">
                            Day {day.day}
                          </span>
                          <span className="font-display text-base font-normal text-white text-left">
                            {day.title}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-4 text-(--color-white-muted)">
                        <p className="text-sm leading-relaxed mb-3">
                          {day.description}
                        </p>
                        {day.meals && day.meals.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {day.meals.map((meal) => (
                              <span
                                key={meal}
                                className="text-xs font-mono bg-(--color-navy-border) text-(--color-white-muted) px-2 py-0.5 rounded"
                              >
                                {meal}
                              </span>
                            ))}
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>

              {/* ── Hotels ── */}
              <TabsContent value="hotels" className="mt-6">
                {pkg.hotels && pkg.hotels.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pkg.hotels.map((hotel) => (
                      <HotelCard key={hotel.name} hotel={hotel} />
                    ))}
                  </div>
                ) : (
                  <p className="py-10 text-center text-sm text-(--color-text-secondary)">
                    Hotel details not available for this package.
                  </p>
                )}
              </TabsContent>

              {/* ── Activities ── */}
              <TabsContent value="activities" className="mt-6 flex flex-col gap-8">
                {includedActivities.length > 0 && (
                  <div>
                    <h3 className="font-display text-lg text-white mb-4">
                      Included Activities
                    </h3>
                    <div className="flex flex-col gap-3">
                      {includedActivities.map((activity, i) => (
                        <div key={activity.name}>
                          <ActivityCard activity={activity} />
                          <ProviderBookingCard activityName={activity.name} index={i} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {optionalActivities.length > 0 && (
                  <div>
                    <h3 className="font-display text-lg text-white mb-4">
                      Optional Add-Ons
                    </h3>
                    <div className="flex flex-col gap-3">
                      {optionalActivities.map((activity, i) => (
                        <div key={activity.name}>
                          <ActivityCard activity={activity} />
                          <ProviderBookingCard
                            activityName={activity.name}
                            index={includedActivities.length + i}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {pkg.activities.length === 0 && (
                  <p className="py-10 text-center text-sm text-(--color-text-secondary)">
                    Activity details not available for this package.
                  </p>
                )}
              </TabsContent>

              {/* ── Reviews ── */}
              <TabsContent value="reviews" className="mt-6 flex flex-col gap-6">
                {/* Review summary cards */}
                {pkg.reviewSummary && (
                  <ReviewSummaryCards
                    loves={pkg.reviewSummary.loves}
                    dislikes={pkg.reviewSummary.dislikes}
                  />
                )}

                {/* Rating bar breakdown */}
                <RatingBarBreakdown avgRating={avgRating} total={reviews.length || 48} />

                {/* Review cards */}
                {reviews.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                ) : (
                  <p className="py-6 text-center text-sm text-(--color-text-secondary)">
                    No reviews yet for this package.
                  </p>
                )}

                <ReviewForm packageId={pkg.id} isEligible={false} />
              </TabsContent>
            </Tabs>

            {/* Similar packages */}
            {similarPackages.length > 0 && (
              <section className="mt-16">
                <h2 className="font-display text-2xl font-light text-white mb-6">
                  You May Also Like
                </h2>
                <div className="flex gap-5 overflow-x-auto pb-2">
                  {similarPackages.map((p) => (
                    <div key={p.id} className="w-72 shrink-0">
                      <PackageCard package={p} variant="compact" />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ── Right Column — Sticky Sidebar ───────────── */}
          <aside className="hidden lg:flex lg:flex-col w-80 xl:w-96 shrink-0 sticky top-24 gap-4">
            {/* Price card */}
            <div className="bg-(--color-navy-surface) border border-(--color-navy-border) rounded-xl p-6 flex flex-col gap-5">
              <div>
                <PriceDisplay
                  price={effectivePrice}
                  originalPrice={effectiveOriginalPrice}
                  size="lg"
                  showDiscount
                />
                <p className="font-sans text-xs text-(--color-text-secondary) mt-1">per person</p>
              </div>

              <Separator className="bg-(--color-navy-border)" />

              {/* Date picker */}
              <div>
                <p className="text-xs font-sans font-medium text-(--color-white-muted) uppercase tracking-widest mb-2">
                  Departure Date
                </p>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <button className="w-full flex items-center gap-2 bg-(--color-navy-border)/50 border border-(--color-navy-border) rounded-lg px-3 py-2.5 text-sm text-(--color-white-muted) hover:border-(--color-gold)/40 transition-colors">
                      <Calendar size={14} className="text-(--color-gold) shrink-0" />
                      <span className={date ? "text-white" : ""}>
                        {date ? formatDate(date) : "Select a date"}
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-(--color-navy-surface) border-(--color-navy-border)"
                    align="start"
                  >
                    <CalendarPicker
                      mode="single"
                      selected={date}
                      onSelect={(d) => {
                        setDate(d);
                        setCalendarOpen(false);
                      }}
                      disabled={(d) => d < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Travellers */}
              <div>
                <p className="text-xs font-sans font-medium text-(--color-white-muted) uppercase tracking-widest mb-3">
                  Travellers
                </p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white">Adults</p>
                      <p className="text-xs text-(--color-text-secondary)">Age 12+</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                        disabled={adults <= 1}
                        className="w-7 h-7 flex items-center justify-center rounded-full border border-(--color-navy-border) text-(--color-white-muted) hover:border-(--color-gold)/40 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="font-mono text-sm text-white w-4 text-center">
                        {adults}
                      </span>
                      <button
                        onClick={() =>
                          setAdults((prev) =>
                            Math.min(pkg.maxGroupSize - children, prev + 1),
                          )
                        }
                        disabled={adults + children >= pkg.maxGroupSize}
                        className="w-7 h-7 flex items-center justify-center rounded-full border border-(--color-navy-border) text-(--color-white-muted) hover:border-(--color-gold)/40 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white">Children</p>
                      <p className="text-xs text-(--color-text-secondary)">Age 2–11</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setChildren((prev) => Math.max(0, prev - 1))}
                        disabled={children <= 0}
                        className="w-7 h-7 flex items-center justify-center rounded-full border border-(--color-navy-border) text-(--color-white-muted) hover:border-(--color-gold)/40 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="font-mono text-sm text-white w-4 text-center">
                        {children}
                      </span>
                      <button
                        onClick={() =>
                          setChildren((prev) =>
                            Math.min(pkg.maxGroupSize - adults, prev + 1),
                          )
                        }
                        disabled={adults + children >= pkg.maxGroupSize}
                        className="w-7 h-7 flex items-center justify-center rounded-full border border-(--color-navy-border) text-(--color-white-muted) hover:border-(--color-gold)/40 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-(--color-navy-border)" />

              {/* Price breakdown */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-(--color-text-secondary)">
                    {formatPrice(effectivePrice)} × {travelers} traveller
                    {travelers !== 1 ? "s" : ""}
                  </span>
                  <span className="font-mono text-(--color-white-muted)">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-(--color-text-secondary)">+5% GST</span>
                  <span className="font-mono text-(--color-white-muted)">
                    {formatPrice(gst)}
                  </span>
                </div>
                <Separator className="bg-(--color-navy-border) my-1" />
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-white">
                    Estimated Total
                  </span>
                  <span className="font-mono font-semibold text-(--color-gold)">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <Link href={`/book/${pkg.id}`}>
                <Button className="w-full bg-(--color-coral) hover:bg-(--color-coral)/90 text-white font-sans font-medium h-11">
                  Submit Booking Request
                </Button>
              </Link>
            </div>

            {/* Quote card */}
            <div className="border border-(--color-navy-border) rounded-xl p-4 flex flex-col gap-3">
              <div>
                <p className="font-sans text-sm font-medium text-white">
                  Need a custom itinerary?
                </p>
                <p className="font-sans text-xs text-(--color-text-secondary) mt-0.5">
                  Personalise this trip for your dates and group.
                </p>
              </div>
              <button
                onClick={() => {
                  // Phase 1: console.log — Phase 3A: open custom quote Dialog
                  console.log("Get Custom Quote clicked for package:", pkg.id);
                }}
                className="flex items-center justify-center gap-1.5 w-full border border-(--color-gold)/40 text-(--color-gold) hover:bg-(--color-gold)/10 hover:border-(--color-gold) font-sans text-sm font-medium h-9 rounded-lg transition-colors"
              >
                <MessageSquare size={14} />
                Get Custom Quote →
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-(--color-navy-surface) border-t border-(--color-navy-border) px-4 py-3 flex items-center justify-between gap-4">
        <PriceDisplay
          price={effectivePrice}
          originalPrice={effectiveOriginalPrice}
          size="sm"
          prefix=""
          suffix="/ person"
          showDiscount={!!activeDeal}
        />
        <Link href={`/book/${pkg.id}`} className="shrink-0">
          <Button className="bg-(--color-coral) hover:bg-(--color-coral)/90 text-white font-sans font-medium text-sm h-10 px-4">
            Submit Booking Request
          </Button>
        </Link>
      </div>
    </>
  );
}
