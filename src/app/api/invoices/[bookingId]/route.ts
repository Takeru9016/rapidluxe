import { auth } from "@clerk/nextjs/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";

import { prisma } from "@/lib/prisma";

import { InvoiceDocument } from "@/pdfs/InvoiceDocument";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ bookingId: string }> },
) {
  const { userId, sessionClaims } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { bookingId } = await params;

  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!dbUser)
    return Response.json({ error: "User not found" }, { status: 404 });

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      user: true,
      package: { include: { destination: true } },
    },
  });

  if (!booking)
    return Response.json({ error: "Booking not found" }, { status: 404 });

  const isOwner = booking.userId === dbUser.id;
  const isAdmin = sessionClaims?.metadata?.role === "admin";

  if (!isOwner && !isAdmin) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  if (booking.status !== "PAID" && booking.status !== "CONFIRMED") {
    return Response.json(
      { error: "Invoice only available for paid or confirmed bookings" },
      { status: 400 },
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(
    createElement(InvoiceDocument, { booking }) as any,
  );

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="INV-${booking.bookingRef ?? bookingId}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
