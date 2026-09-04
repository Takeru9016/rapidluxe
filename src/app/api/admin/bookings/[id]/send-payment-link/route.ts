import crypto from "node:crypto";
import { auth } from "@clerk/nextjs/server";
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

  // Read only to shape the response (404 vs 409/400) — the atomic conditional
  // update below is the actual authorization for the transition.
  const existing = await prisma.booking.findUnique({
    where: { id },
    select: { status: true, quotedAmount: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (!existing.quotedAmount) {
    return NextResponse.json({ error: "No quote set" }, { status: 400 });
  }

  const paymentToken = crypto.randomUUID();
  const paymentTokenExpiry = new Date(Date.now() + 48 * 60 * 60 * 1000);

  // Atomic conditional transition: only QUOTE_SENT or AWAITING_PAYMENT
  // (reissue) can win. quotedAmount is re-checked in the where clause too,
  // so a concurrent send-quote that clears/changes it can't race a payment
  // link into existence against a stale quote.
  const { count } = await prisma.booking.updateMany({
    where: {
      id,
      status: { in: ["QUOTE_SENT", "AWAITING_PAYMENT"] },
      quotedAmount: { not: null },
    },
    data: { paymentToken, paymentTokenExpiry, status: "AWAITING_PAYMENT" },
  });
  if (count === 0) {
    return NextResponse.json(
      { error: `Cannot send a payment link from status ${existing.status}` },
      { status: 409 },
    );
  }

  const updated = await prisma.booking.findUniqueOrThrow({
    where: { id },
    include: { user: true, package: true },
  });

  const paymentUrl = `${process.env.NEXT_PUBLIC_APP_URL}/pay/${paymentToken}`;

  await sendPaymentLinkEmail(updated, paymentUrl);

  return NextResponse.json({
    data: { paymentUrl, expiresAt: paymentTokenExpiry },
  });
}
