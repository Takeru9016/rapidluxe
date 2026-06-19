import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

import { sanityWriteClient } from "@/lib/sanity";

async function requireAdmin() {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string } | null)?.role;
  return role === "admin";
}

export async function GET() {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const items = await sanityWriteClient.fetch(
    `*[_type == "testimonial"] | order(_createdAt desc) {
      _id, clientName, clientTitle, quote, destination, rating, tripDate, isFeatured
    }`,
  );

  return NextResponse.json({ data: items });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = (await req.json()) as {
    clientName: string;
    clientTitle?: string;
    quote: string;
    destination?: string;
    rating: number;
    tripDate?: string;
    isFeatured?: boolean;
  };

  if (!body.clientName || !body.quote) {
    return NextResponse.json(
      { error: "clientName and quote are required" },
      { status: 400 },
    );
  }

  const doc = await sanityWriteClient.create({ _type: "testimonial", ...body });
  return NextResponse.json({ data: doc }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id, ...rest } = (await req.json()) as {
    id: string;
    [k: string]: unknown;
  };
  if (!id)
    return NextResponse.json({ error: "id is required" }, { status: 400 });

  const updated = await sanityWriteClient.patch(id).set(rest).commit();
  return NextResponse.json({ data: updated });
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = (await req.json()) as { id?: string };
  if (!id)
    return NextResponse.json({ error: "id is required" }, { status: 400 });

  await sanityWriteClient.delete(id);
  return NextResponse.json({ data: { id } });
}
