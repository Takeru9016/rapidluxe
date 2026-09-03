import type { DbBookingStatus } from "@/types/booking";

export interface BookingStatusMeta {
  label: string;
  description: string;
  variant: "gold" | "teal" | "coral" | "ghost";
}

export const BOOKING_STATUS_CONFIG: Record<DbBookingStatus, BookingStatusMeta> =
  {
    ENQUIRY: {
      label: "Enquiry",
      description: "Your enquiry is being reviewed.",
      variant: "ghost",
    },
    QUOTE_SENT: {
      label: "Quote Sent",
      description: "A quote is ready for your review.",
      variant: "gold",
    },
    AWAITING_PAYMENT: {
      label: "Payment Pending",
      description: "Payment is needed to confirm this booking.",
      variant: "coral",
    },
    PAID: {
      label: "Paid",
      description: "Payment received. Confirmation may still be pending.",
      variant: "teal",
    },
    CONFIRMED: {
      label: "Confirmed",
      description: "Your booking is confirmed.",
      variant: "teal",
    },
    CANCELLED: {
      label: "Cancelled",
      description: "This booking has been cancelled.",
      variant: "ghost",
    },
  };
