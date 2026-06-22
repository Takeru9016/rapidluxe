"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import {
  Controller,
  type SubmitHandler,
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
import { generateSlug } from "@/lib/utils";
import type {
  AvailabilityStatus,
  Continent,
  CrowdLevel,
  DestinationCrowdLevel,
  VisaType,
} from "@/types/destination";

// ── Types ─────────────────────────────────────────────────────────────────────

interface WhenToVisitRow {
  crowdLevel: CrowdLevel | "";
  weather: string;
  availability: AvailabilityStatus | "";
  recommended: boolean;
}

interface TransportRow {
  name: string;
  description: string;
  recommended: boolean;
}

interface DestinationFormValues {
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
  lat: string;
  lng: string;
  countryCode: string;
  crowdLevel: DestinationCrowdLevel | "";
  about: string;
  travelTips: string;
  metaTitle: string;
  metaDescription: string;
  whenToVisit: WhenToVisitRow[];
  howToGetThere: TransportRow[];
}

interface DestinationData {
  id: string;
  name: string;
  slug: string;
  country: string;
  continent: Continent;
  imageUrl: string | null;
  bestTimeFrom: string | null;
  bestTimeTo: string | null;
  visaType: string | null;
  currency: string | null;
  language: string | null;
  lat: number | null;
  lng: number | null;
  countryCode: string | null;
  crowdLevel: string | null;
  whenToVisit: WhenToVisitRow[] | null;
  howToGetThere: TransportRow[] | null;
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

const EMPTY_WHEN_TO_VISIT: WhenToVisitRow[] = MONTHS.map(() => ({
  crowdLevel: "" as CrowdLevel | "",
  weather: "",
  availability: "" as AvailabilityStatus | "",
  recommended: false,
}));

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

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
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

export default function EditDestinationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [slugManual, setSlugManual] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading, isError } = useQuery<{ data: DestinationData }>({
    queryKey: ["admin-destination", id],
    queryFn: async () => {
      const res = await fetch(`/api/admin/destinations/${id}`);
      if (!res.ok) throw new Error("Failed to fetch destination");
      return res.json() as Promise<{ data: DestinationData }>;
    },
  });

  const dest = data?.data;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    reset,
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
      lat: "",
      lng: "",
      countryCode: "",
      crowdLevel: "",
      about: "",
      travelTips: "",
      metaTitle: "",
      metaDescription: "",
      whenToVisit: EMPTY_WHEN_TO_VISIT,
      howToGetThere: [],
    },
  });

  useEffect(() => {
    if (!dest) return;
    reset({
      name: dest.name,
      slug: dest.slug,
      country: dest.country,
      continent: dest.continent,
      imageUrl: dest.imageUrl ?? "",
      bestTimeFrom: dest.bestTimeFrom ?? "",
      bestTimeTo: dest.bestTimeTo ?? "",
      visaType: (dest.visaType as VisaType | "") ?? "",
      currency: dest.currency ?? "",
      language: dest.language ?? "",
      lat: dest.lat !== null && dest.lat !== undefined ? String(dest.lat) : "",
      lng: dest.lng !== null && dest.lng !== undefined ? String(dest.lng) : "",
      countryCode: dest.countryCode ?? "",
      crowdLevel: (dest.crowdLevel as DestinationCrowdLevel | "") ?? "",
      about: "",
      travelTips: "",
      metaTitle: "",
      metaDescription: "",
      whenToVisit: dest.whenToVisit ?? EMPTY_WHEN_TO_VISIT,
      howToGetThere: dest.howToGetThere ?? [],
    });
  }, [dest, reset]);

  const transport = useFieldArray({ control, name: "howToGetThere" });

  const name = watch("name");
  useEffect(() => {
    if (!slugManual && name) {
      setValue("slug", generateSlug(name), { shouldDirty: false });
    }
  }, [name, slugManual, setValue]);

  const onSubmit: SubmitHandler<DestinationFormValues> = async (formData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/destinations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          country: formData.country,
          continent: formData.continent,
          imageUrl: formData.imageUrl || undefined,
          bestTimeFrom: formData.bestTimeFrom || undefined,
          bestTimeTo: formData.bestTimeTo || undefined,
          visaType: formData.visaType || undefined,
          currency: formData.currency || undefined,
          language: formData.language || undefined,
          lat: formData.lat ? Number(formData.lat) : undefined,
          lng: formData.lng ? Number(formData.lng) : undefined,
          countryCode: formData.countryCode || undefined,
          crowdLevel: formData.crowdLevel || undefined,
          whenToVisit: formData.whenToVisit,
          howToGetThere: formData.howToGetThere,
          about: formData.about || undefined,
          travelTips: formData.travelTips || undefined,
          metaTitle: formData.metaTitle || undefined,
          metaDescription: formData.metaDescription || undefined,
        }),
      });
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error ?? "Failed to update destination");
      }
      toast.success("Destination updated.");
      router.push("/admin/destinations");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="px-4 md:px-8 py-6">
        <div className="py-12 text-center font-['DM_Sans'] text-sm text-(--color-text-secondary)">
          Loading…
        </div>
      </div>
    );
  }

  if (isError || !dest) {
    notFound();
  }

  return (
    <div className="px-4 md:px-8 py-6 max-w-3xl mx-auto">
      <Link
        href="/admin/destinations"
        className="inline-flex items-center gap-2 text-sm font-['DM_Sans'] text-(--color-text-secondary) hover:text-(--color-gold) transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        Back to Destinations
      </Link>

      <h1 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white mb-8">
        Edit Destination
      </h1>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* ── Core Fields ── */}
        <SectionCard title="Core Details" subtitle="Saved to Postgres">
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

            <div className="sm:col-span-2">
              <label className="block font-['DM_Sans'] text-xs text-(--color-text-secondary) mb-1.5">
                Cover Image
              </label>
              <CloudinaryUpload
                folder="rapidluxe/destinations"
                currentUrl={watch("imageUrl")}
                onUpload={(url) => setValue("imageUrl", url)}
              />
            </div>
          </div>
        </SectionCard>

        {/* ── Best Time ── */}
        <SectionCard title="Best Time to Visit" subtitle="Saved to Postgres">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="From Month">
              <select {...register("bestTimeFrom")} className={selectCls}>
                <option value="">Select month</option>
                {MONTHS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="To Month">
              <select {...register("bestTimeTo")} className={selectCls}>
                <option value="">Select month</option>
                {MONTHS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </SectionCard>

        {/* ── Coordinates ── */}
        <SectionCard
          title="Coordinates"
          subtitle="Used for the interactive map on destination page"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Latitude">
              <input
                type="number"
                step={0.000001}
                {...register("lat")}
                placeholder="e.g. -8.4095"
                className={inputCls}
              />
            </Field>
            <Field label="Longitude">
              <input
                type="number"
                step={0.000001}
                {...register("lng")}
                placeholder="e.g. 115.1889"
                className={inputCls}
              />
            </Field>
          </div>
        </SectionCard>

        {/* ── Country Code ── */}
        <SectionCard
          title="Country Code"
          subtitle="ISO 3166-1 alpha-2 country code"
        >
          <Field label="Country Code">
            <input
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
          <Field label="Crowd Level">
            <select {...register("crowdLevel")} className={selectCls}>
              <option value="">Select crowd level</option>
              {DESTINATION_CROWD_LEVELS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
        </SectionCard>

        {/* ── Editorial ── */}
        <SectionCard title="Editorial Content" subtitle="Saved to Sanity CMS">
          <div className="space-y-4">
            <Field label="About">
              <textarea
                {...register("about")}
                rows={6}
                placeholder="Describe this destination — culture, highlights, why it's special…"
                className={inputCls + " resize-y"}
              />
            </Field>
            <Field label="Travel Tips">
              <textarea
                {...register("travelTips")}
                rows={4}
                placeholder="Practical tips — best transport, cultural etiquette, packing list…"
                className={inputCls + " resize-y"}
              />
            </Field>
          </div>
        </SectionCard>

        {/* ── SEO ── */}
        <SectionCard title="SEO" subtitle="Saved to Sanity CMS">
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

        {/* ── When to Visit ── */}
        <div className="bg-(--color-navy-surface)/50 rounded-xl border border-(--color-navy-border) p-6 mt-6">
          <div className="mb-5">
            <h2 className="font-['DM_Sans'] text-xs font-semibold uppercase tracking-widest text-(--color-gold)">
              When to Visit (Monthly Data)
            </h2>
          </div>
          <div className="space-y-3">
            <div className="hidden md:grid md:grid-cols-[100px_1fr_2fr_1fr_80px] gap-3 items-center">
              <span className="font-['DM_Sans'] text-xs text-(--color-text-secondary) uppercase tracking-wide">
                Month
              </span>
              <span className="font-['DM_Sans'] text-xs text-(--color-text-secondary) uppercase tracking-wide">
                Crowd
              </span>
              <span className="font-['DM_Sans'] text-xs text-(--color-text-secondary) uppercase tracking-wide">
                Weather Note
              </span>
              <span className="font-['DM_Sans'] text-xs text-(--color-text-secondary) uppercase tracking-wide">
                Availability
              </span>
              <span className="font-['DM_Sans'] text-xs text-(--color-text-secondary) uppercase tracking-wide">
                Rec.
              </span>
            </div>
            {MONTHS.map((month, i) => (
              <div
                key={month}
                className="grid grid-cols-1 md:grid-cols-[100px_1fr_2fr_1fr_80px] gap-3 items-center border border-(--color-navy-border)/50 rounded-lg p-3 md:border-0 md:p-0"
              >
                <span className="font-['DM_Sans'] text-sm text-white font-medium">
                  {month}
                </span>
                <Controller
                  control={control}
                  name={`whenToVisit.${i}.crowdLevel`}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-(--color-navy) border-(--color-navy-border) text-sm font-['DM_Sans'] text-white focus:ring-(--color-gold)/40">
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
                <input
                  {...register(`whenToVisit.${i}.weather`)}
                  placeholder="e.g. 28–34°C, expect rain"
                  className={inputCls}
                />
                <Controller
                  control={control}
                  name={`whenToVisit.${i}.availability`}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-(--color-navy) border-(--color-navy-border) text-sm font-['DM_Sans'] text-white focus:ring-(--color-gold)/40">
                        <SelectValue placeholder="Avail..." />
                      </SelectTrigger>
                      <SelectContent className="bg-(--color-navy-surface) border-(--color-navy-border)">
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="Limited">Limited</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <div className="flex items-center gap-2 md:justify-center">
                  <span className="font-['DM_Sans'] text-xs text-(--color-text-secondary) md:hidden">
                    Recommended
                  </span>
                  <Controller
                    control={control}
                    name={`whenToVisit.${i}.recommended`}
                    render={({ field }) => (
                      <ToggleSwitch
                        checked={field.value}
                        onChange={field.onChange}
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
          <Link
            href="/admin/destinations"
            className="px-6 py-2.5 rounded-lg border border-(--color-navy-border) text-(--color-white-muted) font-['DM_Sans'] text-sm font-medium hover:border-(--color-gold)/40 hover:text-white transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-lg bg-(--color-gold) text-(--color-navy) font-['DM_Sans'] text-sm font-bold hover:bg-(--color-gold)/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
