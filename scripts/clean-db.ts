import { config } from "dotenv";
config({ path: ".env.local" });
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Cleaning demo data...");

  // Delete in FK-safe order: children before parents
  await prisma.review.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.package.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.enquiry.deleteMany();
  await prisma.coupon.deleteMany();

  // Keep users — don't delete
  console.log("Done. Users preserved.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
