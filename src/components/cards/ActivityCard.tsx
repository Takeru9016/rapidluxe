import Image from "next/image";
import { Compass, Clock } from "lucide-react";

import { Activity } from "@/types/package";

import { formatPrice } from "@/lib/utils";

import { Badge } from "@/components/shared/Badge";

interface ActivityCardProps {
  activity: Activity;
  className?: string;
}

export function ActivityCard({ activity, className }: ActivityCardProps) {
  return (
    <article
      className={[
        "bg-(--color-navy-surface) rounded-lg p-4",
        "border border-(--color-navy-border)",
        "flex items-start gap-4",
        "hover:border-(--color-gold)/30 transition-colors duration-200",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Left — Icon/Image */}
      <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden relative">
        {activity.imageUrl ? (
          <Image
            src={activity.imageUrl}
            alt={activity.name}
            fill
            className="object-cover"
            sizes="64px"
          />
        ) : (
          <div className="w-full h-full bg-(--color-navy-border) flex items-center justify-center">
            <Compass size={24} className="text-(--color-gold)" />
          </div>
        )}
      </div>

      {/* Right — Content */}
      <div className="flex-1 min-w-0">
        <p className="font-sans font-medium text-white text-sm leading-tight">
          {activity.name}
        </p>

        <div className="mt-0.5 flex items-center gap-2">
          <Clock size={12} className="text-(--color-text-secondary) shrink-0" />
          <span className="font-['JetBrains_Mono'] text-xs text-(--color-text-secondary)">
            {activity.duration}
          </span>
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-1">
          {activity.included ? (
            <Badge variant="teal" size="sm">
              ✓ Included
            </Badge>
          ) : (
            <>
              <Badge variant="gold" size="sm">
                Add-On
              </Badge>
              {activity.price !== undefined && (
                <span className="font-sans text-xs text-(--color-gold) ml-1">
                  {formatPrice(activity.price)}
                </span>
              )}
            </>
          )}
        </div>

        {activity.description && (
          <p className="mt-1.5 text-xs text-(--color-white-muted) line-clamp-2">
            {activity.description}
          </p>
        )}
      </div>
    </article>
  );
}
