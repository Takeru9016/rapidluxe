import { cache } from "react";
import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import { PackageDetailClient } from "./PackageDetailClient";

// ─── Cached DB fetch (shared between generateMetadata and page render) ────────

const getPackageMeta = cache(async (slug: string) => {
  return prisma.package.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: {
      title: true,
      description: true,
      images: true,
      pricePerPerson: true,
      metaTitle: true,
      metaDescription: true,
      destination: { select: { name: true, country: true } },
    },
  });
});

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackageMeta(slug);

  if (!pkg) return { title: "Package Not Found" };

  const title = pkg.metaTitle ?? pkg.title;
  const description = pkg.metaDescription ?? pkg.description.slice(0, 155);
  const image = pkg.images[0];

  // Canonical always points at the bare package URL — the ?deal= query
  // param only changes displayed price/banner, not the underlying content,
  // so it must not be treated as a separate indexable page.
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://rapidluxe.com";

  return {
    title,
    description,
    alternates: {
      canonical: `${appUrl}/packages/${slug}`,
    },
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

// ─── JSON-LD helpers ──────────────────────────────────────────────────────────

function buildJsonLd(
  pkg: NonNullable<Awaited<ReturnType<typeof getPackageMeta>>>,
  slug: string,
) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://rapidluxe.com";

  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: pkg.title,
    description: pkg.description,
    url: `${appUrl}/packages/${slug}`,
    image: pkg.images[0] ?? undefined,
    location: pkg.destination
      ? {
          "@type": "Place",
          name: pkg.destination.name,
          address: {
            "@type": "PostalAddress",
            addressCountry: pkg.destination.country,
          },
        }
      : undefined,
    offers: {
      "@type": "Offer",
      price: pkg.pricePerPerson,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: `${appUrl}/packages/${slug}`,
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = await getPackageMeta(slug);

  return (
    <>
      {pkg && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildJsonLd(pkg, slug)),
          }}
        />
      )}
      <PackageDetailClient slug={slug} />
    </>
  );
}
