"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Camera, Globe, Video, AtSign } from "lucide-react";
import gsap from "gsap";

import { useUIStore } from "@/store/uiStore";

import { ThemeToggle } from "@/components/shared/ThemeToggle";

import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Packages",
    href: "/packages",
    sub: [
      { label: "Top Picks", href: "/packages/top-picks" },
      { label: "By Destination", href: "/packages/by-destination" },
      { label: "By Theme", href: "/packages/by-theme" },
    ],
  },
  {
    label: "Destinations",
    href: "/destinations",
    sub: [
      { label: "Asia", href: "/destinations/asia" },
      { label: "Europe", href: "/destinations/europe" },
      { label: "Africa", href: "/destinations/africa" },
      {
        label: "Middle East & Americas",
        href: "/destinations/middle-east-americas",
      },
      { label: "Oceania", href: "/destinations/oceania" },
    ],
  },
  { label: "Deals", href: "/deals" },
  { label: "Blog", href: "/blog" },
  { label: "Corporate", href: "/corporate" },
];

const socialLinks = [
  { Icon: Camera, label: "Instagram", href: "https://instagram.com" },
  { Icon: Globe, label: "Facebook", href: "https://facebook.com" },
  { Icon: Video, label: "YouTube", href: "https://youtube.com" },
  { Icon: AtSign, label: "Twitter", href: "https://twitter.com" },
];

export function MobileMenu() {
  const { mobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string | null>(null);

  const close = () => setMobileMenuOpen(false);

  // Close on route change
  useEffect(() => {
    close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // GSAP animation
  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;

    if (mobileMenuOpen) {
      gsap.set(el, { display: "flex", clipPath: "circle(0% at 92% 5%)" });

      const tl = gsap.timeline();
      tl.to(el, {
        clipPath: "circle(150% at 92% 5%)",
        duration: 0.75,
        ease: "power3.inOut",
      });
      tl.from(
        ".mobile-nav-link",
        {
          opacity: 0,
          y: 40,
          rotate: 3,
          stagger: 0.07,
          duration: 0.55,
          ease: "power3.out",
        },
        "-=0.4",
      );

      document.body.style.overflow = "hidden";
    } else {
      gsap.to(el, {
        clipPath: "circle(0% at 92% 5%)",
        duration: 0.5,
        ease: "power3.inOut",
        onComplete: () => {
          gsap.set(el, { display: "none" });
          setExpanded(null);
        },
      });
      document.body.style.overflow = "";
    }
  }, [mobileMenuOpen]);

  return (
    <div
      ref={overlayRef}
      className="hidden fixed inset-0 z-60 bg-(--color-navy) flex-col px-6 pb-10 pt-6 h-screen overflow-y-auto"
      style={{ clipPath: "circle(0% at 92% 5%)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-10 shrink-0">
        <Link href="/" onClick={close}>
          <span className="font-display text-2xl">
            <span style={{ color: "var(--color-gold)" }}>Rapid</span>
            <span style={{ color: "var(--color-white)" }}>Luxe</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={close}
            aria-label="Close menu"
            className="w-10 h-10 rounded-full flex items-center justify-center border border-(--color-navy-border) text-(--color-white-muted) hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col flex-1">
        {navItems.map((item) => (
          <div
            key={item.href}
            className="mobile-nav-link overflow-hidden border-b border-(--color-navy-border)/40"
          >
            {item.sub ? (
              <>
                <button
                  onClick={() =>
                    setExpanded(expanded === item.label ? null : item.label)
                  }
                  className="w-full flex items-center justify-between py-5 text-left"
                >
                  <span
                    className={cn(
                      "font-display text-5xl leading-none tracking-tight transition-colors duration-200",
                      expanded === item.label
                        ? "text-(--color-gold)"
                        : "text-white hover:text-(--color-gold)",
                    )}
                  >
                    {item.label}
                  </span>
                  <ChevronDown
                    size={20}
                    className={cn(
                      "text-(--color-white-muted) transition-transform duration-300 shrink-0",
                      expanded === item.label && "rotate-180",
                    )}
                  />
                </button>
                {expanded === item.label && (
                  <div className="pb-4 flex flex-col gap-2 pl-2">
                    {item.sub.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={close}
                        className="font-sans text-base text-(--color-white-muted) hover:text-(--color-gold) transition-colors py-1"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={item.href}
                onClick={close}
                className="block py-5 font-display text-5xl leading-none tracking-tight text-white hover:text-(--color-gold) transition-colors duration-200"
              >
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom CTA */}
      <div className="mobile-nav-link mt-8 flex flex-col gap-3 shrink-0">
        <Link
          href="/book"
          onClick={close}
          className="w-full flex items-center justify-center py-4 rounded-full bg-(--color-coral) text-white font-sans font-medium text-base hover:bg-(--color-coral)/90 transition-colors"
        >
          Book Now
        </Link>
        <Link
          href="/sign-in"
          onClick={close}
          className="w-full flex items-center justify-center py-4 rounded-full border border-(--color-navy-border) text-(--color-white-muted) font-sans font-medium text-base hover:border-(--color-gold)/50 hover:text-(--color-gold) transition-colors"
        >
          Sign In
        </Link>
      </div>

      {/* Social */}
      <div className="mobile-nav-link mt-8 flex items-center gap-5 shrink-0">
        {socialLinks.map(({ Icon, label, href }) => (
          <a
            key={label}
            href={href}
            aria-label={label}
            target="_blank"
            rel="noopener noreferrer"
            className="text-(--color-text-secondary) hover:text-(--color-gold) transition-colors"
          >
            <Icon size={20} />
          </a>
        ))}
      </div>
    </div>
  );
}
