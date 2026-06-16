import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Star, Award, Briefcase } from "lucide-react";
import type { PortableTextBlock } from "@portabletext/react";
import { PortableText } from "@portabletext/react";

import { sanityReadClient } from "@/lib/sanity";
import { dummyTeam } from "@/lib/dummy/team";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "RapidLuxe — India's premier luxury travel company. Founded in 2017, we curate extraordinary journeys for discerning travellers across 50+ destinations.",
  openGraph: {
    title: "About Us | RapidLuxe",
    description:
      "RapidLuxe — India's premier luxury travel company. Founded in 2017, we curate extraordinary journeys for discerning travellers across 50+ destinations.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=1200&auto=format&fit=crop&q=80",
        width: 1200,
        height: 800,
        alt: "RapidLuxe team",
      },
    ],
  },
};

// ── Sanity types ──────────────────────────────────────────────────────────────

interface SanityAboutPage {
  headline: string | null;
  subheadline: string | null;
  heroImageUrl: string | null;
  story: PortableTextBlock[] | null;
  missionTitle: string | null;
  missionBody: PortableTextBlock[] | null;
  team: Array<{
    name: string;
    role: string;
    bio: string;
    imageUrl: string | null;
  }> | null;
  stats: Array<{ number: string; label: string }> | null;
}

async function getAboutData(): Promise<SanityAboutPage | null> {
  try {
    return await sanityReadClient.fetch<SanityAboutPage | null>(
      `*[_type == "aboutPage"][0] {
        headline,
        subheadline,
        "heroImageUrl": heroImage.asset->url,
        story,
        "missionTitle": mission.title,
        "missionBody": mission.body,
        "team": team[] {
          name,
          role,
          bio,
          "imageUrl": image.asset->url
        },
        stats[] { number, label }
      }`,
    );
  } catch {
    return null;
  }
}

// ── Fallback data ─────────────────────────────────────────────────────────────

const FALLBACK_STATS = [
  { value: "10,000+", label: "Trips Curated", icon: MapPin },
  { value: "50+", label: "Destinations", icon: MapPin },
  { value: "4.8★", label: "Average Rating", icon: Star },
  { value: "8 Years", label: "Of Excellence", icon: Briefcase },
];

