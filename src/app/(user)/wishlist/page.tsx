"use client";

import { AlertTriangle, Heart } from "lucide-react";
import { PackageCard } from "@/components/cards/PackageCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { PackageCardSkeleton } from "@/components/shared/Skeletons";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/api/useWishlist";

export default function WishlistPage() {
  const { packages, isLoading, isError, refetch } = useWishlist();
  const count = packages.length;

  return (
    <main className="min-h-screen bg-(--color-navy) pt-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-(--font-display) text-4xl md:text-5xl text-white">
            My Wishlist
          </h1>
          <span className="font-(--font-mono) text-sm text-(--color-text-secondary)">
            {isLoading || isError
              ? "—"
              : `${count} saved Journey${count !== 1 ? "s" : ""}`}
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <PackageCardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <AlertTriangle size={40} className="text-(--color-coral) mb-4" />
            <p className="font-display text-xl text-white mb-2">
              Couldn&apos;t load your wishlist
            </p>
            <p className="font-sans text-sm text-(--color-text-secondary) mb-6 max-w-md">
              Something went wrong while fetching your saved Journeys. Please
              try again.
            </p>
            <Button variant="coral" onClick={() => refetch()}>
              Try again
            </Button>
          </div>
        ) : count === 0 ? (
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            description="Start exploring Journeys and save the ones you love"
            action={{ label: "Explore Journeys", href: "/packages" }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((p) => (
              <PackageCard key={p.id} package={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
