import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

import { formatPrice } from "@/lib/utils";
import type { BookingEmailPayload } from "@/types/email";

interface Props {
  booking: BookingEmailPayload;
}

export function PaymentConfirmation({ booking }: Props) {
  const amountPaid = (booking.quotedAmount ?? booking.totalAmount) * 1.05;

  return (
    <Html>
      <Head />
      <Preview>
        Payment received — Booking {booking.bookingRef ?? ""} — RapidLuxe
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Payment received</Heading>
          <Text style={text}>Hi {booking.user.name ?? "there"},</Text>
          <Text style={text}>
            We&apos;ve received your payment. Our team will review and confirm
            your booking shortly — you&apos;ll receive a confirmation email once
            that&apos;s done.
          </Text>

          <Section style={confirmCard}>
            <Text style={confirmIcon}>✓</Text>
            <Text style={confirmLabel}>Amount Paid</Text>
            <Text style={confirmAmount}>{formatPrice(amountPaid)}</Text>
          </Section>

          <Section style={card}>
            <Row label="Booking Ref" value={booking.bookingRef ?? "—"} mono />
            <Row label="Package" value={booking.package.title} />
            <Row
              label="Departure"
              value={new Date(booking.departureDate).toLocaleDateString(
                "en-IN",
                { day: "numeric", month: "long", year: "numeric" },
              )}
            />
            {booking.razorpayPaymentId && (
              <Row label="Payment ID" value={booking.razorpayPaymentId} mono />
            )}
          </Section>

          <Hr style={hr} />
          <Text style={mutedText}>
            Keep this email as your payment receipt. A booking confirmation with
            full trip details will follow once our team reviews your booking.
          </Text>
          <Footer />
        </Container>
      </Body>
    </Html>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <>
      <Text style={rowLabel}>{label}</Text>
      <Text
        style={{ ...rowValue, ...(mono ? { fontFamily: "monospace" } : {}) }}
      >
        {value}
      </Text>
    </>
  );
}

function Footer() {
  return (
    <Text style={footer}>
      RapidLuxe — Luxury Travel Experiences
      <br />
      <span style={{ color: "#8891A4" }}>
        © {new Date().getFullYear()} RapidLuxe. All rights reserved.
      </span>
    </Text>
  );
}

const main = {
  backgroundColor: "#0B0F1A",
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
};
const container = {
  maxWidth: "580px",
  margin: "0 auto",
  padding: "40px 20px",
};
const heading = {
  color: "#C9A84C",
  fontSize: "24px",
  fontWeight: "600" as const,
  margin: "0 0 20px",
};
const text = {
  color: "#D4D8E2",
  fontSize: "14px",
  lineHeight: "1.7",
  margin: "0 0 16px",
};
const mutedText = {
  color: "#8891A4",
  fontSize: "13px",
  lineHeight: "1.6",
  margin: "0 0 16px",
};
const confirmCard = {
  backgroundColor: "#0D1F14",
  border: "1px solid #2D6A4F",
  borderRadius: "8px",
  padding: "24px",
  margin: "16px 0",
  textAlign: "center" as const,
};
const confirmIcon = {
  color: "#4ADE80",
  fontSize: "32px",
  margin: "0 0 8px",
};
const confirmLabel = {
  color: "#8891A4",
  fontSize: "12px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
  margin: "0 0 4px",
};
const confirmAmount = {
  color: "#C9A84C",
  fontSize: "32px",
  fontWeight: "700" as const,
  fontFamily: "monospace",
  margin: "0",
};
const card = {
  backgroundColor: "#131827",
  borderRadius: "8px",
  padding: "20px 24px",
  margin: "16px 0",
};
const rowLabel = {
  color: "#8891A4",
  fontSize: "11px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
  margin: "12px 0 2px",
};
const rowValue = {
  color: "#D4D8E2",
  fontSize: "14px",
  fontWeight: "500" as const,
  margin: "0 0 4px",
};
const hr = { borderColor: "#2A2F40", margin: "24px 0" };
const footer = {
  color: "#C9A84C",
  fontSize: "12px",
  textAlign: "center" as const,
  lineHeight: "1.8",
  marginTop: "32px",
};
