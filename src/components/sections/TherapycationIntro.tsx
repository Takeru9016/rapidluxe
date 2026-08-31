"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

const THERAPYCATION_IMAGE =
  "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=1200&auto=format&fit=crop&q=80";

export function TherapycationIntro() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced || !sectionRef.current) return;

    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      },
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="therapycation-heading"
      className="py-20 md:py-32 bg-(--color-navy-surface)"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-5 gap-12 md:gap-16 items-center">
          {/* Copy — 2/5 */}
          <div className="md:col-span-2">
            <div
              className="w-12 h-px mb-6"
              style={{ backgroundColor: "var(--color-gold)" }}
            />
            <p
              className="font-sans text-xs tracking-[0.3em] uppercase mb-4"
              style={{ color: "var(--color-gold)" }}
            >
              Our Philosophy
            </p>
            <h2
              id="therapycation-heading"
              className="font-(family-name:--font-display) text-4xl md:text-5xl text-white font-light leading-tight mb-6"
            >
              What is a Therapycation?
            </h2>
            <p className="font-sans text-base leading-relaxed text-(--color-white-muted)">
              A Therapycation is not just a holiday. It&apos;s a deliberately
              designed journey that gives your mind and body exactly what they
              need — whether that&apos;s stillness, adventure, culture, or pure
              indulgence. We call it Therapycation. Travel that restores you.
            </p>
            <div className="mt-8">
              <Button variant="outline-gold" className="font-sans" asChild>
                <Link href="/about">Discover Therapycation</Link>
              </Button>
            </div>
          </div>

          {/* Visual — 3/5 */}
          <div className="md:col-span-3 relative aspect-4/3 rounded-2xl overflow-hidden">
            <Image
              src={THERAPYCATION_IMAGE}
              alt="A quiet, restorative RapidLuxe travel moment"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
