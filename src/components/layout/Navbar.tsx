"use client";

import { useState, useEffect, useRef, MouseEvent } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

import { useUIStore } from "@/store/uiStore";

import { cn } from "@/lib/utils";

const packagesItems = [
  { label: "Top Picks", href: "/packages/top-picks" },
  { label: "By Destination", href: "/packages/by-destination" },
  { label: "By Theme", href: "/packages/by-theme" },
];

const destinationItems = [
  { label: "Asia", href: "/destinations/asia" },
  { label: "Europe", href: "/destinations/europe" },
  { label: "Africa", href: "/destinations/africa" },
  {
    label: "Middle East & Americas",
    href: "/destinations/middle-east-americas",
  },
  { label: "Oceania", href: "/destinations/oceania" },
];

const plainLinks = [
  { label: "Deals", href: "/deals" },
  { label: "Blog", href: "/blog" },
  { label: "Corporate", href: "/corporate" },
];

const dropdownItemClass =
  "block px-3 py-2 text-sm font-sans text-[var(--color-white-muted)] rounded-md hover:text-[var(--color-gold)] hover:bg-white/5 transition-colors cursor-pointer";

export function Navbar() {
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
            ? "bg-(--color-navy-surface)/80 backdrop-blur-xl border border-(--color-navy-border) rounded-full px-4 py-2.5 gap-4 shadow-2xl shadow-black/20"
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
          <NavigationMenu viewport={false}>
            <NavigationMenuList className="gap-0">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-(--color-white-muted) hover:text-white font-sans font-medium text-sm data-open:bg-transparent hover:bg-white/5 focus:bg-transparent rounded-full">
                  Packages
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="bg-(--color-navy-surface) border border-(--color-navy-border) rounded-lg p-1 min-w-[180px]">
                    {packagesItems.map((item) => (
                      <NavigationMenuLink key={item.href} asChild>
                        <Link href={item.href} className={dropdownItemClass}>
                          {item.label}
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-(--color-white-muted) hover:text-white font-sans font-medium text-sm data-open:bg-transparent hover:bg-white/5 focus:bg-transparent rounded-full">
                  Destinations
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="bg-(--color-navy-surface) border border-(--color-navy-border) rounded-lg p-1 min-w-[200px]">
                    {destinationItems.map((item) => (
                      <NavigationMenuLink key={item.href} asChild>
                        <Link href={item.href} className={dropdownItemClass}>
                          {item.label}
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

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
            <Button
              variant="ghost"
              size="sm"
              className="text-sm rounded-full"
              asChild
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button
              size="sm"
              className="bg-(--color-coral) text-white px-4 h-9 rounded-full text-sm font-medium hover:bg-(--color-coral)/90 transition-colors"
              asChild
            >
              <Link href="/book">Book Now</Link>
            </Button>
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
