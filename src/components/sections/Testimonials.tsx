import { Star } from "lucide-react";

import { dummyReviews } from "@/lib/dummy/reviews";

import { ReviewCard } from "@/components/cards/ReviewCard";

const USER_NAMES: Record<string, string> = {
  "user-001": "Priya Sharma",
  "user-002": "Arjun Mehta",
  "user-003": "Kavya Nair",
  "user-004": "Rohit Bose",
  "user-005": "Sneha Iyer",
  "user-006": "Vikram Patel",
  "user-007": "Ananya Reddy",
  "user-008": "Karan Gupta",
};

const reviewsWithUsers = dummyReviews.slice(0, 6).map((review) => ({
  ...review,
  user: { name: USER_NAMES[review.userId] ?? "Verified Traveller" },
}));

export function Testimonials() {
  return (
    <section
      className="py-20 md:py-32"
      style={{
        backgroundColor:
          "color-mix(in srgb, var(--color-navy-surface) 40%, transparent)",
      }}
    >
      {/* Header */}
      <div className="text-center mb-12 px-4">
        <p
          className="font-[family-name:var(--font-body)] text-sm tracking-widest uppercase"
          style={{ color: "var(--color-gold)" }}
        >
          Guest Reviews
        </p>
        <h2
          className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-white mt-2"
        >
          What Our Travellers Say
        </h2>

        {/* Stars + aggregate */}
        <div className="mt-4 flex flex-col items-center gap-2">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={20}
                style={{ color: "var(--color-gold)", fill: "var(--color-gold)" }}
              />
            ))}
          </div>
          <p
            className="font-[family-name:var(--font-body)] text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            4.8 out of 5 &mdash; 2,400+ reviews
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviewsWithUsers.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
