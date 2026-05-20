"use client";

import Image from "next/image";
import { Clock } from "lucide-react";

import { Deal } from "@/types/deal";
import { Package } from "@/types/package";

import { formatPrice } from "@/lib/utils";

import { Badge } from "@/components/shared/Badge";
import { CountdownTimer } from "@/components/shared/CountdownTimer";

interface DealCardProps {
  deal: Deal & { package: Package };
  className?: string;
}

export function DealCard({ deal, className }: DealCardProps) {
  const pkg = deal.package;
  if (!pkg) return null;

  const originalPrice =
    pkg.originalPrice ?? pkg.pricePerPerson * (1 + deal.discountPct / 100);
  const savings = originalPrice - pkg.pricePerPerson;

  return (
    <article
      className={[
        "rounded-xl overflow-hidden bg-(--color-navy-surface)",
        "border border-(--color-navy-border)",
        "hover:border-(--color-gold)/50 transition-colors duration-200",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-video">
        {pkg.images[0] ? (
          <Image
            src={pkg.images[0]}
            alt={pkg.title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-[#0B0F1A]" />
        )}

        <div className="absolute top-3 left-3">
          <Badge variant="coral" size="sm">
            ⚡ FLASH SALE
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant="gold" size="sm">
            {deal.discountPct}% OFF
          </Badge>
        </div>
      </div>

      {/* Dashed divider */}
      <div className="border-t border-dashed border-(--color-navy-border)/80" />

      {/* Content */}
      <div className="p-5">
        <h3 className="font-['Cormorant_Garamond'] text-lg text-white">
          {pkg.title}
        </h3>
        <p className="text-sm text-(--color-text-secondary) font-sans mt-1">
          {pkg.durationNights} nights
        </p>

        {/* Price block */}
        <div className="mt-4 space-y-1">
          <p className="line-through text-(--color-text-secondary) text-sm font-['JetBrains_Mono']">
            {formatPrice(originalPrice)}
          </p>
          <p className="text-(--color-gold) text-2xl font-['JetBrains_Mono'] font-semibold">
            {formatPrice(pkg.pricePerPerson)}
          </p>
          <p className="text-(--color-coral) text-sm font-sans">
            Save {formatPrice(savings)}
          </p>
        </div>

        {/* Timer row */}
        <div className="mt-3 flex items-center gap-2 text-sm text-(--color-text-secondary)">
          <Clock size={14} />
          <span>Ends in:</span>
          <CountdownTimer expiresAt={deal.expiresAt} variant="inline" />
        </div>

        {/* CTA */}
        <div className="mt-4">
          <button className="w-full bg-(--color-coral) text-white font-sans font-medium py-3 rounded-lg hover:bg-(--color-coral)/90 transition-colors">
            Book This Deal
          </button>
        </div>
      </div>
    </article>
  );
}
