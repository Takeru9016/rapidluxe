import { z } from "zod";

export const createBookingSchema = z.object({
  packageId: z.string().min(1),
  departureDate: z.string().datetime(),
  adults: z.number().int().min(1),
  children: z.number().int().min(0).default(0),
  infants: z.number().int().min(0).default(0),
  occasion: z.string().optional(),
  dietaryRequirements: z.array(z.string()).default([]),
  couponCode: z.string().optional(),
  specialRequests: z.string().optional(),
});

const travelerSchema = z.object({
  name: z.string().min(1),
  dob: z.string().optional(),
  passportNo: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  isLead: z.boolean().default(false),
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

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type SaveTravelersInput = z.infer<typeof saveTravelersSchema>;
export type SendQuoteInput = z.infer<typeof sendQuoteSchema>;
