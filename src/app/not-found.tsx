import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-(--color-navy) overflow-hidden">
      {/* Map grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-navy-border)/20 1px, transparent 1px), linear-gradient(90deg, var(--color-navy-border)/20 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Large 404 — decorative underlay */}
        <span
          aria-hidden
          className="font-display font-light leading-none select-none"
          style={{
            fontSize: "12rem",
            color: "color-mix(in srgb, var(--color-gold) 20%, transparent)",
          }}
        >
          404
        </span>

        {/* Overlaid heading */}
        <h1 className="font-display text-4xl text-(--color-white) -mt-16 relative z-10">
          Page Not Found
        </h1>

        <p className="font-body text-(--color-white-muted) mt-4 max-w-sm">
          The page you&apos;re looking for has drifted off the map.
        </p>

        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Button
            variant="coral"
            className="h-auto px-6 py-2.5 font-body text-sm"
            asChild
          >
            <Link href="/">Go Home</Link>
          </Button>
          <Button
            variant="outline-gold"
            className="h-auto px-6 py-2.5 font-body text-sm"
            asChild
          >
            <Link href="/packages">Browse Packages</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
