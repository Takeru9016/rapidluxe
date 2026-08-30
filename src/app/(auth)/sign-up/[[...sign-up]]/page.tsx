import type { Metadata } from "next";

import { AuthImagePanel } from "@/components/auth/AuthImagePanel";
import { AuthThemeToggle } from "@/components/auth/AuthThemeToggle";
import { SignUpForm } from "@/components/auth/SignUpForm";

export const metadata: Metadata = {
  title: "Create Account — RapidLuxe",
  description:
    "Join RapidLuxe and unlock exclusive luxury travel packages curated for discerning Indian travellers.",
};

const SIGN_UP_STATS = [
  { label: "Free", sub: "Membership" },
  { label: "100%", sub: "Secure Booking" },
  { label: "5% GST", sub: "Incl. Pricing" },
];

export default function SignUpPage() {
  return (
    <div className="grid lg:grid-cols-2 min-h-screen bg-(--color-navy) transition-colors duration-300">
      {/* ── LEFT — Image panel ── */}
      <AuthImagePanel
        side="left"
        tagline="Join 10,000+ luxury travellers."
        blobTagline={
          "Browse thousands of\npackages to plan your\ndream holiday."
        }
        stats={SIGN_UP_STATS}
      />

      {/* ── RIGHT — Form panel ── */}
      <div className="flex flex-col px-8 py-10 lg:px-14 xl:px-20 bg-(--color-navy) transition-colors duration-300">
        {/* Top bar: logo + theme toggle */}
        <div className="flex items-center justify-between mb-10">
          <span className="font-(--font-display) text-3xl tracking-wider">
            <span className="text-[#F9A826]">Rapid</span>
            <span className="text-white">Luxe</span>
          </span>
          <AuthThemeToggle />
        </div>

        {/* Scrollable form area */}
        <div className="flex flex-col justify-center flex-1 max-w-md w-full mx-auto">
          {/* Heading */}
          <div className="mb-8">
            <h1 className="font-(--font-display) text-4xl lg:text-5xl text-white leading-tight mb-2">
              Begin your journey.
            </h1>
            <p className="font-(--font-body) text-(--color-text-secondary) text-sm">
              Create your account and unlock exclusive luxury experiences.
            </p>
          </div>

          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
