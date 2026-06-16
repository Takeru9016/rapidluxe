"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import type { PortableTextBlock } from "@portabletext/react";

import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { formatDate } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

interface StaticPageData {
  _id: string;
  slug: string | null;
  title: string | null;
  subtitle: string | null;
  body: PortableTextBlock[] | null;
  lastUpdated: string | null;
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const inputCls =
  "w-full bg-(--color-navy) border border-(--color-navy-border) rounded-lg px-3 py-2.5 text-sm font-['DM_Sans'] text-white placeholder:text-(--color-text-secondary) focus:outline-none focus:border-(--color-gold)/60 transition-colors";

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-5 md:p-8">
      <h2 className="font-['DM_Sans'] text-xs font-semibold uppercase tracking-widest text-(--color-gold) mb-5">
        {title}
      </h2>
      {children}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function StaticPageEditorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [body, setBody] = useState<PortableTextBlock[]>([]);
  const [editorKey, setEditorKey] = useState(0);
  const [saving, setSaving] = useState(false);

  const { data, isLoading, isError } = useQuery<{ data: StaticPageData }>({
    queryKey: ["admin-static-page", slug],
    queryFn: async () => {
      const res = await fetch(`/api/admin/sanity/pages/${slug}`);
      if (!res.ok) throw new Error("Not found");
      return res.json() as Promise<{ data: StaticPageData }>;
    },
  });

  const page = data?.data;

  useEffect(() => {
    if (!page) return;
    setTitle(page.title ?? "");
    setSubtitle(page.subtitle ?? "");
    setBody(page.body ?? []);
    setEditorKey((k) => k + 1);
  }, [page]);

  if (isError) {
    return (
      <div className="px-4 md:px-8 py-6">
        <p className="font-['DM_Sans'] text-sm text-(--color-coral)">
          Page not found. Make sure you've run the seed script.
        </p>
        <Link
          href="/admin/pages"
          className="inline-flex items-center gap-2 text-sm font-['DM_Sans'] text-(--color-text-secondary) hover:text-(--color-gold) transition-colors mt-4"
        >
          <ArrowLeft size={14} />
          Back to Pages
        </Link>
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/sanity/pages/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, subtitle, body }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Page saved");
      router.push("/admin/pages");
    } catch {
      toast.error("Failed to save page");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-4 md:px-8 py-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/admin/pages"
          className="inline-flex items-center gap-2 text-sm font-['DM_Sans'] text-(--color-text-secondary) hover:text-(--color-gold) transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Pages
        </Link>
        <a
          href={`/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-['DM_Sans'] text-(--color-text-secondary) hover:text-(--color-gold) transition-colors"
        >
          Preview <ExternalLink size={12} />
        </a>
      </div>

      <div className="flex items-baseline gap-4 mb-8">
        <h1 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white">
          {page?.title ?? slug}
        </h1>
        {page?.lastUpdated && (
          <p className="font-['DM_Sans'] text-xs text-(--color-text-secondary) shrink-0">
            Updated {formatDate(page.lastUpdated)}
          </p>
        )}
      </div>

      {isLoading ? (
        <p className="font-['DM_Sans'] text-sm text-(--color-text-secondary)">
          Loading…
        </p>
      ) : (
        <div className="space-y-6">
          <SectionCard title="Page Info">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-['DM_Sans'] text-(--color-text-secondary) mb-1.5">
                  Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-['DM_Sans'] text-(--color-text-secondary) mb-1.5">
                  Subtitle
                </label>
                <input
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Optional subtitle shown below the title"
                  className={inputCls}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Content">
            <RichTextEditor key={editorKey} value={body} onChange={setBody} />
          </SectionCard>

          <div className="flex gap-3 pb-8">
            <Link
              href="/admin/pages"
              className="px-6 py-2.5 rounded-lg border border-(--color-navy-border) text-(--color-white-muted) font-['DM_Sans'] text-sm font-medium hover:border-(--color-gold)/40 hover:text-white transition-colors"
            >
              Cancel
            </Link>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 rounded-lg bg-(--color-gold) text-(--color-navy) font-['DM_Sans'] text-sm font-bold hover:bg-(--color-gold)/90 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
