"use client";

import {
  Calendar,
  Check,
  ChevronRight,
  Heart,
  MessageSquare,
  Plane,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { ActivityCard } from "@/components/cards/ActivityCard";
import { HotelCard } from "@/components/cards/HotelCard";
import { PackageCard } from "@/components/cards/PackageCard";
import { ReviewCard } from "@/components/cards/ReviewCard";
import { AttributeQualityBadges } from "@/components/shared/AttributeQualityBadges";
import { Badge } from "@/components/shared/Badge";
import { DetailPhotoGrid } from "@/components/shared/DetailPhotoGrid";
import { MapboxMap } from "@/components/shared/MapboxMap";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { Rating } from "@/components/shared/Rating";
import { ReviewForm } from "@/components/shared/ReviewForm";
import { PackageDetailSkeleton } from "@/components/shared/Skeletons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDeals } from "@/hooks/api/useDeals";
import {
  usePackage,
  usePackageHotels,
  usePackages,
} from "@/hooks/api/usePackages";
import { useCheckEligibility, useReviews } from "@/hooks/api/useReviews";
import { formatPrice } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlistStore";

// ─── RatingBarBreakdown ───────────────────────────────────────────────────────

function RatingBarBreakdown({
  reviews,
  avgRating,
  total,
}: {
  reviews: { rating: number }[];
  avgRating: number;
  total: number;
}) {
  const bars = [5, 4, 3, 2, 1].map((star) => ({
    label: `${star}★`,
    pct: Math.round(
      (reviews.filter((r) => Math.round(r.rating) === star).length /
        reviews.length) *
        100,
    ),
  }));
  return (
    <div className="bg-(--color-navy-surface) border border-(--color-navy-border) rounded-xl p-5 mb-6">
      <div className="flex items-center gap-6">
        <div className="text-center shrink-0">
          <p className="font-mono text-4xl font-semibold text-(--color-gold)">
            {avgRating.toFixed(1)}
          </p>
          <Rating
            rating={avgRating}
            size="sm"
            showCount={false}
            className="justify-center mt-1"
          />
          <p className="font-sans text-xs text-(--color-text-secondary) mt-1">
            {total} reviews
          </p>
        </div>
        <div className="flex-1 flex flex-col gap-1.5">
          {bars.map((b) => (
            <div key={b.label} className="flex items-center gap-2">
              <span className="font-mono text-xs text-(--color-text-secondary) w-5 shrink-0">
                {b.label}
              </span>
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

// ─── Component ────────────────────────────────────────────────────────────────

export function PackageDetailClient({ slug }: { slug: string }) {
  const { data: pkgData, isLoading } = usePackage(slug);
  const { data: similarData } = usePackages({ limit: 6, sort: "featured" });
  const { data: liveHotelsData } = usePackageHotels(slug);
  const { data: dealsData } = useDeals();

  const pkg = pkgData?.data;
  const destination = pkg?.destination ?? null;
  const liveHotels = liveHotelsData?.data ?? [];

  const { data: reviewsData, isLoading: reviewsLoading } = useReviews(
    pkg?.id ?? "",
  );
  const { data: eligibilityData } = useCheckEligibility(pkg?.id ?? "");

  const reviews = (reviewsData?.data ?? []).map((r) => ({
    ...r,
    createdAt: new Date(r.createdAt),
    user: { name: r.user.name ?? "Traveller" },
  }));
  const isEligible = eligibilityData?.eligible ?? false;

  const similarPackages = (similarData?.data ?? [])
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const { toggle, has } = useWishlistStore();
  const isWishlisted = pkg ? has(pkg.id) : false;

  const searchParams = useSearchParams();
  const deals = dealsData?.data ?? [];
  const activeDeal = useMemo(() => {
    if (!pkg) return null;
    const dealId = searchParams.get("deal");
    if (!dealId) return null;
    return deals.find((d) => d.id === dealId && d.packageId === pkg.id) ?? null;
  }, [searchParams, pkg, deals]);

  if (isLoading) return <PackageDetailSkeleton />;

  if (!pkg) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="font-display text-2xl text-white mb-2">
          Package not found
        </p>
        <p className="font-sans text-sm text-(--color-text-secondary) mb-6">
          The package you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Link href="/packages">
          <Button
            variant="outline"
            className="border-(--color-gold) text-(--color-gold)"
          >
            View all packages
          </Button>
        </Link>
      </div>
    );
  }

  const effectivePrice = activeDeal
    ? Math.round(pkg.pricePerPerson * (1 - activeDeal.discountPct / 100))
    : pkg.pricePerPerson;
  const effectiveOriginalPrice = activeDeal
    ? pkg.pricePerPerson
    : pkg.originalPrice;

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
                (new Date(activeDeal.expiresAt).getTime() - Date.now()) /
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
            <Link
              href="/"
              className="hover:text-white transition-colors"
            >
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
                  <Calendar
                    size={14}
                    className="text-(--color-gold) shrink-0"
                  />
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
                {reviews.length > 0 ? (
                  <Rating
                    rating={avgRating}
                    reviewCount={reviews.length}
                    size="md"
                    showCount
                  />
                ) : (
                  <span className="font-sans text-sm text-(--color-text-secondary)">
                    No reviews yet
                  </span>
                )}
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
              <AttributeQualityBadges
                attributes={pkg.attributes}
                className="mt-4"
              />
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
              <TabsContent
                value="overview"
                className="mt-6 flex flex-col gap-6"
              >
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

                <MapboxMap
                  lat={destination?.lat}
                  lng={destination?.lng}
                  zoom={9}
                  className="h-64"
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
                {liveHotels.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {liveHotels.map((hotel) => (
                      <div
                        key={hotel.name}
                        className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) overflow-hidden hover:border-(--color-gold)/30 transition-colors"
                      >
                        {hotel.imageUrl && (
                          <div className="h-40 bg-(--color-navy-border)/40 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={hotel.imageUrl}
                              alt={hotel.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="font-sans font-medium text-white leading-snug">
                              {hotel.name}
                            </p>
                            <span className="font-mono text-xs text-(--color-gold) shrink-0">
                              ★ {hotel.rating.toFixed(1)}
                            </span>
                          </div>
                          <p className="font-sans text-xs text-(--color-text-secondary) mb-2">
                            {hotel.location} ·{" "}
                            {"★".repeat(Math.min(hotel.stars, 5))}
                          </p>
                          {hotel.price > 0 && (
                            <p className="font-sans text-sm text-(--color-white-muted)">
                              ₹{hotel.price.toLocaleString("en-IN")} / night
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : pkg.hotels && pkg.hotels.length > 0 ? (
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
              <TabsContent
                value="activities"
                className="mt-6 flex flex-col gap-8"
              >
                {includedActivities.length > 0 && (
                  <div>
                    <h3 className="font-display text-lg text-white mb-4">
                      Included Activities
                    </h3>
                    <div className="flex flex-col gap-3">
                      {includedActivities.map((activity) => (
                        <ActivityCard key={activity.name} activity={activity} />
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
                      {optionalActivities.map((activity) => (
                        <ActivityCard key={activity.name} activity={activity} />
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
                {/* Rating bar breakdown */}
                {reviews.length > 0 && (
                  <RatingBarBreakdown
                    reviews={reviews}
                    avgRating={avgRating}
                    total={reviewsData?.pagination.total ?? 0}
                  />
                )}

                {/* Review cards */}
                {reviewsLoading ? (
                  <div className="flex flex-col gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-(--color-navy-surface) rounded-xl p-6 border border-(--color-navy-border) animate-pulse"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-10 w-10 rounded-full bg-(--color-navy-border)" />
                          <div className="h-4 w-32 rounded bg-(--color-navy-border)" />
                        </div>
                        <div className="h-3 w-24 rounded bg-(--color-navy-border) mb-3" />
                        <div className="space-y-2">
                          <div className="h-3 w-full rounded bg-(--color-navy-border)" />
                          <div className="h-3 w-4/5 rounded bg-(--color-navy-border)" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : reviews.length > 0 ? (
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

                <ReviewForm packageId={pkg.id} isEligible={isEligible} />
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
            {/* Price Guide card */}
            <div className="bg-(--color-navy-surface) border border-(--color-navy-border) rounded-xl p-6 flex flex-col gap-5">
              <div>
                <h3 className="font-display text-2xl text-white leading-tight">
                  Price Guide
                </h3>
                <div className="h-px bg-(--color-gold) mt-3" />
              </div>

              {/* Adults */}
              <div>
                <p className="font-sans text-xs uppercase tracking-wider text-(--color-text-secondary)">
                  Adults (12+ years)
                </p>
                <p className="font-mono text-3xl text-(--color-gold) mt-1">
                  From {formatPrice(effectivePrice)}
                </p>
                <p className="font-sans text-xs text-(--color-text-secondary) mt-0.5">
                  per person
                </p>
              </div>

              {/* Children */}
              {pkg.childPrice != null && (
                <div>
                  <p className="font-sans text-xs uppercase tracking-wider text-(--color-text-secondary)">
                    Children (Age 2–11)
                  </p>
                  <p className="font-mono text-xl text-white mt-1">
                    {formatPrice(pkg.childPrice)}
                  </p>
                  <p className="font-sans text-xs text-(--color-text-secondary) mt-0.5">
                    per child
                  </p>
                </div>
              )}

              {/* Infants */}
              {pkg.infantPrice != null && (
                <div>
                  <p className="font-sans text-xs uppercase tracking-wider text-(--color-text-secondary)">
                    Infants (Under 2)
                  </p>
                  {pkg.infantPrice === 0 ? (
                    <div className="flex items-center gap-2 mt-1">
                      <p className="font-sans text-sm text-white">
                        Infants (under 2) travel free
                      </p>
                      <span className="font-sans text-xs font-medium uppercase tracking-wide text-(--color-teal) bg-(--color-teal)/10 px-2 py-0.5 rounded">
                        Free
                      </span>
                    </div>
                  ) : (
                    <p className="font-mono text-xl text-white mt-1">
                      {formatPrice(pkg.infantPrice)}{" "}
                      <span className="font-sans text-xs text-(--color-text-secondary)">
                        per infant
                      </span>
                    </p>
                  )}
                </div>
              )}

              {/* Tours & Transfers */}
              {pkg.toursPrice != null && (
                <div>
                  <Separator className="bg-(--color-navy-border) mb-4" />
                  <p className="font-sans text-xs uppercase tracking-wider text-(--color-text-secondary)">
                    Tours &amp; Transfers
                  </p>
                  <p className="font-mono text-lg text-(--color-white-muted) mt-1">
                    + {formatPrice(pkg.toursPrice)}
                  </p>
                  <p className="font-sans text-xs text-(--color-text-secondary) mt-0.5">
                    per person (included in quote)
                  </p>
                </div>
              )}

              {/* Transparency note */}
              <div className="bg-(--color-navy-surface) rounded-lg p-4 mt-4 border border-(--color-navy-border)">
                <p className="font-sans text-xs text-(--color-text-secondary) leading-relaxed">
                  Prices shown are base rates per person. Your final quote will
                  include exact costs for your group size, dates, and
                  requirements. 5% GST is applicable on the total amount.
                  Flights and visa costs are not included unless stated.
                </p>
              </div>

              {/* CTA */}
              <div>
                <Link href={`/book/${pkg.slug}`}>
                  <Button className="w-full bg-(--color-coral) hover:bg-(--color-coral)/90 text-white font-sans font-medium h-11">
                    Submit Booking Request
                  </Button>
                </Link>
                <p className="font-sans text-xs text-(--color-text-secondary) text-center mt-3 leading-relaxed">
                  No payment required to enquire. We&apos;ll confirm
                  availability and send your quote.
                </p>
              </div>
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
                  const phone =
                    process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP?.replace(
                      /\+/g,
                      "",
                    );
                  const message = encodeURIComponent(
                    `Hi, I'm interested in a custom quote for ${pkg.title}`,
                  );
                  window.open(
                    `https://wa.me/${phone}?text=${message}`,
                    "_blank",
                  );
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
        <Link href={`/book/${pkg.slug}`} className="shrink-0">
          <Button className="bg-(--color-coral) hover:bg-(--color-coral)/90 text-white font-sans font-medium text-sm h-10 px-4">
            Submit Booking Request
          </Button>
        </Link>
      </div>
    </>
  );
}
