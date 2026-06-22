import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a1a",
    padding: 48,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 32,
    paddingBottom: 16,
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
    marginBottom: 20,
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
  row: {
    flexDirection: "row",
    marginBottom: 3,
  },
  label: {
    width: 140,
    color: "#666666",
    fontSize: 9,
  },
  value: {
    flex: 1,
    color: "#1a1a1a",
    fontSize: 9,
  },
  table: {
    marginTop: 8,
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
  tableRowAlt: {
    flexDirection: "row",
    padding: "5 8",
    backgroundColor: "#fafafa",
    borderBottom: "0.5pt solid #f0f0f0",
  },
  tableCell: {
    color: "#1a1a1a",
    fontSize: 9,
  },
  col1: { flex: 3 },
  col2: { flex: 1, textAlign: "center" },
  col3: { flex: 1.5, textAlign: "right" },
  totalsBlock: {
    marginTop: 16,
    alignSelf: "flex-end",
    width: 220,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
    borderBottom: "0.5pt solid #f0f0f0",
  },
  totalLabel: {
    fontSize: 9,
    color: "#666666",
  },
  totalValue: {
    fontSize: 9,
    color: "#1a1a1a",
    fontFamily: "Helvetica-Bold",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    marginTop: 2,
    borderTop: "1.5pt solid #C9A84C",
  },
  grandTotalLabel: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#0B0F1A",
  },
  grandTotalValue: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#C9A84C",
  },
  paymentRef: {
    marginTop: 24,
    padding: "8 12",
    backgroundColor: "#f8f8f8",
    borderRadius: 4,
    borderLeft: "3pt solid #C9A84C",
  },
  paymentRefLabel: {
    fontSize: 8,
    color: "#666666",
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  paymentRefValue: {
    fontSize: 9,
    color: "#1a1a1a",
    fontFamily: "Helvetica-Bold",
  },
  footer: {
    marginTop: "auto",
    paddingTop: 16,
    borderTop: "0.5pt solid #e5e5e5",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 7,
    color: "#999999",
  },
  notice: {
    marginTop: 20,
    padding: "8 12",
    backgroundColor: "#fffbf0",
    borderRadius: 4,
    fontSize: 8,
    color: "#666666",
    lineHeight: 1.5,
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

export interface InvoiceBooking {
  bookingRef: string | null;
  quotedAmount: number | null;
  razorpayPaymentId: string | null;
  departureDate: Date | string;
  returnDate?: Date | string | null;
  adults: number;
  children: number;
  user: {
    name: string | null;
    email: string;
  };
  package: {
    title: string;
    durationNights?: number;
    destination?: { name: string } | null;
  };
}

interface Props {
  booking: InvoiceBooking;
}

export function InvoiceDocument({ booking }: Props) {
  const taxableValue = booking.quotedAmount ?? 0;
  const gst = taxableValue * 0.05;
  const total = taxableValue + gst;

  const invoiceDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const departureDate = new Date(booking.departureDate).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    },
  );

  const travelerCount =
    booking.adults + booking.children === 1
      ? "1 traveler"
      : `${booking.adults + booking.children} travelers`;

  return (
    <Document
      title={`Invoice INV-${booking.bookingRef ?? "NA"}`}
      author="Rapidluxe Pvt. Ltd."
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
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
              {"\n"}
              SAC / HSN: 998551 (Tour Operator Services)
            </Text>
          </View>
          <View>
            <Text style={styles.invoiceLabel}>TAX INVOICE</Text>
            <Text style={styles.invoiceMeta}>
              Invoice No: INV-{booking.bookingRef ?? "NA"}
              {"\n"}
              Date: {invoiceDate}
              {"\n"}
              Booking Ref: {booking.bookingRef ?? "NA"}
            </Text>
          </View>
        </View>

        {/* Bill To */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill To</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{booking.user.name ?? "Traveler"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{booking.user.email}</Text>
          </View>
        </View>

        {/* Package Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Package Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Package</Text>
            <Text style={styles.value}>{booking.package.title}</Text>
          </View>
          {booking.package.destination && (
            <View style={styles.row}>
              <Text style={styles.label}>Destination</Text>
              <Text style={styles.value}>
                {booking.package.destination.name}
              </Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>Departure Date</Text>
            <Text style={styles.value}>{departureDate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Travelers</Text>
            <Text style={styles.value}>
              {travelerCount}
              {booking.adults > 0 &&
                ` (${booking.adults} adult${booking.adults > 1 ? "s" : ""})`}
              {booking.children > 0 &&
                `, ${booking.children} child${booking.children > 1 ? "ren" : ""}`}
            </Text>
          </View>
        </View>

        {/* Line Items Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Charges</Text>
          <View style={styles.table}>
            {/* Table header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.col1]}>
                Description
              </Text>
              <Text style={[styles.tableHeaderCell, styles.col2]}>HSN/SAC</Text>
              <Text style={[styles.tableHeaderCell, styles.col3]}>Amount</Text>
            </View>
            {/* Service row */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.col1]}>
                Tour Package — {booking.package.title}
              </Text>
              <Text style={[styles.tableCell, styles.col2]}>998551</Text>
              <Text style={[styles.tableCell, styles.col3]}>
                {formatINR(taxableValue)}
              </Text>
            </View>
          </View>

          {/* Totals */}
          <View style={styles.totalsBlock}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Taxable Value</Text>
              <Text style={styles.totalValue}>{formatINR(taxableValue)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>GST @ 5% (HSN 998551)</Text>
              <Text style={styles.totalValue}>{formatINR(gst)}</Text>
            </View>
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total Due</Text>
              <Text style={styles.grandTotalValue}>{formatINR(total)}</Text>
            </View>
          </View>
        </View>

        {/* Payment Reference */}
        {booking.razorpayPaymentId && (
          <View style={styles.paymentRef}>
            <Text style={styles.paymentRefLabel}>Payment Reference</Text>
            <Text style={styles.paymentRefValue}>
              {booking.razorpayPaymentId}
            </Text>
          </View>
        )}

        {/* GST Notice */}
        <View style={styles.notice}>
          <Text>
            This is a computer-generated invoice and does not require a physical
            signature. GST charged at 5% under the Tour Operator Services
            category (SAC 998551) as per the CGST Act, 2017.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Rapidluxe Pvt. Ltd.</Text>
          <Text style={styles.footerText}>
            Ground Floor, 20/21, Ekta Tripolis, Siddharth Nagar, Goregaon West,
            Mumbai - 400104, Maharashtra
          </Text>
          <Text style={styles.footerText}>bookings@rapidluxe.com</Text>
          <Text style={styles.footerText}>
            GSTIN: {process.env.GSTIN ?? "27AAPCR1322N1Z"} · PAN:{" "}
            {process.env.PAN ?? "AAPCR1322N"}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
