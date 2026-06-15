import { config } from "dotenv";
config({ path: ".env.local" });
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2026-06-13",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

let keyCounter = 0;
const key = () => `k${++keyCounter}`;

function block(text: string, style = "normal") {
  return {
    _type: "block",
    _key: key(),
    style,
    children: [{ _type: "span", _key: key(), text, marks: [] }],
    markDefs: [],
  };
}

function heading(text: string) {
  return block(text, "h2");
}

function bullet(text: string) {
  return {
    _type: "block",
    _key: key(),
    style: "normal",
    listItem: "bullet",
    level: 1,
    children: [{ _type: "span", _key: key(), text, marks: [] }],
    markDefs: [],
  };
}

interface PageDoc {
  _id: string;
  _type: string;
  slug: { _type: string; current: string };
  title: string;
  subtitle?: string;
  lastUpdated: string;
  seo: { metaTitle: string; metaDescription: string };
  body: ReturnType<typeof block>[];
}

const pages: PageDoc[] = [
  {
    _id: "static-page-faqs",
    _type: "staticPage",
    slug: { _type: "slug", current: "faqs" },
    title: "Frequently Asked Questions",
    lastUpdated: new Date().toISOString(),
    seo: {
      metaTitle: "FAQs — RapidLuxe",
      metaDescription:
        "Find answers to common questions about booking, payments, cancellations, and more at RapidLuxe.",
    },
    body: [
      heading("How do I book a package?"),
      block(
        "Browse our curated packages, select your preferred dates and group size, and submit a booking request. Our team will review and send you a personalised quote within 24 hours.",
      ),
      heading("What payment methods do you accept?"),
      block(
        "We accept all major cards (Visa, Mastercard, RuPay), UPI, net banking, and EMI via Razorpay. Full payment details are shared with your quote.",
      ),
      heading("Can I customise a package?"),
      block(
        "Absolutely. Every Rapidluxe journey is bespoke. Contact us via the enquiry form or WhatsApp and our team will design an itinerary around your pace and preferences.",
      ),
      heading("What is your cancellation policy?"),
      block(
        "Cancellations 60+ days before arrival receive a full refund minus the initial deposit. 30–59 days: 50% refund. 15–29 days: 25% refund. Under 15 days or no-show: no refund. See our full Cancellation Policy for details.",
      ),
      heading("Do packages include flights?"),
      block(
        "Some packages include flights and some don't — this is clearly marked on each package page. If flights are not included, we can assist with recommendations via our travel partners.",
      ),
      heading("How do I get my booking confirmation?"),
      block(
        "Once payment is received, you will receive a booking confirmation email within 24 hours along with your booking reference number and full itinerary details.",
      ),
      heading("Is travel insurance mandatory?"),
      block(
        "We strongly recommend comprehensive travel insurance for all journeys. While not mandatory, it protects you against unforeseen medical emergencies, cancellations, and trip disruptions.",
      ),
      heading("How can I contact Rapidluxe support?"),
      block(
        "You can reach us via the Contact page, WhatsApp, or email at bookings@rapidluxe.com. Our team is available 7 days a week.",
      ),
    ],
  },
  {
    _id: "static-page-cancellation-policy",
    _type: "staticPage",
    slug: { _type: "slug", current: "cancellation-policy" },
    title: "Cancellation Policy",
    subtitle: "Transparency is at the heart of every Rapidluxe journey.",
    lastUpdated: new Date().toISOString(),
    seo: {
      metaTitle: "Cancellation Policy — RapidLuxe",
      metaDescription:
        "Understand RapidLuxe's cancellation timelines, refund process, and force majeure policy.",
    },
    body: [
      heading("General Cancellation Timeline"),
      bullet(
        "60+ Days Prior to Arrival: Full refund minus a non-refundable initial deposit (10–25% of total package cost).",
      ),
      bullet("30–59 Days Prior to Arrival: 50% refund of total package rate."),
      bullet("15–29 Days Prior to Arrival: 25% refund of total package rate."),
      bullet(
        "Less than 15 Days or No-Show: No refund. Most bespoke services (private villas, exclusive tours) are non-recoverable by this stage.",
      ),
      heading("Non-Refundable Components"),
      block("Certain elements are non-refundable regardless of timeline:"),
      bullet("Airlines: Subject strictly to the specific airline's terms."),
      bullet(
        "Third-Party Suppliers: Non-refundable deposits paid to heritage hotels, jungle lodges, or private yacht charters.",
      ),
      bullet(
        "Statutory Fees: GST, visa fees, and insurance premiums already processed.",
      ),
      heading("Therapycation Flexibility"),
      block(
        "To align with our mission of recharging the traveler, we offer flexibility that typical agencies do not:",
      ),
      bullet(
        "Credit Notes: Keep 100% of your refund as a Credit Certificate valid for 12 months from the original travel date.",
      ),
      bullet(
        "Amendment Policy: One complimentary date change if requested more than 30 days in advance (subject to hotel price differences).",
      ),
      heading("Refund Process"),
      bullet(
        "Processing Time: Refunds are initiated within 7–8 working days and reflect in the original payment method within 15–45 days depending on your bank.",
      ),
      bullet(
        "We strongly recommend comprehensive travel insurance to cover unforeseen health or personal emergencies.",
      ),
      heading("Force Majeure"),
      block(
        "In cases of natural disasters, pandemics, or government travel restrictions, Rapidluxe will offer rescheduling or a full refund less only the unrecoverable costs already paid to third-party suppliers. This policy is in compliance with India's Consumer Protection Act.",
      ),
    ],
  },
  {
    _id: "static-page-terms",
    _type: "staticPage",
    slug: { _type: "slug", current: "terms" },
    title: "Terms & Conditions",
    subtitle: "Please read these terms carefully before making a booking.",
    lastUpdated: new Date().toISOString(),
    seo: {
      metaTitle: "Terms & Conditions — RapidLuxe",
      metaDescription:
        "RapidLuxe terms covering booking, payments, inclusions, traveler responsibilities, and governing law.",
    },
    body: [
      heading("Booking & Payment"),
      bullet(
        "All bookings are confirmed only upon receipt of the initial deposit as specified in your quote.",
      ),
      bullet(
        "Full payment is due as per the schedule communicated in your booking confirmation.",
      ),
      bullet(
        "Prices are quoted in Indian Rupees (INR) and include applicable GST at the rate of 5% (HSN 998551 — Tour Operator Services).",
      ),
      bullet(
        "Rapidluxe Pvt. Ltd. reserves the right to adjust pricing in the event of significant currency fluctuations or supplier cost changes prior to full payment.",
      ),
      heading("Package Inclusions & Exclusions"),
      bullet(
        "Package inclusions are explicitly listed on each package page and in your booking confirmation.",
      ),
      bullet(
        "Unless stated, packages do not include flights, visa fees, travel insurance, personal expenses, or tips.",
      ),
      bullet(
        "Rapidluxe is not responsible for services not listed in the confirmed itinerary.",
      ),
      heading("Traveler Responsibilities"),
      bullet(
        "Travelers are responsible for ensuring valid passports, visas, and travel documents for all destinations.",
      ),
      bullet(
        "It is the traveler's responsibility to disclose any medical conditions or dietary requirements at the time of booking.",
      ),
      bullet(
        "Rapidluxe reserves the right to decline bookings or remove travelers from a trip if their conduct is deemed disruptive or unsafe.",
      ),
      heading("Liability"),
      bullet(
        "Rapidluxe acts as an intermediary between travelers and third-party service providers (hotels, airlines, activity operators). We are not liable for the acts or omissions of these providers.",
      ),
      bullet(
        "Our liability is limited to the total amount paid to Rapidluxe for the booking in question.",
      ),
      bullet("We strongly recommend comprehensive travel insurance."),
      heading("Governing Law"),
      block(
        "These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of Mumbai, Maharashtra.",
      ),
      heading("Contact"),
      block(
        "For any queries regarding these terms, contact us at legal@rapidluxe.com or via our Contact page. Last reviewed: June 2026.",
      ),
    ],
  },
  {
    _id: "static-page-privacy",
    _type: "staticPage",
    slug: { _type: "slug", current: "privacy" },
    title: "Privacy Policy",
    subtitle: "Your privacy is fundamental to how we operate.",
    lastUpdated: new Date().toISOString(),
    seo: {
      metaTitle: "Privacy Policy — RapidLuxe",
      metaDescription:
        "How RapidLuxe collects, uses, and protects your personal data in compliance with India's DPDP Act 2023.",
    },
    body: [
      heading("Information We Collect"),
      block("When you use Rapidluxe, we collect:"),
      bullet(
        "Personal details: name, email address, phone number, date of birth.",
      ),
      bullet(
        "Payment information: processed securely via Razorpay. We do not store card details on our servers.",
      ),
      bullet(
        "Travel details: passport information, dietary requirements, special requests — only as required for your booking.",
      ),
      bullet(
        "Usage data: pages visited, search queries, device information — collected via PostHog analytics.",
      ),
      heading("How We Use Your Information"),
      bullet("To process and manage your bookings."),
      bullet(
        "To send booking confirmations, quotes, and payment links via Resend.",
      ),
      bullet("To personalise your experience on rapidluxe.com."),
      bullet("To comply with legal obligations under Indian law."),
      bullet("We do not sell your personal data to third parties."),
      heading("Third-Party Services"),
      block(
        "Your data is shared with the following trusted partners solely to deliver our services:",
      ),
      bullet(
        "Clerk (authentication): manages your login and account security.",
      ),
      bullet("Razorpay (payments): processes all payment transactions."),
      bullet("Sanity (content management): stores editorial content."),
      bullet(
        "Neon (database): stores booking and account data on secure servers.",
      ),
      bullet("PostHog (analytics): tracks anonymised usage patterns."),
      heading("Data Retention"),
      bullet(
        "Account data is retained for the duration of your account plus 3 years after account deletion, as required by Indian tax law.",
      ),
      bullet(
        "Booking records are retained for 7 years per GST compliance requirements.",
      ),
      heading("Your Rights"),
      block(
        "Under the Digital Personal Data Protection Act 2023 (India), you have the right to:",
      ),
      bullet("Access the personal data we hold about you."),
      bullet("Correct inaccurate personal data."),
      bullet(
        "Request erasure of your data (subject to legal retention obligations).",
      ),
      bullet("Withdraw consent for data processing."),
      block("To exercise these rights, email privacy@rapidluxe.com."),
      heading("Cookies"),
      block(
        "We use essential cookies for authentication (Clerk) and optional analytics cookies (PostHog). You can disable analytics cookies via your browser settings.",
      ),
      heading("Changes to This Policy"),
      block(
        "We may update this policy periodically. The date of the last update is shown at the bottom of this page. Continued use of our services after changes constitutes acceptance.",
      ),
      heading("Contact"),
      block(
        "For privacy queries: privacy@rapidluxe.com — Rapidluxe Pvt. Ltd., Mumbai, Maharashtra, India. Last reviewed: June 2026.",
      ),
    ],
  },
];

async function main() {
  console.log("Seeding static pages to Sanity…");

  for (const page of pages) {
    await client.createOrReplace(page as PageDoc & { [key: string]: unknown });
    console.log(`  ✓ ${page.slug.current}`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
