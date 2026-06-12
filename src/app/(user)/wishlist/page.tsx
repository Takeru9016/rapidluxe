"use client";

import { Heart } from "lucide-react";

import { useWishlist } from "@/hooks/api/useWishlist";

import type { Package } from "@/types/package";

import { PackageCard } from "@/components/cards/PackageCard";
import { PackageCardSkeleton } from "@/components/shared/Skeletons";
import { EmptyState } from "@/components/shared/EmptyState";

export default function WishlistPage() {
  const { packages, isLoading } = useWishlist();
  const count = packages.length;

  return (
    <main className="min-h-screen bg-(--color-navy) pt-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl text-white">
            My Wishlist
          </h1>
          <span className="font-['JetBrains_Mono'] text-sm text-(--color-text-secondary)">
            {isLoading
              ? "—"
              : `${count} saved package${count !== 1 ? "s" : ""}`}
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <PackageCardSkeleton key={i} />
            ))}
          </div>
        ) : count === 0 ? (
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            description="Start exploring packages and save the ones you love"
            action={{ label: "Browse Packages", href: "/packages" }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((p) => (
              <PackageCard key={p.id} package={p as unknown as Package} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
