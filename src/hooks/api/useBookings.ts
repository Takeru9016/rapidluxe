import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/bookings/${id}/cancel`, {
        method: "POST",
      });
      const json: { data?: { status: string }; error?: string } =
        await res.json();
      if (!res.ok) {
        throw new Error(json.error ?? "Failed to cancel booking");
      }
      return json.data;
    },
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({ queryKey: ["bookings"] });
      void queryClient.invalidateQueries({ queryKey: ["booking", id] });
    },
  });
}

export function usePayBooking() {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/bookings/${id}/pay`, { method: "POST" });
      const json: { data?: { payUrl: string }; error?: string } =
        await res.json();
      if (!res.ok || !json.data) {
        throw new Error(
          json.error ?? "Payment is not available for this booking.",
        );
      }
      return json.data;
    },
  });
}
