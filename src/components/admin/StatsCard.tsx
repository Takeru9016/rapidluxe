import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  change?: { value: number; direction: "up" | "down" };
  format?: "number" | "currency";
  className?: string;
}

export function StatsCard({
  label,
  value,
  icon: Icon,
  change,
  format,
  className,
}: StatsCardProps) {
  const displayValue =
    format === "currency" ? formatPrice(value as number) : value;

  return (
    <div
      className={cn(
        "bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-6 flex items-start justify-between",
        className,
      )}
    >
      <div>
        <p className="font-['DM_Sans'] text-sm text-(--color-text-secondary)">
          {label}
        </p>
        <p className="font-['JetBrains_Mono'] text-3xl text-white font-bold mt-1">
          {displayValue}
        </p>
        {change && (
          <p
            className={`font-['DM_Sans'] text-sm mt-2 ${
              change.direction === "up"
                ? "text-(--color-teal)"
                : "text-(--color-coral)"
            }`}
          >
            {change.direction === "up" ? "↑" : "↓"} {change.value}% vs last
            month
          </p>
        )}
      </div>

      <div className="w-11 h-11 rounded-full bg-(--color-gold)/10 flex items-center justify-center shrink-0">
        <Icon className="w-[22px] h-[22px] text-(--color-gold)" />
      </div>
    </div>
  );
}
