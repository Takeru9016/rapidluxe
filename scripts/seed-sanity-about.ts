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

async function main() {
  console.log("Seeding aboutPage to Sanity…");

  const doc = {
    _id: "about-page-singleton",
    _type: "aboutPage",
    headline: "Your Next Journey Awaits",
    subheadline:
      "Bespoke luxury travel crafted for India's most discerning travellers — every detail personalised, every moment extraordinary.",
    story: [
      block(
        "Rapidluxe Pvt. Ltd. was born from a belief that travel should do more than move you from one place to another — it should restore you. Based in Mumbai, we are a bespoke luxury travel company founded by Siddhesh Sood, a seasoned traveller who has explored 27 countries and spent 15 years across corporate and real estate before channelling that experience into crafting journeys that matter.",
      ),
      block(
        "Our philosophy is simple: we call it 'Therapycation' — travel designed to provide a bespoke mental and emotional recharge. Every itinerary we create is personal. We take the time to understand who you are, what you need, and what will genuinely move you — then we build the trip around that.",
      ),
      block(
        "From hidden Himalayan retreats to private villas in Bali, from cultural immersions in Japan to safari mornings in Kenya — every Rapidluxe journey is researched, vetted, and curated with one goal: to give you the best trip of your life.",
      ),
    ],
    mission: {
      title:
        "We don't sell holidays. We design experiences that heal, inspire, and stay with you forever.",
      body: [
        block(
          "Our mission is to make extraordinary travel accessible to those who demand excellence — not just in the destinations they visit, but in the care they receive along the way. We believe that a truly great trip can change the way you see the world, and yourself.",
        ),
      ],
    },
    team: [
      {
        _type: "object",
        _key: key(),
        name: "Siddhesh Sood",
        role: "Founder & CEO",
        bio: "27 countries explored, MBA in Marketing & International Business from Amity Business School, 15 years across corporate and real estate. Siddhesh founded Rapidluxe to bring the 'Therapycation' philosophy to India's luxury travel market — bespoke journeys designed for mental and emotional recharge.",
      },
      {
        _type: "object",
        _key: key(),
        name: "Kabita Baraily",
        role: "Director of Marketing & Operations",
        bio: "Kabita brings operational precision and creative marketing instinct to every Rapidluxe experience. She ensures that from the first enquiry to the final farewell, every touchpoint reflects the standard our clients expect.",
      },
    ],
    stats: [
      {
        _type: "object",
        _key: key(),
        number: "27",
        label: "Countries Explored",
      },
      {
        _type: "object",
        _key: key(),
        number: "500+",
        label: "Happy Travelers",
      },
      {
        _type: "object",
        _key: key(),
        number: "100%",
        label: "Bespoke Experiences",
      },
      { _type: "object", _key: key(), number: "5★", label: "Average Rating" },
    ],
  };

  await client.createOrReplace(doc as typeof doc & { [key: string]: unknown });
  console.log("  ✓ aboutPage seeded");
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
