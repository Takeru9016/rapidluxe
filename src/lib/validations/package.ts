import { z } from "zod";

import { SLUG_PATTERN } from "@/lib/utils";

export const packageFiltersSchema = z.object({
  destination: z.string().optional(),
  search: z.string().trim().min(1).max(200).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  priceMin: z.coerce.number().optional(),
  priceMax: z.coerce.number().optional(),
  duration: z.coerce.number().optional(),
  durationMin: z.coerce.number().optional(),
  durationMax: z.coerce.number().optional(),
  tags: z.array(z.string()).default([]),
  type: z.string().optional(),
  sort: z
    .enum([
      "price_asc",
      "price_desc",
      "duration_asc",
      "duration_desc",
      "featured",
    ])
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export const createPackageSchema = z.object({
  title: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(
      SLUG_PATTERN,
      "Slug must be lowercase letters, numbers, and hyphens only (no spaces or leading/trailing hyphen)",
    ),
  description: z.string().min(1),
  destinationId: z.string().min(1),
  durationNights: z.number().int().min(1),
  pricePerPerson: z.number().positive(),
  originalPrice: z.number().positive().optional(),
  childPrice: z.number().nonnegative().optional(),
  infantPrice: z.number().nonnegative().optional(),
  toursPrice: z.number().nonnegative().optional(),
  minGroupSize: z.number().int().min(1).default(1),
  maxGroupSize: z.number().int().min(1).default(20),
  inclusions: z.array(z.string()).default([]),
  exclusions: z.array(z.string()).default([]),
  itinerary: z.array(
    z.object({
      day: z.number().int().min(1),
      title: z.string(),
      description: z.string(),
      meals: z.array(z.string()).optional(),
    }),
  ),
  hotels: z.array(
    z.object({
      name: z.string(),
      stars: z.number().int().min(1).max(7),
      location: z.string(),
      imageUrl: z.preprocess(
        (v) => (v === "" ? undefined : v),
        z.string().url().optional(),
      ),
      included: z.boolean(),
    }),
  ),
  activities: z.array(
    z.object({
      name: z.string(),
      duration: z.string(),
      included: z.boolean(),
      price: z.number().optional(),
    }),
  ),
  images: z.array(z.string().url()).default([]),
  tags: z.array(z.string()).default([]),
  cancellationPolicy: z
    .array(
      z.object({
        daysBeforeDeparture: z.number().int(),
        refundPercent: z.number().min(0).max(100),
      }),
    )
    .optional(),
  // Shape matches PackageAttribute (src/types/package.ts) and the public
  // AttributeQualityBadges renderer — {label, value, icon?} never matched
  // either consumer and no persisted row ever used it (verified against
  // the live DB: zero non-null `attributes` rows existed under any shape).
  attributes: z
    .array(
      z.object({
        label: z.string().min(1),
        quality: z.enum(["GREAT", "GOOD", "AVERAGE"]),
      }),
    )
    .optional(),
  isFeatured: z.boolean().default(false),
  includesFlights: z.boolean().default(false),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export type PackageFilters = z.infer<typeof packageFiltersSchema>;
export type CreatePackageInput = z.infer<typeof createPackageSchema>;
