import { cn } from "@/lib/utils";
import type { PlatformRating } from "@/types/package";

interface MultiPlatformRatingsProps {
  ratings: PlatformRating[];
  showSeeAll?: boolean;
  className?: string;
}

export function MultiPlatformRatings({ ratings, showSeeAll = true, className }: MultiPlatformRatingsProps) {
  if (!ratings || ratings.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-4 py-2", className)}>
      {ratings.map((item, i) => (
        <div key={item.platform} className="flex items-center gap-2">
          {i > 0 && <span className="w-px h-3 bg-(--color-navy-border)" />}
          <div className="flex items-center gap-1.5">
            <span className="font-sans text-xs text-(--color-text-secondary)">{item.platform}</span>
            <span className="font-mono text-sm text-white font-medium">{item.score}</span>
            {item.reviewCount !== undefined && (
              <span className="font-sans text-xs text-(--color-text-secondary)">
                ({item.reviewCount.toLocaleString("en-IN")})
              </span>
            )}
          </div>
        </div>
      ))}
      {showSeeAll && (
        <button className="font-sans text-sm text-(--color-gold) hover:text-(--color-gold-light) transition-colors ml-auto">
          See all reviews →
        </button>
      )}
    </div>
  );
}
