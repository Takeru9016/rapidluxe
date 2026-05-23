// This form dual-writes to Postgres in Phase 2F
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

import { generateSlug } from "@/lib/utils";
import { dummyDestinations } from "@/lib/dummy/destinations";
import type { PackageStatus } from "@/types/package";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ItineraryDayForm {
  day: number;
  title: string;
  description: string;
  meals: { breakfast: boolean; lunch: boolean; dinner: boolean };
}

interface HotelForm {
  name: string;
  stars: number;
  location: string;
  imageUrl: string;
  included: boolean;
}

interface ActivityForm {
  name: string;
  duration: string;
  included: boolean;
  price: number;
}

interface CancellationRow {
  daysBeforeDeparture: number;
  refundPercent: number;
}

interface PackageFormValues {
  title: string;
  slug: string;
  status: PackageStatus;
  destinationId: string;
  country: string;
  durationNights: number;
  minGroupSize: number;
  maxGroupSize: number;
  pricePerPerson: number;
  originalPrice: number;
  description: string;
  images: { url: string }[];
  itinerary: ItineraryDayForm[];
  hotels: HotelForm[];
  activities: ActivityForm[];
  inclusions: { value: string }[];
  exclusions: { value: string }[];
  tags: string[];
  cancellationPolicy: CancellationRow[];
  metaTitle: string;
  metaDescription: string;
  isFeatured: boolean;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const ALL_TAGS = [
  "Luxury",
  "Honeymoon",
  "Beach",
  "Adventure",
  "Family",
  "Budget",
  "Cultural",
];

const DEFAULT_CANCELLATION: CancellationRow[] = [
  { daysBeforeDeparture: 30, refundPercent: 90 },
  { daysBeforeDeparture: 15, refundPercent: 50 },
  { daysBeforeDeparture: 0, refundPercent: 0 },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

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

export default function NewPackagePage() {
  const [slugManual, setSlugManual] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<PackageFormValues>({
    defaultValues: {
      title: "",
      slug: "",
      status: "DRAFT",
      destinationId: "",
      country: "",
      durationNights: 7,
      minGroupSize: 1,
      maxGroupSize: 12,
      pricePerPerson: 0,
      originalPrice: 0,
      description: "",
      images: [{ url: "" }],
      itinerary: [
        {
          day: 1,
          title: "",
          description: "",
          meals: { breakfast: false, lunch: false, dinner: false },
        },
      ],
      hotels: [
        { name: "", stars: 5, location: "", imageUrl: "", included: true },
      ],
      activities: [
        { name: "", duration: "", included: true, price: 0 },
      ],
      inclusions: [{ value: "" }],
      exclusions: [{ value: "" }],
      tags: [],
      cancellationPolicy: DEFAULT_CANCELLATION,
      metaTitle: "",
      metaDescription: "",
      isFeatured: false,
    },
  });

  // ── Field arrays ──────────────────────────────────────────────────────────

  const images = useFieldArray({ control, name: "images" });
  const itinerary = useFieldArray({ control, name: "itinerary" });
  const hotels = useFieldArray({ control, name: "hotels" });
  const activities = useFieldArray({ control, name: "activities" });
  const inclusions = useFieldArray({ control, name: "inclusions" });
  const exclusions = useFieldArray({ control, name: "exclusions" });
  const cancellation = useFieldArray({ control, name: "cancellationPolicy" });

  // ── Auto-slug ─────────────────────────────────────────────────────────────

  const title = watch("title");
  useEffect(() => {
    if (!slugManual && title) {
      setValue("slug", generateSlug(title), { shouldDirty: false });
    }
  }, [title, slugManual, setValue]);

  // ── Tags toggle ───────────────────────────────────────────────────────────

  const selectedTags = watch("tags");
  const toggleTag = (tag: string) => {
    const current = selectedTags ?? [];
    setValue(
      "tags",
      current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag],
    );
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const onSubmit: SubmitHandler<PackageFormValues> = (data) => {
    console.log(data);
  };

  const onSaveDraft = () => {
    setValue("status", "DRAFT");
    handleSubmit(onSubmit)();
  };

  const onPublish = () => {
    setValue("status", "PUBLISHED");
    handleSubmit(onSubmit)();
  };

  // ── Destination → country auto-fill ──────────────────────────────────────

  const destId = watch("destinationId");
  useEffect(() => {
    const dest = dummyDestinations.find((d) => d.id === destId);
    if (dest) setValue("country", dest.country);
  }, [destId, setValue]);

  return (
    <div className="px-4 md:px-8 py-6 max-w-4xl mx-auto">
      {/* Back */}
      <Link
        href="/admin/packages"
        className="inline-flex items-center gap-2 text-sm font-['DM_Sans'] text-(--color-text-secondary) hover:text-(--color-gold) transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        Back to Packages
      </Link>

      <h1 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white mb-8">
        New Package
      </h1>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

        {/* ── Basic Info ── */}
        <SectionCard title="Basic Info">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Title" className="md:col-span-2">
              <input
                {...register("title", { required: true })}
                placeholder="e.g. Bali Serenity Escape"
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

            <Field label="Status">
              <select {...register("status")} className={selectCls}>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </Field>
          </div>
        </SectionCard>

        {/* ── Location ── */}
        <SectionCard title="Location">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Destination">
              <select {...register("destinationId")} className={selectCls}>
                <option value="">Select destination</option>
                {dummyDestinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Country">
              <input
                {...register("country")}
                placeholder="e.g. Indonesia"
                className={inputCls}
              />
            </Field>
          </div>
        </SectionCard>

        {/* ── Duration ── */}
        <SectionCard title="Duration & Group Size">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Nights">
              <input
                type="number"
                min={1}
                {...register("durationNights", { valueAsNumber: true })}
                className={inputCls}
              />
            </Field>
            <Field label="Min Group Size">
              <input
                type="number"
                min={1}
                {...register("minGroupSize", { valueAsNumber: true })}
                className={inputCls}
              />
            </Field>
            <Field label="Max Group Size">
              <input
                type="number"
                min={1}
                {...register("maxGroupSize", { valueAsNumber: true })}
                className={inputCls}
              />
            </Field>
          </div>
        </SectionCard>

        {/* ── Pricing ── */}
        <SectionCard title="Pricing">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Price per Person (₹)">
              <input
                type="number"
                min={0}
                {...register("pricePerPerson", { valueAsNumber: true })}
                className={inputCls}
              />
            </Field>
            <Field label="Original Price (₹) — for discount display">
              <input
                type="number"
                min={0}
                {...register("originalPrice", { valueAsNumber: true })}
                className={inputCls}
              />
            </Field>
          </div>
        </SectionCard>

        {/* ── Description ── */}
        <SectionCard title="Description">
          <Field label="Description (→ Phase 2E: Tiptap)">
            <textarea
              {...register("description")}
              rows={5}
              placeholder="Describe the package experience…"
              className={inputCls + " resize-y"}
            />
          </Field>
        </SectionCard>

        {/* ── Images ── */}
        <SectionCard title="Images">
          <div className="space-y-2">
            {images.fields.map((field, i) => (
              <div key={field.id} className="flex gap-2">
                <input
                  {...register(`images.${i}.url`)}
                  placeholder="https://..."
                  className={inputCls}
                />
                {images.fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => images.remove(i)}
                    className="shrink-0 p-2 text-(--color-coral) hover:bg-(--color-coral)/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
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

        {/* ── Itinerary ── */}
        <SectionCard title="Itinerary">
          <div className="space-y-4">
            {itinerary.fields.map((field, i) => (
              <div
                key={field.id}
                className="border border-(--color-navy-border) rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-['JetBrains_Mono'] text-xs text-(--color-gold)">
                    Day {i + 1}
                  </span>
                  {itinerary.fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => itinerary.remove(i)}
                      className="text-(--color-coral) hover:opacity-80 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <input type="hidden" {...register(`itinerary.${i}.day`)} value={i + 1} />
                <Field label="Title">
                  <input
                    {...register(`itinerary.${i}.title`)}
                    placeholder="e.g. Arrival & Welcome"
                    className={inputCls}
                  />
                </Field>
                <Field label="Description">
                  <textarea
                    {...register(`itinerary.${i}.description`)}
                    rows={2}
                    placeholder="What happens this day…"
                    className={inputCls + " resize-none"}
                  />
                </Field>
                <div>
                  <p className="font-['DM_Sans'] text-xs text-(--color-text-secondary) mb-2">
                    Meals
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {(["breakfast", "lunch", "dinner"] as const).map((meal) => (
                      <label
                        key={meal}
                        className="flex items-center gap-2 text-sm font-['DM_Sans'] text-(--color-white-muted) cursor-pointer capitalize"
                      >
                        <input
                          type="checkbox"
                          {...register(`itinerary.${i}.meals.${meal}`)}
                          className="accent-(--color-gold)"
                        />
                        {meal}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() =>
              itinerary.append({
                day: itinerary.fields.length + 1,
                title: "",
                description: "",
                meals: { breakfast: false, lunch: false, dinner: false },
              })
            }
            className="mt-3 inline-flex items-center gap-2 text-sm font-['DM_Sans'] text-(--color-gold) hover:text-(--color-gold)/80 transition-colors"
          >
            <Plus size={14} />
            Add Day
          </button>
        </SectionCard>

        {/* ── Hotels ── */}
        <SectionCard title="Hotels">
          <div className="space-y-4">
            {hotels.fields.map((field, i) => (
              <div
                key={field.id}
                className="border border-(--color-navy-border) rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-['JetBrains_Mono'] text-xs text-(--color-gold)">
                    Hotel {i + 1}
                  </span>
                  {hotels.fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => hotels.remove(i)}
                      className="text-(--color-coral) hover:opacity-80 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Hotel Name">
                    <input {...register(`hotels.${i}.name`)} placeholder="e.g. Four Seasons" className={inputCls} />
                  </Field>
                  <Field label="Stars">
                    <select {...register(`hotels.${i}.stars`, { valueAsNumber: true })} className={selectCls}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <option key={s} value={s}>{s} ★</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Location">
                    <input {...register(`hotels.${i}.location`)} placeholder="e.g. Ubud, Bali" className={inputCls} />
                  </Field>
                  <Field label="Image URL">
                    <input {...register(`hotels.${i}.imageUrl`)} placeholder="https://..." className={inputCls} />
                  </Field>
                </div>
                <label className="flex items-center gap-2 text-sm font-['DM_Sans'] text-(--color-white-muted) cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    {...register(`hotels.${i}.included`)}
                    className="accent-(--color-gold)"
                  />
                  Included in package
                </label>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() =>
              hotels.append({ name: "", stars: 5, location: "", imageUrl: "", included: true })
            }
            className="mt-3 inline-flex items-center gap-2 text-sm font-['DM_Sans'] text-(--color-gold) hover:text-(--color-gold)/80 transition-colors"
          >
            <Plus size={14} />
            Add Hotel
          </button>
        </SectionCard>

        {/* ── Activities ── */}
        <SectionCard title="Activities">
          <div className="space-y-3">
            {activities.fields.map((field, i) => (
              <div
                key={field.id}
                className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-3 items-end border border-(--color-navy-border) rounded-lg p-3"
              >
                <Field label="Activity Name">
                  <input {...register(`activities.${i}.name`)} placeholder="e.g. Snorkelling" className={inputCls} />
                </Field>
                <Field label="Duration">
                  <input {...register(`activities.${i}.duration`)} placeholder="2 hrs" className={inputCls} />
                </Field>
                <Field label="Price (₹) if not incl.">
                  <input
                    type="number"
                    min={0}
                    {...register(`activities.${i}.price`, { valueAsNumber: true })}
                    className={inputCls}
                  />
                </Field>
                <div className="flex items-center gap-3 pb-2.5">
                  <label className="flex items-center gap-1.5 text-xs font-['DM_Sans'] text-(--color-white-muted) cursor-pointer whitespace-nowrap">
                    <input
                      type="checkbox"
                      defaultChecked
                      {...register(`activities.${i}.included`)}
                      className="accent-(--color-gold)"
                    />
                    Included
                  </label>
                  {activities.fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => activities.remove(i)}
                      className="text-(--color-coral) hover:opacity-80 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => activities.append({ name: "", duration: "", included: true, price: 0 })}
            className="mt-3 inline-flex items-center gap-2 text-sm font-['DM_Sans'] text-(--color-gold) hover:text-(--color-gold)/80 transition-colors"
          >
            <Plus size={14} />
            Add Activity
          </button>
        </SectionCard>

        {/* ── Inclusions / Exclusions ── */}
        <SectionCard title="Inclusions & Exclusions">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Inclusions */}
            <div>
              <p className="font-['DM_Sans'] text-xs font-medium text-(--color-teal) uppercase tracking-widest mb-3">
                Inclusions
              </p>
              <div className="space-y-2">
                {inclusions.fields.map((field, i) => (
                  <div key={field.id} className="flex gap-2">
                    <input
                      {...register(`inclusions.${i}.value`)}
                      placeholder="e.g. Airport transfers"
                      className={inputCls}
                    />
                    {inclusions.fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => inclusions.remove(i)}
                        className="shrink-0 p-2 text-(--color-coral) hover:bg-(--color-coral)/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => inclusions.append({ value: "" })}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-['DM_Sans'] text-(--color-gold) hover:opacity-80 transition-opacity"
              >
                <Plus size={12} />
                Add
              </button>
            </div>

            {/* Exclusions */}
            <div>
              <p className="font-['DM_Sans'] text-xs font-medium text-(--color-coral) uppercase tracking-widest mb-3">
                Exclusions
              </p>
              <div className="space-y-2">
                {exclusions.fields.map((field, i) => (
                  <div key={field.id} className="flex gap-2">
                    <input
                      {...register(`exclusions.${i}.value`)}
                      placeholder="e.g. International flights"
                      className={inputCls}
                    />
                    {exclusions.fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => exclusions.remove(i)}
                        className="shrink-0 p-2 text-(--color-coral) hover:bg-(--color-coral)/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => exclusions.append({ value: "" })}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-['DM_Sans'] text-(--color-coral) hover:opacity-80 transition-opacity"
              >
                <Plus size={12} />
                Add
              </button>
            </div>
          </div>
        </SectionCard>

        {/* ── Tags ── */}
        <SectionCard title="Tags">
          <div className="flex flex-wrap gap-2">
            {ALL_TAGS.map((tag) => {
              const active = selectedTags?.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-sm font-['DM_Sans'] border transition-colors ${
                    active
                      ? "border-(--color-gold) bg-(--color-gold)/10 text-(--color-gold)"
                      : "border-(--color-navy-border) text-(--color-text-secondary) hover:border-(--color-gold)/40"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </SectionCard>

        {/* ── Cancellation Policy ── */}
        <SectionCard title="Cancellation Policy">
          <div className="space-y-3">
            {cancellation.fields.map((field, i) => (
              <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end">
                <Field label="Days Before Departure">
                  <input
                    type="number"
                    min={0}
                    {...register(`cancellationPolicy.${i}.daysBeforeDeparture`, { valueAsNumber: true })}
                    className={inputCls}
                  />
                </Field>
                <Field label="Refund %">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    {...register(`cancellationPolicy.${i}.refundPercent`, { valueAsNumber: true })}
                    className={inputCls}
                  />
                </Field>
                {cancellation.fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => cancellation.remove(i)}
                    className="pb-2.5 text-(--color-coral) hover:opacity-80 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() =>
              cancellation.append({ daysBeforeDeparture: 0, refundPercent: 0 })
            }
            className="mt-3 inline-flex items-center gap-2 text-sm font-['DM_Sans'] text-(--color-gold) hover:opacity-80 transition-opacity"
          >
            <Plus size={14} />
            Add Row
          </button>
        </SectionCard>

        {/* ── SEO ── */}
        <SectionCard title="SEO">
          <div className="space-y-4">
            <Field label="Meta Title">
              <input
                {...register("metaTitle")}
                placeholder="e.g. Bali Serenity Escape | RapidLuxe"
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

        {/* ── Featured ── */}
        <SectionCard title="Featured">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register("isFeatured")}
              className="w-4 h-4 accent-(--color-gold)"
            />
            <span className="font-['DM_Sans'] text-sm text-(--color-white-muted)">
              Show this package on the homepage featured section
            </span>
          </label>
        </SectionCard>

        {/* ── Actions ── */}
        <div className="flex flex-wrap gap-3 pb-8">
          <button
            type="button"
            onClick={onSaveDraft}
            className="px-6 py-2.5 rounded-lg border border-(--color-navy-border) text-(--color-white-muted) font-['DM_Sans'] text-sm font-medium hover:border-(--color-gold)/40 hover:text-white transition-colors"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={onPublish}
            className="px-6 py-2.5 rounded-lg bg-(--color-gold) text-(--color-navy) font-['DM_Sans'] text-sm font-bold hover:bg-(--color-gold)/90 transition-colors"
          >
            Publish
          </button>
        </div>

      </form>
    </div>
  );
}
