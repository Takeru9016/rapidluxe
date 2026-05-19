export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "REFUNDED"
  | "COMPLETED";

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
  email: string;
  phone: string;
  isLead: boolean;
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
