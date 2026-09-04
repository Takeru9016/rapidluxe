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

import { calculateGST, formatPrice } from "@/lib/utils";
import type { BookingEmailPayload } from "@/types/email";

interface Props {
  booking: BookingEmailPayload;
  paymentUrl: string;
}

export function PaymentLinkSent({ booking, paymentUrl }: Props) {
  const quoteAmount = booking.quotedAmount ?? booking.baseAmount;
  const { gst, total: totalDue } = calculateGST(quoteAmount);
  const whatsapp = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP ?? "";
  const supportEmail =
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "info@rapidluxe.com";

  return (
    <Html>
      <Head />
      <Preview>
        Your payment link is ready — complete your booking with RapidLuxe
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Complete your booking</Heading>
          <Text style={text}>Hi {booking.user.name ?? "there"},</Text>
          <Text style={text}>
            Your payment link is now ready. Click below to securely complete
            your booking.
          </Text>

          <Section style={card}>
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

          <Section style={amountCard}>
            <Text style={amountLabel}>Quoted Amount</Text>
            <Text style={amountValue}>{formatPrice(quoteAmount)}</Text>
            <Text style={amountLabel}>GST (5%)</Text>
            <Text style={amountSecondary}>{formatPrice(gst)}</Text>
            <Text style={amountLabel}>Total Due</Text>
            <Text style={totalAmount}>{formatPrice(totalDue)}</Text>
          </Section>

          <Button style={payButton} href={paymentUrl}>
            Pay {formatPrice(totalDue)} →
          </Button>

          {booking.paymentTokenExpiry && (
            <Text style={expiryWarning}>
              ⚠ This payment link expires on{" "}
              {new Date(booking.paymentTokenExpiry).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                },
              )}
            </Text>
          )}

          <Hr style={hr} />
          <Text style={mutedText}>
            If the button doesn&apos;t work, copy and paste this link into your
            browser:
            <br />
            <span style={{ color: "#F9A826", wordBreak: "break-all" }}>
              {paymentUrl}
            </span>
          </Text>
          <Text style={mutedText}>
            Questions about this payment? WhatsApp us at{" "}
            <span style={{ color: "#F9A826" }}>{whatsapp}</span> or email us at{" "}
            {supportEmail}.
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
const amountCard = {
  backgroundColor: "#0F1520",
  border: "1px solid #F9A82640",
  borderRadius: "8px",
  padding: "20px 24px",
  margin: "16px 0",
};
const amountLabel = {
  color: "#8891A4",
  fontSize: "11px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
  margin: "12px 0 2px",
};
const amountValue = {
  color: "#D4D8E2",
  fontSize: "16px",
  fontFamily: "monospace",
  margin: "0 0 4px",
};
const amountSecondary = {
  color: "#8891A4",
  fontSize: "14px",
  fontFamily: "monospace",
  margin: "0 0 4px",
};
const totalAmount = {
  color: "#F9A826",
  fontSize: "28px",
  fontWeight: "700" as const,
  fontFamily: "monospace",
  margin: "0 0 4px",
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
const payButton = {
  backgroundColor: "#F9A826",
  color: "#1B2A41",
  padding: "14px 32px",
  borderRadius: "6px",
  fontWeight: "700" as const,
  fontSize: "16px",
  display: "inline-block",
  margin: "16px 0",
};
const expiryWarning = {
  color: "#E8705A",
  fontSize: "13px",
  margin: "8px 0 0",
};
const hr = { borderColor: "#2A2F40", margin: "24px 0" };
const footer = {
  color: "#F9A826",
  fontSize: "12px",
  textAlign: "center" as const,
  lineHeight: "1.8",
  marginTop: "32px",
};
