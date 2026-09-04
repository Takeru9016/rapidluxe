import type { Metadata } from "next";

import { PayPageClient } from "./PayPageClient";

// Private, tokenized payment-link page — must never be indexed. No SEO
// copy is meaningful here (no title/description beyond "don't index this").
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function PayPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <PayPageClient token={token} />;
}
