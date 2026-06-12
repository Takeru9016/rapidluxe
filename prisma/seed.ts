import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";

import { type Prisma, PrismaClient } from "../src/generated/prisma/client";
import { dummyDestinations } from "../src/lib/dummy/destinations";
import { dummyPackages } from "../src/lib/dummy/packages";

config({ path: [".env.local", ".env"] });

const connectionString =
  process.env.DATABASE_DIRECT_URL ?? process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_DIRECT_URL or DATABASE_URL must be set");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const toJson = (value: unknown): Prisma.InputJsonValue =>
  value as Prisma.InputJsonValue;

interface GeoInfo {
  lat: number;
  lng: number;
  countryCode: string;
}

const geoBySlug: Record<string, GeoInfo> = {
  bali: { lat: -8.4095, lng: 115.1889, countryCode: "ID" },
  maldives: { lat: 4.1755, lng: 73.5093, countryCode: "MV" },
  kerala: { lat: 9.9312, lng: 76.2673, countryCode: "IN" },
  switzerland: { lat: 46.8182, lng: 8.2275, countryCode: "CH" },
  santorini: { lat: 36.3932, lng: 25.4615, countryCode: "GR" },
  dubai: { lat: 25.2048, lng: 55.2708, countryCode: "AE" },
  rajasthan: { lat: 26.9124, lng: 75.7873, countryCode: "IN" },
  singapore: { lat: 1.3521, lng: 103.8198, countryCode: "SG" },
};

const coupons: Prisma.CouponCreateInput[] = [
  {
    code: "WELCOME20",
    discountType: "PERCENT",
    discountValue: 20,
    minAmount: 50000,
    maxUses: 500,
    expiresAt: new Date("2026-12-31"),
    isActive: true,
  },
  {
    code: "HONEYMOON15",
    discountType: "PERCENT",
    discountValue: 15,
    minAmount: 80000,
    maxUses: 200,
    expiresAt: new Date("2026-12-31"),
    isActive: true,
  },
  {
    code: "FLAT5000",
    discountType: "FIXED",
    discountValue: 5000,
    minAmount: 75000,
    maxUses: 1000,
    expiresAt: new Date("2026-12-31"),
    isActive: true,
  },
];

async function main() {
  await prisma.wishlist.deleteMany();
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.package.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.coupon.deleteMany();

  for (const dest of dummyDestinations) {
    const geo = geoBySlug[dest.slug];
    await prisma.destination.create({
      data: {
        id: dest.id,
        name: dest.name,
        slug: dest.slug,
        country: dest.country,
        continent: dest.continent,
        description: dest.description,
        imageUrl: dest.imageUrl,
        bestTimeFrom: dest.bestTimeFrom,
        bestTimeTo: dest.bestTimeTo,
        visaType: dest.visaType,
        currency: dest.currency,
        language: dest.language,
        lat: geo?.lat,
        lng: geo?.lng,
        countryCode: geo?.countryCode,
        whenToVisit: toJson(dest.whenToVisit ?? []),
        howToGetThere: toJson(dest.howToGetThere ?? []),
      },
    });
  }

  for (const pkg of dummyPackages.slice(0, 3)) {
    await prisma.package.create({
      data: {
        id: pkg.id,
        title: pkg.title,
        slug: pkg.slug,
        description: pkg.description,
        destinationId: pkg.destinationId,
        durationNights: pkg.durationNights,
        pricePerPerson: pkg.pricePerPerson,
        originalPrice: pkg.originalPrice,
        minGroupSize: pkg.minGroupSize,
        maxGroupSize: pkg.maxGroupSize,
        inclusions: pkg.inclusions,
        exclusions: pkg.exclusions,
        itinerary: toJson(pkg.itinerary),
        hotels: toJson(pkg.hotels),
        activities: toJson(pkg.activities),
        images: pkg.images,
        tags: pkg.tags,
        cancellationPolicy: toJson(pkg.cancellationPolicy ?? []),
        attributes: toJson(pkg.attributes ?? []),
        platformRatings: toJson(pkg.platformRatings ?? []),
        reviewSummary: toJson(pkg.reviewSummary ?? {}),
        isFeatured: pkg.isFeatured,
        includesFlights: pkg.includesFlights,
        status: pkg.status,
        metaTitle: pkg.metaTitle,
        metaDescription: pkg.metaDescription,
      },
    });
  }

  for (const coupon of coupons) {
    await prisma.coupon.create({ data: coupon });
  }

  const [destinations, packages, couponCount] = await Promise.all([
    prisma.destination.count(),
    prisma.package.count(),
    prisma.coupon.count(),
  ]);
  console.log(
    `Seeded ${destinations} destinations, ${packages} packages, ${couponCount} coupons`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
