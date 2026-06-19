import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import {
  checkRateLimit,
  strictLimiter,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { getResend } from "@/lib/resend";

const FROM = process.env.RESEND_FROM_EMAIL ?? "hello@rapidluxe.com";
const ADMIN = process.env.ADMIN_EMAIL ?? "";

const bodySchema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
  const rl = await checkRateLimit(strictLimiter, ip);
  if (!rl.success) return rateLimitResponse(rl.reset);

  const body = await req.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });

  const { email } = parsed.data;

  const row = await prisma.siteSettings.findUnique({
    where: { key: "newsletter_subscribers" },
  });

  const subscribers: string[] = row ? (JSON.parse(row.value) as string[]) : [];
  if (subscribers.includes(email)) {
    return NextResponse.json({ success: true });
  }

  subscribers.push(email);
  await prisma.siteSettings.upsert({
    where: { key: "newsletter_subscribers" },
    create: {
      key: "newsletter_subscribers",
      value: JSON.stringify(subscribers),
    },
    update: { value: JSON.stringify(subscribers) },
  });

  const resend = getResend();
  await Promise.allSettled([
    resend.emails.send({
      from: FROM,
      to: email,
      subject: "Welcome to RapidLuxe — You're on the list! ✈️",
      html: `<p>Thank you for subscribing. We'll send you exclusive deals, travel inspiration, and insider tips.</p>`,
    }),
    ADMIN
      ? resend.emails.send({
          from: FROM,
          to: ADMIN,
          subject: `New newsletter subscriber: ${email}`,
          html: `<p>${email} subscribed to the newsletter.</p>`,
        })
      : Promise.resolve(),
  ]);

  return NextResponse.json({ success: true });
}
