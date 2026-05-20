import Link from "next/link";
import Image from "next/image";

import { Destination } from "@/types/destination";

interface DestinationCardProps {
  destination: Destination;
  packageCount?: number;
  className?: string;
}

export function DestinationCard({
  destination,
  packageCount,
  className,
}: DestinationCardProps) {
  return (
    <Link href={`/destinations/${destination.slug}`}>
      <article
        className={[
          "rounded-xl overflow-hidden relative aspect-3/4 cursor-pointer",
          "ring-0 hover:ring-2 hover:ring-(--color-gold)/50",
          "transition-all duration-300",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {destination.imageUrl ? (
          <Image
            src={destination.imageUrl}
            alt={destination.name}
            fill
            className="object-cover transition-transform duration-500 ease-out hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-[#0B0F1A]" />
        )}

        <div className="absolute inset-0 bg-linear-to-t from-[#0B0F1A]/90 via-[#0B0F1A]/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="text-sm text-(--color-white-muted) font-sans">
            {destination.country}
          </p>
          <h3 className="font-['Cormorant_Garamond'] text-2xl text-white leading-tight">
            {destination.name}
          </h3>
          {packageCount !== undefined && packageCount > 0 && (
            <p className="mt-1 text-sm text-(--color-gold) font-['JetBrains_Mono']">
              {packageCount} packages
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
