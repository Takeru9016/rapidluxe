"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";

import { cn } from "@/lib/utils";

import type { Package } from "@/types/package";

import { useWishlistStore } from "@/store/wishlistStore";

import { Rating } from "@/components/shared/Rating";
import { Badge } from "@/components/shared/Badge";
import { PriceDisplay } from "@/components/shared/PriceDisplay";

interface PackageCardProps {
  package: Package;
  variant?: "default" | "compact";
  className?: string;
}

function destinationLabel(destinationId: string): string {
  return destinationId
    .replace(/^dest-/, "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function PackageCard({
  package: pkg,
  variant = "default",
  className,
}: PackageCardProps) {
  const { has, toggle } = useWishlistStore();
  const isWishlisted = has(pkg.id);

  return (
    <Link href={`/packages/${pkg.slug}`} className="block" tabIndex={-1}>
      <article
        className={cn(
          "group rounded-xl overflow-hidden bg-(--color-navy-surface)",
          "border border-(--color-navy-border)",
          "transition-all duration-200",
          "hover:border-(--color-gold)/50 hover:shadow-lg hover:shadow-black/30",
          className,
        )}
      >
        {/* Image area */}
        <div
          className={cn(
            "relative overflow-hidden",
            variant === "compact" ? "aspect-video" : "aspect-4/3",
          )}
        >
          <Image
            src={pkg.images[0]}
            alt={pkg.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Badges row */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <Badge variant="teal" size="sm">
              {destinationLabel(pkg.destinationId)}
            </Badge>
            <button
              type="button"
              aria-label={
                isWishlisted ? "Remove from wishlist" : "Add to wishlist"
              }
              onClick={(e) => {
                e.preventDefault();
                toggle(pkg.id);
              }}
              className="p-1.5 rounded-full bg-black/30 backdrop-blur-sm transition-colors"
            >
              <Heart
                size={18}
                className={cn(
                  "transition-colors",
                  isWishlisted ?
                    "text-(--color-gold) fill-(--color-gold)"
                  : "text-white/70 hover:text-(--color-gold)",
                )}
              />
            </button>
          </div>

          {/* Hover overlay — default variant only */}
          {variant === "default" && (
            <div className="absolute inset-0 bg-(--color-navy)/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="border border-(--color-gold) text-(--color-gold) px-6 py-2 rounded-lg font-sans font-medium text-sm hover:bg-(--color-gold)/10 transition-colors">
                View Details →
              </span>
            </div>
          )}
        </div>

        {/* Content area */}
        <div className={cn(variant === "compact" ? "p-4" : "p-5")}>
          <h3
            className={cn(
              "font-serif text-white leading-tight",
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

          <div className="mt-2">
            <Rating rating={4.5} reviewCount={24} size="sm" />
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
      </article>
    </Link>
  );
}
