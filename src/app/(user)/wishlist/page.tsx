"use client";

import { Heart } from "lucide-react";

import { useWishlistStore } from "@/store/wishlistStore";
import { dummyPackages } from "@/lib/dummy/packages";

import { PackageCard } from "@/components/cards/PackageCard";
import { EmptyState } from "@/components/shared/EmptyState";

export default function WishlistPage() {
  const { ids } = useWishlistStore();
  const filteredPackages = dummyPackages.filter((p) => ids.includes(p.id));
  const count = filteredPackages.length;

  return (
    <main className="min-h-screen bg-(--color-navy) pt-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl text-white">
            My Wishlist
          </h1>
          <span className="font-['JetBrains_Mono'] text-sm text-(--color-text-secondary)">
            {count} saved package{count !== 1 ? "s" : ""}
          </span>
        </div>

        {count === 0 ? (
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            description="Start exploring packages and save the ones you love"
            action={{ label: "Browse Packages", href: "/packages" }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((p) => (
              <PackageCard key={p.id} package={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
