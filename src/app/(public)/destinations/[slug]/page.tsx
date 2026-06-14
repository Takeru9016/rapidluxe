import { cache } from "react";
import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import { DestinationDetailClient } from "./DestinationDetailClient";

// ─── Cached DB fetch ──────────────────────────────────────────────────────────

const getDestinationMeta = cache(async (slug: string) => {
  return prisma.destination.findUnique({
    where: { slug },
    select: {
      name: true,
      country: true,
      description: true,
      imageUrl: true,
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
  const dest = await getDestinationMeta(slug);

  if (!dest) return { title: "Destination Not Found" };

  const title = `${dest.name}, ${dest.country}`;
  const description =
    dest.description ??
    `Explore ${dest.name} — curated luxury travel packages and insider guides for the discerning Indian traveller.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: dest.imageUrl ? [{ url: dest.imageUrl }] : undefined,
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <DestinationDetailClient slug={slug} />;
}
