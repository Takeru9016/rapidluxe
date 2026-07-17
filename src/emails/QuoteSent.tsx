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

export function QuoteSent({ booking }: Props) {
  const whatsapp = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP ?? "";
  const supportEmail =
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "info@rapidluxe.com";

  return (
    <Html>
      <Head />
      <Preview>Your personalised travel quote is ready — RapidLuxe</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Your quote is ready</Heading>
          <Text style={text}>Hi {booking.user.name ?? "there"},</Text>
          <Text style={text}>
            Our team has reviewed your request and prepared a personalised quote
            for your trip. A secure payment link will be sent separately once
            you confirm interest.
          </Text>

          <Section style={card}>
            <Text style={sectionTitle}>Trip Summary</Text>
            <Row label="Package" value={booking.package.title} />
            {booking.package.destination && (
              <Row
                label="Destination"
                value={`${booking.package.destination.name}, ${booking.package.destination.country}`}
              />
            )}
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
          </Section>

          <Section style={quoteCard}>
            <Text style={quoteLabel}>Quoted Amount</Text>
            <Text style={quoteAmount}>
              {formatPrice(booking.quotedAmount ?? booking.totalAmount)}
            </Text>
            {booking.quoteNotes && (
              <>
                <Text style={quoteLabel}>Notes from our team</Text>
                <Text style={quoteNoteText}>{booking.quoteNotes}</Text>
              </>
            )}
            {booking.paymentDueDate && (
              <>
                <Text style={quoteLabel}>Payment Due By</Text>
                <Text style={quoteNoteText}>
                  {new Date(booking.paymentDueDate).toLocaleDateString(
                    "en-IN",
                    { day: "numeric", month: "long", year: "numeric" },
                  )}
                </Text>
              </>
            )}
          </Section>

          <Hr style={hr} />
          <Text style={mutedText}>
            Reply to this email or WhatsApp us at{" "}
            <span style={{ color: "#C9A84C" }}>{whatsapp}</span> (or email{" "}
            {supportEmail}) if you have any questions. Your payment link will
            arrive separately.
          </Text>
          <Footer />
        </Container>
      </Body>
    </Html>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <>
      <Text style={rowLabel}>{label}</Text>
      <Text style={rowValue}>{value}</Text>
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
const sectionTitle = {
  color: "#C9A84C",
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
const quoteCard = {
  backgroundColor: "#0F1520",
  border: "1px solid #C9A84C40",
  borderRadius: "8px",
  padding: "20px 24px",
  margin: "16px 0",
};
const quoteLabel = {
  color: "#8891A4",
  fontSize: "11px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
  margin: "12px 0 4px",
};
const quoteAmount = {
  color: "#C9A84C",
  fontSize: "28px",
  fontWeight: "700" as const,
  fontFamily: "monospace",
  margin: "0 0 8px",
};
const quoteNoteText = {
  color: "#D4D8E2",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0 0 8px",
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
