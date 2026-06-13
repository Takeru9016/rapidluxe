import { AdminNewEnquiry } from "@/emails/AdminNewEnquiry";
import { AdminNewPayment } from "@/emails/AdminNewPayment";
import { BookingConfirmed } from "@/emails/BookingConfirmed";
import { CancellationNotice } from "@/emails/CancellationNotice";
import { EnquiryReceived } from "@/emails/EnquiryReceived";
import { PaymentConfirmation } from "@/emails/PaymentConfirmation";
import { PaymentLinkSent } from "@/emails/PaymentLinkSent";
import { QuoteSent } from "@/emails/QuoteSent";
import type { BookingEmailPayload } from "@/types/email";

import { getResend } from "./resend";

const FROM = process.env.RESEND_FROM_EMAIL ?? "bookings@rapidluxe.com";
const ADMIN = process.env.ADMIN_EMAIL ?? "";

export async function sendEnquiryReceivedEmail(
  booking: BookingEmailPayload,
): Promise<void> {
  try {
    const resend = getResend();
    await Promise.all([
      resend.emails.send({
        from: FROM,
        to: booking.user.email,
        subject: "We received your travel request — RapidLuxe",
        react: EnquiryReceived({ booking }),
      }),
      resend.emails.send({
        from: FROM,
        to: ADMIN,
        subject: `New booking enquiry — ${booking.package.title} — ${booking.bookingRef ?? ""}`,
        react: AdminNewEnquiry({ booking }),
      }),
    ]);
  } catch (error) {
    console.error("[email] sendEnquiryReceivedEmail failed:", error);
  }
}

export async function sendQuoteEmail(
  booking: BookingEmailPayload,
): Promise<void> {
  try {
    await getResend().emails.send({
      from: FROM,
      to: booking.user.email,
      subject: "Your quote is ready — RapidLuxe",
      react: QuoteSent({ booking }),
    });
  } catch (error) {
    console.error("[email] sendQuoteEmail failed:", error);
  }
}

export async function sendPaymentLinkEmail(
  booking: BookingEmailPayload,
  paymentUrl: string,
): Promise<void> {
  try {
    await getResend().emails.send({
      from: FROM,
      to: booking.user.email,
      subject: "Complete your booking — Payment link inside",
      react: PaymentLinkSent({ booking, paymentUrl }),
    });
  } catch (error) {
    console.error("[email] sendPaymentLinkEmail failed:", error);
  }
}

export async function sendPaymentConfirmationEmail(
  booking: BookingEmailPayload,
): Promise<void> {
  try {
    const resend = getResend();
    await Promise.all([
      resend.emails.send({
        from: FROM,
        to: booking.user.email,
        subject: `Payment received — Booking #${booking.bookingRef ?? ""}`,
        react: PaymentConfirmation({ booking }),
      }),
      resend.emails.send({
        from: FROM,
        to: ADMIN,
        subject: `Payment received — ${booking.bookingRef ?? ""}`,
        react: AdminNewPayment({ booking }),
      }),
    ]);
  } catch (error) {
    console.error("[email] sendPaymentConfirmationEmail failed:", error);
  }
}

export async function sendBookingConfirmedEmail(
  booking: BookingEmailPayload,
): Promise<void> {
  try {
    await getResend().emails.send({
      from: FROM,
      to: booking.user.email,
      subject: `Your trip is confirmed! — ${booking.package.title}`,
      react: BookingConfirmed({ booking }),
    });
  } catch (error) {
    console.error("[email] sendBookingConfirmedEmail failed:", error);
  }
}

export async function sendCancellationEmail(
  booking: BookingEmailPayload,
): Promise<void> {
  try {
    await getResend().emails.send({
      from: FROM,
      to: booking.user.email,
      subject: `Booking cancelled — ${booking.bookingRef ?? ""}`,
      react: CancellationNotice({ booking }),
    });
  } catch (error) {
    console.error("[email] sendCancellationEmail failed:", error);
  }
}
