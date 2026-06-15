import { cn } from "@/lib/utils";
import { formatPrice, calculateDiscount } from "@/lib/utils";

import { Badge } from "./Badge";

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  prefix?: string;
  suffix?: string;
  size?: "sm" | "md" | "lg";
  showDiscount?: boolean;
  className?: string;
}

const priceTextSize: Record<NonNullable<PriceDisplayProps["size"]>, string> = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-3xl",
};

const originalTextSize: Record<
  NonNullable<PriceDisplayProps["size"]>,
  string
> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-sm",
};

export function PriceDisplay({
  price,
  originalPrice,
  prefix = "from",
  suffix = "per person",
  size = "md",
  showDiscount = true,
  className,
}: PriceDisplayProps) {
  const discount =
    originalPrice !== undefined ? calculateDiscount(originalPrice, price) : 0;

  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      {originalPrice !== undefined && originalPrice > price && (
        <span
          className={cn(
            "font-mono line-through text-(--color-text-secondary)",
            originalTextSize[size],
          )}
        >
          {formatPrice(originalPrice)}
        </span>
      )}

      <div className="flex items-baseline gap-1.5 flex-wrap">
        {prefix && (
          <span className="font-sans text-(--color-text-secondary) text-sm">
            {prefix}
          </span>
        )}
        <span
          className={cn(
            "font-mono font-semibold text-(--color-gold)",
            priceTextSize[size],
          )}
        >
          {formatPrice(price)}
        </span>
        {suffix && (
          <span className="font-sans text-(--color-text-secondary) text-sm">
            {suffix}
          </span>
        )}
      </div>

      {showDiscount && originalPrice !== undefined && discount > 0 && (
        <div className="mt-0.5">
          <Badge variant="coral" size="sm">
            {discount}% off
          </Badge>
        </div>
      )}
    </div>
  );
}
