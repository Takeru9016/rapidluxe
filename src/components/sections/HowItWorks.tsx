"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type LucideIcon, MessageSquare, Plane, Search } from "lucide-react";
import { useEffect, useRef } from "react";

import { useSiteContent } from "@/hooks/api/useSiteContent";

gsap.registerPlugin(ScrollTrigger);

const STEP_ICONS: LucideIcon[] = [Search, MessageSquare, Plane];

export function HowItWorks() {
  const stepsRef = useRef<HTMLDivElement>(null);
  const { data, isLoading } = useSiteContent();
  const steps = data?.howItWorksSteps ?? [];

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced || !stepsRef.current) return;

    const cards =
      stepsRef.current.querySelectorAll<HTMLElement>(":scope > div");

    gsap.fromTo(
      cards,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: stepsRef.current,
          start: "top 75%",
          once: true,
        },
      },
    );
  }, []);

  if (!isLoading && steps.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8">
      <div className="relative">
        {/* Desktop connector line */}
        <div
          className="absolute top-12 left-[16%] right-[16%] h-px hidden md:block"
          style={{ backgroundColor: "var(--color-navy-border)" }}
        />

        <div
          ref={stepsRef}
          className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8"
        >
          {steps.map((step, i) => {
            const Icon = STEP_ICONS[i % STEP_ICONS.length];
            return (
              <div
                key={step.stepNumber}
                className="flex flex-col items-center text-center"
              >
                <div
                  className="relative z-10 w-24 h-24 rounded-full border-2 flex items-center justify-center"
                  style={{ borderColor: "var(--color-gold)" }}
                >
                  <Icon size={32} style={{ color: "var(--color-gold)" }} />
                </div>
                <p
                  className="text-xs tracking-widest mt-4 mb-2"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--color-gold)",
                  }}
                >
                  STEP {step.stepNumber}
                </p>
                <h3
                  className="text-2xl text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm leading-relaxed mt-3"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--color-white-muted)",
                  }}
                >
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
