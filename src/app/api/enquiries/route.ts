import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import {
  apiLimiter,
  checkRateLimit,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { getResend } from "@/lib/resend";

const enquirySchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(2000),
  type: z.enum(["CORPORATE", "GENERAL"]).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { success, reset } = await checkRateLimit(
      apiLimiter,
      `enquiry:${ip}`,
    );
    if (!success) return rateLimitResponse(reset);

    const body: unknown = await req.json();
    const parsed = enquirySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.issues },
        { status: 400 },
      );
    }
    const { name, email, phone, subject, message, type } = parsed.data;

    await prisma.enquiry.create({
      data: {
        name,
        email,
        phone: phone ?? null,
        subject,
        message,
        type: type ?? "GENERAL",
      },
    });

    const adminEmail = process.env.ADMIN_EMAIL ?? "";
    const fromEmail = process.env.RESEND_FROM_EMAIL ?? "bookings@rapidluxe.com";

    if (adminEmail) {
      try {
        await getResend().emails.send({
          from: fromEmail,
          to: adminEmail,
          subject: `New contact enquiry — ${subject}`,
          html: `
            <div style="background:#1B2A41;color:#D4D8E2;font-family:system-ui,sans-serif;padding:40px 20px;max-width:580px;margin:0 auto">
              <h2 style="color:#F9A826;margin:0 0 20px">New Contact Enquiry</h2>
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="color:#8891A4;font-size:11px;text-transform:uppercase;padding:8px 0 2px">Name</td></tr>
                <tr><td style="color:#D4D8E2;font-size:14px;padding:0 0 12px">${name}</td></tr>
                <tr><td style="color:#8891A4;font-size:11px;text-transform:uppercase;padding:8px 0 2px">Email</td></tr>
                <tr><td style="color:#D4D8E2;font-size:14px;padding:0 0 12px">${email}</td></tr>
                ${phone ? `<tr><td style="color:#8891A4;font-size:11px;text-transform:uppercase;padding:8px 0 2px">Phone</td></tr><tr><td style="color:#D4D8E2;font-size:14px;padding:0 0 12px">${phone}</td></tr>` : ""}
                <tr><td style="color:#8891A4;font-size:11px;text-transform:uppercase;padding:8px 0 2px">Subject</td></tr>
                <tr><td style="color:#D4D8E2;font-size:14px;padding:0 0 12px">${subject}</td></tr>
                <tr><td style="color:#8891A4;font-size:11px;text-transform:uppercase;padding:8px 0 2px">Message</td></tr>
                <tr><td style="color:#D4D8E2;font-size:14px;line-height:1.6;padding:0 0 12px;white-space:pre-wrap">${message}</td></tr>
              </table>
              <hr style="border-color:#2A2F40;margin:24px 0" />
              <p style="color:#8891A4;font-size:12px;text-align:center">RapidLuxe — Admin Notification</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("[email] enquiry notification failed:", emailError);
      }
    }

    return NextResponse.json({ data: { success: true } }, { status: 201 });
  } catch (error) {
    console.error("enquiry create error:", error);
    return NextResponse.json(
      { error: "Failed to submit enquiry" },
      { status: 500 },
    );
  }
}
