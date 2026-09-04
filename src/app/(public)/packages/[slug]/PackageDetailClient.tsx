"use client";

import { useAuth } from "@clerk/nextjs";
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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import { useDeals } from "@/hooks/api/useDeals";
import { usePackage, usePackages } from "@/hooks/api/usePackages";
import { useCheckEligibility, useReviews } from "@/hooks/api/useReviews";
import { useWishlist } from "@/hooks/api/useWishlist";
import { formatPrice } from "@/lib/utils";

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

// ─── SectionHeading ───────────────────────────────────────────────────────────

function SectionHeading({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <h2 className="font-display text-2xl md:text-3xl font-light text-(--color-white) mb-5 flex items-center gap-2.5">
      {icon}
      {children}
    </h2>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PackageDetailClient({ slug }: { slug: string }) {
  const { data: pkgData, isLoading } = usePackage(slug);
  const { data: poolData } = usePackages({ limit: 12, sort: "featured" });
  const { data: dealsData } = useDeals();

  const pkg = pkgData?.data;
  const destination = pkg?.destination ?? null;

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

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { has, toggle } = useWishlist();
  const isWishlisted = pkg ? has(pkg.id) : false;

  const searchParams = useSearchParams();

  function handleWishlistToggle() {
    if (!pkg || !authLoaded) return;
    if (!isSignedIn) {
      // pathname/searchParams are always same-origin by construction, so no
      // separate sanitizer is needed here — unlike SignInForm, which reads
      // an untrusted redirect_url from the URL itself.
      const query = searchParams.toString();
      const target = query ? `${pathname}?${query}` : pathname;
      router.push(`/sign-in?redirect_url=${encodeURIComponent(target)}`);
      return;
    }
    toggle(pkg.id);
  }
  const deals = dealsData?.data ?? [];
  const activeDeal = useMemo(() => {
    if (!pkg) return null;
    const dealId = searchParams.get("deal");
    if (!dealId) return null;
    return deals.find((d) => d.id === dealId && d.packageId === pkg.id) ?? null;
  }, [searchParams, pkg, deals]);

  // Related Journeys: same destination first, then shared tags, excluding self.
  // Falls back to the existing featured pool if nothing is genuinely relevant.
  const { relatedPackages, relatedHeading } = useMemo(() => {
    if (!pkg) return { relatedPackages: [], relatedHeading: "" };

    const pool = (poolData?.data ?? []).filter((p) => p.slug !== slug);
    const currentTags = new Set(pkg.tags);

    const scored = pool.map((p) => ({
      p,
      sameDestination: destination
        ? p.destination?.slug === destination.slug
        : false,
      sharedTags: p.tags.filter((t) => currentTags.has(t)).length,
    }));

    const relevant = scored
      .filter((s) => s.sameDestination || s.sharedTags > 0)
      .sort(
        (a, b) =>
          Number(b.sameDestination) - Number(a.sameDestination) ||
          b.sharedTags - a.sharedTags,
      )
      .slice(0, 3)
      .map((s) => s.p);

    if (relevant.length > 0) {
      const allSameDestination = relevant.every(
        (p) => destination && p.destination?.slug === destination.slug,
      );
      return {
        relatedPackages: relevant,
        relatedHeading:
          allSameDestination && destination
            ? `More Journeys in ${destination.name}`
            : "Related Journeys",
      };
    }

    return {
      relatedPackages: pool.slice(0, 3),
      relatedHeading: "Explore More Journeys",
    };
  }, [poolData, pkg, slug, destination]);

  if (isLoading) return <PackageDetailSkeleton />;

  if (!pkg) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="font-display text-2xl text-(--color-white) mb-2">
          Journey not found
        </p>
        <p className="font-sans text-sm text-(--color-text-secondary) mb-6">
          The journey you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Link href="/packages">
          <Button variant="outline-gold">View all Journeys</Button>
        </Link>
      </div>
    );
  }

  const bookingHref = activeDeal
    ? `/book/${pkg?.slug}?deal=${activeDeal.id}`
    : `/book/${pkg?.slug}`;

  const effectivePrice = activeDeal
    ? Math.round(pkg.pricePerPerson * (1 - activeDeal.discountPct / 100))
    : pkg.pricePerPerson;
  const effectiveOriginalPrice = activeDeal
    ? pkg.pricePerPerson
    : pkg.originalPrice;

  const includedActivities = pkg.activities.filter((a) => a.included);
  const optionalActivities = pkg.activities.filter((a) => !a.included);
  const highlightActivities = includedActivities.slice(0, 6);

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
              className="hover:text-(--color-white) transition-colors"
            >
              Home
            </Link>
            <ChevronRight size={12} className="shrink-0" />
            <Link
              href="/packages"
              className="hover:text-(--color-white) transition-colors"
            >
              Journeys
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
          <div className="flex-1 min-w-0 flex flex-col gap-14">
            {/* 1. Gallery */}
            <div>
              <DetailPhotoGrid images={pkg.images} alt={pkg.title} priority />
            </div>

            {/* 2. Title + destination + core facts */}
            <div className="-mt-8">
              {destination && (
                <div className="mb-3">
                  <Badge variant="teal" size="sm">
                    {destination.name}, {destination.country}
                  </Badge>
                </div>
              )}

              <h1 className="font-display text-4xl md:text-5xl font-light text-(--color-white) leading-tight mb-5">
                {pkg.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-(--color-text-secondary)">
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

              {/* Rating + Save — subordinate to the title, not competing with it */}
              <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t border-(--color-navy-border)">
                {reviews.length > 0 ? (
                  <Rating
                    rating={avgRating}
                    reviewCount={reviews.length}
                    size="sm"
                    showCount
                  />
                ) : (
                  <span className="font-sans text-xs text-(--color-text-secondary)">
                    No reviews yet
                  </span>
                )}
                <button
                  type="button"
                  aria-pressed={isWishlisted}
                  onClick={handleWishlistToggle}
                  className="flex items-center gap-1.5 text-xs text-(--color-text-secondary) hover:text-(--color-white) transition-colors"
                >
                  <Heart
                    size={16}
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
              <AttributeQualityBadges attributes={pkg.attributes} />
            )}

            {/* 3. Editorial narrative */}
            <section>
              <SectionHeading>About This Journey</SectionHeading>
              <p className="font-sans text-(--color-white-muted) text-base leading-relaxed max-w-3xl">
                {pkg.description}
              </p>

              {/* 4. Experience highlights — compact, real activities only */}
              {highlightActivities.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-sans text-xs uppercase tracking-widest text-(--color-text-secondary) mb-3 flex items-center gap-2">
                    <Sparkles size={14} className="text-(--color-gold)" />
                    Highlights
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {highlightActivities.map((activity) => (
                      <span
                        key={activity.name}
                        className="font-sans text-sm text-(--color-white-muted) bg-(--color-navy-surface) border border-(--color-navy-border) rounded-full px-3.5 py-1.5"
                      >
                        {activity.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* 5. Itinerary */}
            <section>
              <SectionHeading>Itinerary</SectionHeading>
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
                    <AccordionTrigger className="py-4 hover:no-underline text-(--color-white)">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-(--color-gold) bg-(--color-gold)/10 px-2 py-1 rounded-md w-14 text-center shrink-0">
                          Day {day.day}
                        </span>
                        <span className="font-display text-base font-normal text-(--color-white) text-left">
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
                              className="text-xs font-sans bg-(--color-navy-border) text-(--color-white-muted) px-2 py-0.5 rounded"
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
            </section>

            {/* 6. Where You'll Stay — curated package hotels only, never a generic destination search */}
            <section>
              <SectionHeading>Where You&apos;ll Stay</SectionHeading>
              {pkg.hotels && pkg.hotels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pkg.hotels.map((hotel) => (
                    <HotelCard key={hotel.name} hotel={hotel} />
                  ))}
                </div>
              ) : (
                <p className="py-8 text-sm text-(--color-text-secondary)">
                  Stay details for this Journey aren&apos;t published yet — ask
                  us when you request it.
                </p>
              )}
            </section>

            {/* 7. Experiences */}
            <section className="flex flex-col gap-8">
              <SectionHeading>Experiences</SectionHeading>

              {includedActivities.length > 0 && (
                <div>
                  <h3 className="font-display text-lg text-(--color-white) mb-4">
                    Included
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
                  <h3 className="font-display text-lg text-(--color-white) mb-4">
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
                <p className="py-4 text-sm text-(--color-text-secondary)">
                  Experience details for this Journey aren&apos;t published yet.
                </p>
              )}
            </section>

            {/* 8. Practical details */}
            <section>
              <SectionHeading>Practical Details</SectionHeading>
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-(--color-navy-surface) border border-(--color-navy-border) rounded-xl p-5">
                    <h3 className="font-display text-lg text-(--color-white) mb-4">
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
                    <h3 className="font-display text-lg text-(--color-white) mb-4">
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

                {/* This Journey's cancellationPolicy data (if any) is not
                    rendered here — the repository has no way to distinguish
                    a genuine Journey-specific policy exception from legacy/
                    default data (no flag exists for that), so the site's
                    single Cancellation Policy page is always the
                    authoritative source shown to customers. The underlying
                    per-package data is preserved, untouched, for a future
                    milestone that adds a real way to mark an intentional
                    override. */}
                <div className="bg-(--color-navy-surface) border border-(--color-navy-border) rounded-xl p-5">
                  <h3 className="font-(--font-display) text-lg text-(--color-white) mb-2">
                    Cancellation Policy
                  </h3>
                  <p className="font-(--font-body) text-sm text-(--color-white-muted) mb-3">
                    This Journey follows RapidLuxe&apos;s standard Cancellation
                    Policy.
                  </p>
                  <Link
                    href="/cancellation-policy"
                    className="inline-flex items-center gap-1 text-sm font-(--font-body) text-(--color-gold) hover:text-(--color-gold-light) underline underline-offset-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-gold) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-navy) rounded-xs"
                  >
                    View full Cancellation Policy →
                  </Link>
                </div>

                <div>
                  <h3 className="font-display text-lg text-(--color-white) mb-4">
                    Location
                  </h3>
                  <MapboxMap
                    lat={destination?.lat}
                    lng={destination?.lng}
                    zoom={9}
                    className="h-64"
                  />
                </div>
              </div>
            </section>

            {/* 11. Reviews */}
            <section className="flex flex-col gap-6">
              <SectionHeading>Reviews</SectionHeading>

              {reviews.length > 0 && (
                <RatingBarBreakdown
                  reviews={reviews}
                  avgRating={avgRating}
                  total={reviewsData?.pagination.total ?? 0}
                />
              )}

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
                  No reviews yet for this Journey.
                </p>
              )}

              <ReviewForm packageId={pkg.id} isEligible={isEligible} />
            </section>

            {/* 12. Related Journeys */}
            {relatedPackages.length > 0 && (
              <section>
                <SectionHeading>{relatedHeading}</SectionHeading>
                <div className="flex gap-5 overflow-x-auto pb-2">
                  {relatedPackages.map((p) => (
                    <div key={p.id} className="w-72 shrink-0">
                      <PackageCard package={p} variant="compact" />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ── Right Column — Sticky Sidebar (9. Pricing / 10. Human support) ─── */}
          <aside className="hidden lg:flex lg:flex-col w-80 xl:w-96 shrink-0 sticky top-24 gap-4">
            {/* Price Guide card */}
            <div className="bg-(--color-navy-surface) border border-(--color-navy-border) rounded-xl p-6 flex flex-col gap-5">
              <div>
                <h3 className="font-display text-2xl text-(--color-white) leading-tight">
                  Price Guide
                </h3>
                <div className="h-px bg-(--color-gold) mt-3" />
              </div>

              {/* Adults */}
              <div>
                <p className="font-sans text-xs uppercase tracking-wider text-(--color-text-secondary)">
                  Adults (12+ years)
                </p>
                {effectiveOriginalPrice != null &&
                  effectiveOriginalPrice > effectivePrice && (
                    <p className="font-mono text-sm line-through text-(--color-text-secondary) mt-1">
                      {formatPrice(effectiveOriginalPrice)}
                    </p>
                  )}
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
                  <p className="font-mono text-xl text-(--color-white) mt-1">
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
                      <p className="font-sans text-sm text-(--color-white)">
                        Infants (under 2) travel free
                      </p>
                      <span className="font-sans text-xs font-medium uppercase tracking-wide text-(--color-teal) bg-(--color-teal)/10 px-2 py-0.5 rounded">
                        Free
                      </span>
                    </div>
                  ) : (
                    <p className="font-mono text-xl text-(--color-white) mt-1">
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
                <Button
                  asChild
                  variant="coral"
                  className="w-full font-sans font-medium h-11"
                >
                  <Link href={bookingHref}>Request This Journey</Link>
                </Button>
                <p className="font-sans text-xs text-(--color-text-secondary) text-center mt-3 leading-relaxed">
                  No payment required to enquire. We&apos;ll confirm
                  availability and send your quote.
                </p>
              </div>
            </div>

            {/* Human / bespoke planning card */}
            <div className="border border-(--color-gold)/30 rounded-xl p-4 flex flex-col gap-3">
              <div>
                <p className="font-sans text-sm font-medium text-(--color-white)">
                  Need a custom itinerary?
                </p>
                <p className="font-sans text-xs text-(--color-text-secondary) mt-0.5">
                  Personalise this Journey for your dates and group.
                </p>
              </div>
              <Button
                variant="outline-gold"
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
                className="w-full gap-1.5 font-sans text-sm h-9"
              >
                <MessageSquare size={14} />
                Get Custom Quote →
              </Button>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile sticky bottom bar — persistent conversion action + bespoke planning access */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-(--color-navy-surface) border-t border-(--color-navy-border) px-4 py-3 flex items-center justify-between gap-3">
        <PriceDisplay
          price={effectivePrice}
          originalPrice={effectiveOriginalPrice}
          size="sm"
          prefix=""
          suffix="/ person"
          showDiscount={!!activeDeal}
        />
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline-gold"
            size="icon"
            aria-label="Get custom quote via WhatsApp"
            onClick={() => {
              const phone = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP?.replace(
                /\+/g,
                "",
              );
              const message = encodeURIComponent(
                `Hi, I'm interested in a custom quote for ${pkg.title}`,
              );
              window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
            }}
            className="h-10 w-10"
          >
            <MessageSquare size={16} />
          </Button>
          <Button
            asChild
            variant="coral"
            className="font-sans font-medium text-sm h-10 px-4"
          >
            <Link href={bookingHref}>Request This Journey</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
