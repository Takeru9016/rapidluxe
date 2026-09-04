import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

import { sanityWriteClient, uploadSanityImageFromUrl } from "@/lib/sanity";

async function requireAdmin() {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string } | null)?.role;
  return role === "admin";
}

// Only these fields are writable — mirrors the testimonial schema/admin
// editor exactly. Anything else in a request body is ignored rather than
// mass-assigned onto the document.
interface TestimonialInput {
  clientName?: string;
  clientTitle?: string;
  quote?: string;
  destination?: string;
  rating?: number;
  tripDate?: string;
  isFeatured?: boolean;
  // Cloudinary URL from the admin upload widget — converted to a real
  // Sanity `image` asset reference before being stored; never written
  // as-is (that field is what the public query used to miss).
  imageUrl?: string;
}

async function buildDoc(body: TestimonialInput) {
  const doc: Record<string, unknown> = {};

  if (body.clientName !== undefined) doc.clientName = body.clientName;
  if (body.clientTitle !== undefined) doc.clientTitle = body.clientTitle;
  if (body.quote !== undefined) doc.quote = body.quote;
  if (body.destination !== undefined) doc.destination = body.destination;
  if (body.rating !== undefined) doc.rating = body.rating;
  if (body.tripDate !== undefined) doc.tripDate = body.tripDate;
  if (body.isFeatured !== undefined) doc.isFeatured = body.isFeatured;
  if (body.imageUrl) {
    const image = await uploadSanityImageFromUrl(body.imageUrl);
    if (image) doc.image = image;
  }

  return doc;
}

export async function GET() {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const items = await sanityWriteClient.fetch(
    `*[_type == "testimonial"] | order(_createdAt desc) {
      _id, clientName, clientTitle, quote, destination, rating, tripDate, isFeatured,
      "imageUrl": image.asset->url
    }`,
  );

  return NextResponse.json({ data: items });
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = (await req.json()) as TestimonialInput;

  if (!body.clientName || !body.quote) {
    return NextResponse.json(
      { error: "clientName and quote are required" },
      { status: 400 },
    );
  }

  const doc = await buildDoc(body);
  const created = await sanityWriteClient.create({
    _type: "testimonial",
    ...doc,
  });
  return NextResponse.json({ data: created }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id, ...rest } = (await req.json()) as TestimonialInput & {
    id: string;
  };
  if (!id)
    return NextResponse.json({ error: "id is required" }, { status: 400 });

  const doc = await buildDoc(rest);
  const updated = await sanityWriteClient.patch(id).set(doc).commit();
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
