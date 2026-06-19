import { sanityWriteClient } from "../src/lib/sanity";

async function main() {
  const existing = await sanityWriteClient.fetch<{ _id: string } | null>(
    `*[_type == "siteContent"][0]{ _id }`,
  );

  const doc = {
    _type: "siteContent",
    howItWorksSteps: [
      {
        _key: "step1",
        stepNumber: "01",
        title: "Enquire",
        description:
          "Browse curated packages across 50+ destinations. Submit a booking request with your travel dates — no payment required.",
      },
      {
        _key: "step2",
        stepNumber: "02",
        title: "Get Your Quote",
        description:
          "Our travel experts review your request and contact you within 2 hours via WhatsApp to confirm availability and provide a tailored quote.",
      },
      {
        _key: "step3",
        stepNumber: "03",
        title: "Travel",
        description:
          "Once happy with the quote, complete payment securely via the link we send. Then sit back and look forward to your trip.",
      },
    ],
    whyRapidluxePoints: [
      {
        _key: "why1",
        title: "Bespoke, Not Bulk",
        description:
          "Every itinerary is built around you — not a group tour schedule. Your pace, your preferences, your trip.",
      },
      {
        _key: "why2",
        title: "Therapycation Philosophy",
        description:
          "We believe travel should restore you. Every journey we design aims to provide a complete mental and emotional recharge.",
      },
      {
        _key: "why3",
        title: "Expert Guidance",
        description:
          "Our founder has explored 27 countries. We know what works and what doesn't — and we build that knowledge into every trip.",
      },
      {
        _key: "why4",
        title: "Seamless from Start to Finish",
        description:
          "From your first enquiry to your return home, we handle every detail. You focus on the experience. We handle everything else.",
      },
    ],
    trustBarStats: [
      { _key: "stat1", number: "27", label: "Countries Explored" },
      { _key: "stat2", number: "500+", label: "Happy Travellers" },
      { _key: "stat3", number: "100%", label: "Bespoke Journeys" },
      { _key: "stat4", number: "2hrs", label: "Response Time" },
    ],
  };

  if (existing?._id) {
    await sanityWriteClient.patch(existing._id).set(doc).commit();
    console.log("Updated existing siteContent document:", existing._id);
  } else {
    const created = await sanityWriteClient.create(doc);
    console.log("Created siteContent document:", created._id);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
