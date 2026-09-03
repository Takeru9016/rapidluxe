"use client";

import { BadgeCheck, Crown, Gem, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { DealCard } from "@/components/cards/DealCard";
import { CountdownTimer } from "@/components/shared/CountdownTimer";
import { DealCardSkeleton } from "@/components/shared/Skeletons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDeals } from "@/hooks/api/useDeals";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600";

const WHY_CARDS = [
  {
    icon: BadgeCheck,
    title: "Genuine Savings",
    body: "No inflated original prices. Every discount reflects a real reduction from our standard package rate.",
  },
  {
    icon: Gem,
    title: "Thoughtfully Curated",
    body: "Every deal is handpicked from our journeys by our team — not an automated discount feed.",
  },
  {
    icon: Crown,
    title: "Same Bespoke Service",
    body: "Deal or full price, every booking receives our complete white-glove attention from enquiry to return.",
  },
] as const;

function NewsletterStrip() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="bg-(--color-navy-surface) border-y border-(--color-navy-border) py-16">
      <div className="text-center max-w-xl mx-auto px-4">
        <p className="font-sans text-xs uppercase tracking-widest text-(--color-gold)">
          STAY INFORMED
        </p>
        <h2 className="font-['Cormorant_Garamond'] text-4xl text-white mt-2">
          Hear About New Deals First.
        </h2>
        <p className="font-sans text-(--color-white-muted) mt-4">
          Subscribe to be notified when we add a new curated offer.
        </p>

        {submitted ? (
          <p className="mt-8 text-(--color-gold) font-sans">
            ✓ You&apos;re on the list!
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex gap-3 max-w-sm mx-auto"
          >
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="bg-(--color-navy) border border-(--color-navy-border) focus:border-(--color-gold) text-white placeholder:text-(--color-text-secondary) rounded-lg px-4 h-10 flex-1"
            />
            <Button
              type="submit"
              variant="gold"
              disabled={submitting}
              className="h-10 px-6 font-sans font-medium"
            >
              Subscribe →
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}

export default function DealsPageClient() {
  const { data, isLoading } = useDeals();
  const deals = data?.data ?? [];

  const earliestExpiresAt = useMemo(() => {
    if (deals.length === 0) return null;
    return deals.reduce(
      (min, d) => (d.expiresAt < min ? d.expiresAt : min),
      deals[0].expiresAt,
    );
  }, [deals]);

  return (
    <main className="min-h-screen bg-(--color-navy)">
      {/* Hero */}
      <div className="relative min-h-[60vh] flex items-end pb-20 overflow-hidden">
        <Image
          src={HERO_IMAGE}
          alt="Exclusive travel deals"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-(--color-navy)/60 via-transparent to-(--color-navy)/90" />

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 w-full">
          <p className="font-sans text-xs uppercase tracking-widest text-(--color-gold)">
            CURATED OFFERS
          </p>
          <h1 className="font-['Cormorant_Garamond'] font-light text-5xl md:text-7xl text-white mt-3">
            Exclusive Deals.
            <br />
            Extraordinary Journeys.
          </h1>
          <p className="font-sans text-lg text-(--color-white-muted) max-w-2xl mt-4">
            Handpicked offers with genuine savings, each valid for a limited
            time.
          </p>

          {earliestExpiresAt && (
            <div className="mt-8 flex items-center gap-4">
              <span className="font-sans text-sm text-(--color-white-muted)">
                Earliest offer valid until:
              </span>
              <CountdownTimer
                variant="blocks"
                expiresAt={new Date(earliestExpiresAt)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Active deals grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <DealCardSkeleton key={i} />
            ))}
          </div>
        ) : deals.length === 0 ? (
          <div className="text-center py-20">
            <Tag className="w-16 h-16 text-(--color-gold)/30 mx-auto mb-6" />
            <h2 className="font-['Cormorant_Garamond'] text-3xl text-white">
              No Active Deals Right Now
            </h2>
            <p className="font-sans text-(--color-white-muted) mt-4">
              We regularly add exclusive offers for our travellers. Subscribe
              below to be the first to know.
            </p>
            <Button
              variant="outline-gold"
              className="mt-6 h-10 font-sans text-sm"
              asChild
            >
              <Link href="/packages">Explore Journeys →</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {deals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        )}
      </section>

      <NewsletterStrip />

      {/* Why book deals */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <h2 className="font-['Cormorant_Garamond'] text-3xl text-center text-white mb-12">
          Why Book Deals With Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {WHY_CARDS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="p-8 rounded-2xl bg-(--color-navy-surface) border border-(--color-navy-border) border-t-2 border-t-(--color-gold)"
            >
              <Icon className="text-(--color-gold) w-8 h-8" />
              <h3 className="font-['Cormorant_Garamond'] text-xl text-white mt-4">
                {title}
              </h3>
              <p className="font-sans text-sm text-(--color-white-muted) mt-2">
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
