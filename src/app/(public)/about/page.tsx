import type { PortableTextBlock } from "@portabletext/react";
import { PortableText } from "@portabletext/react";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

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
}

interface TrustStat {
  number: string;
  label: string;
}

async function getAboutData(): Promise<{
  about: SanityAboutPage | null;
  trustBarStats: TrustStat[];
}> {
  try {
    const [about, siteData] = await Promise.all([
      sanityReadClient.fetch<SanityAboutPage | null>(
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
          }
        }`,
      ),
      sanityReadClient.fetch<{ trustBarStats: TrustStat[] | null } | null>(
        `*[_type == "siteContent"][0] { trustBarStats[] { number, label } }`,
      ),
    ]);
    return { about, trustBarStats: siteData?.trustBarStats ?? [] };
  } catch {
    return { about: null, trustBarStats: [] };
  }
}

// ── Process steps ─────────────────────────────────────────────────────────────

const PROCESS_STEPS = [
  {
    number: "01",
    title: "You Enquire",
    body: "Tell us where you want to go, when, and who's coming.",
  },
  {
    number: "02",
    title: "We Listen",
    body: "A WhatsApp conversation to understand exactly what you need — not what a brochure suggests.",
  },
  {
    number: "03",
    title: "We Design",
    body: "Your bespoke itinerary — every stay, transfer, and experience handpicked for you specifically.",
  },
  {
    number: "04",
    title: "You Approve",
    body: "Review your quote. Request changes. We refine until every detail is right.",
  },
  {
    number: "05",
    title: "You Travel",
    body: "We stay reachable throughout. You focus entirely on the experience.",
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
  const { about: sanity, trustBarStats } = await getAboutData();

  const heroImage =
    sanity?.heroImageUrl ??
    "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=1600&auto=format&fit=crop&q=80";

  return (
    <main className="min-h-screen bg-(--color-navy)">
      {/* SECTION 1 — Hero */}
      <section className="relative min-h-[70vh] flex items-end pb-20 overflow-hidden">
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
          <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-7xl text-(--color-white) font-light leading-none max-w-3xl">
            {sanity?.headline ?? "Designed to Restore. Built to Inspire."}
          </h1>
          {(sanity?.subheadline ?? true) && (
            <p className="font-sans text-(--color-white-muted) mt-5 max-w-2xl text-base leading-relaxed">
              {sanity?.subheadline ??
                "We are a boutique luxury travel studio built on one belief: every journey should restore you."}
            </p>
          )}
        </div>
      </section>

      {/* SECTION 2 — Story (40 / 60) */}
      <section className="py-20 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-5 gap-16 items-start">
          {/* Left 40% — pull quote */}
          <div className="md:col-span-2">
            <div
              className="w-12 h-px mb-6"
              style={{ backgroundColor: "var(--color-gold)" }}
            />
            <p className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-(--color-white) font-light italic leading-snug">
              &ldquo;We don&apos;t sell holidays. We design experiences that
              heal, inspire, and stay with you forever.&rdquo;
            </p>
            <p
              className="font-sans text-sm mt-6"
              style={{ color: "var(--color-gold)" }}
            >
              — Siddhesh Sood, Founder
            </p>
          </div>

          {/* Right 60% — story body */}
          <div className="md:col-span-3">
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

      {/* SECTION 3 — Trust stats bar */}
      {trustBarStats.length > 0 && (
        <section className="border-y py-12 bg-(--color-navy-surface) border-(--color-navy-border)">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x md:divide-(--color-navy-border)">
              {trustBarStats.map(({ number, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 md:px-8"
                >
                  <span
                    className="font-mono text-4xl font-bold"
                    style={{ color: "var(--color-gold)" }}
                  >
                    {number}
                  </span>
                  <span
                    className="font-sans text-sm uppercase tracking-wider text-center"
                    style={{ color: "var(--color-white-muted)" }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 4 — Therapycation Philosophy */}
      <section className="py-20 bg-(--color-navy-surface)">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-sans text-xs tracking-[0.3em] uppercase text-(--color-gold) mb-4">
                Our Philosophy
              </p>
              <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl text-(--color-white) font-light mb-6">
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

            {/* Right — quote card */}
            <div className="relative rounded-2xl border p-8 overflow-hidden bg-(--color-navy) border-(--color-navy-border)">
              <div
                className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full"
                style={{ backgroundColor: "var(--color-gold)" }}
              />
              <p className="font-['Cormorant_Garamond'] text-xl italic font-light text-(--color-white) leading-relaxed">
                &ldquo;In the world of high-end travel, there is often too much
                noise and not enough intent.&rdquo;
              </p>
              <p
                className="font-sans text-sm mt-6"
                style={{ color: "var(--color-gold)" }}
              >
                — Siddhesh Sood, Founder
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — Team (Sanity only) */}
      {sanity?.team && sanity.team.length > 0 && (
        <section className="py-20 max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-14">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-(--color-gold) mb-3">
              The People Behind the Magic
            </p>
            <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl text-(--color-white) font-light">
              Meet the Team
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {sanity.team.slice(0, 2).map((member) => (
              <div
                key={member.name}
                className="bg-(--color-navy-surface) border border-(--color-navy-border) rounded-2xl overflow-hidden group hover:border-(--color-gold)/30 transition-colors duration-300"
              >
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

                <div className="p-6">
                  <div
                    className="w-12 h-px mb-4"
                    style={{ backgroundColor: "var(--color-gold)" }}
                  />
                  <h3 className="font-['Cormorant_Garamond'] text-2xl text-(--color-white)">
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
      )}

      {/* SECTION 6 — Our Process */}
      <section className="py-20 bg-(--color-navy-surface)">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-14">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-(--color-gold) mb-3">
              How We Work
            </p>
            <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl text-(--color-white) font-light">
              From First Message to Final Memory
            </h2>
          </div>

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
                  <h3 className="font-['Cormorant_Garamond'] text-lg text-(--color-white) mb-2">
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

      {/* SECTION 7 — CTA strip */}
      <section
        className="py-20 text-center px-4"
        style={{
          background:
            "linear-gradient(135deg, var(--color-gold) 0%, var(--color-gold-muted) 100%)",
        }}
      >
        <h2
          className="font-['Cormorant_Garamond'] text-4xl md:text-5xl font-light mb-4"
          style={{ color: "#0B0F1A" }}
        >
          Ready to travel with us?
        </h2>
        <p
          className="font-sans text-sm mb-8 max-w-md mx-auto"
          style={{ color: "rgba(11,15,26,0.7)" }}
        >
          Browse our curated packages and let us design your next Therapycation.
        </p>
        <Link
          href="/packages"
          className="inline-flex items-center gap-2 font-sans font-medium px-10 py-4 rounded-lg text-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#0B0F1A", color: "#FFFFFF" }}
        >
          Browse Packages <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  );
}
