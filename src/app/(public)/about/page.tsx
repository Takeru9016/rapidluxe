import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PortableTextBlock } from "@portabletext/react";
import { PortableText } from "@portabletext/react";

import { sanityReadClient } from "@/lib/sanity";

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
  { value: "27", label: "Countries Explored" },
  { value: "500+", label: "Happy Travellers" },
  { value: "100%", label: "Bespoke Journeys" },
  { value: "2hrs", label: "Response Time" },
];

const FALLBACK_TEAM = [
  {
    name: "Siddhesh",
    role: "Founder & Lead Travel Designer",
    bio: "Having explored 27 countries personally, Siddhesh built RapidLuxe to share that knowledge — crafting itineraries that go beyond the guidebook and into the extraordinary.",
    imageUrl: null,
  },
  {
    name: "Kabita",
    role: "Client Experience & Partnerships",
    bio: "Kabita ensures every client feels heard from the first WhatsApp message to the final flight home. She manages all partnerships, ensuring our hotel and activity network reflects true luxury.",
    imageUrl: null,
  },
];

const PROCESS_STEPS = [
  {
    number: "01",
    title: "You Enquire",
    body: "Tell us where you want to go and when.",
  },
  {
    number: "02",
    title: "We Listen",
    body: "A call or WhatsApp conversation to understand exactly what you need.",
  },
  {
    number: "03",
    title: "We Design",
    body: "We build your bespoke itinerary — every stay, transfer, and experience handpicked.",
  },
  {
    number: "04",
    title: "You Approve",
    body: "Review your quote. Request changes. We refine until it's perfect.",
  },
  {
    number: "05",
    title: "You Travel",
    body: "We stay reachable throughout. You focus on the experience.",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AboutPage() {
  const sanity = await getAboutData();

  const heroImage =
    sanity?.heroImageUrl ??
    "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=1600&auto=format&fit=crop&q=80";

  const displayStats = sanity?.stats?.length
    ? sanity.stats.map((s) => ({ value: s.number, label: s.label }))
    : FALLBACK_STATS;

  const displayTeam = sanity?.team?.length ? sanity.team : FALLBACK_TEAM;

  return (
    <main className="min-h-screen bg-(--color-navy)">
      {/* SECTION 1 — Hero */}
      <section className="relative min-h-[60vh] flex items-end pb-20 overflow-hidden">
        <Image
          src={heroImage}
          alt="RapidLuxe — luxury travel"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-(--color-navy) via-(--color-navy)/50 to-(--color-navy)/10" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-(--color-gold) mb-4">
            Who We Are
          </p>
          <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-7xl text-white font-light leading-none max-w-3xl">
            {sanity?.headline ?? "Your Next Journey Awaits"}
          </h1>
          {(sanity?.subheadline ?? true) && (
            <p className="font-sans text-(--color-white-muted) mt-5 max-w-2xl text-base leading-relaxed">
              {sanity?.subheadline ??
                "We are a boutique luxury travel studio built on one belief: every journey should restore you."}
            </p>
          )}
        </div>
      </section>

      {/* SECTION 2 — Story */}
      <section className="py-20 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left — pull quote */}
          <div>
            <p
              className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white font-light italic leading-snug"
              style={{ color: "var(--color-white)" }}
            >
              &ldquo;We don&apos;t sell holidays. We design experiences that
              heal, inspire, and stay with you forever.&rdquo;
            </p>
            {/* Stats row */}
            <div className="mt-12 grid grid-cols-2 gap-6">
              {displayStats.map(({ value, label }) => (
                <div key={label}>
                  <p
                    className="font-['JetBrains_Mono'] text-3xl font-bold"
                    style={{ color: "var(--color-gold)" }}
                  >
                    {value}
                  </p>
                  <p className="font-sans text-sm text-(--color-white-muted) mt-1">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — story body */}
          <div>
            {sanity?.story?.length ? (
              <div className="font-sans text-(--color-white-muted) leading-relaxed space-y-4 prose prose-invert prose-sm max-w-none">
                <PortableText value={sanity.story} />
              </div>
            ) : (
              <div className="space-y-5">
                <p className="font-sans text-(--color-white-muted) leading-relaxed">
                  RapidLuxe was born from a simple frustration: India&apos;s
                  discerning travellers deserved better than generic packages
                  and opaque pricing. We set out to build something different.
                </p>
                <p className="font-sans text-(--color-white-muted) leading-relaxed">
                  A travel company with the editorial sensibility of a luxury
                  magazine, the responsiveness of a startup, and the warmth of a
                  family-run enterprise. Every itinerary we design is entirely
                  bespoke — built around you, not a group tour schedule.
                </p>
                <p className="font-sans text-(--color-white-muted) leading-relaxed">
                  We call it Therapycation. Travel that restores you. Every
                  journey we design aims to provide a complete mental and
                  emotional recharge — whether that&apos;s a private villa in
                  Bali or a glacier trek in Patagonia.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 3 — Philosophy */}
      <section className="py-20" style={{ backgroundColor: "#111827" }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-(--color-gold) mb-4">
                Our Philosophy
              </p>
              <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl text-white font-light mb-6">
                What is a Therapycation?
              </h2>
              {sanity?.missionBody?.length ? (
                <div className="font-sans text-(--color-white-muted) leading-relaxed space-y-4 prose prose-invert prose-sm max-w-none">
                  <PortableText value={sanity.missionBody} />
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="font-sans text-(--color-white-muted) leading-relaxed">
                    A Therapycation is not just a holiday. It&apos;s a
                    deliberately designed journey that gives your mind and body
                    exactly what they need — whether that&apos;s stillness,
                    adventure, culture, or pure indulgence.
                  </p>
                  <p className="font-sans text-(--color-white-muted) leading-relaxed">
                    We believe the best travel experiences don&apos;t just
                    entertain you. They change you — even if just a little. They
                    give you perspective, rest, and stories worth telling.
                  </p>
                </div>
              )}
            </div>
            {/* Decorative right side */}
            <div className="flex items-center justify-center">
              <div className="relative">
                <div
                  className="w-px h-64 mx-auto"
                  style={{ backgroundColor: "var(--color-gold)", opacity: 0.4 }}
                />
                <p
                  className="font-['Cormorant_Garamond'] text-2xl text-white italic font-light text-center mt-8 max-w-xs mx-auto"
                  style={{ color: "var(--color-gold-muted)" }}
                >
                  &ldquo;
                  {sanity?.missionTitle ??
                    "Travel should restore you, not exhaust you."}
                  &rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — Team */}
      <section className="py-20 max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-14">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-(--color-gold) mb-3">
            The People Behind the Magic
          </p>
          <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl text-white font-light">
            Meet the Team
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {displayTeam.slice(0, 2).map((member) => (
            <div
              key={member.name}
              className="bg-(--color-navy-surface) border border-(--color-navy-border) rounded-2xl overflow-hidden group hover:border-(--color-gold)/30 transition-colors duration-300"
            >
              {/* Portrait */}
              {member.imageUrl ? (
                <div className="aspect-3/4 relative overflow-hidden">
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-(--color-navy-surface)/80 via-transparent to-transparent" />
                </div>
              ) : (
                <div
                  className="aspect-3/4 flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-navy) 0%, color-mix(in srgb, var(--color-gold) 8%, var(--color-navy)) 100%)",
                  }}
                >
                  <span
                    className="font-['Cormorant_Garamond'] text-7xl font-light"
                    style={{ color: "var(--color-gold)", opacity: 0.6 }}
                  >
                    {getInitials(member.name)}
                  </span>
                </div>
              )}

              {/* Info */}
              <div className="p-6">
                <div
                  className="w-12 h-px mb-4"
                  style={{ backgroundColor: "var(--color-gold)" }}
                />
                <h3 className="font-['Cormorant_Garamond'] text-2xl text-white">
                  {member.name}
                </h3>
                <p
                  className="font-sans text-xs tracking-widest uppercase mt-1 mb-3"
                  style={{ color: "var(--color-gold)" }}
                >
                  {member.role}
                </p>
                <p className="font-sans text-sm text-(--color-white-muted) leading-relaxed line-clamp-4">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5 — Our Process */}
      <section className="py-20" style={{ backgroundColor: "#111827" }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-14">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-(--color-gold) mb-3">
              How We Work
            </p>
            <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl text-white font-light">
              From First Message to Final Memory
            </h2>
          </div>

          {/* Timeline — horizontal desktop, vertical mobile */}
          <div className="relative">
            {/* Connector line — desktop */}
            <div
              className="hidden md:block absolute top-8 left-[10%] right-[10%] h-px"
              style={{ backgroundColor: "var(--color-navy-border)" }}
            />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4">
              {PROCESS_STEPS.map((step) => (
                <div
                  key={step.number}
                  className="flex flex-col items-center text-center md:px-2"
                >
                  {/* Step circle */}
                  <div
                    className="relative z-10 w-16 h-16 rounded-full border flex items-center justify-center mb-4 shrink-0"
                    style={{
                      borderColor: "var(--color-gold)",
                      backgroundColor: "var(--color-navy)",
                    }}
                  >
                    <span
                      className="font-['JetBrains_Mono'] text-sm font-bold"
                      style={{ color: "var(--color-gold)" }}
                    >
                      {step.number}
                    </span>
                  </div>
                  <h3 className="font-['Cormorant_Garamond'] text-lg text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="font-sans text-xs text-(--color-white-muted) leading-relaxed">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — CTA strip */}
      <section
        className="py-20 text-center px-4"
        style={{
          background: "linear-gradient(135deg, #C9A84C 0%, #A07C30 100%)",
        }}
      >
        <h2
          className="font-['Cormorant_Garamond'] text-4xl md:text-5xl font-light mb-4"
          style={{ color: "#0B1120" }}
        >
          Ready to travel with us?
        </h2>
        <p
          className="font-sans text-sm mb-8 max-w-md mx-auto"
          style={{ color: "rgba(11,17,32,0.7)" }}
        >
          Browse our curated packages and let us design your next Therapycation.
        </p>
        <Link
          href="/packages"
          className="inline-flex items-center gap-2 font-sans font-medium px-10 py-4 rounded-lg text-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#0B1120", color: "#FFFFFF" }}
        >
          Browse Packages <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  );
}
