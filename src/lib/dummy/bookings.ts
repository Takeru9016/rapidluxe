export type BookingEnquiryStatus =
  | "ENQUIRY"
  | "QUOTE_SENT"
  | "AWAITING_PAYMENT"
  | "PAID"
  | "CONFIRMED"
  | "CANCELLED";

export interface AdminBooking {
  id: string;
  bookingRef: string;
  user: { name: string; email: string };
  package: { name: string };
  departureDate: string;
  adults: number;
  children: number;
  totalAmount: number;
  quotedAmount: number | null;
  status: BookingEnquiryStatus;
}

export const dummyAdminBookings: AdminBooking[] = [
  {
    id: "bk-001",
    bookingRef: "RL-A3F8K2",
    user: { name: "Arjun Sharma", email: "arjun.sharma@gmail.com" },
    package: { name: "Bali Serenity Escape" },
    departureDate: "2026-09-14",
    adults: 2,
    children: 0,
    totalAmount: 178500,
    quotedAmount: null,
    status: "ENQUIRY",
  },
  {
    id: "bk-002",
    bookingRef: "RL-B7M4P9",
    user: { name: "Priya Mehta", email: "priya.mehta@gmail.com" },
    package: { name: "Maldives Overwater Luxury" },
    departureDate: "2026-11-03",
    adults: 2,
    children: 1,
    totalAmount: 304500,
    quotedAmount: null,
    status: "ENQUIRY",
  },
  {
    id: "bk-003",
    bookingRef: "RL-C2N6Q1",
    user: { name: "Rahul Verma", email: "rahul.verma@outlook.com" },
    package: { name: "Santorini Sunset Romance" },
    departureDate: "2026-07-20",
    adults: 2,
    children: 0,
    totalAmount: 325500,
    quotedAmount: 318000,
    status: "QUOTE_SENT",
  },
  {
    id: "bk-004",
    bookingRef: "RL-D5R3T7",
    user: { name: "Sneha Patel", email: "sneha.patel@yahoo.com" },
    package: { name: "Dubai Desert Luxury" },
    departureDate: "2026-08-15",
    adults: 2,
    children: 2,
    totalAmount: 225750,
    quotedAmount: 215000,
    status: "QUOTE_SENT",
  },
  {
    id: "bk-005",
    bookingRef: "RL-E9S1W4",
    user: { name: "Vikram Nair", email: "vikram.nair@gmail.com" },
    package: { name: "Switzerland Alpine Dream" },
    departureDate: "2026-06-10",
    adults: 3,
    children: 0,
    totalAmount: 399000,
    quotedAmount: 390000,
    status: "AWAITING_PAYMENT",
  },
  {
    id: "bk-006",
    bookingRef: "RL-F4U8X2",
    user: { name: "Anita Desai", email: "anita.desai@gmail.com" },
    package: { name: "Kerala Backwaters Bliss" },
    departureDate: "2026-10-01",
    adults: 2,
    children: 0,
    totalAmount: 131250,
    quotedAmount: 125000,
    status: "PAID",
  },
  {
    id: "bk-007",
    bookingRef: "RL-G6V2Y5",
    user: { name: "Karan Kapoor", email: "karan.kapoor@gmail.com" },
    package: { name: "Rajasthan Royal Circuit" },
    departureDate: "2026-11-20",
    adults: 4,
    children: 1,
    totalAmount: 99750,
    quotedAmount: 95000,
    status: "CONFIRMED",
  },
  {
    id: "bk-008",
    bookingRef: "RL-H1Z9B3",
    user: { name: "Meera Joshi", email: "meera.joshi@outlook.com" },
    package: { name: "Singapore City & Sentosa" },
    departureDate: "2026-05-01",
    adults: 2,
    children: 0,
    totalAmount: 152250,
    quotedAmount: 145000,
    status: "CANCELLED",
  },
];
