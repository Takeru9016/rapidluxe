import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a1a",
    padding: 40,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    paddingBottom: 14,
    borderBottom: "1.5pt solid #C9A84C",
  },
  companyName: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#0B0F1A",
    letterSpacing: 0.5,
  },
  companyMeta: {
    fontSize: 8,
    color: "#666666",
    marginTop: 4,
    lineHeight: 1.6,
  },
  invoiceLabel: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#C9A84C",
    textAlign: "right",
  },
  invoiceMeta: {
    fontSize: 8,
    color: "#666666",
    textAlign: "right",
    marginTop: 4,
    lineHeight: 1.6,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#C9A84C",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
    paddingBottom: 4,
    borderBottom: "0.5pt solid #e5e5e5",
  },
  // Two-column summary
  twoCol: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  col: {
    width: "48%",
  },
  row: {
    flexDirection: "row",
    marginBottom: 3,
  },
  label: {
    width: 90,
    color: "#666666",
    fontSize: 9,
  },
  value: {
    flex: 1,
    color: "#1a1a1a",
    fontSize: 9,
  },
  valueMono: {
    flex: 1,
    color: "#1a1a1a",
    fontSize: 9,
    fontFamily: "Courier-Bold",
  },
  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#C9A84C",
    color: "#0B0F1A",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 3,
  },
  // Price breakdown table
  table: {
    marginTop: 6,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0B0F1A",
    padding: "6 8",
    borderRadius: 3,
    marginBottom: 1,
  },
  tableHeaderCell: {
    color: "#C9A84C",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    padding: "5 8",
    borderBottom: "0.5pt solid #f0f0f0",
  },
  tableCell: {
    color: "#1a1a1a",
    fontSize: 9,
  },
  tableCellMuted: {
    color: "#888888",
    fontSize: 9,
  },
  tableCellGreen: {
    color: "#0D9488",
    fontSize: 9,
  },
  colDesc: { flex: 3.2 },
  colRate: { flex: 1.6, textAlign: "right" },
  colQty: { flex: 1.3, textAlign: "center" },
  colAmount: { flex: 1.5, textAlign: "right" },
  // Subtotal / GST / Total rows
  summaryRow: {
    flexDirection: "row",
    padding: "5 8",
  },
  subtotalRow: {
    flexDirection: "row",
    padding: "6 8",
    borderTop: "1pt solid #1a1a1a",
  },
  totalRow: {
    flexDirection: "row",
    padding: "7 8",
    backgroundColor: "#C9A84C",
    borderRadius: 3,
    marginTop: 2,
  },
  summaryLabel: {
    flex: 1,
    fontSize: 9,
    color: "#666666",
    textAlign: "right",
    paddingRight: 12,
  },
  summaryLabelBold: {
    flex: 1,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
    textAlign: "right",
    paddingRight: 12,
  },
  summaryValue: {
    width: 90,
    fontSize: 9,
    color: "#1a1a1a",
    textAlign: "right",
  },
  summaryValueBold: {
    width: 90,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
    textAlign: "right",
  },
  totalLabel: {
    flex: 1,
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#0B0F1A",
    textAlign: "right",
    paddingRight: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  totalValue: {
    width: 90,
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#0B0F1A",
    textAlign: "right",
  },
  // Payment confirmation
  paymentBlock: {
    marginTop: 4,
    padding: "10 12",
    backgroundColor: "#f8f8f8",
    borderRadius: 4,
    borderLeft: "3pt solid #C9A84C",
  },
  paymentTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#C9A84C",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  notice: {
    marginTop: 8,
    padding: "8 12",
    backgroundColor: "#fffbf0",
    borderRadius: 4,
    fontSize: 8,
    color: "#666666",
    lineHeight: 1.6,
  },
  footer: {
    marginTop: "auto",
    paddingTop: 14,
    borderTop: "0.5pt solid #e5e5e5",
  },
  footerText: {
    fontSize: 7,
    color: "#999999",
    lineHeight: 1.6,
    textAlign: "center",
  },
});

