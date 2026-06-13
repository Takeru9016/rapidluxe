export interface BookingEmailPayload {
  bookingRef: string | null;
  departureDate: Date;
  adults: number;
  children: number;
  infants: number;
  totalAmount: number;
  baseAmount: number;
  gstAmount: number;
  discountAmount: number;
  quotedAmount: number | null;
  quoteNotes: string | null;
  paymentDueDate: Date | null;
  paymentTokenExpiry: Date | null;
  razorpayPaymentId: string | null;
  status: string;
  createdAt: Date;
  user: {
    email: string;
    name: string | null;
    phone: string | null;
  };
  package: {
    title: string;
    images: string[];
    destination?: {
      name: string;
      country: string;
    } | null;
  };
}
