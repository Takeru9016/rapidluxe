"use client";

import { ArrowLeft, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Controller,
  type FieldPath,
  type SubmitHandler,
  type UseFormSetError,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { CloudinaryUpload } from "@/components/admin/CloudinaryUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateSlug, SLUG_PATTERN } from "@/lib/utils";
import type {
  AvailabilityStatus,
  Continent,
  CrowdLevel,
  DestinationCrowdLevel,
  VisaType,
  VisitRecommendation,
} from "@/types/destination";

// ── Types ─────────────────────────────────────────────────────────────────────

interface WhenToVisitRow {
  crowdLevel: CrowdLevel | "";
  availability: AvailabilityStatus | "";
  recommendation: VisitRecommendation | "";
}

interface TransportRow {
  name: string;
  description: string;
  recommended: boolean;
}

interface DestinationFormValues {
  // ── Postgres fields ──────────────────────────────────────────────────────
  name: string;
  slug: string;
  country: string;
  continent: Continent;
  imageUrl: string;
  images: { url: string }[];
  bestMonths: string[];
  visaType: VisaType | "";
  currency: string;
  language: string;
  lat: string;
  lng: string;
  countryCode: string;
  crowdLevel: DestinationCrowdLevel | "";

  // ── Sanity editorial fields ──────────────────────────────────────────────
  // Phase 2E: replace textareas with Tiptap / PortableText editor
  about: string;
  travelTips: string;
  metaTitle: string;
  metaDescription: string;
  whenToVisit: WhenToVisitRow[];
  howToGetThere: TransportRow[];
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

const DESTINATION_CROWD_LEVELS: {
  value: DestinationCrowdLevel;
  label: string;
}[] = [
  { value: "LOW", label: "Low" },
  { value: "MODERATE", label: "Moderate" },
  { value: "HIGH", label: "High" },
  { value: "VERY_HIGH", label: "Very High" },
];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
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
  htmlFor,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const errorId = error ? `${htmlFor}-error` : undefined;
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="block font-['DM_Sans'] text-xs text-(--color-text-secondary) mb-1.5"
      >
        {label}
      </label>
      {children}
      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-xs text-(--color-coral) mt-1"
        >
          {error}
        </p>
      )}
    </div>
  );
}

// Maps a server 400's Zod issues (path + message) onto react-hook-form field
// errors, so a validation failure the client didn't already catch (slug
// format, coordinate bounds, duplicate bestMonths, etc.) still surfaces next
// to the field that caused it.
function applyServerErrors(
  details: unknown,
  setError: UseFormSetError<DestinationFormValues>,
) {
  if (!Array.isArray(details)) return;
  for (const issue of details) {
    if (typeof issue !== "object" || issue === null) continue;
    const path = (issue as { path?: (string | number)[] }).path;
    const message = (issue as { message?: string }).message;
    if (!path || path.length === 0 || !message) continue;
    setError(path.join(".") as FieldPath<DestinationFormValues>, {
      type: "server",
      message,
    });
  }
}

const inputCls =
  "w-full bg-(--color-navy) border border-(--color-navy-border) rounded-lg px-3 py-2.5 text-sm font-['DM_Sans'] text-white placeholder:text-(--color-text-secondary) focus:outline-none focus:border-(--color-gold)/60 transition-colors";

const selectCls = inputCls + " cursor-pointer";

