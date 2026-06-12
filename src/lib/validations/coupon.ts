import { z } from "zod";

export const validateCouponSchema = z.object({
  code: z.string().min(1).toUpperCase(),
  packageId: z.string().min(1),
  amount: z.number().positive(),
});

export type ValidateCouponInput = z.infer<typeof validateCouponSchema>;
