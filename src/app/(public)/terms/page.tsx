import type { Metadata } from "next";
import { cache } from "react";
import { PortableTextBody } from "@/components/shared/PortableTextBody";
import { STATIC_PAGE_QUERY } from "@/lib/queries/pages";
import { sanityReadClient } from "@/lib/sanity";
import { formatDate } from "@/lib/utils";
import type { StaticPageData } from "@/types/staticPage";

export const revalidate = 3600;

const SLUG = "terms";

interface TermsFetchResult {
  page: StaticPageData | null;
  failed: boolean;
}

const getTermsData = cache(async (): Promise<TermsFetchResult> => {
  try {
    const page = await sanityReadClient.fetch<StaticPageData | null>(
      STATIC_PAGE_QUERY,
      { slug: SLUG },
    );
    return { page, failed: false };
  } catch (err) {
    console.error("terms page sanity fetch error:", err);
    return { page: null, failed: true };
  }
});

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getTermsData();

  return {
    title: page?.seo?.metaTitle ?? page?.title ?? "Terms & Conditions",
    description: page?.seo?.metaDescription ?? undefined,
  };
}

export default async function TermsPage() {
  const { page, failed: fetchFailed } = await getTermsData();

  return (
    <section className="bg-(--color-navy) min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="border-b border-(--color-gold)/30 pb-8 mb-10">
          <h1 className="font-(--font-display) text-4xl md:text-5xl text-white font-light leading-tight">
            {page?.title ?? "Terms & Conditions"}
          </h1>
          {page?.subtitle && (
            <p className="font-sans text-lg text-(--color-white-muted) mt-4">
              {page.subtitle}
            </p>
          )}
        </div>

        {fetchFailed ? (
          <p className="font-sans text-(--color-white-muted)">
            We couldn&apos;t load this page right now. Please try again shortly.
          </p>
        ) : page?.body?.length ? (
          <PortableTextBody value={page.body} className="space-y-5" />
        ) : (
          <p className="font-sans text-(--color-white-muted)">
            Content coming soon.
          </p>
        )}

        {page?.lastUpdated && (
          <p className="mt-16 pt-6 border-t border-(--color-navy-border) font-sans text-sm text-(--color-text-secondary)">
            Last updated: {formatDate(page.lastUpdated)}
          </p>
        )}
      </div>
    </section>
  );
}
