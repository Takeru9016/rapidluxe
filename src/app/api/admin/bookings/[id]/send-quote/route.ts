import { auth } from "@clerk/nextjs/server";
import { after, type NextRequest, NextResponse } from "next/server";

import { sendQuoteEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { sendQuoteSchema } from "@/lib/validations/booking";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string } | null)?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body: unknown = await req.json();
  const parsed = sendQuoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.issues },
      { status: 400 },
    );
  }

  // Read only to shape the response (404 vs 409) — the actual authorization
  // for the transition is the atomic conditional update below, not this read.
  const existing = await prisma.booking.findUnique({
    where: { id },
    select: { status: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Atomic conditional transition: only a booking currently in ENQUIRY or
  // QUOTE_SENT (re-quote) can win this update. Two concurrent requests can
  // no longer both pass a stale in-memory status check — the database itself
  // is the single source of truth for who wins.
  const { count } = await prisma.booking.updateMany({
    where: { id, status: { in: ["ENQUIRY", "QUOTE_SENT"] } },
    data: {
      quotedAmount: parsed.data.quotedAmount,
      quoteNotes: parsed.data.quoteNotes ?? null,
      paymentDueDate: parsed.data.paymentDueDate
        ? new Date(parsed.data.paymentDueDate)
        : null,
      status: "QUOTE_SENT",
    },
  });
  if (count === 0) {
    return NextResponse.json(
      { error: `Cannot send a quote from status ${existing.status}` },
      { status: 409 },
    );
  }

  // Only after the atomic transition has actually won do we perform the
  // external side effect — never send the email speculatively.
  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id },
    include: { user: true, package: true },
  });

  // Send the email after the response is flushed so a slow Resend call never
  // blocks the admin's "Send Quote" action. sendQuoteEmail swallows its own errors.
  after(() => sendQuoteEmail(booking));

  return NextResponse.json({
    data: { bookingId: booking.id, status: "QUOTE_SENT" },
  });
}
