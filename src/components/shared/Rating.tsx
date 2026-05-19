import { cn } from "@/lib/utils";

interface RatingProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
  showCount?: boolean;
  className?: string;
}

interface StarProps {
  type: "filled" | "half" | "empty";
  sizePx: number;
}

function Star({ type, sizePx }: StarProps) {
  const id = `half-${sizePx}`;
  return (
    <svg
      width={sizePx}
      height={sizePx}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      {type === "half" && (
        <defs>
          <linearGradient id={id}>
            <stop offset="50%" stopColor="var(--color-gold)" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
      )}
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={
          type === "filled" ? "var(--color-gold)"
          : type === "half" ?
            `url(#${id})`
          : "none"
        }
        stroke={
          type === "empty" ? "var(--color-navy-border)" : "var(--color-gold)"
        }
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function buildStars(rating: number): Array<"filled" | "half" | "empty"> {
  const filled = Math.floor(rating);
  const hasHalf = rating - filled >= 0.5;
  const stars: Array<"filled" | "half" | "empty"> = [];

  for (let i = 0; i < 5; i++) {
    if (i < filled) stars.push("filled");
    else if (i === filled && hasHalf) stars.push("half");
    else stars.push("empty");
  }

  return stars;
}

export function Rating({
  rating,
  reviewCount,
  size = "md",
  showCount = true,
  className,
}: RatingProps) {
  const stars = buildStars(rating);
  const sizePx = size === "sm" ? 14 : 18;
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5">
        {stars.map((type, i) => (
          <Star key={i} type={type} sizePx={sizePx} />
        ))}
      </div>
      <span
        className={cn("font-mono font-semibold text-(--color-gold)", textSize)}
      >
        {rating.toFixed(1)}
      </span>
      {showCount && reviewCount !== undefined && (
        <span
          className={cn("font-sans text-(--color-text-secondary)", textSize)}
        >
          ({reviewCount} reviews)
        </span>
      )}
    </div>
  );
}
