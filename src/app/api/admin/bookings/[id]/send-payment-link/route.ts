import { auth } from "@clerk/nextjs/server";
import crypto from "crypto";
import { type NextRequest, NextResponse } from "next/server";

import { sendPaymentLinkEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string } | null)?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (!booking.quotedAmount) {
    return NextResponse.json({ error: "No quote set" }, { status: 400 });
  }

  const paymentToken = crypto.randomUUID();
  const paymentTokenExpiry = new Date(Date.now() + 48 * 60 * 60 * 1000);

  const updated = await prisma.booking.update({
    where: { id },
    data: { paymentToken, paymentTokenExpiry, status: "AWAITING_PAYMENT" },
    include: { user: true, package: true },
  });

  const paymentUrl = `${process.env.NEXT_PUBLIC_APP_URL}/pay/${paymentToken}`;

  await sendPaymentLinkEmail(updated, paymentUrl);

  return NextResponse.json({
    data: { paymentUrl, expiresAt: paymentTokenExpiry },
  });
}
