"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import Link from "next/link";
import { type MouseEvent, useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/uiStore";

const plainLinks = [
  { label: "Packages", href: "/packages" },
  { label: "Destinations", href: "/destinations" },
  { label: "Deals", href: "/deals" },
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Corporate", href: "/corporate" },
  { label: "Contact Us", href: "/contact" },
];

export function Navbar() {
  const { isSignedIn } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const [hoverPill, setHoverPill] = useState({ opacity: 0, left: 0, width: 0 });
  const plainLinksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleLinkMouseEnter = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!plainLinksRef.current) return;
    const itemRect = e.currentTarget.getBoundingClientRect();
    const containerRect = plainLinksRef.current.getBoundingClientRect();
    setHoverPill({
      opacity: 1,
      left: itemRect.left - containerRect.left,
      width: itemRect.width,
    });
  };

  const handleLinksMouseLeave = () => {
    setHoverPill((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <header
      className={cn(
        "fixed z-50 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]",
        scrolled ? "top-4 left-1/2 -translate-x-1/2" : "top-0 left-0 right-0",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
          scrolled
            ? "max-w-[calc(100vw-2rem)] bg-(--color-navy-surface)/80 backdrop-blur-md border border-(--color-navy-border) rounded-full px-4 py-2.5 gap-4 shadow-2xl shadow-black/20"
            : "max-w-7xl mx-auto px-4 md:px-6 h-16 gap-6",
        )}
      >
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <span className="font-display text-xl">
            <span style={{ color: "var(--color-gold)" }}>Rapid</span>
            <span style={{ color: "var(--color-white)" }}>Luxe</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {/* Plain links with hover pill */}
          <div
            ref={plainLinksRef}
            className="relative flex items-center"
            onMouseLeave={handleLinksMouseLeave}
          >
            {/* Floating hover pill */}
            <div
              className="absolute top-0 h-full rounded-full bg-white/5 pointer-events-none transition-all duration-200 ease-out"
              style={{
                opacity: hoverPill.opacity,
                left: hoverPill.left,
                width: hoverPill.width,
              }}
            />
            {plainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onMouseEnter={handleLinkMouseEnter}
                className="relative z-10 px-3 py-2 text-sm font-sans font-medium text-(--color-white-muted) hover:text-white transition-colors rounded-full"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <div className="hidden md:flex items-center gap-2">
            {isSignedIn ? (
              <>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                    },
                  }}
                  userProfileUrl="/profile"
                />
                <Button
                  variant="coral"
                  size="sm"
                  className="px-4 h-9 rounded-full"
                  asChild
                >
                  <Link href="/packages">Book Now</Link>
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost-brand"
                  size="sm"
                  className="text-sm rounded-full"
                  asChild
                >
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button
                  variant="coral"
                  size="sm"
                  className="px-4 h-9 rounded-full"
                  asChild
                >
                  <Link href="/packages">Book Now</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            aria-label="Open menu"
            className="md:hidden p-1.5 text-(--color-white-muted) hover:text-white transition-colors cursor-pointer"
            onClick={() => useUIStore.getState().setMobileMenuOpen(true)}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
