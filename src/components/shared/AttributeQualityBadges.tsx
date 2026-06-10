import { cn } from "@/lib/utils";
import type { PackageAttribute } from "@/types/package";

interface AttributeQualityBadgesProps {
  attributes: PackageAttribute[];
  className?: string;
}

const badgeStyles: Record<PackageAttribute["quality"], string> = {
  GREAT: "bg-(--color-teal)/20 text-(--color-teal) border border-(--color-teal)/30",
  GOOD: "bg-(--color-gold)/20 text-(--color-gold) border border-(--color-gold)/30",
  AVERAGE: "bg-white/5 text-(--color-white-muted) border border-white/10",
};

export function AttributeQualityBadges({ attributes, className }: AttributeQualityBadgesProps) {
  if (!attributes || attributes.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-x-6 gap-y-3 py-4 border-t border-b border-(--color-navy-border)", className)}>
      {attributes.map((attr) => (
        <div key={attr.label} className="flex flex-col items-start gap-1">
          <span className="font-sans text-xs text-(--color-text-secondary) uppercase tracking-wide">
            {attr.label}
          </span>
          <span className={cn("px-2 py-0.5 rounded-full text-xs font-mono", badgeStyles[attr.quality])}>
            {attr.quality}
          </span>
        </div>
      ))}
    </div>
  );
}
