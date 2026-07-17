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

import type { BookingEmailPayload } from "@/types/email";

interface Props {
  booking: BookingEmailPayload;
}

export function CancellationNotice({ booking }: Props) {
  const whatsapp = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP ?? "";
  const supportEmail =
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "info@rapidluxe.com";

  return (
    <Html>
      <Head />
      <Preview>
        Booking cancelled — {booking.bookingRef ?? ""} — RapidLuxe
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Booking Cancelled</Heading>
          <Text style={text}>Hi {booking.user.name ?? "there"},</Text>
          <Text style={text}>
            Your booking has been cancelled as requested. We&apos;re sorry to
            see you go and hope to plan your next trip together soon.
          </Text>

          <Section style={card}>
            <Row label="Booking Ref" value={booking.bookingRef ?? "—"} mono />
            <Row label="Package" value={booking.package.title} />
            <Row
              label="Departure Date"
              value={new Date(booking.departureDate).toLocaleDateString(
                "en-IN",
                { day: "numeric", month: "long", year: "numeric" },
              )}
            />
            <Row label="Status" value="Cancelled" />
          </Section>

          <Section style={policyCard}>
            <Text style={policyTitle}>Refund Policy</Text>
            <Text style={policyText}>
              If payment was made, our team will process your refund within 7–10
              business days to the original payment method. Please contact us if
              you haven&apos;t received your refund after this period.
            </Text>
          </Section>

          <Hr style={hr} />
          <Text style={mutedText}>
            For any questions about your cancellation or refund, contact us:
            <br />
            WhatsApp: <span style={{ color: "#C9A84C" }}>{whatsapp}</span>
            <br />
            Email: {supportEmail}
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
const card = {
  backgroundColor: "#131827",
  borderRadius: "8px",
  padding: "20px 24px",
  margin: "16px 0",
};
const policyCard = {
  backgroundColor: "#1A1010",
  border: "1px solid #4A1515",
  borderRadius: "8px",
  padding: "20px 24px",
  margin: "16px 0",
};
const policyTitle = {
  color: "#E8705A",
  fontSize: "13px",
  fontWeight: "600" as const,
  margin: "0 0 8px",
};
const policyText = {
  color: "#8891A4",
  fontSize: "13px",
  lineHeight: "1.6",
  margin: "0",
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
