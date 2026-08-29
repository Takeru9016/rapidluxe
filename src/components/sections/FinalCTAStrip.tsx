import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const stats = [
  { number: "1,000+", label: "Vacations Planned" },
  { number: "₹17 Cr+", label: "Total Savings" },
  { number: "50+", label: "Destinations" },
  { number: "4.9★", label: "Traveller Rating" },
];

const photos = [
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
];

export function FinalCTAStrip() {
  return (
    <section
      className="py-20 md:py-24 border-t"
      style={{
        backgroundColor:
          "color-mix(in srgb, var(--color-navy-surface) 50%, transparent)",
        borderColor: "var(--color-navy-border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
        {/* Heading */}
        <h2
          className="text-4xl md:text-5xl text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Ready for your best vacation yet?
        </h2>
        <p
          className="mt-4 text-lg max-w-2xl mx-auto"
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--color-white-muted)",
          }}
        >
          Get expert guidance, lowest prices, and a custom itinerary — all in
          one place.
        </p>

        {/* Stats row */}
        <div className="mt-12 flex justify-center gap-8 md:gap-16 flex-wrap">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span
                className="font-mono text-3xl"
                style={{ color: "var(--color-gold)" }}
              >
                {stat.number}
              </span>
              <span
                className="text-sm"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--color-white-muted)",
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Photo grid */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
          {photos.map((url, i) => (
            <div
              key={i}
              className="relative aspect-3/2 rounded-xl overflow-hidden"
            >
              <Image
                src={url}
                alt={`Travel destination ${i + 1}`}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12">
          <Button
            variant="coral"
            size="lg"
            className="h-auto px-10 py-4 rounded-lg text-base font-sans"
            asChild
          >
            <Link href="/packages">Plan My Trip →</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
