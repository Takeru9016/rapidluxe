import Link from "next/link";

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
          className="font-cormorant font-light leading-none select-none"
          style={{
            fontSize: "12rem",
            color: "color-mix(in srgb, var(--color-gold) 20%, transparent)",
          }}
        >
          404
        </span>

        {/* Overlaid heading */}
        <h1 className="font-cormorant text-4xl text-white -mt-16 relative z-10">
          Page Not Found
        </h1>

        <p className="font-dm-sans text-(--color-white-muted) mt-4 max-w-sm">
          The page you&apos;re looking for has drifted off the map.
        </p>

        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-2.5 rounded-lg bg-(--color-coral) text-white font-dm-sans text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Go Home
          </Link>
          <Link
            href="/packages"
            className="px-6 py-2.5 rounded-lg border border-(--color-gold) text-(--color-gold) font-dm-sans text-sm font-medium hover:bg-(--color-gold)/10 transition-colors"
          >
            Browse Packages
          </Link>
        </div>
      </div>
    </div>
  );
}
