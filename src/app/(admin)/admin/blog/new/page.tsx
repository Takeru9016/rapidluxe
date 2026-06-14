// Phase 2E: submits to Sanity API via /api/admin/sanity/posts
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, X } from "lucide-react";
import type { PortableTextBlock } from "@portabletext/react";

import { generateSlug } from "@/lib/utils";
import { CloudinaryUpload } from "@/components/admin/CloudinaryUpload";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import type { AdminPostPayload } from "@/types/blog";

interface SanityAuthor {
  _id: string;
  name: string;
  role: string | null;
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface BlogFormValues {
  title: string;
  slug: string;
  authorId: string;
  category: string;
  excerpt: string;
  readTime: number;
  publishedAt: string;
  tags: string[];
  body: PortableTextBlock[];
  // Phase 2F: replace with CloudinaryUpload
  imageUrl: string;
  metaTitle: string;
  metaDescription: string;
  status: "DRAFT" | "PUBLISHED";
}

const CATEGORIES = [
  "Travel Tips",
  "Destination Guide",
  "Honeymoon",
  "Adventure",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-5 md:p-8">
      <div className="mb-5">
        <h2 className="font-['DM_Sans'] text-xs font-semibold uppercase tracking-widest text-(--color-gold)">
          {title}
        </h2>
        {subtitle && (
          <p className="font-['DM_Sans'] text-xs text-(--color-text-secondary) mt-1">
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="font-['DM_Sans'] text-xs text-(--color-text-secondary)">
          {label}
        </label>
        {hint && (
          <span className="font-['DM_Sans'] text-[10px] text-(--color-text-secondary)">
            {hint}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

const inputCls =
  "w-full bg-(--color-navy) border border-(--color-navy-border) rounded-lg px-3 py-2.5 text-sm font-['DM_Sans'] text-white placeholder:text-(--color-text-secondary) focus:outline-none focus:border-(--color-gold)/60 transition-colors";

const selectCls = inputCls + " cursor-pointer";

// ── Tags chip input ───────────────────────────────────────────────────────────

function TagsInput({
  tags,
  onChange,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
}) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (tag && !tags.includes(tag)) onChange([...tags, tag]);
    setInput("");
  };

  const removeTag = (tag: string) => onChange(tags.filter((t) => t !== tag));

  return (
    <div
      className="flex flex-wrap gap-1.5 min-h-[42px] bg-(--color-navy) border border-(--color-navy-border) rounded-lg px-3 py-2 cursor-text focus-within:border-(--color-gold)/60 transition-colors"
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-(--color-gold)/10 border border-(--color-gold)/30 text-xs font-['DM_Sans'] text-(--color-gold)"
        >
          {tag}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeTag(tag);
            }}
            className="hover:opacity-70 transition-opacity"
          >
            <X size={10} />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addTag(input);
          }
          if (e.key === "Backspace" && !input && tags.length)
            removeTag(tags[tags.length - 1]);
        }}
        onBlur={() => {
          if (input) addTag(input);
        }}
        placeholder={tags.length === 0 ? "Type and press Enter…" : ""}
        className="flex-1 min-w-[120px] bg-transparent outline-none text-sm font-['DM_Sans'] text-white placeholder:text-(--color-text-secondary)"
      />
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NewBlogPostPage() {
  const router = useRouter();
  const [slugManual, setSlugManual] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { data: authorsData } = useQuery<{ data: SanityAuthor[] }>({
    queryKey: ["sanity-authors"],
    queryFn: async () => {
      const res = await fetch("/api/admin/sanity/authors");
      if (!res.ok) throw new Error("Failed");
      return res.json() as Promise<{ data: SanityAuthor[] }>;
    },
  });
  const authors = authorsData?.data ?? [];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BlogFormValues>({
    defaultValues: {
      title: "",
      slug: "",
      authorId: "",
      category: CATEGORIES[0],
      excerpt: "",
      readTime: 5,
      publishedAt: new Date().toISOString().split("T")[0],
      tags: [],
      body: [],
      imageUrl: "",
      metaTitle: "",
      metaDescription: "",
      status: "DRAFT",
    },
  });

  // Auto-slug
  const title = watch("title");
  useEffect(() => {
    if (!slugManual && title) {
      setValue("slug", generateSlug(title), { shouldDirty: false });
    }
  }, [title, slugManual, setValue]);

  const tags = watch("tags");
  const excerpt = watch("excerpt");
  const body = watch("body");

  const onSubmit: SubmitHandler<BlogFormValues> = async (data) => {
    setSubmitting(true);
    try {
      const payload: AdminPostPayload = {
        title: data.title,
        slug: data.slug || generateSlug(data.title),
        excerpt: data.excerpt,
        readTime: data.readTime,
        // Only send a published date when the editor hit "Publish".
        publishedAt: data.status === "PUBLISHED" ? data.publishedAt : undefined,
        tags: data.tags,
        body: data.body,
        mainImageUrl: data.imageUrl || undefined,
        metaTitle: data.metaTitle || undefined,
        metaDescription: data.metaDescription || undefined,
        // author/category are Sanity references — wired once the Sanity-backed
        // author & category admin pages exist (see SANITY_CMS.md admin table).
      };

      const res = await fetch("/api/admin/sanity/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(err?.error ?? "Failed to save post");
      }

      toast.success(
        data.status === "PUBLISHED" ? "Post published" : "Draft saved",
      );
      router.push("/admin/blog");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const onSaveDraft = () => {
    setValue("status", "DRAFT");
    handleSubmit(onSubmit)();
  };

  const onPublish = () => {
    setValue("status", "PUBLISHED");
    handleSubmit(onSubmit)();
  };

  return (
    <div className="px-4 md:px-8 py-6 max-w-3xl mx-auto">
      {/* Back */}
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-2 text-sm font-['DM_Sans'] text-(--color-text-secondary) hover:text-(--color-gold) transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        Back to Blog
      </Link>

      <h1 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white mb-8">
        New Post
      </h1>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* ── Basic Info ── */}
        <SectionCard title="Basic Info">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Title" className="sm:col-span-2">
              <input
                {...register("title", { required: true })}
                placeholder="e.g. 10 Things Nobody Tells You About Bali"
                className={inputCls}
              />
              {errors.title && (
                <p className="text-xs text-(--color-coral) mt-1">Required</p>
              )}
            </Field>

            <Field label="Slug">
              <input
                {...register("slug")}
                placeholder="auto-generated"
                className={inputCls}
                onChange={(e) => {
                  setSlugManual(true);
                  setValue("slug", e.target.value);
                }}
              />
            </Field>

            <Field label="Published At">
              <input
                type="date"
                {...register("publishedAt")}
                className={inputCls}
              />
            </Field>

            <Field label="Author">
              <select {...register("authorId")} className={selectCls}>
                <option value="">Select author…</option>
                {authors.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.name}
                    {a.role ? ` — ${a.role}` : ""}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Category">
              <select {...register("category")} className={selectCls}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Read Time (minutes)">
              <input
                type="number"
                min={1}
                {...register("readTime", { valueAsNumber: true })}
                className={inputCls}
              />
            </Field>
          </div>
        </SectionCard>

        {/* ── Content ── */}
        <SectionCard title="Content">
          <div className="space-y-4">
            <Field label="Excerpt" hint={`${excerpt?.length ?? 0}/160`}>
              <textarea
                {...register("excerpt", { maxLength: 160 })}
                rows={3}
                placeholder="Short summary shown in previews…"
                className={inputCls + " resize-none"}
              />
            </Field>

            <Field label="Tags">
              <TagsInput
                tags={tags ?? []}
                onChange={(t) => setValue("tags", t)}
              />
            </Field>

            <Field label="Body">
              <RichTextEditor
                value={body ?? []}
                onChange={(blocks) => setValue("body", blocks)}
              />
            </Field>
          </div>
        </SectionCard>

        {/* ── Media ── */}
        <SectionCard title="Main Image">
          <CloudinaryUpload
            folder="rapidluxe/blog"
            currentUrl={watch("imageUrl")}
            onUpload={(url) => setValue("imageUrl", url)}
          />
        </SectionCard>

        {/* ── SEO ── */}
        <SectionCard title="SEO">
          <div className="space-y-4">
            <Field label="Meta Title">
              <input
                {...register("metaTitle")}
                placeholder="e.g. 10 Bali Travel Tips | RapidLuxe"
                className={inputCls}
              />
            </Field>
            <Field label="Meta Description">
              <textarea
                {...register("metaDescription")}
                rows={2}
                placeholder="Short description for search engines…"
                className={inputCls + " resize-none"}
              />
            </Field>
          </div>
        </SectionCard>

        {/* ── Actions ── */}
        <div className="flex flex-wrap gap-3 pb-8">
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={submitting}
            className="px-6 py-2.5 rounded-lg border border-(--color-navy-border) text-(--color-white-muted) font-['DM_Sans'] text-sm font-medium hover:border-(--color-gold)/40 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={onPublish}
            disabled={submitting}
            className="px-6 py-2.5 rounded-lg bg-(--color-gold) text-(--color-navy) font-['DM_Sans'] text-sm font-bold hover:bg-(--color-gold)/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Saving…" : "Publish"}
          </button>
        </div>
      </form>
    </div>
  );
}
