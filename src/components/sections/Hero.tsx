"use client";

import { gsap } from "gsap";
import { ArrowUpRight, ChevronDown, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { usePackages } from "@/hooks/api/usePackages";
import { useSiteContent } from "@/hooks/api/useSiteContent";
import { PILL_BUTTON_CLASS } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";

const BASE_VIDEO_TRANSFORMS = "f_mp4,q_auto,vc_auto";
// The source video has a logo burned into its top-left corner, so every crop
// (CSS object-position and this Cloudinary gravity) is anchored top-left.
const MOBILE_VIDEO_TRANSFORMS = `${BASE_VIDEO_TRANSFORMS},c_fill,ar_9:16,g_north_west,w_720`;

function toCloudinaryVideoUrl(
  url: string | undefined,
  transforms: string,
): string | undefined {
  if (!url) return url;
  const marker = "cloudinary.com/video/upload/";
  const markerIndex = url.indexOf(marker);
  if (markerIndex === -1) return url;
  const insertAt = markerIndex + marker.length;
  return `${url.slice(0, insertAt)}${transforms}/${url.slice(insertAt)}`;
}

const BADGE_TEXT = "EXPLORE NOW • EXPLORE NOW • ";

// Sample traveler avatars — decorative stock photography, not real customer
// data; the count/label next to them stays sourced from real trustBarStats.
const AVATAR_PHOTOS = [
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=72&h=72&fit=crop&crop=faces&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=72&h=72&fit=crop&crop=faces&q=80",
  "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=72&h=72&fit=crop&crop=faces&q=80",
];

// Circular badge text, one <tspan> per character positioned around an SVG
// circle — CSS-only rotation (respects prefers-reduced-motion via the
// .animate-spin-slow class below), no JS animation loop needed.
function RotatingExploreBadge({ spinning }: { spinning: boolean }) {
  const radius = 46;
  return (
    <div className="relative w-28 h-28 shrink-0">
      <svg
        viewBox="0 0 120 120"
        className={spinning ? "animate-[spin_12s_linear_infinite]" : ""}
        aria-hidden="true"
      >
        <defs>
          <path
            id="badge-circle"
            d={`M 60,60 m -${radius},0 a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 -${radius * 2},0`}
          />
        </defs>
        <text
          className="font-sans"
          style={{
            fill: "#FFFFFF",
            fontSize: "10.5px",
            letterSpacing: "2px",
          }}
        >
          <textPath href="#badge-circle" startOffset="0%">
            {BADGE_TEXT}
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "var(--color-coral)" }}
        >
          <Play
            size={14}
            className="ml-0.5"
            fill="var(--color-accent-coral-ink)"
            style={{ color: "var(--color-accent-coral-ink)" }}
          />
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  // Picked after mount (not <source media>, which video elements don't
  // reliably honor) — poster covers the brief gap before the source is set.
  const videoUrl =
    isMobile === null
      ? undefined
      : toCloudinaryVideoUrl(
          process.env.NEXT_PUBLIC_HERO_VIDEO_URL,
          isMobile ? MOBILE_VIDEO_TRANSFORMS : BASE_VIDEO_TRANSFORMS,
        );
  const posterUrl = process.env.NEXT_PUBLIC_HERO_POSTER_URL;

  // Real featured package for the floating card — never fabricated content.
  const { data: packagesData } = usePackages({ sort: "featured", limit: 1 });
  const featured = packagesData?.data?.[0];
  const featuredImage = featured?.images?.[0];

  // Real, admin-managed stat for the social-proof strip — same source as
  // TrustBar; if none exists yet, the strip simply doesn't render.
  const { data: siteContent } = useSiteContent();
  const joinedStat =
    siteContent?.trustBarStats?.find((s) =>
      /travel|customer|guest|member|joined/i.test(s.label),
    ) ?? siteContent?.trustBarStats?.[0];

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setReducedMotion(prefersReduced);
    setIsMobile(window.matchMedia("(max-width: 767px)").matches);

    if (!prefersReduced) {
      gsap
        .timeline()
        .fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        )
        .fromTo(
          h1Ref.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.3",
        )
        .fromTo(
          subRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.4",
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.3",
        )
        .fromTo(
          badgeRef.current,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.5 },
          "-=0.3",
        )
        .fromTo(
          cardRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.3",
        )
        .fromTo(
          scrollRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.4 },
          "-=0.2",
        );
    }
  }, []);

  useEffect(() => {
    if (!videoUrl || reducedMotion) return;
    videoRef.current?.play().catch(() => {});
  }, [videoUrl, reducedMotion]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          aria-hidden="true"
          preload="metadata"
          src={videoUrl}
          className="absolute inset-0 w-full h-full object-cover object-top-left"
          {...(posterUrl ? { poster: posterUrl } : {})}
        />
        {/* Base layer — consistent darkening over any video frame or theme */}
        <div className="absolute inset-0 bg-[#1B2A41]/50" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, #1B2A4180 0%, rgba(11,15,26,0.2) 45%, rgba(11,15,26,0.2) 55%, #1B2A41E0 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 pt-20 pb-16">
        <div className="max-w-2xl">
          <p
            ref={eyebrowRef}
            className="font-sans font-medium text-sm tracking-[0.2em] uppercase"
            style={{ color: "var(--color-gold)" }}
          >
            India&apos;s Original Therapycation Travel Studio
          </p>

          <h1
            ref={h1Ref}
            className="mt-4 font-(family-name:--font-display) text-5xl md:text-6xl lg:text-7xl font-light text-[#FFFFFF] leading-[1.05]"
            style={{ textShadow: "0 2px 24px rgba(11,15,26,0.6)" }}
          >
            Travel That
            <br />
            Restores You
          </h1>

          <p
            ref={subRef}
            className="mt-6 font-sans text-lg max-w-xl text-[#FFFFFF]/80"
            style={{ textShadow: "0 1px 12px rgba(11,15,26,0.5)" }}
          >
            Bespoke journeys, handpicked by experts — designed to rest,
            reconnect, and restore.
          </p>

          <div
            ref={ctaRef}
            className="mt-8 md:mt-10 flex flex-wrap items-center gap-4"
          >
            <Button
              variant="coral"
              size="lg"
              className={cn(PILL_BUTTON_CLASS, "text-base font-sans")}
              asChild
            >
              <Link href="/packages">Explore Journeys</Link>
            </Button>
            <Link
              href="/contact"
              aria-label="Bespoke Planning"
              className={cn(
                PILL_BUTTON_CLASS,
                "group flex items-center px-0 border border-[#FFFFFF]/40 text-[#FFFFFF] overflow-hidden transition-[padding-right] duration-300 hover:pr-6",
              )}
            >
              <span className="flex items-center justify-center size-11 shrink-0">
                <ArrowUpRight size={20} />
              </span>
              <span className="max-w-0 group-hover:max-w-40 overflow-hidden whitespace-nowrap font-sans text-sm transition-[max-width] duration-300">
                Bespoke Planning
              </span>
            </Link>
          </div>

          {/* Explore badge — real control into the packages catalogue */}
          <div ref={badgeRef} className="mt-8 md:mt-12">
            <Link
              href="/packages"
              aria-label="Explore all packages"
              className="inline-block"
            >
              <RotatingExploreBadge spinning={!reducedMotion} />
            </Link>
          </div>
        </div>

        {/* Floating featured-journey card — real data, never fabricated */}
        {featured && featuredImage && (
          <div
            ref={cardRef}
            className="hidden lg:block absolute right-4 xl:right-8 bottom-20 w-80 xl:w-96"
          >
            <div
              className={
                reducedMotion
                  ? ""
                  : "animate-[hero-card-float_6s_ease-in-out_infinite]"
              }
            >
              <Link
                href={`/packages/${featured.slug}`}
                className="group block rounded-2xl overflow-hidden bg-[#1B2A41]/90 backdrop-blur-sm border border-[#FFFFFF]/10 shadow-2xl transition-colors hover:border-(--color-gold)/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
              >
                <div className="relative h-48 xl:h-56 w-full overflow-hidden">
                  <Image
                    src={featuredImage}
                    alt={featured.title}
                    fill
                    sizes="384px"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                  <div
                    className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:rotate-45"
                    style={{ backgroundColor: "#FFFFFF" }}
                  >
                    <ArrowUpRight size={16} style={{ color: "#1B2A41" }} />
                  </div>
                </div>
                <div className="p-5">
                  <p className="font-(family-name:--font-display) text-xl text-[#FFFFFF]">
                    {featured.destination?.name ?? featured.title}
                  </p>
                  <p className="mt-1 font-sans text-sm text-[#FFFFFF]/70 line-clamp-2">
                    {featured.title}
                  </p>
                </div>
              </Link>

              {joinedStat && (
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {AVATAR_PHOTOS.map((src, i) => (
                      <div
                        key={src}
                        className="relative w-9 h-9 rounded-full border-2 overflow-hidden transition-transform duration-300 hover:z-10 hover:scale-110"
                        style={{
                          borderColor: "#1B2A41",
                          transitionDelay: `${i * 60}ms`,
                        }}
                      >
                        <Image
                          src={src}
                          alt=""
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      </div>
                    ))}
                    <div
                      className="w-9 h-9 rounded-full border-2 flex items-center justify-center animate-pulse"
                      style={{
                        borderColor: "#1B2A41",
                        backgroundColor: "var(--color-coral)",
                      }}
                    >
                      <span
                        className="font-sans text-[10px] font-semibold"
                        style={{ color: "var(--color-accent-coral-ink)" }}
                      >
                        +
                      </span>
                    </div>
                  </div>
                  <p className="font-sans text-sm text-[#FFFFFF]/80">
                    <span className="font-semibold text-[#FFFFFF]">
                      {joinedStat.number}
                    </span>{" "}
                    {joinedStat.label}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Scroll indicator — pinned to bottom of section */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <ChevronDown size={24} className="animate-bounce text-[#FFFFFF]/60" />
        <span className="text-xs font-sans text-[#FFFFFF]/50">
          Scroll to explore
        </span>
      </div>
    </section>
  );
}
