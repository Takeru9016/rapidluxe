"use client";

import Link from "next/link";
import { PackageSearch } from "lucide-react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

const actionButtonClass =
  "inline-flex items-center px-5 py-2.5 rounded-lg border border-[var(--color-gold)] text-[var(--color-gold)] font-sans text-sm font-medium hover:bg-[var(--color-gold)]/10 transition-colors";

export function EmptyState({
  icon: Icon = PackageSearch,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-20 px-4",
        className,
      )}
    >
      <div className="bg-(--color-gold)/10 rounded-full p-4">
        <Icon className="w-12 h-12 text-(--color-gold)" />
      </div>

      <h3 className="font-serif text-2xl text-white mt-6">{title}</h3>

      {description && (
        <p className="font-sans text-(--color-white-muted) text-base mt-2 max-w-sm">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-6">
          {action.href ? (
            <Link href={action.href} className={actionButtonClass}>
              {action.label}
            </Link>
          ) : (
            <button onClick={action.onClick} className={actionButtonClass}>
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
