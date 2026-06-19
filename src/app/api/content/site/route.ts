import { NextResponse } from "next/server";

import { sanityReadClient } from "@/lib/sanity";

export const revalidate = 3600;

export interface HowItWorksStep {
  stepNumber: string;
  title: string;
  description: string;
}

export interface WhyPoint {
  title: string;
  description: string;
}

export interface TrustStat {
  number: string;
  label: string;
}

export interface SiteContentResponse {
  howItWorksSteps: HowItWorksStep[];
  whyRapidluxePoints: WhyPoint[];
  trustBarStats: TrustStat[];
}

export async function GET() {
  const data = await sanityReadClient.fetch<SiteContentResponse | null>(
    `*[_type == "siteContent"][0] {
      howItWorksSteps[] { stepNumber, title, description },
      whyRapidluxePoints[] { title, description },
      trustBarStats[] { number, label }
    }`,
  );

  return NextResponse.json(
    data ?? { howItWorksSteps: [], whyRapidluxePoints: [], trustBarStats: [] },
  );
}