function formatINR(amount: number): string {
  return (
    "₹" +
    amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

function formatDate(value: Date | string): string {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export interface InvoiceBooking {
  bookingRef: string | null;
  quotedAmount: number | null;
  discountAmount: number;
  couponCode: string | null;
  razorpayPaymentId: string | null;
  departureDate: Date | string;
  returnDate?: Date | string | null;
  updatedAt: Date | string;
  adults: number;
  children: number;
  infants: number;
  user: {
    name: string | null;
    email: string;
  };
  package: {
    title: string;
    durationNights?: number;
    pricePerPerson: number;
    childPrice?: number | null;
    infantPrice?: number | null;
    toursPrice?: number | null;
    destination?: { name: string; country?: string } | null;
  };
}

interface Props {
  booking: InvoiceBooking;
}

export function InvoiceDocument({ booking }: Props) {
  const { package: pkg } = booking;

  // ── Line-item amounts ───────────────────────────────────────────────────────
  const pricePerAdult = pkg.pricePerPerson;
  const adultTotal = pricePerAdult * booking.adults;

  const showChildRow =
    booking.children > 0 && pkg.childPrice != null && pkg.childPrice > 0;
  const childTotal = showChildRow
    ? (pkg.childPrice ?? 0) * booking.children
    : 0;

  const showInfantRow =
    booking.infants > 0 && pkg.infantPrice != null && pkg.infantPrice > 0;
  const infantTotal = showInfantRow
    ? (pkg.infantPrice ?? 0) * booking.infants
    : 0;

  const showToursRow = pkg.toursPrice != null;
  const toursPersons = booking.adults + booking.children;
  const toursTotal = showToursRow ? (pkg.toursPrice ?? 0) * toursPersons : 0;

  const showDiscount = booking.discountAmount > 0;
  const discount = booking.discountAmount;

  const subtotal =
    adultTotal + childTotal + infantTotal + toursTotal - discount;
  const gst = subtotal * 0.05;
  const total = subtotal + gst;

  const totalTravellers = booking.adults + booking.children + booking.infants;
  const destination = pkg.destination;
  const destinationLabel = destination
    ? destination.country
      ? `${destination.name}, ${destination.country}`
      : destination.name
    : "—";

  return (
    <Document
      title={`Invoice INV-${booking.bookingRef ?? "NA"}`}
      author="Rapidluxe Pvt. Ltd."
    >
      <Page size="A4" style={styles.page}>
        {/* ── Section 1 — Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>RapidLuxe</Text>
            <Text style={styles.companyMeta}>
              Rapidluxe Pvt. Ltd.{"\n"}
              Ground Floor, 20/21, Ekta Tripolis, Siddharth Nagar,{"\n"}
              Goregaon West, Mumbai - 400104, Maharashtra{"\n"}
              GSTIN: {process.env.GSTIN ?? "27AAPCR1322N1Z"}
              {"\n"}
              PAN: {process.env.PAN ?? "AAPCR1322N"}
            </Text>
          </View>
          <View>
            <Text style={styles.invoiceLabel}>TAX INVOICE</Text>
            <Text style={styles.invoiceMeta}>
              SAC / HSN: 998551{"\n"}
              Tour Operator Services
            </Text>
          </View>
        </View>

        {/* ── Section 2 — Booking Summary ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Summary</Text>
          <View style={styles.twoCol}>
            <View style={styles.col}>
              <View style={styles.row}>
                <Text style={styles.label}>Package</Text>
                <Text style={styles.value}>{pkg.title}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Destination</Text>
                <Text style={styles.value}>{destinationLabel}</Text>
              </View>
              {pkg.durationNights != null && (
                <View style={styles.row}>
                  <Text style={styles.label}>Duration</Text>
                  <Text style={styles.value}>{pkg.durationNights} nights</Text>
                </View>
              )}
              <View style={styles.row}>
                <Text style={styles.label}>Departure</Text>
                <Text style={styles.value}>
                  {formatDate(booking.departureDate)}
                </Text>
              </View>
            </View>
            <View style={styles.col}>
              <View style={styles.row}>
                <Text style={styles.label}>Booking Ref</Text>
                <Text style={styles.valueMono}>
                  {booking.bookingRef ?? "NA"}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Invoice No</Text>
                <Text style={styles.valueMono}>
                  INV-{booking.bookingRef ?? "NA"}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Invoice Date</Text>
                <Text style={styles.value}>{formatDate(new Date())}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Bill To</Text>
                <Text style={styles.value}>
                  {booking.user.name ?? "Traveller"}
                  {"\n"}
                  {booking.user.email}
                </Text>
              </View>
              <View style={[styles.row, { marginTop: 2 }]}>
                <Text style={styles.label}>Status</Text>
                <Text style={styles.statusBadge}>PAID</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Section 3 — Traveller Details ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Traveller Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Adults</Text>
            <Text style={styles.value}>
              {booking.adults} traveller{booking.adults !== 1 ? "s" : ""}
            </Text>
          </View>
          {booking.children > 0 && (
            <View style={styles.row}>
              <Text style={styles.label}>Children</Text>
              <Text style={styles.value}>
                {booking.children} traveller{booking.children !== 1 ? "s" : ""}
              </Text>
            </View>
          )}
          {booking.infants > 0 && (
            <View style={styles.row}>
              <Text style={styles.label}>Infants</Text>
              <Text style={styles.value}>
                {booking.infants} traveller{booking.infants !== 1 ? "s" : ""}
              </Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>Total</Text>
            <Text style={[styles.value, { fontFamily: "Helvetica-Bold" }]}>
              {totalTravellers} traveller{totalTravellers !== 1 ? "s" : ""}
            </Text>
          </View>
        </View>

        {/* ── Section 4 — Price Breakdown ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Breakdown</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.colDesc]}>
                Description
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colRate]}>Rate</Text>
              <Text style={[styles.tableHeaderCell, styles.colQty]}>Qty</Text>
              <Text style={[styles.tableHeaderCell, styles.colAmount]}>
                Amount
              </Text>
            </View>

            {/* Row 1 — Adults (always present) */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.colDesc]}>
                Package — {pkg.title} (Adults)
              </Text>
              <Text style={[styles.tableCell, styles.colRate]}>
                {formatINR(pricePerAdult)}
              </Text>
              <Text style={[styles.tableCell, styles.colQty]}>
                {booking.adults} adult{booking.adults !== 1 ? "s" : ""}
              </Text>
              <Text style={[styles.tableCell, styles.colAmount]}>
                {formatINR(adultTotal)}
              </Text>
            </View>

            {/* Row 2 — Children */}
            {showChildRow && (
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.colDesc]}>
                  Package — {pkg.title} (Children, Age 2–11)
                </Text>
                <Text style={[styles.tableCell, styles.colRate]}>
                  {formatINR(pkg.childPrice ?? 0)}
                </Text>
                <Text style={[styles.tableCell, styles.colQty]}>
                  {booking.children} child
                  {booking.children !== 1 ? "ren" : ""}
                </Text>
                <Text style={[styles.tableCell, styles.colAmount]}>
                  {formatINR(childTotal)}
                </Text>
              </View>
            )}

            {/* Row 3 — Infants */}
            {showInfantRow && (
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.colDesc]}>
                  Package — {pkg.title} (Infants, Under 2)
                </Text>
                <Text style={[styles.tableCell, styles.colRate]}>
                  {formatINR(pkg.infantPrice ?? 0)}
                </Text>
                <Text style={[styles.tableCell, styles.colQty]}>
                  {booking.infants} infant{booking.infants !== 1 ? "s" : ""}
                </Text>
                <Text style={[styles.tableCell, styles.colAmount]}>
                  {formatINR(infantTotal)}
                </Text>
              </View>
            )}

            {/* Row 4 — Tours & Transfers */}
            {showToursRow && (
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.colDesc]}>
                  Tours &amp; Transfers
                </Text>
                <Text style={[styles.tableCell, styles.colRate]}>
                  {formatINR(pkg.toursPrice ?? 0)}
                </Text>
                <Text style={[styles.tableCell, styles.colQty]}>
                  {toursPersons} person{toursPersons !== 1 ? "s" : ""}
                </Text>
                <Text style={[styles.tableCell, styles.colAmount]}>
                  {formatINR(toursTotal)}
                </Text>
              </View>
            )}

            {/* Row 5 — Discount */}
            {showDiscount && (
              <View style={styles.tableRow}>
                <Text style={[styles.tableCellGreen, styles.colDesc]}>
                  Discount Applied
                  {booking.couponCode ? ` (${booking.couponCode})` : ""}
                </Text>
                <Text style={[styles.tableCellMuted, styles.colRate]}>—</Text>
                <Text style={[styles.tableCellMuted, styles.colQty]}>—</Text>
                <Text style={[styles.tableCellGreen, styles.colAmount]}>
                  -{formatINR(discount)}
                </Text>
              </View>
            )}

            {/* Subtotal */}
            <View style={styles.subtotalRow}>
              <Text style={styles.summaryLabelBold}>
                Subtotal (Taxable Value)
              </Text>
              <Text style={styles.summaryValueBold}>{formatINR(subtotal)}</Text>
            </View>

            {/* GST */}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                GST @ 5% (HSN 998551 — Tour Operator Services)
              </Text>
              <Text style={styles.summaryValue}>{formatINR(gst)}</Text>
            </View>

            {/* Total */}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>{formatINR(total)}</Text>
            </View>
          </View>
        </View>

        {/* ── Section 5 — Payment Confirmation ── */}
        <View style={styles.section}>
          <View style={styles.paymentBlock}>
            <Text style={styles.paymentTitle}>Payment Received</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Amount Paid</Text>
              <Text style={[styles.value, { fontFamily: "Helvetica-Bold" }]}>
                {formatINR(booking.quotedAmount ?? total)}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Payment Method</Text>
              <Text style={styles.value}>Razorpay</Text>
            </View>
            {booking.razorpayPaymentId && (
              <View style={styles.row}>
                <Text style={styles.label}>Transaction ID</Text>
                <Text style={styles.valueMono}>
                  {booking.razorpayPaymentId}
                </Text>
              </View>
            )}
            <View style={styles.row}>
              <Text style={styles.label}>Payment Date</Text>
              <Text style={styles.value}>{formatDate(booking.updatedAt)}</Text>
            </View>
          </View>
        </View>

        {/* ── Section 6 — Important Notes ── */}
        <View style={styles.notice}>
          <Text>
            • This invoice is valid subject to realization of payment.{"\n"}•
            Rates quoted are in Indian Rupees (INR).{"\n"}• GST charged under
            HSN 998551 — Tour Operator Services.{"\n"}• Prices exclude flights,
            visa, and personal expenses unless explicitly stated in the package
            inclusions.{"\n"}• For support: bookings@rapidluxe.com | +91 91374
            56611
          </Text>
        </View>

        {/* ── Section 7 — Footer ── */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Rapidluxe Pvt. Ltd. | GSTIN: {process.env.GSTIN ?? "27AAPCR1322N1Z"}{" "}
            | PAN: {process.env.PAN ?? "AAPCR1322N"}
          </Text>
          <Text style={styles.footerText}>
            Ground Floor, 20/21, Ekta Tripolis, Siddharth Nagar, Goregaon West,
            Mumbai — 400104, Maharashtra
          </Text>
          <Text style={styles.footerText}>
            This is a computer-generated document. No signature required.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
