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

export function BookingConfirmed({ booking }: Props) {
  const whatsapp = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP ?? "";
  const supportEmail =
    process.env.RESEND_FROM_EMAIL ?? "bookings@rapidluxe.com";

  return (
    <Html>
      <Head />
      <Preview>
        Your trip is confirmed — {booking.package.title} — RapidLuxe
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Your trip is confirmed!</Heading>
          <Text style={text}>Hi {booking.user.name ?? "there"},</Text>
          <Text style={text}>
            Congratulations! Your booking has been confirmed by our team.
            Everything is set — we&apos;re looking forward to making this an
            unforgettable journey.
          </Text>

          <Section style={confirmBanner}>
            <Text style={confirmTitle}>{booking.package.title}</Text>
            {booking.package.destination && (
              <Text style={confirmDestination}>
                {booking.package.destination.name},{" "}
                {booking.package.destination.country}
              </Text>
            )}
          </Section>

          <Section style={card}>
            <Text style={sectionTitle}>Booking Details</Text>
            <Row label="Booking Ref" value={booking.bookingRef ?? "—"} mono />
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
                booking.infants > 0
                  ? `${booking.infants} infant${booking.infants !== 1 ? "s" : ""}`
                  : null,
              ]
                .filter(Boolean)
                .join(", ")}
            />
            <Row
              label="Amount Paid"
              value={formatPrice(
                (booking.quotedAmount ?? booking.totalAmount) * 1.05,
              )}
              highlight
            />
          </Section>

          <Section style={nextStepsCard}>
            <Text style={sectionTitle}>What happens next</Text>
            <Text style={stepText}>
              1. Our team will send you a detailed itinerary within 48 hours.
            </Text>
            <Text style={stepText}>
              2. You&apos;ll receive visa & documentation guidance if required.
            </Text>
            <Text style={stepText}>
              3. We&apos;ll be in touch 7 days before departure with final
              details.
            </Text>
          </Section>

          <Hr style={hr} />
          <Text style={mutedText}>
            For any questions, WhatsApp us at{" "}
            <span style={{ color: "#C9A84C" }}>{whatsapp}</span> or email us at{" "}
            {supportEmail}.
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
  highlight,
}: {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <>
      <Text style={rowLabel}>{label}</Text>
      <Text
        style={{
          ...rowValue,
          ...(mono ? { fontFamily: "monospace" } : {}),
          ...(highlight ? { color: "#C9A84C", fontSize: "18px" } : {}),
        }}
      >
        {value}
      </Text>
    </>
  );
}

function Footer() {
  const whatsapp = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP ?? "";
  const supportEmail =
    process.env.RESEND_FROM_EMAIL ?? "bookings@rapidluxe.com";

  return (
    <Text style={footer}>
      RapidLuxe — Luxury Travel Experiences
      <br />
      <span style={{ color: "#8891A4" }}>
        Support: {supportEmail} · WhatsApp: {whatsapp}
        <br />© {new Date().getFullYear()} RapidLuxe. All rights reserved.
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
  fontSize: "28px",
  fontWeight: "700" as const,
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
const confirmBanner = {
  backgroundColor: "#0F1520",
  border: "1px solid #C9A84C",
  borderRadius: "8px",
  padding: "24px",
  margin: "16px 0",
  textAlign: "center" as const,
};
const confirmTitle = {
  color: "#C9A84C",
  fontSize: "20px",
  fontWeight: "700" as const,
  margin: "0 0 4px",
};
const confirmDestination = {
  color: "#8891A4",
  fontSize: "14px",
  margin: "0",
};
const card = {
  backgroundColor: "#131827",
  borderRadius: "8px",
  padding: "20px 24px",
  margin: "16px 0",
};
const nextStepsCard = {
  backgroundColor: "#0F1A2E",
  border: "1px solid #1E3A5F",
  borderRadius: "8px",
  padding: "20px 24px",
  margin: "16px 0",
};
const stepText = {
  color: "#D4D8E2",
  fontSize: "13px",
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
