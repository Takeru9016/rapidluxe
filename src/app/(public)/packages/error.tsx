"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
      <h2 className="font-display text-3xl text-(--color-white)">
        Something went wrong
      </h2>
      <p className="font-body text-(--color-white-muted) mt-2 max-w-md">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <div className="mt-8 flex gap-4 justify-center">
        <Button
          variant="coral"
          onClick={reset}
          className="h-auto px-6 py-2.5 font-body text-sm"
        >
          Try again
        </Button>
        <Button
          variant="outline-gold"
          className="h-auto px-6 py-2.5 font-body text-sm"
          asChild
        >
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}
