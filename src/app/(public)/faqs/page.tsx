import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { cache } from "react";

import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { FAQ_PAGE_QUERY } from "@/lib/queries/faq";
import { sanityReadClient } from "@/lib/sanity";
import type { FaqPageData } from "@/types/faq";

export const revalidate = 3600;

interface FaqFetchResult {
  data: FaqPageData | null;
  failed: boolean;
}

const getFaqData = cache(async (): Promise<FaqFetchResult> => {
  try {
    const data = await sanityReadClient.fetch<FaqPageData | null>(
      FAQ_PAGE_QUERY,
    );
    return { data, failed: false };
  } catch {
    return { data: null, failed: true };
  }
});

export async function generateMetadata(): Promise<Metadata> {
  const { data: page } = await getFaqData();

  return {
    title: page?.seo?.metaTitle ?? page?.title ?? "FAQs",
    description:
      page?.seo?.metaDescription ??
      "Answers to common questions about booking, payments, journeys, changes, documents, and support with RapidLuxe.",
  };
}

export default async function FaqsPage() {
  const { data: page, failed } = await getFaqData();
  const categories = (page?.categories ?? []).filter(
    (category) => category.items?.length,
  );
  const hasContent = categories.length > 0;

  return (
    <section className="bg-(--color-navy) min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="border-b border-(--color-gold)/30 pb-8 mb-10">
          <h1 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl text-(--color-white) font-light leading-tight">
            {page?.title ?? "Frequently Asked Questions"}
          </h1>
          {page?.subtitle && (
            <p className="font-sans text-lg text-(--color-white-muted) mt-4">
              {page.subtitle}
            </p>
          )}
        </div>

        {failed ? (
          <p className="font-sans text-(--color-white-muted)">
            We couldn&apos;t load our FAQs right now. Please try again shortly,
            or reach out to us directly below.
          </p>
        ) : hasContent ? (
          <FAQAccordion categories={categories} />
        ) : (
          <p className="font-sans text-(--color-white-muted)">
            We&apos;re putting together answers to our most common questions. In
            the meantime, reach out and we&apos;ll answer directly.
          </p>
        )}

        <div className="mt-16 pt-8 border-t border-(--color-navy-border)">
          <p className="font-sans text-sm text-(--color-white-muted) mb-3">
            Can&apos;t find what you&apos;re looking for?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 font-sans text-sm font-medium text-(--color-gold) hover:text-(--color-gold-light) transition-colors"
          >
            Contact Us <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
