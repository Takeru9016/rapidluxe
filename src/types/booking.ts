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
  totalAmount: number;
  quotedAmount: number | null;
  status: DbBookingStatus;
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
  totalAmount: number;
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
