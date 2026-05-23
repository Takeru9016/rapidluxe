// On submit: Phase 2F writes to Postgres + Sanity (see docs/SANITY_CMS.md)
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm, type SubmitHandler } from "react-hook-form";
import { ArrowLeft } from "lucide-react";

import { generateSlug } from "@/lib/utils";
import type { Continent, VisaType } from "@/types/destination";

// ── Types ─────────────────────────────────────────────────────────────────────

interface DestinationFormValues {
  // ── Postgres fields ──────────────────────────────────────────────────────
  name: string;
  slug: string;
  country: string;
  continent: Continent;
  imageUrl: string;
  bestTimeFrom: string;
  bestTimeTo: string;
  visaType: VisaType | "";
  currency: string;
  language: string;

  // ── Sanity editorial fields ──────────────────────────────────────────────
  // Phase 2E: replace textareas with Tiptap / PortableText editor
  about: string;
  travelTips: string;
  metaTitle: string;
  metaDescription: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const CONTINENTS: { value: Continent; label: string }[] = [
  { value: "ASIA", label: "Asia" },
  { value: "EUROPE", label: "Europe" },
  { value: "AFRICA", label: "Africa" },
  { value: "AMERICAS", label: "Americas" },
  { value: "MIDDLE_EAST", label: "Middle East" },
  { value: "OCEANIA", label: "Oceania" },
];

const VISA_TYPES: { value: VisaType; label: string }[] = [
  { value: "VISA_FREE", label: "Visa Free" },
  { value: "VISA_ON_ARRIVAL", label: "Visa on Arrival" },
  { value: "E_VISA", label: "e-Visa" },
  { value: "VISA_REQUIRED", label: "Visa Required" },
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
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
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block font-['DM_Sans'] text-xs text-(--color-text-secondary) mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full bg-(--color-navy) border border-(--color-navy-border) rounded-lg px-3 py-2.5 text-sm font-['DM_Sans'] text-white placeholder:text-(--color-text-secondary) focus:outline-none focus:border-(--color-gold)/60 transition-colors";

const selectCls = inputCls + " cursor-pointer";

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NewDestinationPage() {
  const [slugManual, setSlugManual] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DestinationFormValues>({
    defaultValues: {
      name: "",
      slug: "",
      country: "",
      continent: "ASIA",
      imageUrl: "",
      bestTimeFrom: "",
      bestTimeTo: "",
      visaType: "",
      currency: "",
      language: "",
      about: "",
      travelTips: "",
      metaTitle: "",
      metaDescription: "",
    },
  });

  // Auto-slug from name
  const name = watch("name");
  useEffect(() => {
    if (!slugManual && name) {
      setValue("slug", generateSlug(name), { shouldDirty: false });
    }
  }, [name, slugManual, setValue]);

  const onSubmit: SubmitHandler<DestinationFormValues> = (data) => {
    console.log(data);
  };

  return (
    <div className="px-4 md:px-8 py-6 max-w-3xl mx-auto">
      {/* Back */}
      <Link
        href="/admin/destinations"
        className="inline-flex items-center gap-2 text-sm font-['DM_Sans'] text-(--color-text-secondary) hover:text-(--color-gold) transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        Back to Destinations
      </Link>

      <h1 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white mb-8">
        New Destination
      </h1>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

        {/* ── Postgres: Core Fields ── */}
        <SectionCard
          title="Core Details"
          subtitle="Saved to Postgres"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Name" className="sm:col-span-2">
              <input
                {...register("name", { required: true })}
                placeholder="e.g. Bali"
                className={inputCls}
              />
              {errors.name && (
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

            <Field label="Country">
              <input
                {...register("country", { required: true })}
                placeholder="e.g. Indonesia"
                className={inputCls}
              />
            </Field>

            <Field label="Continent">
              <select {...register("continent")} className={selectCls}>
                {CONTINENTS.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Visa Type">
              <select {...register("visaType")} className={selectCls}>
                <option value="">Select visa type</option>
                {VISA_TYPES.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Currency">
              <input
                {...register("currency")}
                placeholder="e.g. IDR"
                className={inputCls}
              />
            </Field>

            <Field label="Language">
              <input
                {...register("language")}
                placeholder="e.g. Bahasa Indonesia"
                className={inputCls}
              />
            </Field>

            <Field label="Cover Image URL" className="sm:col-span-2">
              <input
                {...register("imageUrl")}
                placeholder="https://..."
                className={inputCls}
              />
            </Field>
          </div>
        </SectionCard>

        {/* ── Postgres: Best Time ── */}
        <SectionCard
          title="Best Time to Visit"
          subtitle="Saved to Postgres"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="From Month">
              <select {...register("bestTimeFrom")} className={selectCls}>
                <option value="">Select month</option>
                {MONTHS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </Field>
            <Field label="To Month">
              <select {...register("bestTimeTo")} className={selectCls}>
                <option value="">Select month</option>
                {MONTHS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </Field>
          </div>
        </SectionCard>

        {/* ── Sanity: Editorial ── */}
        <SectionCard
          title="Editorial Content"
          subtitle="Saved to Sanity CMS — see docs/SANITY_CMS.md"
        >
          <div className="space-y-4">
            {/* Phase 2E: replace with Tiptap / PortableText editor */}
            <Field label="About (Phase 2E: replace with Tiptap / PortableText)">
              <textarea
                {...register("about")}
                rows={6}
                placeholder="Describe this destination — culture, highlights, why it's special…"
                className={inputCls + " resize-y"}
              />
            </Field>

            {/* Phase 2E: replace with Tiptap / PortableText editor */}
            <Field label="Travel Tips (Phase 2E: replace with Tiptap / PortableText)">
              <textarea
                {...register("travelTips")}
                rows={4}
                placeholder="Practical tips — best transport, cultural etiquette, packing list…"
                className={inputCls + " resize-y"}
              />
            </Field>
          </div>
        </SectionCard>

        {/* ── Sanity: SEO ── */}
        <SectionCard
          title="SEO"
          subtitle="Saved to Sanity CMS"
        >
          <div className="space-y-4">
            <Field label="Meta Title">
              <input
                {...register("metaTitle")}
                placeholder="e.g. Bali Travel Packages | RapidLuxe"
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
            onClick={() => handleSubmit(onSubmit)()}
            className="px-6 py-2.5 rounded-lg border border-(--color-navy-border) text-(--color-white-muted) font-['DM_Sans'] text-sm font-medium hover:border-(--color-gold)/40 hover:text-white transition-colors"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-(--color-gold) text-(--color-navy) font-['DM_Sans'] text-sm font-bold hover:bg-(--color-gold)/90 transition-colors"
          >
            Publish
          </button>
        </div>

      </form>
    </div>
  );
}
