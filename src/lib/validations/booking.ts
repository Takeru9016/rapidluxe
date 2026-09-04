import { z } from "zod";

const travelerSchema = z.object({
  name: z.string().min(1),
  dob: z.string().optional(),
  passportNo: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  isLead: z.boolean().default(false),
});

const panCardSchema = z
  .string()
  .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN card format");

export const createBookingSchema = z.object({
  packageId: z.string().min(1),
  departureDate: z.string().datetime(),
  adults: z.number().int().min(1),
  children: z.number().int().min(0).default(0),
  infants: z.number().int().min(0).default(0),
  occasion: z.string().optional(),
  dietaryRequirements: z.array(z.string()).default([]),
  couponCode: z.string().optional(),
  dealId: z.string().optional(),
  specialRequests: z.string().optional(),
  travelers: z.array(travelerSchema).min(1),
  panCard: panCardSchema.optional(),
  idempotencyKey: z.string().uuid(),
});

export const saveTravelersSchema = z.object({
  bookingId: z.string().min(1),
  travelers: z.array(travelerSchema).min(1),
  panCard: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN card format")
    .optional(),
  specialRequests: z.string().optional(),
  dietaryRequirements: z.array(z.string()).default([]),
});

export const sendQuoteSchema = z.object({
  quotedAmount: z.coerce.number().positive(),
  quoteNotes: z.string().optional(),
  paymentDueDate: z.string().datetime().optional(),
});

// Query params for GET /api/admin/bookings. dateFrom/dateTo intentionally
// filter on departureDate (the trip date), not createdAt/enquiry date — this
// is a deliberate, standardized choice for Admin Bookings, not a default.
// Both are plain YYYY-MM-DD strings from a date input, interpreted as UTC
// day boundaries (consistent with how the rest of the app doesn't do
// per-request timezone conversion): dateFrom is >= that date's start;
// dateTo is < the following date's start (see the where-clause construction
// in src/app/api/admin/bookings/route.ts), so a booking departing anywhere
// on the supplied end date is included regardless of its time component.
export const adminBookingFiltersSchema = z.object({
  status: z
    .enum([
      "ENQUIRY",
      "QUOTE_SENT",
      "AWAITING_PAYMENT",
      "PAID",
      "CONFIRMED",
      "CANCELLED",
    ])
    .optional(),
  search: z.string().trim().min(1).max(200).optional(),
  dateFrom: z.string().date().optional(),
  dateTo: z.string().date().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type SaveTravelersInput = z.infer<typeof saveTravelersSchema>;
export type SendQuoteInput = z.infer<typeof sendQuoteSchema>;
export type AdminBookingFilters = z.infer<typeof adminBookingFiltersSchema>;
