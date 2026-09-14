import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PILL_BUTTON_CLASS } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";

export function FinalCTAStrip() {
  return (
    <section
      className="py-20 md:py-28 border-t"
      style={{
        backgroundColor:
          "color-mix(in srgb, var(--color-navy-surface) 50%, transparent)",
        borderColor: "var(--color-navy-border)",
      }}
    >
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2
          className="text-4xl md:text-5xl text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Ready for your next Therapycation?
        </h2>
        <p
          className="mt-4 text-lg"
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--color-white-muted)",
          }}
        >
          Tell us where you&apos;d like to go — our travel experts will design
          the rest.
        </p>

        <div className="mt-10">
          <Button
            variant="coral"
            size="lg"
            className={cn(PILL_BUTTON_CLASS, "text-base font-sans")}
            asChild
          >
            <Link href="/packages">Explore Journeys →</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
