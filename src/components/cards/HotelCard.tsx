import { MapPin, Star } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/shared/Badge";
import type { Hotel } from "@/types/package";

interface HotelCardProps {
  hotel: Hotel;
  className?: string;
}

export function HotelCard({ hotel, className }: HotelCardProps) {
  return (
    <article
      className={[
        "bg-(--color-navy-surface) rounded-xl overflow-hidden",
        "border border-(--color-navy-border)",
        "hover:border-(--color-gold)/30 transition-colors duration-200",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Image */}
      <div className="relative aspect-4/3 overflow-hidden">
        {hotel.imageUrl ? (
          <Image
            src={hotel.imageUrl}
            alt={hotel.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-[#1B2A41]" />
        )}

        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
          {Array.from({ length: hotel.stars }).map((_, i) => (
            <Star
              key={i}
              size={12}
              className="text-(--color-gold) fill-(--color-gold)"
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-['Cormorant_Garamond'] text-lg text-white">
          {hotel.name}
        </h3>
        <div className="mt-1 flex items-center gap-1 text-sm text-(--color-text-secondary)">
          <MapPin size={14} className="text-(--color-gold) shrink-0" />
          <span>{hotel.location}</span>
        </div>
        <div className="mt-2">
          {hotel.included ? (
            <Badge variant="teal" size="sm">
              ✓ Included
            </Badge>
          ) : (
            <Badge variant="gold" size="sm">
              Optional Upgrade
            </Badge>
          )}
        </div>
        {hotel.description && (
          <p className="mt-2 text-sm text-(--color-white-muted) line-clamp-2">
            {hotel.description}
          </p>
        )}
      </div>
    </article>
  );
}
