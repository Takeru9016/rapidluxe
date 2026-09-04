"use client";

import { Clock, Sparkles, Sunrise, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CountdownTimer } from "@/components/shared/CountdownTimer";
import type { ApiDeal } from "@/hooks/api/useDeals";
import { formatPrice } from "@/lib/utils";

interface DealCardProps {
  deal: ApiDeal;
  className?: string;
}

const TYPE_META: Record<ApiDeal["type"], { label: string; icon: typeof Zap }> =
  {
    FLASH_SALE: { label: "Flash Sale", icon: Zap },
    EARLY_BIRD: { label: "Early Bird", icon: Sunrise },
    LAST_MINUTE: { label: "Last Minute", icon: Clock },
    SEASONAL: { label: "Seasonal", icon: Sparkles },
  };

export function DealCard({ deal, className }: DealCardProps) {
  const pkg = deal.package;
  if (!pkg) return null;

  const originalPrice = pkg.pricePerPerson;
  const dealPrice = pkg.pricePerPerson * (1 - deal.discountPct / 100);
  const savings = originalPrice - dealPrice;
  const discountPercent = Math.round(deal.discountPct);
  const expiresAt = new Date(deal.expiresAt);
  const { label: typeLabel, icon: TypeIcon } = TYPE_META[deal.type];

  return (
    <Link href={`/packages/${pkg.slug}?deal=${deal.id}`} className="block">
      <article
        className={[
          "group relative rounded-xl overflow-hidden",
          "border border-(--color-navy-border)",
          "hover:border-(--color-gold)/50",
          "transition-all duration-300",
          "bg-(--color-navy-surface)",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* Image area */}
        <div className="relative aspect-video overflow-hidden">
          {pkg.images[0] ? (
            <Image
              src={pkg.images[0]}
              alt={pkg.title}
              fill
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-(--color-navy)" />
          )}

          <div className="absolute inset-0 bg-linear-to-t from-(--color-navy)/80 via-transparent to-transparent" />

          <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-(--color-coral)/90 text-white text-xs font-medium px-3 py-1 rounded-full">
              <TypeIcon size={12} aria-hidden="true" />
              {typeLabel}
            </span>
            <span className="bg-(--color-gold) text-[#1B2A41] font-mono text-sm font-bold px-3 py-1 rounded-full">
              {discountPercent}% off
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <span className="inline-block bg-(--color-teal)/20 text-(--color-teal) border border-(--color-teal)/30 rounded-full text-xs px-3 py-1 w-fit font-sans">
            {pkg.destination.name}, {pkg.destination.country}
          </span>

          <h3 className="font-['Cormorant_Garamond'] text-xl text-(--color-white)">
            {pkg.title}
          </h3>

          <p className="text-sm text-(--color-text-secondary) font-sans">
            {pkg.durationNights} nights
          </p>

          <div className="mt-2">
            <div className="flex items-end gap-3">
              <span className="line-through text-(--color-text-secondary) text-sm">
                {formatPrice(originalPrice)}
              </span>
              <span className="font-['JetBrains_Mono'] text-2xl text-(--color-gold) font-bold">
                {formatPrice(dealPrice)}
              </span>
            </div>
            <span className="mt-1 inline-block bg-(--color-teal)/20 text-(--color-teal) border border-(--color-teal)/30 rounded-full text-xs px-2 py-0.5 w-fit">
              Save {formatPrice(savings)}
            </span>
            <p className="text-xs text-(--color-text-secondary) font-sans mt-1">
              per person · GST calculated at booking
            </p>
          </div>

          <div className="flex items-center gap-2 mt-2 text-xs text-(--color-text-secondary) font-sans">
            <span>Valid until:</span>
            <CountdownTimer expiresAt={expiresAt} variant="inline" />
          </div>

          <span
            aria-hidden="true"
            className="mt-4 flex items-center justify-center w-full rounded-lg border border-(--color-gold)/40 text-(--color-gold) text-sm font-sans font-medium py-2.5 transition-colors group-hover:bg-(--color-gold)/10"
          >
            View This Deal →
          </span>
        </div>
      </article>
    </Link>
  );
}
