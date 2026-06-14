import { useQuery } from "@tanstack/react-query";

import type { UserBooking, UserBookingDetail } from "@/types/booking";

export function useBookings() {
  return useQuery<{ data: UserBooking[] }>({
    queryKey: ["bookings"],
    queryFn: async () => {
      const res = await fetch("/api/bookings");
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return res.json() as Promise<{ data: UserBooking[] }>;
    },
  });
}

export function useBooking(id: string) {
  return useQuery<{ data: UserBookingDetail }>({
    queryKey: ["booking", id],
    queryFn: async () => {
      const res = await fetch(`/api/bookings/${id}`);
      if (!res.ok) throw new Error("Booking not found");
      return res.json() as Promise<{ data: UserBookingDetail }>;
    },
    enabled: !!id,
  });
}
