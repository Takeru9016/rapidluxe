import { useQuery } from "@tanstack/react-query";

import type { Review } from "@/types/review";

export type ApiReview = Omit<Review, "createdAt"> & {
  createdAt: string;
  user: { name: string | null };
};

interface ReviewsResponse {
  data: ApiReview[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function useReviews(packageId: string, page = 1, limit = 10) {
  return useQuery<ReviewsResponse>({
    queryKey: ["reviews", packageId, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        packageId,
        page: String(page),
        limit: String(limit),
      });
      const res = await fetch(`/api/reviews?${params}`);
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return res.json() as Promise<ReviewsResponse>;
    },
    enabled: !!packageId,
  });
}

export function useCheckEligibility(packageId: string) {
  return useQuery<{ eligible: boolean }>({
    queryKey: ["eligibility", packageId],
    queryFn: async () => {
      const res = await fetch(
        `/api/bookings/check-eligibility?packageId=${packageId}`,
      );
      if (res.status === 401) return { eligible: false };
      if (!res.ok) throw new Error("Failed to check eligibility");
      return res.json() as Promise<{ eligible: boolean }>;
    },
    enabled: !!packageId,
  });
}
