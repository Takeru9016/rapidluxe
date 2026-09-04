import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Access Denied — RapidLuxe",
  robots: { index: false, follow: false },
};

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-(--color-navy) px-6">
      <div className="text-center space-y-4 max-w-md">
        <span className="font-(--font-display) text-2xl tracking-wider">
          <span className="text-[#F9A826]">Rapid</span>
          <span className="text-white">Luxe</span>
        </span>
        <h1 className="font-(--font-display) text-3xl text-white">
          Access denied
        </h1>
        <p className="text-sm text-(--color-text-secondary) leading-relaxed">
          Your account doesn&apos;t have permission to view this page. If you
          believe this is a mistake, contact our support team.
        </p>
        <Link
          href="/"
          className="inline-block mt-4 rounded-lg bg-(--color-gold) px-6 py-3 text-sm font-semibold text-(--color-navy) hover:opacity-90 transition-opacity"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}
