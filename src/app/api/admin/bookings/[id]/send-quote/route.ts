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

  const existing = await prisma.booking.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const booking = await prisma.booking.update({
    where: { id },
    data: {
      quotedAmount: parsed.data.quotedAmount,
      quoteNotes: parsed.data.quoteNotes ?? null,
      paymentDueDate: parsed.data.paymentDueDate
        ? new Date(parsed.data.paymentDueDate)
        : null,
      status: "QUOTE_SENT",
    },
    include: { user: true, package: true },
  });

  // Send the email after the response is flushed so a slow Resend call never
  // blocks the admin's "Send Quote" action. sendQuoteEmail swallows its own errors.
  after(() => sendQuoteEmail(booking));

  return NextResponse.json({
    data: { bookingId: booking.id, status: "QUOTE_SENT" },
  });
}
