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

export function EnquiryReceived({ booking }: Props) {
  const whatsapp = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP ?? "";
  const supportEmail =
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "info@rapidluxe.com";

  return (
    <Html>
      <Head />
      <Preview>
        We received your travel request and will send a quote within 24 hours.
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>We&apos;ve got your request</Heading>
          <Text style={text}>Hi {booking.user.name ?? "there"},</Text>
          <Text style={text}>
            Thank you for reaching out to RapidLuxe. Our travel experts will
            review your request and send you a personalised quote within{" "}
            <strong style={{ color: "#C9A84C" }}>24 hours</strong>.
          </Text>

          <Section style={card}>
            <Row label="Package" value={booking.package.title} />
            {booking.package.destination && (
              <Row
                label="Destination"
                value={`${booking.package.destination.name}, ${booking.package.destination.country}`}
              />
            )}
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
              label="Estimated Total"
              value={formatPrice(booking.totalAmount)}
              highlight
            />
          </Section>

          <Hr style={hr} />
          <Text style={mutedText}>
            For urgent queries, WhatsApp us at{" "}
            <span style={{ color: "#C9A84C" }}>{whatsapp}</span> or reply to{" "}
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
  margin: "24px 0",
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
