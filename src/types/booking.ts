export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "REFUNDED"
  | "COMPLETED";

export type DbBookingStatus =
  | "ENQUIRY"
  | "QUOTE_SENT"
  | "AWAITING_PAYMENT"
  | "PAID"
  | "CONFIRMED"
  | "CANCELLED";

export interface AdminBooking {
  id: string;
  bookingRef: string | null;
  user: { name: string | null; email: string };
  package: { title: string };
  departureDate: string;
  adults: number;
  children: number;
  /** Admin-set quote (pre-GST), when one has been sent. Null before Send Quote. */
  quotedAmount: number | null;
  /**
   * The authoritative displayed amount: GST-inclusive charged total when a
   * quote exists (matches what /api/payments/create-order actually bills),
   * else the enquiry-time estimate. See chargedTotal() in src/lib/utils.ts.
   */
  chargedTotal: number;
  status: DbBookingStatus;
}

/** Masked traveler view for the admin detail page — never carries raw PAN/passport numbers. */
export interface AdminTravelerSummary {
  name: string;
  isLead: boolean;
  hasDocument: boolean;
}

export interface AdminBookingDetail {
  id: string;
  bookingRef: string | null;
  status: DbBookingStatus;
  createdAt: string;
  updatedAt: string;
  user: { name: string | null; email: string; phone: string | null };
  package: { id: string; title: string; destination: string | null };
  departureDate: string;
  returnDate: string | null;
  adults: number;
  children: number;
  infants: number;
  travelers: AdminTravelerSummary[];
  occasion: string | null;
  dietaryRequirements: string[];
  specialRequests: string | null;
  quoteNotes: string | null;
  paymentDueDate: string | null;
  baseAmount: number;
  quotedAmount: number | null;
  discountAmount: number;
  gstAmount: number;
  chargedTotal: number;
  hasPanOnFile: boolean;
}

export type BookingStep = 1 | 2 | 3 | 4;

export interface Traveler {
  name: string;
  dob: Date;
  passportNo: string;
  isLead: boolean;
}

export interface TravelerDetail {
  name: string;
  dob: string;
  passportNo: string;
  email?: string;
  phone?: string;
  isLead: boolean;
}

export interface PaymentPageData {
  bookingRef: string | null;
  packageName: string;
  packageImage: string | null;
  destination?: string;
  departureDate: string;
  adults: number;
  children: number;
  quotedAmount: number | null;
  quoteNotes: string | null;
  gstAmount: number;
  totalAmount: number;
  expiresAt: string | null;
  userName: string | null;
  userEmail: string | null;
}

export interface Booking {
  id: string;
  bookingRef: string;
  userId: string;
  packageId: string;
  departureDate: Date;
  adults: number;
  children: number;
  infants: number;
  travelers: Traveler[];
  totalAmount: number;
  gstAmount: number;
  discountAmount: number;
  couponCode?: string;
  panCard?: string;
  bookingStatus: BookingStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type DisplayStatus = "upcoming" | "completed" | "cancelled" | "refunded";

export interface UserBooking {
  id: string;
  bookingRef: string | null;
  /** Authoritative six-state status, sourced directly from the persisted booking. */
  status: DbBookingStatus;
  /** Coarse Upcoming/Completed/Cancelled grouping only — not for status display. */
  displayStatus: DisplayStatus;
  departureDate: string;
  returnDate: string | null;
  adults: number;
  children: number;
  /** Stale once a quote exists — do not use for display; kept for existing readers. */
  totalAmount: number;
  /** Enquiry-time base amount (pre-GST). Authoritative only when no quote exists. */
  baseAmount: number;
  /** Admin-set quote (pre-GST). Authoritative once set — supersedes baseAmount. */
  quotedAmount: number | null;
  package: {
    title: string;
    images: string[];
    destination: { name: string } | null;
  };
}

export interface UserBookingDetail extends Omit<UserBooking, "package"> {
  infants: number;
  baseAmount: number;
  gstAmount: number;
  discountAmount: number;
  couponCode: string | null;
  quotedAmount: number | null;
  quoteNotes: string | null;
  paymentDueDate: string | null;
  occasion: string | null;
  dietaryRequirements: string[];
  specialRequests: string | null;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  travelers: TravelerDetail[];
  package: {
    title: string;
    images: string[];
    durationNights: number;
    tags: string[];
    destination: { name: string } | null;
  };
}
