import type { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { prisma } from "@/lib/prisma";

// Prisma (pg adapter) requires the Node runtime, not edge
export const runtime = "nodejs";

export async function POST(request: Request) {
  const svixId = request.headers.get("svix-id");
  const svixTimestamp = request.headers.get("svix-timestamp");
  const svixSignature = request.headers.get("svix-signature");
  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: "Missing svix headers" },
      { status: 400 },
    );
  }

  const body = await request.text();
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  let event: WebhookEvent;
  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "user.created" || event.type === "user.updated") {
      const { id, email_addresses, first_name, last_name, phone_numbers } =
        event.data;
      const email = email_addresses[0]?.email_address;
      if (!email) {
        // phone-only signups have no email; User.email is required + unique
        console.error(`clerk webhook: no email for user ${id}, skipping sync`);
        return NextResponse.json({ received: true });
      }
      const name = [first_name, last_name].filter(Boolean).join(" ") || null;
      const phone = phone_numbers?.[0]?.phone_number ?? null;

      // upsert keeps this idempotent across svix redeliveries and syncs
      // Clerk users who existed before this webhook was set up
      await prisma.user.upsert({
        where: { clerkId: id },
        update: { email, name, phone },
        create: { clerkId: id, email, name, phone, role: "USER" },
      });
    }

    if (event.type === "user.deleted") {
      const { id } = event.data;
      if (id) {
        // anonymize rather than delete — bookings/reviews reference the row
        await prisma.user.updateMany({
          where: { clerkId: id },
          data: { email: `deleted_${id}@deleted.com`, name: null, phone: null },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("clerk webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
