import type { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://rapidluxe.com";

  const [packages, destinations] = await Promise.all([
    prisma.package.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.destination.findMany({
      select: { slug: true, createdAt: true },
    }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: appUrl,
      lastModified: new Date(),
      priority: 1.0,
      changeFrequency: "daily",
    },
    {
      url: `${appUrl}/packages`,
      lastModified: new Date(),
      priority: 0.9,
      changeFrequency: "daily",
    },
    {
      url: `${appUrl}/destinations`,
      lastModified: new Date(),
      priority: 0.9,
      changeFrequency: "weekly",
    },
    {
      url: `${appUrl}/deals`,
      lastModified: new Date(),
      priority: 0.8,
      changeFrequency: "daily",
    },
    {
      url: `${appUrl}/blog`,
      lastModified: new Date(),
      priority: 0.7,
      changeFrequency: "weekly",
    },
    {
      url: `${appUrl}/about`,
      lastModified: new Date(),
      priority: 0.6,
      changeFrequency: "monthly",
    },
    {
      url: `${appUrl}/contact`,
      lastModified: new Date(),
      priority: 0.5,
      changeFrequency: "monthly",
    },
  ];

  const packageRoutes: MetadataRoute.Sitemap = packages.map((pkg) => ({
    url: `${appUrl}/packages/${pkg.slug}`,
    lastModified: pkg.updatedAt,
    priority: 0.8,
    changeFrequency: "weekly" as const,
  }));

  const destinationRoutes: MetadataRoute.Sitemap = destinations.map((dest) => ({
    url: `${appUrl}/destinations/${dest.slug}`,
    lastModified: dest.createdAt,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  return [...staticRoutes, ...packageRoutes, ...destinationRoutes];
}
