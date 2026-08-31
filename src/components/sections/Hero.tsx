"use client";

import { gsap } from "gsap";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

function toMp4CloudinaryUrl(url: string | undefined): string | undefined {
  if (!url) return url;
  const marker = "cloudinary.com/video/upload/";
  const markerIndex = url.indexOf(marker);
  if (markerIndex === -1) return url;
  const insertAt = markerIndex + marker.length;
  return `${url.slice(0, insertAt)}f_mp4,q_auto,vc_auto/${url.slice(insertAt)}`;
}

export function Hero() {
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoUrl = toMp4CloudinaryUrl(process.env.NEXT_PUBLIC_HERO_VIDEO_URL);
  const posterUrl = process.env.NEXT_PUBLIC_HERO_POSTER_URL;

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!prefersReduced) {
      videoRef.current?.play().catch(() => {});

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
          scrollRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.4 },
          "-=0.2",
        );
    }
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          aria-hidden="true"
          preload="metadata"
          className="absolute inset-0 w-full h-full object-fill"
          {...(posterUrl ? { poster: posterUrl } : {})}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
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
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <p
          ref={eyebrowRef}
          className="font-sans font-medium text-sm tracking-[0.2em] uppercase"
          style={{ color: "var(--color-gold)" }}
        >
          India&apos;s Original Therapycation Travel Studio
        </p>

        <h1
          ref={h1Ref}
          className="mt-4 font-(family-name:--font-display) text-5xl md:text-6xl lg:text-7xl font-light text-white leading-[1.05]"
          style={{ textShadow: "0 2px 24px rgba(11,15,26,0.6)" }}
        >
          Travel That
          <br />
          Restores You
        </h1>

        <p
          ref={subRef}
          className="mt-6 font-sans text-lg max-w-xl mx-auto text-white/80"
          style={{ textShadow: "0 1px 12px rgba(11,15,26,0.5)" }}
        >
          Bespoke journeys, handpicked by experts — designed to rest, reconnect,
          and restore.
        </p>

        <div
          ref={ctaRef}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            variant="coral"
            size="lg"
            className="h-auto px-8 py-4 rounded-lg text-base font-sans w-full sm:w-auto"
            asChild
          >
            <Link href="/packages">Explore Journeys</Link>
          </Button>
          <Button
            variant="outline-gold"
            size="lg"
            className="h-auto px-8 py-4 rounded-lg text-base font-sans w-full sm:w-auto"
            asChild
          >
            <Link href="/contact">Bespoke Planning</Link>
          </Button>
        </div>
      </div>

      {/* Scroll indicator — pinned to bottom of section */}
      <div
        ref={scrollRef}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <ChevronDown size={24} className="animate-bounce text-white/60" />
        <span className="text-xs font-sans text-white/50">
          Scroll to explore
        </span>
      </div>
    </section>
  );
}
