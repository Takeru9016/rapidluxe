"use client";

import { useQuery } from "@tanstack/react-query";
import { Edit, ExternalLink, FileText } from "lucide-react";
import Link from "next/link";

import { formatDate } from "@/lib/utils";

// FAQ and Site Content are deliberately not given dedicated editors in this
// milestone — Sanity Studio remains their editing surface. This is only a
// navigation aid pointing there, not a duplicate editor.
const STUDIO_ONLY_CONTENT = [
  {
    typeName: "faqPage",
    label: "FAQ",
    description: "Categories and questions shown on /faqs",
  },
  {
    typeName: "siteContent",
    label: "Site Content",
    description: "Homepage How It Works, Why RapidLuxe & Trust Bar",
  },
];

// ── Types ─────────────────────────────────────────────────────────────────────

interface StaticPageMeta {
  _id: string;
  slug: string | null;
  title: string | null;
  subtitle: string | null;
  lastUpdated: string | null;
}

// All static pages that should be manageable, with fallback defaults
const PAGE_MANIFEST = [
  { slug: "cancellation-policy", label: "Cancellation Policy" },
  { slug: "terms", label: "Terms & Conditions" },
  { slug: "privacy", label: "Privacy Policy" },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminPagesPage() {
  const { data, isLoading } = useQuery<{ data: StaticPageMeta[] }>({
    queryKey: ["admin-static-pages"],
    queryFn: async () => {
      const res = await fetch("/api/admin/sanity/pages");
      if (!res.ok) throw new Error("Failed");
      return res.json() as Promise<{ data: StaticPageMeta[] }>;
    },
  });

  const sanityPages = data?.data ?? [];

  const getPage = (slug: string) => sanityPages.find((p) => p.slug === slug);

  return (
    <div className="px-4 md:px-8 py-6">
      <div className="mb-8">
        <h1 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white mb-2">
          Static Pages
        </h1>
        <p className="font-['DM_Sans'] text-sm text-(--color-text-secondary)">
          Edit the content of your static informational pages.
        </p>
      </div>

      {/* About Us card — links to dedicated editor */}
      <div className="mb-4">
        <Link
          href="/admin/pages/about"
          className="group flex items-center justify-between p-5 bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) hover:border-(--color-gold)/30 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-(--color-gold)/10 flex items-center justify-center shrink-0">
              <FileText size={18} className="text-(--color-gold)" />
            </div>
            <div>
              <p className="font-['DM_Sans'] text-sm font-medium text-white">
                About Us
              </p>
              <p className="font-['DM_Sans'] text-xs text-(--color-text-secondary) mt-0.5">
                Hero, company story, mission, team members &amp; stats
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-['DM_Sans'] text-xs text-(--color-text-secondary) hidden sm:block">
              Dedicated editor
            </span>
            <Edit
              size={14}
              className="text-(--color-white-muted) group-hover:text-(--color-gold) transition-colors"
            />
          </div>
        </Link>
      </div>

      {/* Static pages grid */}
      {isLoading ? (
        <p className="py-8 font-['DM_Sans'] text-sm text-(--color-text-secondary)">
          Loading…
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PAGE_MANIFEST.map(({ slug, label }) => {
            const page = getPage(slug);
            return (
              <Link
                key={slug}
                href={`/admin/pages/${slug}`}
                className="group flex items-center justify-between p-5 bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) hover:border-(--color-gold)/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <FileText
                      size={18}
                      className="text-(--color-white-muted)"
                    />
                  </div>
                  <div>
                    <p className="font-['DM_Sans'] text-sm font-medium text-white">
                      {page?.title ?? label}
                    </p>
                    <p className="font-['DM_Sans'] text-xs text-(--color-text-secondary) mt-0.5">
                      {page?.lastUpdated
                        ? `Updated ${formatDate(page.lastUpdated)}`
                        : "Not yet seeded"}
                    </p>
                  </div>
                </div>
                <Edit
                  size={14}
                  className="text-(--color-white-muted) group-hover:text-(--color-gold) transition-colors shrink-0"
                />
              </Link>
            );
          })}
        </div>
      )}

      {/* Studio-only content — navigation link, not a duplicate editor */}
      <div className="mt-10">
        <h2 className="font-['DM_Sans'] text-xs font-semibold uppercase tracking-widest text-(--color-text-secondary) mb-3">
          Managed in Sanity Studio
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {STUDIO_ONLY_CONTENT.map(({ typeName, label, description }) => (
            <a
              key={typeName}
              href={`/studio/structure/${typeName}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-5 bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) hover:border-(--color-gold)/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <FileText size={18} className="text-(--color-white-muted)" />
                </div>
                <div>
                  <p className="font-['DM_Sans'] text-sm font-medium text-white">
                    {label}
                  </p>
                  <p className="font-['DM_Sans'] text-xs text-(--color-text-secondary) mt-0.5">
                    {description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-['DM_Sans'] text-xs text-(--color-text-secondary) hidden sm:block">
                  Manage in Studio
                </span>
                <ExternalLink
                  size={14}
                  className="text-(--color-white-muted) group-hover:text-(--color-gold) transition-colors"
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
