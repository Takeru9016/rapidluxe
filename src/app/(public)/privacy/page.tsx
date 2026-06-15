import type { Metadata } from "next";
import { sanityReadClient } from "@/lib/sanity";
import { STATIC_PAGE_QUERY } from "@/lib/queries/pages";
import type { StaticPageData } from "@/types/staticPage";
import { formatDate } from "@/lib/utils";
import { PortableTextBody } from "@/components/shared/PortableTextBody";

export const revalidate = 3600;

const SLUG = "privacy";

export async function generateMetadata(): Promise<Metadata> {
  const page = await sanityReadClient.fetch<StaticPageData | null>(
    STATIC_PAGE_QUERY,
    { slug: SLUG },
  );

  return {
    title: page?.seo?.metaTitle ?? page?.title ?? "Privacy Policy",
    description: page?.seo?.metaDescription ?? undefined,
  };
}

export default async function PrivacyPage() {
  const page = await sanityReadClient.fetch<StaticPageData | null>(
    STATIC_PAGE_QUERY,
    { slug: SLUG },
  );

  return (
    <section className="bg-(--color-navy) min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="border-b border-(--color-gold)/30 pb-8 mb-10">
          <h1 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl text-white font-light leading-tight">
            {page?.title ?? "Privacy Policy"}
          </h1>
          {page?.subtitle && (
            <p className="font-sans text-lg text-(--color-white-muted) mt-4">
              {page.subtitle}
            </p>
          )}
        </div>

        {page?.body?.length ? (
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
