import type { Metadata } from "next";

import { AuthImagePanel } from "@/components/auth/AuthImagePanel";
import { AuthThemeToggle } from "@/components/auth/AuthThemeToggle";
import { SignInForm } from "@/components/auth/SignInForm";

export const metadata: Metadata = {
  title: "Sign In — RapidLuxe",
  description:
    "Sign in to your RapidLuxe account and continue your luxury travel journey.",
};

const SIGN_IN_STATS = [
  { label: "10,000+", sub: "Happy Travellers" },
  { label: "500+", sub: "Curated Packages" },
  { label: "24/7", sub: "Expert Support" },
];

export default function SignInPage() {
  return (
    <div className="grid lg:grid-cols-2 min-h-screen bg-(--color-navy) transition-colors duration-300">
      {/* ── LEFT — Form panel ── */}
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
              Welcome back.
            </h1>
            <p className="font-(--font-body) text-(--color-text-secondary) text-sm">
              Sign in to continue your luxury travel journey.
            </p>
          </div>

          <SignInForm />
        </div>
      </div>

      {/* ── RIGHT — Image panel ── */}
      <AuthImagePanel
        side="right"
        tagline="Your journey, perfected."
        blobTagline={
          "Curate thousands of\nexperiences to inspire\nyour next escape."
        }
        stats={SIGN_IN_STATS}
      />
    </div>
  );
}
