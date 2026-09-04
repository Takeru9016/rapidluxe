"use client";

import { useAuth } from "@clerk/nextjs";
import { Globe, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/shared/Badge";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import type { ApiPackage } from "@/hooks/api/usePackages";
import { useWishlist } from "@/hooks/api/useWishlist";
import { cn } from "@/lib/utils";

interface PackageCardProps {
  package: ApiPackage;
  variant?: "default" | "compact";
  className?: string;
}

export function PackageCard({
  package: pkg,
  variant = "default",
  className,
}: PackageCardProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { has, toggle } = useWishlist();
  const isWishlisted = has(pkg.id);

  function handleWishlistToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoaded) return;
    if (!isSignedIn) {
      // pathname/searchParams are always same-origin by construction, so no
      // separate sanitizer is needed here — same convention as Journey Detail.
      const query = searchParams.toString();
      const target = query ? `${pathname}?${query}` : pathname;
      router.push(`/sign-in?redirect_url=${encodeURIComponent(target)}`);
      return;
    }
    toggle(pkg.id);
  }

  return (
    <article
      className={cn(
        "group relative rounded-xl overflow-hidden bg-(--color-navy-surface)",
        "border border-(--color-navy-border)",
        "transition-all duration-200",
        "hover:border-(--color-gold)/50 hover:shadow-lg hover:shadow-black/30",
        className,
      )}
    >
      {/* Card content — purely visual, clicks pass through to the stretched
          link below. The wishlist button is a sibling with its own z-index,
          not nested inside the link, so both stay independently focusable. */}
      <div className="pointer-events-none">
        {/* Image area */}
        <div
          className={cn(
            "relative overflow-hidden",
            variant === "compact" ? "aspect-video" : "aspect-4/3",
          )}
        >
          {pkg.images[0] ? (
            <Image
              src={pkg.images[0]}
              alt={pkg.title}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-(--color-navy-surface) to-(--color-navy-border) flex items-center justify-center">
              <Globe className="w-12 h-12 text-(--color-gold)/30" />
            </div>
          )}

          {/* Destination badge */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            {pkg.destination && (
              <Badge variant="teal" size="sm">
                {pkg.destination.name}
                {pkg.destination.country ? `, ${pkg.destination.country}` : ""}
              </Badge>
            )}
          </div>

          {/* Hover overlay — default variant only */}
          {variant === "default" && (
            <div className="absolute inset-0 bg-(--color-navy)/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="border border-(--color-gold) text-(--color-gold) px-6 py-2 rounded-lg font-sans font-medium text-sm">
                View Details →
              </span>
            </div>
          )}
        </div>

        {/* Content area */}
        <div className={cn(variant === "compact" ? "p-4" : "p-5")}>
          <h3
            className={cn(
              "font-display text-white leading-tight",
              variant === "compact" ? "text-lg" : "text-xl",
            )}
          >
            {pkg.title}
          </h3>

          <div className="mt-1 flex items-center gap-3 text-sm text-(--color-text-secondary)">
            <span className="font-mono">{pkg.durationNights} Nights</span>
            <span>·</span>
            <span className="font-sans">
              {pkg.tags.slice(0, 2).join(" · ")}
            </span>
          </div>

          <div className="mt-3 flex items-end justify-between gap-2">
            <PriceDisplay
              price={pkg.pricePerPerson}
              originalPrice={pkg.originalPrice}
              size="md"
            />
            {pkg.includesFlights && (
              <Badge variant="teal" size="sm">
                ✈ Flights
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Primary navigation — stretched over the whole card, sibling of the
          wishlist button (not an ancestor), so no interactive nesting. */}
      <Link
        href={`/packages/${pkg.slug}`}
        className="absolute inset-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-gold) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-navy)"
      >
        <span className="sr-only">View {pkg.title}</span>
      </Link>

      {/* Wishlist toggle — sits above the stretched link via z-index, stays
          independently clickable and keyboard-focusable. */}
      <button
        type="button"
        aria-pressed={isWishlisted}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        onClick={handleWishlistToggle}
        className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/30 backdrop-blur-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-gold) focus-visible:ring-offset-1"
      >
        <Heart
          size={18}
          className={cn(
            "transition-colors",
            isWishlisted
              ? "text-(--color-gold) fill-(--color-gold)"
              : "text-white/70 hover:text-(--color-gold)",
          )}
        />
      </button>
    </article>
  );
}