function ToggleSwitch({
  checked,
  onChange,
  ariaLabel,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
        checked ? "bg-(--color-gold)" : "bg-(--color-navy-border)"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NewDestinationPage() {
  const router = useRouter();
  const [slugManual, setSlugManual] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    control,
    formState: { errors },
  } = useForm<DestinationFormValues>({
    defaultValues: {
      name: "",
      slug: "",
      country: "",
      continent: "ASIA",
      imageUrl: "",
      images: [{ url: "" }],
      bestMonths: [],
      visaType: "",
      currency: "",
      language: "",
      lat: "",
      lng: "",
      countryCode: "",
      crowdLevel: "",
      about: "",
      travelTips: "",
      metaTitle: "",
      metaDescription: "",
      whenToVisit: MONTHS.map(() => ({
        crowdLevel: "" as CrowdLevel | "",
        availability: "Open" as AvailabilityStatus | "",
        recommendation: "" as VisitRecommendation | "",
      })),
      howToGetThere: [],
    },
  });

  const transport = useFieldArray({ control, name: "howToGetThere" });
  const images = useFieldArray({ control, name: "images" });

  // Auto-slug from name
  const name = watch("name");
  useEffect(() => {
    if (!slugManual && name) {
      setValue("slug", generateSlug(name), { shouldDirty: false });
    }
  }, [name, slugManual, setValue]);

  const onSubmit: SubmitHandler<DestinationFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/destinations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          slug: data.slug,
          country: data.country,
          continent: data.continent,
          imageUrl: data.imageUrl || undefined,
          images: data.images.map((i) => i.url).filter(Boolean),
          bestMonths: data.bestMonths,
          visaType: data.visaType || undefined,
          currency: data.currency || undefined,
          language: data.language || undefined,
          lat: data.lat ? Number(data.lat) : undefined,
          lng: data.lng ? Number(data.lng) : undefined,
          countryCode: data.countryCode || undefined,
          crowdLevel: data.crowdLevel || undefined,
          whenToVisit: data.whenToVisit,
          howToGetThere: data.howToGetThere,
          about: data.about || undefined,
          travelTips: data.travelTips || undefined,
          metaTitle: data.metaTitle || undefined,
          metaDescription: data.metaDescription || undefined,
        }),
      });
      if (!res.ok) {
        const err = (await res.json()) as { error?: string; details?: unknown };
        applyServerErrors(err.details, setError);
        throw new Error(err.error ?? "Failed to create destination");
      }
      toast.success("Destination created.");
      router.push("/admin/destinations");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
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
        <SectionCard title="Core Details" subtitle="Saved to Postgres">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Name"
              htmlFor="name"
              error={errors.name ? "Required" : undefined}
              className="sm:col-span-2"
            >
              <input
                id="name"
                {...register("name", { required: true })}
                placeholder="e.g. Bali"
                className={inputCls}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
            </Field>

            <Field label="Slug" htmlFor="slug" error={errors.slug?.message}>
              <input
                id="slug"
                {...register("slug", {
                  pattern: {
                    value: SLUG_PATTERN,
                    message:
                      "Slug must be lowercase letters, numbers, and hyphens only (no spaces or leading/trailing hyphen)",
                  },
                })}
                placeholder="auto-generated"
                className={inputCls}
                aria-invalid={!!errors.slug}
                aria-describedby={errors.slug ? "slug-error" : undefined}
                onChange={(e) => {
                  setSlugManual(true);
                  setValue("slug", e.target.value);
                }}
              />
            </Field>

            <Field
              label="Country"
              htmlFor="country"
              error={errors.country ? "Required" : undefined}
            >
              <input
                id="country"
                {...register("country", { required: true })}
                placeholder="e.g. Indonesia"
                className={inputCls}
                aria-invalid={!!errors.country}
                aria-describedby={errors.country ? "country-error" : undefined}
              />
            </Field>

            <Field label="Continent" htmlFor="continent">
              <select
                id="continent"
                {...register("continent")}
                className={selectCls}
              >
                {CONTINENTS.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Visa Type" htmlFor="visaType">
              <select
                id="visaType"
                {...register("visaType")}
                className={selectCls}
              >
                <option value="">Select visa type</option>
                {VISA_TYPES.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Currency" htmlFor="currency">
              <input
                id="currency"
                {...register("currency")}
                placeholder="e.g. IDR"
                className={inputCls}
              />
            </Field>

            <Field label="Language" htmlFor="language">
              <input
                id="language"
                {...register("language")}
                placeholder="e.g. Bahasa Indonesia"
                className={inputCls}
              />
            </Field>

            <div className="sm:col-span-2">
              <span
                id="imageUrl-label"
                className="block font-['DM_Sans'] text-xs text-(--color-text-secondary) mb-1.5"
              >
                Cover Image
              </span>
              <CloudinaryUpload
                folder="rapidluxe/destinations"
                currentUrl={watch("imageUrl")}
                onUpload={(url) => setValue("imageUrl", url)}
                onRemove={() => setValue("imageUrl", "")}
              />
            </div>
          </div>
        </SectionCard>

        {/* ── Gallery ── */}
        <SectionCard
          title="Gallery"
          subtitle="Additional photos shown on the destination page"
        >
          <div className="space-y-4">
            {images.fields.map((field, i) => (
              <div key={field.id} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-['JetBrains_Mono'] text-xs text-(--color-text-secondary)">
                    Image {i + 1}
                  </span>
                  {images.fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => images.remove(i)}
                      className="p-1 text-(--color-coral) hover:bg-(--color-coral)/10 rounded transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
                <CloudinaryUpload
                  folder="rapidluxe/destinations"
                  currentUrl={field.url}
                  onUpload={(url) => setValue(`images.${i}.url`, url)}
                  onRemove={() => setValue(`images.${i}.url`, "")}
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => images.append({ url: "" })}
            className="mt-3 inline-flex items-center gap-2 text-sm font-['DM_Sans'] text-(--color-gold) hover:text-(--color-gold)/80 transition-colors"
          >
            <Plus size={14} />
            Add Image
          </button>
        </SectionCard>

        {/* ── Postgres: Best Time ── */}
        <SectionCard
          title="Best Time to Visit"
          subtitle="Select all months that are ideal for visiting"
        >
          <Controller
            control={control}
            name="bestMonths"
            render={({ field }) => (
              <fieldset className="grid grid-cols-3 sm:grid-cols-4 gap-2 border-0 p-0 m-0">
                <legend className="sr-only">Best months to visit</legend>
                {MONTHS.map((m) => {
                  const checked = field.value.includes(m);
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() =>
                        field.onChange(
                          checked
                            ? field.value.filter((v) => v !== m)
                            : [...field.value, m],
                        )
                      }
                      className={`px-3 py-2 rounded-lg text-xs font-['DM_Sans'] font-medium border transition-colors ${
                        checked
                          ? "bg-(--color-gold) text-(--color-navy) border-(--color-gold)"
                          : "border-(--color-navy-border) text-(--color-text-secondary) hover:border-(--color-gold)/40"
                      }`}
                    >
                      {m}
                    </button>
                  );
                })}
              </fieldset>
            )}
          />
        </SectionCard>

        {/* ── Coordinates ── */}
        <SectionCard
          title="Coordinates"
          subtitle="Used for the interactive map on destination page"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Latitude" htmlFor="lat" error={errors.lat?.message}>
              <input
                id="lat"
                type="number"
                step={0.000001}
                {...register("lat", {
                  validate: (v) => {
                    if (!v) return true;
                    const n = Number(v);
                    return (
                      (n >= -90 && n <= 90) || "Must be between -90 and 90"
                    );
                  },
                })}
                placeholder="e.g. -8.4095"
                className={inputCls}
                aria-invalid={!!errors.lat}
                aria-describedby={errors.lat ? "lat-error" : undefined}
              />
            </Field>
            <Field label="Longitude" htmlFor="lng" error={errors.lng?.message}>
              <input
                id="lng"
                type="number"
                step={0.000001}
                {...register("lng", {
                  validate: (v) => {
                    if (!v) return true;
                    const n = Number(v);
                    return (
                      (n >= -180 && n <= 180) || "Must be between -180 and 180"
                    );
                  },
                })}
                placeholder="e.g. 115.1889"
                className={inputCls}
                aria-invalid={!!errors.lng}
                aria-describedby={errors.lng ? "lng-error" : undefined}
              />
            </Field>
          </div>
        </SectionCard>

        {/* ── Country Code ── */}
        <SectionCard
          title="Country Code"
          subtitle="ISO 3166-1 alpha-2 country code"
        >
          <Field label="Country Code" htmlFor="countryCode">
            <input
              id="countryCode"
              {...register("countryCode")}
              maxLength={2}
              placeholder="e.g. ID for Indonesia, CH for Switzerland"
              className={inputCls + " uppercase"}
              onChange={(e) =>
                setValue("countryCode", e.target.value.toUpperCase())
              }
            />
          </Field>
        </SectionCard>

        {/* ── Crowd Level ── */}
        <SectionCard
          title="Crowd Level"
          subtitle="Overall crowd level for this destination"
        >
          <Field label="Crowd Level" htmlFor="crowdLevel">
            <select
              id="crowdLevel"
              {...register("crowdLevel")}
              className={selectCls}
            >
              <option value="">Select crowd level</option>
              {DESTINATION_CROWD_LEVELS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
        </SectionCard>

        {/* ── Sanity: Editorial ── */}
        <SectionCard
          title="Editorial Content"
          subtitle="Saved to Sanity CMS — see docs/SANITY_CMS.md"
        >
          <div className="space-y-4">
            {/* Phase 2E: replace with Tiptap / PortableText editor */}
            <Field
              label="About (Phase 2E: replace with Tiptap / PortableText)"
              htmlFor="about"
            >
              <textarea
                id="about"
                {...register("about")}
                rows={6}
                placeholder="Describe this destination — culture, highlights, why it's special…"
                className={inputCls + " resize-y"}
              />
            </Field>

            {/* Phase 2E: replace with Tiptap / PortableText editor */}
            <Field
              label="Travel Tips (Phase 2E: replace with Tiptap / PortableText)"
              htmlFor="travelTips"
            >
              <textarea
                id="travelTips"
                {...register("travelTips")}
                rows={4}
                placeholder="Practical tips — best transport, cultural etiquette, packing list…"
                className={inputCls + " resize-y"}
              />
            </Field>
          </div>
        </SectionCard>

        {/* ── Sanity: SEO ── */}
        <SectionCard title="SEO" subtitle="Saved to Sanity CMS">
          <div className="space-y-4">
            <Field label="Meta Title" htmlFor="metaTitle">
              <input
                id="metaTitle"
                {...register("metaTitle")}
                placeholder="e.g. Bali Travel Packages | RapidLuxe"
                className={inputCls}
              />
            </Field>
            <Field label="Meta Description" htmlFor="metaDescription">
              <textarea
                id="metaDescription"
                {...register("metaDescription")}
                rows={2}
                placeholder="Short description for search engines…"
                className={inputCls + " resize-none"}
              />
            </Field>
          </div>
        </SectionCard>

        {/* ── When to Visit ── */}
        <div className="bg-(--color-navy-surface)/50 rounded-xl border border-(--color-navy-border) p-6 mt-6">
          <div className="mb-5">
            <h2 className="font-['DM_Sans'] text-xs font-semibold uppercase tracking-widest text-(--color-gold)">
              When to Visit (Monthly Data)
            </h2>
            <p className="font-['DM_Sans'] text-xs text-(--color-text-secondary) mt-1">
              Weather auto-populates from lat/lng after this destination is
              first saved — set Crowd/Recommendation manually for now, or leave
              blank and revisit after saving.
            </p>
          </div>
          <div className="space-y-3">
            {/* Header row */}
            <div className="hidden md:grid md:grid-cols-[100px_1fr_90px_110px] gap-3 items-center">
              <span className="font-['DM_Sans'] text-xs text-(--color-text-secondary) uppercase tracking-wide">
                Month
              </span>
              <span className="font-['DM_Sans'] text-xs text-(--color-text-secondary) uppercase tracking-wide">
                Crowd
              </span>
              <span className="font-['DM_Sans'] text-xs text-(--color-text-secondary) uppercase tracking-wide">
                Open
              </span>
              <span className="font-['DM_Sans'] text-xs text-(--color-text-secondary) uppercase tracking-wide">
                Recommended
              </span>
            </div>
            {MONTHS.map((month, i) => (
              <div
                key={month}
                className="grid grid-cols-1 md:grid-cols-[100px_1fr_90px_110px] gap-3 items-center border border-(--color-navy-border)/50 rounded-lg p-3 md:border-0 md:p-0"
              >
                <span className="font-['DM_Sans'] text-sm text-white font-medium">
                  {month}
                </span>
                <Controller
                  control={control}
                  name={`whenToVisit.${i}.crowdLevel`}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        aria-label={`${month} crowd level`}
                        className="bg-(--color-navy) border-(--color-navy-border) text-sm font-['DM_Sans'] text-white focus:ring-(--color-gold)/40"
                      >
                        <SelectValue placeholder="Crowd..." />
                      </SelectTrigger>
                      <SelectContent className="bg-(--color-navy-surface) border-(--color-navy-border)">
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <div className="flex items-center gap-2 md:justify-center">
                  <span className="font-['DM_Sans'] text-xs text-(--color-text-secondary) md:hidden">
                    Open
                  </span>
                  <Controller
                    control={control}
                    name={`whenToVisit.${i}.availability`}
                    render={({ field }) => (
                      <ToggleSwitch
                        checked={field.value === "Open"}
                        ariaLabel={`${month} open`}
                        onChange={(checked) =>
                          field.onChange(checked ? "Open" : "Closed")
                        }
                      />
                    )}
                  />
                </div>
                <div className="flex items-center gap-2 md:justify-center">
                  <span className="font-['DM_Sans'] text-xs text-(--color-text-secondary) md:hidden">
                    Recommended
                  </span>
                  <Controller
                    control={control}
                    name={`whenToVisit.${i}.recommendation`}
                    render={({ field }) => (
                      <ToggleSwitch
                        checked={field.value === "Recommended"}
                        ariaLabel={`${month} recommended`}
                        onChange={(checked) =>
                          field.onChange(
                            checked ? "Recommended" : "Not recommended",
                          )
                        }
                      />
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── How to Get There ── */}
        <div className="bg-(--color-navy-surface)/50 rounded-xl border border-(--color-navy-border) p-6 mt-6">
          <div className="mb-5">
            <h2 className="font-['DM_Sans'] text-xs font-semibold uppercase tracking-widest text-(--color-gold)">
              Transport Options (How to Get There)
            </h2>
          </div>
          <div className="space-y-2">
            {transport.fields.map((field, i) => (
              <div
                key={field.id}
                className="flex gap-3 items-start bg-(--color-navy-border)/30 rounded-lg p-3"
              >
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    {...register(`howToGetThere.${i}.name`)}
                    placeholder="Mode name (e.g. Grab, Metro)"
                    className={inputCls}
                  />
                  <div className="flex items-center gap-3 sm:justify-end">
                    <span className="font-['DM_Sans'] text-xs text-(--color-text-secondary) whitespace-nowrap">
                      Recommended
                    </span>
                    <Controller
                      control={control}
                      name={`howToGetThere.${i}.recommended`}
                      render={({ field: f }) => (
                        <ToggleSwitch checked={f.value} onChange={f.onChange} />
                      )}
                    />
                  </div>
                  <textarea
                    {...register(`howToGetThere.${i}.description`)}
                    rows={2}
                    placeholder="Short description of this transport option…"
                    className={`${inputCls} resize-none sm:col-span-2`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => transport.remove(i)}
                  className="shrink-0 p-1.5 text-(--color-text-secondary) hover:text-(--color-coral) transition-colors mt-0.5"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() =>
              transport.append({
                name: "",
                description: "",
                recommended: false,
              })
            }
            className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-(--color-coral)/60 text-(--color-coral) text-sm font-['DM_Sans'] font-medium hover:bg-(--color-coral)/10 transition-colors"
          >
            <Plus size={14} />
            Add Transport Option
          </button>
        </div>

        {/* ── Actions ── */}
        <div className="flex flex-wrap gap-3 pb-8">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit(onSubmit)()}
            className="px-6 py-2.5 rounded-lg border border-(--color-navy-border) text-(--color-white-muted) font-['DM_Sans'] text-sm font-medium hover:border-(--color-gold)/40 hover:text-white transition-colors disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-lg bg-(--color-gold) text-(--color-navy) font-['DM_Sans'] text-sm font-bold hover:bg-(--color-gold)/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Saving…" : "Publish"}
          </button>
        </div>
      </form>
    </div>
  );
}
