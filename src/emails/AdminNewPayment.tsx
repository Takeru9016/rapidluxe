import {
  Body,
  Button,
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

export function AdminNewPayment({ booking }: Props) {
  const amountPaid = (booking.quotedAmount ?? booking.totalAmount) * 1.05;
  const adminUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/admin/bookings`;

  return (
    <Html>
      <Head />
      <Preview>
        Payment received — {booking.bookingRef ?? ""} — action required
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Payment Received</Heading>
          <Text style={text}>
            A customer has completed payment and is awaiting booking
            confirmation.
          </Text>

          <Section style={alertCard}>
            <Text style={alertLabel}>Amount Paid</Text>
            <Text style={alertAmount}>{formatPrice(amountPaid)}</Text>
          </Section>

          <Section style={card}>
            <Text style={sectionTitle}>Customer Details</Text>
            <Row label="Name" value={booking.user.name ?? "Not provided"} />
            <Row label="Email" value={booking.user.email} />
            {booking.user.phone && (
              <Row label="Phone" value={booking.user.phone} />
            )}
          </Section>

          <Section style={card}>
            <Text style={sectionTitle}>Booking Details</Text>
            <Row label="Booking Ref" value={booking.bookingRef ?? "—"} mono />
            <Row label="Package" value={booking.package.title} />
            <Row
              label="Departure"
              value={new Date(booking.departureDate).toLocaleDateString(
                "en-IN",
                { day: "numeric", month: "long", year: "numeric" },
              )}
            />
            <Row
              label="Travelers"
              value={[
                `${booking.adults} adult${booking.adults !== 1 ? "s" : ""}`,
                booking.children > 0
                  ? `${booking.children} child${booking.children !== 1 ? "ren" : ""}`
                  : null,
              ]
                .filter(Boolean)
                .join(", ")}
            />
            {booking.razorpayPaymentId && (
              <Row
                label="Razorpay Payment ID"
                value={booking.razorpayPaymentId}
                mono
              />
            )}
          </Section>

          <Hr style={hr} />
          <Button style={button} href={adminUrl}>
            Confirm Booking →
          </Button>
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
      RapidLuxe — Admin Notification
      <br />
      <span style={{ color: "#8891A4" }}>
        © {new Date().getFullYear()} RapidLuxe. All rights reserved.
      </span>
    </Text>
  );
}

const main = {
  backgroundColor: "#1B2A41",
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
};
const container = {
  maxWidth: "580px",
  margin: "0 auto",
  padding: "40px 20px",
};
const heading = {
  color: "#F9A826",
  fontSize: "24px",
  fontWeight: "600" as const,
  margin: "0 0 20px",
};
const sectionTitle = {
  color: "#F9A826",
  fontSize: "12px",
  fontWeight: "600" as const,
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
  margin: "0 0 12px",
};
const text = {
  color: "#D4D8E2",
  fontSize: "14px",
  lineHeight: "1.7",
  margin: "0 0 16px",
};
const alertCard = {
  backgroundColor: "#0D1F14",
  border: "1px solid #2D6A4F",
  borderRadius: "8px",
  padding: "20px 24px",
  margin: "16px 0",
  textAlign: "center" as const,
};
const alertLabel = {
  color: "#8891A4",
  fontSize: "12px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
  margin: "0 0 8px",
};
const alertAmount = {
  color: "#F9A826",
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
const button = {
  backgroundColor: "#F9A826",
  color: "#1B2A41",
  padding: "12px 28px",
  borderRadius: "6px",
  fontWeight: "600" as const,
  fontSize: "14px",
  display: "inline-block",
};
const footer = {
  color: "#F9A826",
  fontSize: "12px",
  textAlign: "center" as const,
  lineHeight: "1.8",
  marginTop: "32px",
};
