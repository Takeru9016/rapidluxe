import { z } from "zod";

export const createReviewSchema = z.object({
  packageId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(100).optional(),
  body: z.string().min(10).max(2000),
  images: z.array(z.string()).default([]),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
