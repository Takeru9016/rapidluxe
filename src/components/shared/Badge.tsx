import { cn } from "@/lib/utils";

interface BadgeProps {
  variant: "gold" | "teal" | "coral" | "ghost" | "outline";
  size?: "sm" | "md";
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeProps["variant"], string> = {
  gold: "bg-[var(--color-gold)]/20 text-[var(--color-gold)] border border-[var(--color-gold)]/30",
  teal: "bg-[var(--color-teal)]/20 text-[var(--color-teal)] border border-[var(--color-teal)]/30",
  coral:
    "bg-[var(--color-coral)]/20 text-[var(--color-coral)] border border-[var(--color-coral)]/30",
  ghost: "bg-white/5 text-[var(--color-white-muted)] border border-white/10",
  outline:
    "bg-transparent text-[var(--color-white)] border border-[var(--color-navy-border)]",
};

const sizeStyles: Record<NonNullable<BadgeProps["size"]>, string> = {
  md: "px-3 py-1 text-sm font-medium font-sans",
  sm: "px-2 py-0.5 text-xs font-mono",
};

export function Badge({
  variant,
  size = "md",
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "rounded-full inline-flex items-center gap-1",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
    >
      {children}
    </span>
  );
}
