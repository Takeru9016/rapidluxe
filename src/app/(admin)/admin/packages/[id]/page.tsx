// This form dual-writes to Postgres in Phase 2F
"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
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
import { generateSlug } from "@/lib/utils";
import type { AttributeQuality, PackageStatus } from "@/types/package";

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

interface AttributeRow {
  quality: AttributeQuality | "";
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
  childPrice?: number;
  infantPrice?: number;
  toursPrice?: number;
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
  attributes: AttributeRow[];
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

const ATTRIBUTE_LABELS = [
  "Public Transport Access",
  "Proximity to Attractions",
  "Walkability",
  "Neighbourhood Vibrancy",
  "Safety",
] as const;

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
// errors, so a validation failure the client didn't already catch (numeric
// bounds, URL format, etc.) still surfaces next to the field that caused it.
function applyServerErrors(
  details: unknown,
  setError: UseFormSetError<PackageFormValues>,
) {
  if (!Array.isArray(details)) return;
  for (const issue of details) {
    if (typeof issue !== "object" || issue === null) continue;
    const path = (issue as { path?: (string | number)[] }).path;
    const message = (issue as { message?: string }).message;
    if (!path || path.length === 0 || !message) continue;
    setError(path.join(".") as FieldPath<PackageFormValues>, {
      type: "server",
      message,
    });
  }
}

const inputCls =
  "w-full bg-(--color-navy) border border-(--color-navy-border) rounded-lg px-3 py-2.5 text-sm font-['DM_Sans'] text-white placeholder:text-(--color-text-secondary) focus:outline-none focus:border-(--color-gold)/60 transition-colors";

const selectCls = inputCls + " cursor-pointer";

// ── Page ──────────────────────────────────────────────────────────────────────

interface DestOption {
  id: string;
  name: string;
  country: string;
}

interface DbPackage {
  id: string;
  title: string;
  slug: string;
  status: PackageStatus;
  destinationId: string;
  description: string;
  durationNights: number;
  minGroupSize: number;
  maxGroupSize: number;
  pricePerPerson: number;
  originalPrice: number | null;
  childPrice: number | null;
  infantPrice: number | null;
  toursPrice: number | null;
  images: string[];
  itinerary: Array<{
    day: number;
    title: string;
    description: string;
    meals: string[];
  }>;
  hotels: Array<{
    name: string;
    stars: number;
    location: string;
    imageUrl: string;
    included: boolean;
  }>;
  activities: Array<{
    name: string;
    duration: string;
    included: boolean;
    price?: number;
  }>;
  inclusions: string[];
  exclusions: string[];
  tags: string[];
  cancellationPolicy: Array<{
    daysBeforeDeparture: number;
    refundPercent: number;
  }> | null;
  metaTitle: string | null;
  metaDescription: string | null;
  isFeatured: boolean;
  attributes: Array<{ label: string; quality: AttributeQuality }> | null;
}

export default function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [slugManual, setSlugManual] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: pkgData,
    isLoading: pkgLoading,
    isError,
  } = useQuery<{ data: DbPackage }>({
    queryKey: ["admin-package", id],
    queryFn: async () => {
      const res = await fetch(`/api/admin/packages/${id}`);
      if (!res.ok) throw new Error("Not found");
      return res.json() as Promise<{ data: DbPackage }>;
    },
  });

  const { data: destData } = useQuery<{ data: DestOption[] }>({
    queryKey: ["destinations-for-select"],
    queryFn: async () => {
      const res = await fetch("/api/destinations");
      if (!res.ok) throw new Error("Failed");
      return res.json() as Promise<{ data: DestOption[] }>;
    },
  });
  const destinations = destData?.data ?? [];

  const pkg = pkgData?.data;

  if (isError) notFound();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    reset,
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
      activities: [{ name: "", duration: "", included: true, price: 0 }],
      inclusions: [{ value: "" }],
      exclusions: [{ value: "" }],
      tags: [],
      cancellationPolicy: DEFAULT_CANCELLATION,
      metaTitle: "",
      metaDescription: "",
      isFeatured: false,
      attributes: ATTRIBUTE_LABELS.map(() => ({ quality: "" as const })),
    },
  });

  useEffect(() => {
    if (!pkg) return;
    reset({
      title: pkg.title,
      slug: pkg.slug,
      status: pkg.status,
      destinationId: pkg.destinationId,
      country: "",
      durationNights: pkg.durationNights,
      minGroupSize: pkg.minGroupSize,
      maxGroupSize: pkg.maxGroupSize,
      pricePerPerson: pkg.pricePerPerson,
      originalPrice: pkg.originalPrice ?? 0,
      childPrice: pkg.childPrice ?? undefined,
      infantPrice: pkg.infantPrice ?? undefined,
      toursPrice: pkg.toursPrice ?? undefined,
      description: pkg.description,
      images:
        pkg.images.length > 0
          ? pkg.images.map((url) => ({ url }))
          : [{ url: "" }],
      itinerary:
        pkg.itinerary.length > 0
          ? pkg.itinerary.map((d) => ({
              day: d.day,
              title: d.title,
              description: d.description,
              meals: {
                breakfast: d.meals.includes("Breakfast"),
                lunch: d.meals.includes("Lunch"),
                dinner: d.meals.includes("Dinner"),
              },
            }))
          : [
              {
                day: 1,
                title: "",
                description: "",
                meals: { breakfast: false, lunch: false, dinner: false },
              },
            ],
      hotels:
        pkg.hotels.length > 0
          ? pkg.hotels.map((h) => ({
              name: h.name,
              stars: h.stars,
              location: h.location,
              imageUrl: h.imageUrl,
              included: h.included,
            }))
          : [
              {
                name: "",
                stars: 5,
                location: "",
                imageUrl: "",
                included: true,
              },
            ],
      activities:
        pkg.activities.length > 0
          ? pkg.activities.map((a) => ({
              name: a.name,
              duration: a.duration,
              included: a.included,
              price: a.price ?? 0,
            }))
          : [{ name: "", duration: "", included: true, price: 0 }],
      inclusions:
        pkg.inclusions.length > 0
          ? pkg.inclusions.map((v) => ({ value: v }))
          : [{ value: "" }],
      exclusions:
        pkg.exclusions.length > 0
          ? pkg.exclusions.map((v) => ({ value: v }))
          : [{ value: "" }],
      tags: pkg.tags,
      cancellationPolicy: pkg.cancellationPolicy?.length
        ? pkg.cancellationPolicy
        : DEFAULT_CANCELLATION,
      metaTitle: pkg.metaTitle ?? "",
      metaDescription: pkg.metaDescription ?? "",
      isFeatured: pkg.isFeatured,
      attributes: ATTRIBUTE_LABELS.map((label) => {
        const found = pkg.attributes?.find((a) => a.label === label);
        return { quality: (found?.quality ?? "") as AttributeQuality | "" };
      }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pkg]);

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

  const onSubmit: SubmitHandler<PackageFormValues> = async (data) => {
    if (!pkg) return;
    setIsSubmitting(true);
    try {
      const payload = {
        title: data.title,
        slug: data.slug,
        description: data.description,
        destinationId: data.destinationId,
        durationNights: data.durationNights,
        pricePerPerson: data.pricePerPerson,
        originalPrice: data.originalPrice || undefined,
        childPrice: Number.isFinite(data.childPrice)
          ? data.childPrice
          : undefined,
        infantPrice: Number.isFinite(data.infantPrice)
          ? data.infantPrice
          : undefined,
        toursPrice: Number.isFinite(data.toursPrice)
          ? data.toursPrice
          : undefined,
        minGroupSize: data.minGroupSize,
        maxGroupSize: data.maxGroupSize,
        inclusions: data.inclusions.map((i) => i.value).filter(Boolean),
        exclusions: data.exclusions.map((e) => e.value).filter(Boolean),
        itinerary: data.itinerary.map((d) => ({
          day: d.day,
          title: d.title,
          description: d.description,
          meals: [
            d.meals.breakfast ? "Breakfast" : null,
            d.meals.lunch ? "Lunch" : null,
            d.meals.dinner ? "Dinner" : null,
          ].filter(Boolean),
        })),
        hotels: data.hotels,
        activities: data.activities,
        images: data.images.map((i) => i.url).filter(Boolean),
        tags: data.tags,
        cancellationPolicy: data.cancellationPolicy,
        attributes: data.attributes
          .map((a, i) => ({
            label: ATTRIBUTE_LABELS[i] as string,
            quality: a.quality,
          }))
          .filter((a) => a.quality !== "")
          .map((a) => ({
            label: a.label,
            quality: a.quality as AttributeQuality,
          })),
        isFeatured: data.isFeatured,
        status: data.status,
        metaTitle: data.metaTitle || undefined,
        metaDescription: data.metaDescription || undefined,
      };
      const res = await fetch(`/api/packages/${pkg.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = (await res.json()) as {
          error?: string;
          details?: unknown;
        };
        applyServerErrors(err.details, setError);
        throw new Error(err.error ?? "Failed to update package");
      }
      toast.success("Package saved.");
      router.push("/admin/packages");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save package.",
      );
    } finally {
      setIsSubmitting(false);
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

  // ── Destination → country auto-fill ──────────────────────────────────────

  const destId = watch("destinationId");
  useEffect(() => {
    const dest = destinations.find((d) => d.id === destId);
    if (dest) setValue("country", dest.country);
  }, [destId, destinations, setValue]);

  if (pkgLoading) {
    return (
      <div className="px-4 md:px-8 py-6">
        <p className="font-['DM_Sans'] text-sm text-(--color-text-secondary)">
          Loading…
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 py-6 max-w-4xl mx-auto">
      <Link
        href="/admin/packages"
        className="inline-flex items-center gap-2 text-sm font-['DM_Sans'] text-(--color-text-secondary) hover:text-(--color-gold) transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        Back to Packages
      </Link>

      <h1 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white mb-8">
        Edit Package
      </h1>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* ── Basic Info ── */}
        <SectionCard title="Basic Info">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="Title"
              htmlFor="title"
              error={errors.title?.message}
              className="md:col-span-2"
            >
              <input
                id="title"
                {...register("title", { required: "Title is required" })}
                placeholder="e.g. Bali Serenity Escape"
                className={inputCls}
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? "title-error" : undefined}
              />
            </Field>

            <Field label="Slug" htmlFor="slug" error={errors.slug?.message}>
              <input
                id="slug"
                {...register("slug", { required: "Slug is required" })}
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

            <Field label="Status" htmlFor="status">
              <select id="status" {...register("status")} className={selectCls}>
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
            <Field
              label="Destination"
              htmlFor="destinationId"
              error={errors.destinationId?.message}
            >
              <select
                id="destinationId"
                {...register("destinationId", {
                  required: "Destination is required",
                })}
                className={selectCls}
                aria-invalid={!!errors.destinationId}
                aria-describedby={
                  errors.destinationId ? "destinationId-error" : undefined
                }
              >
                <option value="">Select destination</option>
                {destinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Country" htmlFor="country">
              <input
                id="country"
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
            <Field
              label="Nights"
              htmlFor="durationNights"
              error={errors.durationNights?.message}
            >
              <input
                id="durationNights"
                type="number"
                min={1}
                {...register("durationNights", {
                  valueAsNumber: true,
                  required: "Duration is required",
                  min: { value: 1, message: "Must be at least 1 night" },
                })}
                className={inputCls}
                aria-invalid={!!errors.durationNights}
                aria-describedby={
                  errors.durationNights ? "durationNights-error" : undefined
                }
              />
            </Field>
            <Field label="Min Group Size" htmlFor="minGroupSize">
              <input
                id="minGroupSize"
                type="number"
                min={1}
                {...register("minGroupSize", { valueAsNumber: true })}
                className={inputCls}
              />
            </Field>
            <Field label="Max Group Size" htmlFor="maxGroupSize">
              <input
                id="maxGroupSize"
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
            <Field
              label="Price per Person (Adults 12+) (₹)"
              htmlFor="pricePerPerson"
              error={errors.pricePerPerson?.message}
            >
              <input
                id="pricePerPerson"
                type="number"
                min={0}
                {...register("pricePerPerson", {
                  valueAsNumber: true,
                  required: "Price per person is required",
                  min: { value: 0.01, message: "Must be greater than 0" },
                })}
                className={inputCls}
                aria-invalid={!!errors.pricePerPerson}
                aria-describedby={
                  errors.pricePerPerson ? "pricePerPerson-error" : undefined
                }
              />
            </Field>
            <Field
              label="Original Price (₹) — for discount display"
              htmlFor="originalPrice"
            >
              <input
                id="originalPrice"
                type="number"
                min={0}
                {...register("originalPrice", { valueAsNumber: true })}
                className={inputCls}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-(--color-navy-border)">
            <Field label="Per Child (Age 2–11) (₹)" htmlFor="childPrice">
              <input
                id="childPrice"
                type="number"
                min={0}
                {...register("childPrice", { valueAsNumber: true })}
                placeholder="Leave empty if not applicable"
                className={inputCls}
              />
            </Field>
            <Field label="Per Infant (Under 2) (₹)" htmlFor="infantPrice">
              <input
                id="infantPrice"
                type="number"
                min={0}
                {...register("infantPrice", { valueAsNumber: true })}
                placeholder="0 if infants travel free"
                className={inputCls}
              />
              <p className="font-['DM_Sans'] text-xs text-(--color-text-secondary) mt-1">
                Enter 0 for free, leave empty if not accepted
              </p>
            </Field>
            <Field
              label="Tours & Transfers (per person) (₹)"
              htmlFor="toursPrice"
            >
              <input
                id="toursPrice"
                type="number"
                min={0}
                {...register("toursPrice", { valueAsNumber: true })}
                placeholder="e.g. 5068 — from Bali quotation"
                className={inputCls}
              />
              <p className="font-['DM_Sans'] text-xs text-(--color-text-secondary) mt-1">
                Separate cost for guided tours and transfers
              </p>
            </Field>
          </div>
        </SectionCard>

        {/* ── Description ── */}
        <SectionCard title="Description">
          <Field
            label="Description (→ Phase 2E: Tiptap)"
            htmlFor="description"
            error={errors.description?.message}
          >
            <textarea
              id="description"
              {...register("description", {
                required: "Description is required",
              })}
              rows={5}
              placeholder="Describe the package experience…"
              className={inputCls + " resize-y"}
              aria-invalid={!!errors.description}
              aria-describedby={
                errors.description ? "description-error" : undefined
              }
            />
          </Field>
        </SectionCard>

        {/* ── Images ── */}
        <SectionCard title="Images">
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
                  folder="rapidluxe/packages"
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
                <input
                  type="hidden"
                  {...register(`itinerary.${i}.day`)}
                  value={i + 1}
                />
                <Field
                  label="Title"
                  htmlFor={`itinerary-${i}-title`}
                  error={errors.itinerary?.[i]?.title?.message}
                >
                  <input
                    id={`itinerary-${i}-title`}
                    {...register(`itinerary.${i}.title`, {
                      required: "Day title is required",
                    })}
                    placeholder="e.g. Arrival & Welcome"
                    className={inputCls}
                    aria-invalid={!!errors.itinerary?.[i]?.title}
                    aria-describedby={
                      errors.itinerary?.[i]?.title
                        ? `itinerary-${i}-title-error`
                        : undefined
                    }
                  />
                </Field>
                <Field
                  label="Description"
                  htmlFor={`itinerary-${i}-description`}
                >
                  <textarea
                    id={`itinerary-${i}-description`}
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
                  <Field
                    label="Hotel Name"
                    htmlFor={`hotels-${i}-name`}
                    error={errors.hotels?.[i]?.name?.message}
                  >
                    <input
                      id={`hotels-${i}-name`}
                      {...register(`hotels.${i}.name`, {
                        required: "Hotel name is required",
                      })}
                      placeholder="e.g. Four Seasons"
                      className={inputCls}
                      aria-invalid={!!errors.hotels?.[i]?.name}
                      aria-describedby={
                        errors.hotels?.[i]?.name
                          ? `hotels-${i}-name-error`
                          : undefined
                      }
                    />
                  </Field>
                  <Field label="Stars" htmlFor={`hotels-${i}-stars`}>
                    <select
                      id={`hotels-${i}-stars`}
                      {...register(`hotels.${i}.stars`, {
                        valueAsNumber: true,
                      })}
                      className={selectCls}
                    >
                      {[1, 2, 3, 4, 5].map((s) => (
                        <option key={s} value={s}>
                          {s} ★
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Location" htmlFor={`hotels-${i}-location`}>
                    <input
                      id={`hotels-${i}-location`}
                      {...register(`hotels.${i}.location`)}
                      placeholder="e.g. Ubud, Bali"
                      className={inputCls}
                    />
                  </Field>
                </div>
                <div>
                  <span
                    id={`hotels-${i}-image-label`}
                    className="block font-['DM_Sans'] text-xs text-(--color-text-secondary) mb-1.5"
                  >
                    Hotel Image
                  </span>
                  <CloudinaryUpload
                    folder="rapidluxe/hotels"
                    currentUrl={watch(`hotels.${i}.imageUrl`)}
                    onUpload={(url) => setValue(`hotels.${i}.imageUrl`, url)}
                    onRemove={() => setValue(`hotels.${i}.imageUrl`, "")}
                  />
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
              hotels.append({
                name: "",
                stars: 5,
                location: "",
                imageUrl: "",
                included: true,
              })
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
                <Field
                  label="Activity Name"
                  htmlFor={`activities-${i}-name`}
                  error={errors.activities?.[i]?.name?.message}
                >
                  <input
                    id={`activities-${i}-name`}
                    {...register(`activities.${i}.name`, {
                      required: "Activity name is required",
                    })}
                    placeholder="e.g. Snorkelling"
                    className={inputCls}
                    aria-invalid={!!errors.activities?.[i]?.name}
                    aria-describedby={
                      errors.activities?.[i]?.name
                        ? `activities-${i}-name-error`
                        : undefined
                    }
                  />
                </Field>
                <Field label="Duration" htmlFor={`activities-${i}-duration`}>
                  <input
                    id={`activities-${i}-duration`}
                    {...register(`activities.${i}.duration`)}
                    placeholder="2 hrs"
                    className={inputCls}
                  />
                </Field>
                <Field
                  label="Price (₹) if not incl."
                  htmlFor={`activities-${i}-price`}
                >
                  <input
                    id={`activities-${i}-price`}
                    type="number"
                    min={0}
                    {...register(`activities.${i}.price`, {
                      valueAsNumber: true,
                    })}
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
            onClick={() =>
              activities.append({
                name: "",
                duration: "",
                included: true,
                price: 0,
              })
            }
            className="mt-3 inline-flex items-center gap-2 text-sm font-['DM_Sans'] text-(--color-gold) hover:text-(--color-gold)/80 transition-colors"
          >
            <Plus size={14} />
            Add Activity
          </button>
        </SectionCard>

        {/* ── Inclusions / Exclusions ── */}
        <SectionCard title="Inclusions & Exclusions">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
              <div
                key={field.id}
                className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end"
              >
                <Field
                  label="Days Before Departure"
                  htmlFor={`cancellation-${i}-days`}
                >
                  <input
                    id={`cancellation-${i}-days`}
                    type="number"
                    min={0}
                    {...register(
                      `cancellationPolicy.${i}.daysBeforeDeparture`,
                      { valueAsNumber: true },
                    )}
                    className={inputCls}
                  />
                </Field>
                <Field
                  label="Refund %"
                  htmlFor={`cancellation-${i}-refund`}
                  error={errors.cancellationPolicy?.[i]?.refundPercent?.message}
                >
                  <input
                    id={`cancellation-${i}-refund`}
                    type="number"
                    min={0}
                    max={100}
                    {...register(`cancellationPolicy.${i}.refundPercent`, {
                      valueAsNumber: true,
                      min: { value: 0, message: "Must be 0-100" },
                      max: { value: 100, message: "Must be 0-100" },
                    })}
                    className={inputCls}
                    aria-invalid={
                      !!errors.cancellationPolicy?.[i]?.refundPercent
                    }
                    aria-describedby={
                      errors.cancellationPolicy?.[i]?.refundPercent
                        ? `cancellation-${i}-refund-error`
                        : undefined
                    }
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
            <Field label="Meta Title" htmlFor="metaTitle">
              <input
                id="metaTitle"
                {...register("metaTitle")}
                placeholder="e.g. Bali Serenity Escape | RapidLuxe"
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

        {/* ── Attributes ── */}
        <div className="bg-(--color-navy-surface)/50 rounded-xl border border-(--color-navy-border) p-6 mt-6">
          <h2 className="font-['DM_Sans'] text-xs font-semibold uppercase tracking-widest text-(--color-gold) mb-1">
            Location & Quality Attributes
          </h2>
          <p className="font-['DM_Sans'] text-xs text-(--color-text-secondary) mb-5">
            These appear as quality badges on the package detail page
          </p>
          <div className="space-y-4">
            {ATTRIBUTE_LABELS.map((label, i) => (
              <div key={label} className="flex items-center justify-between">
                <span
                  id={`attributes-${i}-label`}
                  className="font-['DM_Sans'] text-sm text-(--color-white-muted)"
                >
                  {label}
                </span>
                <Controller
                  control={control}
                  name={`attributes.${i}.quality`}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        id={`attributes-${i}-quality`}
                        aria-labelledby={`attributes-${i}-label`}
                        className="w-36 bg-(--color-navy) border-(--color-navy-border) text-sm font-['DM_Sans'] text-white focus:ring-(--color-gold)/40"
                      >
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent className="bg-(--color-navy-surface) border-(--color-navy-border)">
                        <SelectItem value="GREAT">Great</SelectItem>
                        <SelectItem value="GOOD">Good</SelectItem>
                        <SelectItem value="AVERAGE">Average</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex flex-wrap gap-3 pb-8">
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-lg border border-(--color-navy-border) text-(--color-white-muted) font-['DM_Sans'] text-sm font-medium hover:border-(--color-gold)/40 hover:text-white transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Saving…" : "Save as Draft"}
          </button>
          <button
            type="button"
            onClick={onPublish}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-lg bg-(--color-gold) text-(--color-navy) font-['DM_Sans'] text-sm font-bold hover:bg-(--color-gold)/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Publishing…" : "Publish"}
          </button>
        </div>
      </form>
    </div>
  );
}
