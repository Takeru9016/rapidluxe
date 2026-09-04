import { z } from "zod";

import { SLUG_PATTERN } from "@/lib/utils";

export const destinationFiltersSchema = z.object({
  continent: z.string().optional(),
});

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

// Matches the existing checklist UI in both admin forms (new/[id] pages) —
// full month names only, no abbreviations, no invented taxonomy.
// No .default() here deliberately: this base schema is shared by both create
// and update. A default baked in here would survive `.partial()` on the
// update schema, turning "field omitted from a PATCH body" into "field
// present as []" in parsed.data — which the route's `!== undefined` guard
// would then read as an explicit clear. Create applies its own default
// separately below; update leaves the field genuinely optional (no default).
const bestMonthsFieldSchema = z
  .array(z.enum(MONTHS))
  .refine((months) => new Set(months).size === months.length, {
    message: "Duplicate months are not allowed",
  });

const CONTINENTS = [
  "ASIA",
  "EUROPE",
  "AFRICA",
  "AMERICAS",
  "MIDDLE_EAST",
  "OCEANIA",
] as const;

const VISA_TYPES = [
  "VISA_FREE",
  "VISA_ON_ARRIVAL",
  "E_VISA",
  "VISA_REQUIRED",
] as const;

// Matches Prisma's DestinationCrowdLevel enum exactly (schema.prisma).
const DESTINATION_CROWD_LEVELS = [
  "LOW",
  "MODERATE",
  "HIGH",
  "VERY_HIGH",
] as const;

// Matches src/types/destination.ts CrowdLevel — deliberately distinct from
// DestinationCrowdLevel above (per-month "MEDIUM" vs. overall "MODERATE").
// Not unified in this stage — flagged as a product decision, not touched here.
const WHEN_TO_VISIT_CROWD_LEVELS = ["LOW", "MEDIUM", "HIGH"] as const;
const AVAILABILITY_STATUSES = ["Open", "Closed", "Limited"] as const;
const VISIT_RECOMMENDATIONS = ["Recommended", "Not recommended"] as const;

// Mirrors the actual shape both admin forms submit for each of the 12 fixed
// monthly rows (index-aligned to MONTHS, no "month" key sent) — not the
// WhenToVisitMonth type in types/destination.ts, which includes "month" but
// is not what either form currently produces.
const whenToVisitRowSchema = z.object({
  crowdLevel: z.enum(WHEN_TO_VISIT_CROWD_LEVELS).or(z.literal("")),
  availability: z.enum(AVAILABILITY_STATUSES).or(z.literal("")),
  recommendation: z.enum(VISIT_RECOMMENDATIONS).or(z.literal("")),
});

// Mirrors the actual shape both admin forms submit — name/description/
// recommended only, no "type" field (unlike TransportOption in
// types/destination.ts, which the forms don't currently populate).
const transportRowSchema = z.object({
  name: z.string(),
  description: z.string(),
  recommended: z.boolean(),
});

const slugSchema = z
  .string()
  .min(1)
  .regex(
    SLUG_PATTERN,
    "Slug must be lowercase letters, numbers, and hyphens only (no spaces or leading/trailing hyphen)",
  );

// Same reasoning as bestMonthsFieldSchema above: no .default() on the shared
// base, so the update schema's `.partial()` derivation below leaves this
// field genuinely absent (not []) when the request omits it.
const imagesFieldSchema = z.array(z.string().url());

export const createDestinationSchema = z.object({
  name: z.string().min(1),
  slug: slugSchema,
  country: z.string().min(1),
  continent: z.enum(CONTINENTS),
  imageUrl: z.string().url().optional(),
  // Create-only defaults: a brand-new Destination with no images/bestMonths
  // in the request genuinely means "start with none", so [] is correct here.
  images: imagesFieldSchema.default([]),
  bestMonths: bestMonthsFieldSchema.default([]),
  visaType: z.enum(VISA_TYPES).optional(),
  currency: z.string().optional(),
  language: z.string().optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  countryCode: z.string().optional(),
  crowdLevel: z.enum(DESTINATION_CROWD_LEVELS).optional(),
  whenToVisit: z.array(whenToVisitRowSchema).optional(),
  howToGetThere: z.array(transportRowSchema).optional(),
  about: z.string().optional(),
  travelTips: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

// Partial: every field optional, but any field that IS supplied is fully
// validated. Omitted fields are simply absent from parsed.data, so the PATCH
// route's existing `...(body.x !== undefined && {x: body.x})` spread pattern
// continues to leave them untouched.
//
// `images` and `bestMonths` are overridden here (rather than inherited via
// plain `.partial()`) specifically to strip the create schema's `.default([])`
// — without this override, `.partial()` would still apply that default to an
// omitted key, producing `images: []` / `bestMonths: []` in parsed.data even
// though the request never mentioned them. The route's `!== undefined` guard
// would then read that manufactured [] as an explicit "clear this field"
// instruction, silently wiping existing data on any partial PATCH that
// doesn't happen to include these two keys. Overriding with the plain
// (default-less) field schemas keeps them truly optional: omitted → absent
// from parsed.data → left untouched by the route; explicitly sent as [] →
// present in parsed.data as [] → intentional clear, exactly as before.
export const updateDestinationSchema = createDestinationSchema
  .omit({ images: true, bestMonths: true })
  .partial()
  .extend({
    images: imagesFieldSchema.optional(),
    bestMonths: bestMonthsFieldSchema.optional(),
  });

export const searchQuerySchema = z.object({
  q: z.string().min(1).max(200),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const suggestionsQuerySchema = z.object({
  q: z.string().min(1).max(100),
  limit: z.coerce.number().int().min(1).max(10).default(5),
});