const AWARDS = [
  "Travel + Leisure India",
  "Condé Nast Traveller",
  "Forbes Travel Guide",
  "TAAI Award 2024",
  "Outlook Traveller",
  "Times Travel Awards",
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AboutPage() {
  const sanity = await getAboutData();

  const heroImage =
    sanity?.heroImageUrl ??
    "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=1600&auto=format&fit=crop&q=80";

  const displayStats = sanity?.stats?.length
    ? sanity.stats.map((s) => ({ value: s.number, label: s.label }))
    : FALLBACK_STATS.map(({ value, label }) => ({ value, label }));

  const displayTeam = sanity?.team?.length
    ? sanity.team
    : dummyTeam.map((m) => ({
        name: m.name,
        role: m.role,
        bio: m.bio,
        imageUrl: m.imageUrl,
      }));

  return (
    <main className="min-h-screen bg-(--color-navy)">
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-end pb-16 overflow-hidden">
        <Image
          src={heroImage}
          alt="RapidLuxe team at a luxury destination"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-(--color-navy) via-(--color-navy)/50 to-(--color-navy)/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full">
          <p className="font-sans text-sm tracking-widest uppercase text-(--color-gold) mb-3">
            Who We Are
          </p>
          <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-7xl text-white font-light leading-none">
            {sanity?.headline ?? "Our Story"}
          </h1>
          {sanity?.subheadline && (
            <p className="font-sans text-(--color-white-muted) mt-4 max-w-xl">
              {sanity.subheadline}
            </p>
          )}
        </div>
      </section>

      {/* Story */}
      <section className="py-20 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl text-white font-light leading-tight">
              Luxury travel,{" "}
              <span className="text-(--color-gold)">designed for India.</span>
            </h2>
            {sanity?.story?.length ? (
              <div className="font-sans text-(--color-white-muted) leading-relaxed space-y-4 prose prose-invert prose-sm max-w-none">
                <PortableText value={sanity.story} />
              </div>
            ) : (
              <>
                <p className="font-sans text-(--color-white-muted) leading-relaxed">
                  RapidLuxe was born in 2017 from a simple frustration:
                  India&apos;s wealthiest travellers were booking world-class
                  trips through agencies that didn&apos;t understand them.
                  Generic itineraries, opaque pricing, and zero personalisation
                  were the norm.
                </p>
                <p className="font-sans text-(--color-white-muted) leading-relaxed">
                  We set out to build something different — a travel company
                  with the editorial sensibility of a luxury magazine, the
                  technology of a modern startup, and the warmth of a family-run
                  enterprise.
                </p>
                <p className="font-sans text-(--color-white-muted) leading-relaxed">
                  Today, RapidLuxe serves 10,000+ travellers a year across 50+
                  destinations — from private villas in Bali to glacier treks in
                  Patagonia.
                </p>
              </>
            )}
          </div>
          <div className="relative aspect-4/5 rounded-2xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop&q=80"
              alt="Luxury travel experience"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute bottom-6 left-6 right-6 bg-(--color-navy)/80 backdrop-blur-sm rounded-xl p-4 border border-(--color-gold)/20">
              <p className="font-['Cormorant_Garamond'] text-lg text-white leading-snug">
                &ldquo;
                {sanity?.missionTitle ??
                  "We don't sell holidays. We architect memories."}
                &rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-(--color-navy-surface)/60 border-y border-(--color-navy-border)">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {displayStats.map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <span className="font-['JetBrains_Mono'] text-4xl md:text-5xl text-(--color-gold) font-normal leading-none">
                  {value}
                </span>
                <span className="font-sans text-sm text-(--color-text-secondary) uppercase tracking-widest">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-14">
          <p className="font-sans text-sm tracking-widest uppercase text-(--color-gold) mb-2">
            The People Behind the Magic
          </p>
          <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl text-white font-light">
            Meet the Team
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayTeam.map((member) => (
            <article
              key={member.name}
              className="group flex flex-col rounded-xl overflow-hidden bg-(--color-navy-surface) border border-(--color-navy-border) hover:border-(--color-gold)/30 transition-colors"
            >
              <div className="relative aspect-3/4 overflow-hidden">
                {member.imageUrl ? (
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full bg-(--color-navy) flex items-center justify-center">
                    <span className="font-['Cormorant_Garamond'] text-5xl text-(--color-gold)/40">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-(--color-navy) via-transparent to-transparent opacity-60" />
              </div>
              <div className="p-5 flex flex-col gap-2 flex-1">
                <h3 className="font-['Cormorant_Garamond'] text-xl text-white">
                  {member.name}
                </h3>
                <p className="font-sans text-xs text-(--color-gold) uppercase tracking-widest">
                  {member.role}
                </p>
                <p className="font-sans text-sm text-(--color-text-secondary) leading-relaxed mt-1 line-clamp-4">
                  {member.bio}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Awards / Press */}
      <section className="py-16 border-t border-(--color-navy-border)">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-10">
            <p className="font-sans text-sm tracking-widest uppercase text-(--color-text-secondary) flex items-center justify-center gap-2">
              <Award size={14} className="text-(--color-gold)" />
              As featured in &amp; recognised by
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-4">
            {AWARDS.map((name) => (
              <span
                key={name}
                className="font-sans text-xs font-medium tracking-widest uppercase px-5 py-2.5 rounded-full border border-(--color-navy-border) text-(--color-text-secondary) hover:border-(--color-gold)/40 hover:text-(--color-white-muted) transition-colors"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 max-w-7xl mx-auto px-4 md:px-8 text-center">
        <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl text-white font-light mb-4">
          Ready to travel with us?
        </h2>
        <p className="font-sans text-(--color-white-muted) text-sm mb-8 max-w-md mx-auto">
          Browse our curated collection of luxury packages and let us craft an
          experience that exceeds every expectation.
        </p>
        <Link
          href="/packages"
          className="inline-flex items-center gap-2 bg-(--color-coral) text-white font-sans font-medium px-10 py-4 rounded-lg hover:bg-(--color-coral)/90 transition-colors text-sm"
        >
          Browse Packages <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  );
}
