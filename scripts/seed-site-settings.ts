import { prisma } from "../src/lib/prisma";

const defaults = [
  { key: "social_instagram", value: "https://instagram.com/rapidluxe" },
  { key: "social_facebook", value: "https://facebook.com/rapidluxe" },
  { key: "social_youtube", value: "https://youtube.com/@rapidluxe" },
  { key: "social_twitter", value: "https://twitter.com/rapidluxe" },
  {
    key: "social_whatsapp",
    value: process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP ?? "",
  },
  { key: "newsletter_subscribers", value: "[]" },
];

async function main() {
  for (const s of defaults) {
    await prisma.siteSettings.upsert({
      where: { key: s.key },
      create: s,
      update: {},
    });
  }
  console.log("SiteSettings seeded");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
