import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  checkRateLimit,
  strictLimiter,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { getResend } from "@/lib/resend";

const FROM = process.env.RESEND_FROM_EMAIL ?? "info@rapidluxe.com";
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

  const existing = await prisma.newsletterSubscriber.findUnique({
    where: { email },
  });
  if (existing) {
    return NextResponse.json({ success: true });
  }

  try {
    await prisma.newsletterSubscriber.create({ data: { email } });
  } catch (error) {
    const isDuplicate =
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002";
    if (!isDuplicate) throw error;
  }

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
