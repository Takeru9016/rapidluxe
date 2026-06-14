import { prisma } from "../src/lib/prisma";

async function main() {
  // Delete in FK-safe order: children before parents
  await prisma.review.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.package.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.enquiry.deleteMany();
  await prisma.user.deleteMany();

  console.log("DB cleaned — all seed data removed.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
