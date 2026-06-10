import { ThumbsUp, ThumbsDown, Check, X } from "lucide-react";

interface ReviewSummaryCardsProps {
  loves: string[];
  dislikes: string[];
}

export function ReviewSummaryCards({ loves, dislikes }: ReviewSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div className="bg-(--color-navy-surface) rounded-xl p-5 border border-(--color-teal)/30">
        <div className="flex items-center gap-2 mb-3">
          <ThumbsUp size={16} className="text-(--color-teal) shrink-0" />
          <span className="font-sans font-medium text-white text-sm">What guests love</span>
          <span className="ml-1 font-mono text-xs text-(--color-text-secondary) bg-(--color-navy-border) px-1.5 py-0.5 rounded">
            Summarised
          </span>
        </div>
        <ul className="space-y-2">
          {loves.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <Check size={14} className="text-(--color-teal) mt-0.5 shrink-0" />
              <span className="font-sans text-sm text-(--color-white-muted)">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-(--color-navy-surface) rounded-xl p-5 border border-(--color-coral)/30">
        <div className="flex items-center gap-2 mb-3">
          <ThumbsDown size={16} className="text-(--color-coral) shrink-0" />
          <span className="font-sans font-medium text-white text-sm">What guests dislike</span>
        </div>
        <ul className="space-y-2">
          {dislikes.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <X size={14} className="text-(--color-coral) mt-0.5 shrink-0" />
              <span className="font-sans text-sm text-(--color-white-muted)">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
