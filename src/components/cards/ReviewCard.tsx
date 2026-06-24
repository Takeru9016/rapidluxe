"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/shared/Badge";
import { Rating } from "@/components/shared/Rating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import type { Review } from "@/types/review";

interface ReviewCardProps {
  review: Review & { user: { name: string; avatarUrl?: string } };
  className?: string;
}

export function ReviewCard({ review, className }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const bodyRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) {
      setIsClamped(el.scrollHeight > el.clientHeight);
    }
  }, [review.body]);

  const initials = review.user.name.slice(0, 2).toUpperCase();

  return (
    <article
      className={[
        "bg-(--color-navy-surface) rounded-xl p-6",
        "border border-(--color-navy-border)",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={review.user.avatarUrl} alt={review.user.name} />
          <AvatarFallback className="bg-(--color-gold)/20 text-(--color-gold) text-sm font-sans">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-sans font-medium text-white text-sm">
            {review.user.name}
          </p>
        </div>
      </div>

      {/* Rating */}
      <div className="mt-3">
        <Rating rating={review.rating} size="sm" showCount={false} />
      </div>

      {/* Body */}
      <div className="mt-3">
        <p
          ref={bodyRef}
          className={[
            "text-(--color-white-muted) text-sm leading-relaxed font-sans overflow-hidden",
            !expanded ? "line-clamp-3" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {review.body}
        </p>
        {(isClamped || expanded) && (
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="mt-1 text-(--color-gold) text-sm cursor-pointer hover:text-(--color-gold-light) transition-colors"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 flex justify-between items-center">
        <span className="text-xs text-(--color-text-secondary) font-sans">
          {formatDate(review.createdAt)}
        </span>
        {review.isVerified && (
          <Badge variant="teal" size="sm">
            ✓ Verified
          </Badge>
        )}
      </div>
    </article>
  );
}
