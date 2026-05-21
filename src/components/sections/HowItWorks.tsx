"use client";

import { useEffect, useRef } from "react";
import { Search, Calendar, Plane, LucideIcon } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Step {
  step: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    step: "01",
    icon: Search,
    title: "Search & Discover",
    description:
      "Browse curated packages across 50+ destinations. Filter by budget, duration, and travel style.",
  },
  {
    step: "02",
    icon: Calendar,
    title: "Book with Confidence",
    description:
      "Secure your spot with our flexible booking. 100% money-back guarantee on all packages.",
  },
  {
    step: "03",
    icon: Plane,
    title: "Travel & Explore",
    description:
      "Let us handle the details. You focus on creating memories that last a lifetime.",
  },
];

export function HowItWorks() {
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !stepsRef.current) return;

    const cards = stepsRef.current.querySelectorAll<HTMLElement>(":scope > div");

    gsap.fromTo(
      cards,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: stepsRef.current,
          start: "top 75%",
          once: true,
        },
      }
    );
  }, []);

  return (
    <section className="py-20 md:py-32">
      {/* Header */}
      <div className="text-center mb-16 px-4">
        <p
          className="font-[family-name:var(--font-body)] text-sm tracking-widest uppercase"
          style={{ color: "var(--color-gold)" }}
        >
          How It Works
        </p>
        <h2
          className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-white mt-2"
        >
          Three Simple Steps
        </h2>
      </div>

      {/* Steps */}
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Desktop connector line */}
        <div className="relative hidden md:block">
          <div
            className="absolute top-6 left-[16%] right-[16%] h-px"
            style={{ backgroundColor: "var(--color-navy-border)" }}
          />

          <div ref={stepsRef} className="grid grid-cols-3 gap-8">
            {steps.map(({ step, icon: Icon, title, description }) => (
              <div key={step} className="flex flex-col items-center text-center">
                <div
                  className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    border: "1px solid var(--color-navy-border)",
                    backgroundColor: "var(--color-navy-surface)",
                  }}
                >
                  <span
                    className="font-[family-name:var(--font-mono)] text-sm"
                    style={{ color: "var(--color-gold)" }}
                  >
                    {step}
                  </span>
                </div>
                <Icon size={32} className="mt-6" style={{ color: "var(--color-gold)" }} />
                <h3
                  className="font-[family-name:var(--font-display)] text-xl text-white mt-4"
                >
                  {title}
                </h3>
                <p
                  className="font-[family-name:var(--font-body)] text-sm leading-relaxed mt-2"
                  style={{ color: "var(--color-white-muted)" }}
                >
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile stacked */}
        <div className="flex flex-col gap-10 md:hidden">
          {steps.map(({ step, icon: Icon, title, description }) => (
            <div key={step} className="flex flex-col items-center text-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  border: "1px solid var(--color-navy-border)",
                  backgroundColor: "var(--color-navy-surface)",
                }}
              >
                <span
                  className="font-[family-name:var(--font-mono)] text-sm"
                  style={{ color: "var(--color-gold)" }}
                >
                  {step}
                </span>
              </div>
              <Icon size={32} className="mt-6" style={{ color: "var(--color-gold)" }} />
              <h3
                className="font-[family-name:var(--font-display)] text-xl text-white mt-4"
              >
                {title}
              </h3>
              <p
                className="font-[family-name:var(--font-body)] text-sm leading-relaxed mt-2"
                style={{ color: "var(--color-white-muted)" }}
              >
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
