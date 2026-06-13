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

export function AdminNewEnquiry({ booking }: Props) {
  const adminUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/admin/bookings`;

  return (
    <Html>
      <Head />
      <Preview>
        New booking enquiry — {booking.package.title} —{" "}
        {booking.bookingRef ?? ""}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>New Booking Enquiry</Heading>
          <Text style={text}>
            A new travel enquiry has been submitted and is awaiting your review.
          </Text>

          <Section style={card}>
            <Text style={sectionTitle}>Customer Details</Text>
            <Row label="Name" value={booking.user.name ?? "Not provided"} />
            <Row label="Email" value={booking.user.email} />
            <Row label="Phone" value={booking.user.phone ?? "Not provided"} />
          </Section>

          <Section style={card}>
            <Text style={sectionTitle}>Booking Details</Text>
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
              label="Estimated Amount"
              value={formatPrice(booking.totalAmount)}
              highlight
            />
          </Section>

          <Hr style={hr} />
          <Button style={button} href={adminUrl}>
            Review in Admin →
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
          ...(highlight ? { color: "#C9A84C", fontSize: "16px" } : {}),
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
      RapidLuxe — Admin Notification
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
  backgroundColor: "#C9A84C",
  color: "#0B0F1A",
  padding: "12px 28px",
  borderRadius: "6px",
  fontWeight: "600" as const,
  fontSize: "14px",
  display: "inline-block",
};
const footer = {
  color: "#C9A84C",
  fontSize: "12px",
  textAlign: "center" as const,
  lineHeight: "1.8",
  marginTop: "32px",
};
