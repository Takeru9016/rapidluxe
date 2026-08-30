"use client";

import { useUser } from "@clerk/nextjs";
import gsap from "gsap";
import {
  AtSign,
  Briefcase,
  Camera,
  Globe,
  Heart,
  User as UserIcon,
  Video,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FocusScope as FocusScopeNS } from "radix-ui/internal";
import { useEffect, useRef } from "react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/api/useSiteSettings";
import { useUIStore } from "@/store/uiStore";
import { useWishlistStore } from "@/store/wishlistStore";

const navItems = [
  { label: "Journeys", href: "/packages" },
  { label: "Destinations", href: "/destinations" },
  { label: "Deals", href: "/deals" },
  { label: "Therapycation", href: "/about" },
  { label: "Journal", href: "/blog" },
  { label: "Corporate", href: "/corporate" },
  { label: "Contact", href: "/contact" },
];

const SOCIAL_ICONS = [
  { key: "social_instagram" as const, Icon: Camera, label: "Instagram" },
  { key: "social_facebook" as const, Icon: Globe, label: "Facebook" },
  { key: "social_youtube" as const, Icon: Video, label: "YouTube" },
  { key: "social_twitter" as const, Icon: AtSign, label: "Twitter" },
];

const accountLinkClass =
  "flex items-center gap-3 py-2.5 font-sans text-base text-(--color-white-muted) hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-gold) rounded-md";

export function MobileMenu() {
  const { mobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const { isLoaded, isSignedIn } = useUser();
  const wishlistCount = useWishlistStore((s) => s.count);
  const { data: settings } = useSiteSettings();
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const triggerRef = useRef<HTMLElement | null>(null);

  const close = () => setMobileMenuOpen(false);

  // Close on route change
  useEffect(() => {
    close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Escape closes the menu
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobileMenuOpen]);

  // GSAP animation + focus management + scroll lock
  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;

    if (mobileMenuOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";

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

      const firstFocusable = el.querySelector<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      firstFocusable?.focus({ preventScroll: true });
    } else {
      document.body.style.overflow = "";

      gsap.to(el, {
        clipPath: "circle(0% at 92% 5%)",
        duration: 0.5,
        ease: "power3.inOut",
        onComplete: () => {
          gsap.set(el, { display: "none" });
        },
      });

      triggerRef.current?.focus({ preventScroll: true });
    }
  }, [mobileMenuOpen]);

  return (
    <FocusScopeNS.Root asChild trapped={mobileMenuOpen} loop>
      <div
        id="mobile-menu"
        ref={overlayRef}
        role="dialog"
        aria-modal={mobileMenuOpen || undefined}
        aria-label="Main menu"
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
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="w-10 h-10 rounded-full flex items-center justify-center border border-(--color-navy-border) text-(--color-white-muted) hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-gold)"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col flex-1" aria-label="Primary">
          {navItems.map((item) => (
            <div
              key={item.href}
              className="mobile-nav-link overflow-hidden border-b border-(--color-navy-border)/40"
            >
              <Link
                href={item.href}
                onClick={close}
                aria-current={
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                    ? "page"
                    : undefined
                }
                className="block py-5 font-display text-5xl leading-none tracking-tight text-white hover:text-(--color-gold) transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-gold) rounded-md"
              >
                {item.label}
              </Link>
            </div>
          ))}
        </nav>

        {/* Account links + CTA */}
        <div className="mobile-nav-link mt-8 flex flex-col gap-3 shrink-0">
          {!isLoaded ? (
            <div className="flex flex-col gap-3" aria-hidden="true">
              <div className="h-14 w-full rounded-full bg-(--color-navy-border)/60 motion-safe:animate-pulse" />
            </div>
          ) : isSignedIn ? (
            <>
              <Link
                href="/profile"
                onClick={close}
                className={accountLinkClass}
              >
                <UserIcon size={18} /> Profile
              </Link>
              <Link
                href="/bookings"
                onClick={close}
                className={accountLinkClass}
              >
                <Briefcase size={18} /> My Bookings
              </Link>
              <Link
                href="/wishlist"
                onClick={close}
                className={accountLinkClass}
              >
                <Heart size={18} />
                {wishlistCount > 0 ? `Wishlist (${wishlistCount})` : "Wishlist"}
              </Link>
              <Button
                variant="coral"
                className="w-full h-auto py-4 rounded-full font-sans text-base mt-2"
                asChild
              >
                <Link href="/packages" onClick={close}>
                  Book Now
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="coral"
                className="w-full h-auto py-4 rounded-full font-sans text-base"
                asChild
              >
                <Link href="/packages" onClick={close}>
                  Book Now
                </Link>
              </Button>
              <Button
                variant="ghost-brand"
                className="w-full h-auto py-4 rounded-full border border-(--color-navy-border) font-sans text-base"
                asChild
              >
                <Link href="/sign-in" onClick={close}>
                  Sign In
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Social */}
        <div className="mobile-nav-link mt-8 flex items-center gap-5 shrink-0">
          {SOCIAL_ICONS.map(({ key, Icon, label }) => {
            const href = settings?.[key];
            if (!href) return null;
            return (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="text-(--color-text-secondary) hover:text-(--color-gold) transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-gold) rounded-md"
              >
                <Icon size={20} />
              </a>
            );
          })}
        </div>
      </div>
    </FocusScopeNS.Root>
  );
}
