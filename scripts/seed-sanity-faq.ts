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

interface FaqItem {
  _key: string;
  _type: "faqItem";
  question: string;
  answer: string;
}

interface FaqCategory {
  _key: string;
  _type: "faqCategory";
  title: string;
  items: FaqItem[];
}

function item(question: string, answer: string): FaqItem {
  return { _key: key(), _type: "faqItem", question, answer };
}

function category(title: string, items: FaqItem[]): FaqCategory {
  return { _key: key(), _type: "faqCategory", title, items };
}

const PUBLISHED_ID = "faq-page-singleton";
const DRAFT_ID = `drafts.${PUBLISHED_ID}`;

// ── Published document ──────────────────────────────────────────────────────
// Only source-supported, non-recommendation-framed content. Categories with
// no verified client-document content are seeded with an empty items array
// rather than invented answers or omitted categories.

const publishedCategories: FaqCategory[] = [
  category("Booking Process", [
    item(
      "Can RapidLuxe create a journey around my preferences?",
      "Yes. RapidLuxe designs journeys around your individual pace, preferences, and priorities. We curate stays, experiences, transfers, and other travel details around the way you want to travel.",
    ),
    item(
      "Does RapidLuxe handle the details of my journey?",
      "We coordinate the key elements of your journey, from carefully selected stays and experiences to bookings, private transfers, and on-ground support, according to your requirements.",
    ),
  ]),
  category("Quotes & Payments", []),
  category("Journeys", [
    item(
      "What does RapidLuxe offer?",
      "RapidLuxe offers bespoke stays, curated experiences, seamless journeys, and concierge services. Journeys can range from wellness escapes to exclusive international getaways, with arrangements designed around your individual preferences.",
    ),
    item(
      "Can my journey be customized?",
      "Yes. Customization is central to the RapidLuxe approach. Each journey is designed around your pace, preferences, and priorities rather than following a fixed itinerary.",
    ),
  ]),
  category("Changes & Cancellations", [
    item(
      "What is the general cancellation timeline?",
      "The general cancellation guidance is as follows: 60+ days before arrival, a full refund minus the non-refundable initial deposit; 30–59 days before arrival, a 50% refund of the total package rate; 15–29 days before arrival, a 25% refund of the total package rate; less than 15 days before arrival, or a no-show, no refund. The applicable terms may depend on the specific services and suppliers involved. Please confirm the applicable cancellation terms for your journey before booking.",
    ),
    item(
      "Are some travel components non-refundable?",
      "Certain components may be non-refundable depending on the service provider and circumstances, including airline charges according to the airline's terms, non-refundable deposits paid to third-party suppliers, and statutory or processed fees such as GST, visa fees, and insurance premiums.",
    ),
  ]),
  category("Documents", []),
  category("Support", [
    item(
      "How does RapidLuxe support travelers?",
      "RapidLuxe provides discreet on-ground support as part of its journey coordination, with local partners and support staff helping manage travel logistics for individual and corporate clients.",
    ),
    item(
      "How can I contact RapidLuxe?",
      "For enquiries or assistance, please contact the RapidLuxe team through our Contact page.",
    ),
  ]),
];

const publishedDoc = {
  _id: PUBLISHED_ID,
  _type: "faqPage",
  title: "Frequently Asked Questions",
  subtitle:
    "Find answers about our journeys, bookings, cancellations, and support.",
  seo: {
    metaTitle: "FAQs — RapidLuxe",
    metaDescription:
      "Answers to common questions about booking, payments, journeys, changes, documents, and support with RapidLuxe.",
  },
  categories: publishedCategories,
};

// ── Draft document ───────────────────────────────────────────────────────────
// Source content the client document frames as a recommendation/consideration
// ("consider offering", refund-processing guidance stated without being
// confirmed as a binding SLA) rather than an established policy. Entered as
// a genuine Sanity draft (native drafts.<id> mechanism, no schema change)
// so it is invisible to the public, token-less read client until an editor
// reviews and explicitly publishes it in Studio.

function withDraftPendingItems(categories: FaqCategory[]): FaqCategory[] {
  return categories.map((c) => {
    if (c.title !== "Changes & Cancellations") return c;
    return {
      ...c,
      items: [
        ...c.items,
        item(
          "Can I change my travel dates? [PENDING POLICY CONFIRMATION]",
          "Source guidance describes considering one complimentary date change when requested more than 30 days in advance, subject to hotel price differences. This is framed in the source document as something to consider offering, not a confirmed customer entitlement — do not publish until confirmed.",
        ),
        item(
          "How are refunds processed? [PENDING POLICY CONFIRMATION]",
          "Source guidance states refunds are intended to be initiated within 7–8 working days and may take 15–45 days to reflect through the original payment method depending on the bank. Treat as requiring policy confirmation before presenting as a firm customer-facing SLA — do not publish until confirmed.",
        ),
      ],
    };
  });
}

const draftDoc = {
  _id: DRAFT_ID,
  _type: "faqPage",
  title: publishedDoc.title,
  subtitle: publishedDoc.subtitle,
  seo: publishedDoc.seo,
  categories: withDraftPendingItems(publishedCategories),
};

async function main() {
  console.log("Seeding faqPage to Sanity…");

  const existingPublished = await client.fetch<{ _id: string } | null>(
    `*[_id == $id][0]{ _id }`,
    { id: PUBLISHED_ID },
  );
  await client.createOrReplace(publishedDoc);
  console.log(
    existingPublished
      ? `  ✓ Updated existing published faqPage: ${PUBLISHED_ID}`
      : `  ✓ Created published faqPage: ${PUBLISHED_ID}`,
  );

  const existingDraft = await client.fetch<{ _id: string } | null>(
    `*[_id == $id][0]{ _id }`,
    { id: DRAFT_ID },
  );
  await client.createOrReplace(draftDoc);
  console.log(
    existingDraft
      ? `  ✓ Updated existing faqPage draft: ${DRAFT_ID}`
      : `  ✓ Created faqPage draft (pending policy confirmation items): ${DRAFT_ID}`,
  );

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
