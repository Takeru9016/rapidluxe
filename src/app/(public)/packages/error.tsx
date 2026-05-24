"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
      <AlertTriangle size={48} className="text-(--color-coral) mb-6" />
      <h2 className="font-cormorant text-3xl text-white">
        Something went wrong
      </h2>
      <p className="font-dm-sans text-(--color-white-muted) mt-2 max-w-md">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <div className="mt-8 flex gap-4 justify-center">
        <button
          onClick={reset}
          className="px-6 py-2.5 rounded-lg bg-(--color-coral) text-white font-dm-sans text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-6 py-2.5 rounded-lg border border-(--color-navy-border) text-(--color-white-muted) font-dm-sans text-sm font-medium hover:text-white transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
