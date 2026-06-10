"use client";

import { useEffect, useRef } from "react";
import { Search, MessageSquare, Plane, LucideIcon } from "lucide-react";
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
    title: "Enquire",
    description:
      "Browse curated packages across 50+ destinations. Submit a booking request with your travel dates and preferences — no payment required.",
  },
  {
    step: "02",
    icon: MessageSquare,
    title: "Get Your Quote",
    description:
      "Our travel experts review your request and contact you within 2 hours via WhatsApp to confirm availability and provide a tailored quote.",
  },
  {
    step: "03",
    icon: Plane,
    title: "Travel",
    description:
      "Once you're happy with the quote, complete payment securely via the link we send you. Then sit back and look forward to your trip.",
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
        stagger: 0.15,
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
      <div className="text-center mb-16 px-4">
        <p
          className="text-xs tracking-widest uppercase"
          style={{ fontFamily: "var(--font-body)", color: "var(--color-gold)" }}
        >
          How It Works
        </p>
        <h2
          className="text-4xl md:text-5xl text-white mt-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Three Simple Steps
        </h2>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="relative">
          {/* Desktop connector line */}
          <div
            className="absolute top-12 left-[16%] right-[16%] h-px hidden md:block"
            style={{ backgroundColor: "var(--color-navy-border)" }}
          />

          {/* Steps grid — desktop 3-col, mobile flex-col */}
          <div
            ref={stepsRef}
            className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8"
          >
            {steps.map(({ step, icon: Icon, title, description }) => (
              <div key={step} className="flex flex-col items-center text-center">
                <div
                  className="relative z-10 w-24 h-24 rounded-full border-2 flex items-center justify-center"
                  style={{ borderColor: "var(--color-gold)" }}
                >
                  <Icon size={32} style={{ color: "var(--color-gold)" }} />
                </div>
                <p
                  className="text-xs tracking-widest mt-4 mb-2"
                  style={{ fontFamily: "var(--font-body)", color: "var(--color-gold)" }}
                >
                  STEP {step}
                </p>
                <h3
                  className="text-2xl text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {title}
                </h3>
                <p
                  className="text-sm leading-relaxed mt-3"
                  style={{ fontFamily: "var(--font-body)", color: "var(--color-white-muted)" }}
                >
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
