"use client";

import { useState } from "react";
import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Star, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

import { CloudinaryUpload } from "@/components/admin/CloudinaryUpload";

// ── Types ─────────────────────────────────────────────────────────────────────

interface AdminTestimonial {
  _id: string;
  clientName: string;
  clientTitle: string | null;
  quote: string;
  destination: string | null;
  rating: number;
  tripDate: string | null;
  isFeatured: boolean;
  imageUrl: string | null;
}

interface TestimonialForm {
  clientName: string;
  clientTitle: string;
  quote: string;
  destination: string;
  rating: number;
  tripDate: string;
  isFeatured: boolean;
  imageUrl: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const INPUT_CLASS =
  "w-full bg-(--color-navy) border border-(--color-navy-border) rounded-lg px-3 py-2.5 text-sm font-['DM_Sans'] text-white placeholder:text-(--color-text-secondary) focus:outline-none focus:border-(--color-gold)/60 transition-colors";

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminTestimonialsPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { data, isLoading } = useQuery<{ data: AdminTestimonial[] }>({
    queryKey: ["admin-testimonials"],
    queryFn: async () => {
      const res = await fetch("/api/admin/sanity/testimonials");
      if (!res.ok) throw new Error("Failed to fetch testimonials");
      return res.json() as Promise<{ data: AdminTestimonial[] }>;
    },
  });

  const testimonials = data?.data ?? [];

  const { register, handleSubmit, reset, watch, setValue } =
    useForm<TestimonialForm>({
      defaultValues: { rating: 5, isFeatured: true, imageUrl: "" },
    });

  async function onCreate(values: TestimonialForm) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/sanity/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          rating: Number(values.rating),
          clientTitle: values.clientTitle || undefined,
          destination: values.destination || undefined,
          tripDate: values.tripDate || undefined,
          imageUrl: values.imageUrl || undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Testimonial created");
      reset();
      setShowForm(false);
      await qc.invalidateQueries({ queryKey: ["admin-testimonials"] });
    } catch {
      toast.error("Failed to create testimonial");
    } finally {
      setSubmitting(false);
    }
  }

  async function onToggleFeatured(t: AdminTestimonial) {
    try {
      const res = await fetch("/api/admin/sanity/testimonials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: t._id, isFeatured: !t.isFeatured }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(
        t.isFeatured ? "Hidden from homepage" : "Featured on homepage",
      );
      await qc.invalidateQueries({ queryKey: ["admin-testimonials"] });
    } catch {
      toast.error("Failed to update testimonial");
    }
  }

  async function onDelete(t: AdminTestimonial) {
    if (
      !confirm(
        `Delete testimonial from "${t.clientName}"? This cannot be undone.`,
      )
    )
      return;
    try {
      const res = await fetch("/api/admin/sanity/testimonials", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: t._id }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Testimonial deleted");
      await qc.invalidateQueries({ queryKey: ["admin-testimonials"] });
    } catch {
      toast.error("Failed to delete testimonial");
    }
  }

  return (
    <div className="px-4 md:px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white">
          Testimonials
        </h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-(--color-gold)/20 border border-(--color-gold)/40 text-(--color-gold) text-sm font-['DM_Sans'] font-medium hover:bg-(--color-gold)/30 transition-colors"
        >
          <Plus size={14} />
          Add Testimonial
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <form
          onSubmit={handleSubmit(onCreate)}
          className="bg-(--color-navy-surface) border border-(--color-navy-border) rounded-xl p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="md:col-span-2">
            <span className="text-xs font-['DM_Sans'] text-(--color-text-secondary) block mb-1.5">
              Client Photo
            </span>
            <CloudinaryUpload
              folder="rapidluxe/testimonials"
              currentUrl={watch("imageUrl")}
              onUpload={(url) => setValue("imageUrl", url)}
              onRemove={() => setValue("imageUrl", "")}
            />
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="testimonial-clientName"
              className="text-xs font-['DM_Sans'] text-(--color-text-secondary) block mb-1.5"
            >
              Client Name *
            </label>
            <input
              id="testimonial-clientName"
              {...register("clientName", { required: true })}
              placeholder="Priya & Rajan Sharma"
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label
              htmlFor="testimonial-clientTitle"
              className="text-xs font-['DM_Sans'] text-(--color-text-secondary) block mb-1.5"
            >
              Client Title
            </label>
            <input
              id="testimonial-clientTitle"
              {...register("clientTitle")}
              placeholder="Couple from Mumbai"
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label
              htmlFor="testimonial-destination"
              className="text-xs font-['DM_Sans'] text-(--color-text-secondary) block mb-1.5"
            >
              Destination
            </label>
            <input
              id="testimonial-destination"
              {...register("destination")}
              placeholder="Bali, 7 nights"
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label
              htmlFor="testimonial-tripDate"
              className="text-xs font-['DM_Sans'] text-(--color-text-secondary) block mb-1.5"
            >
              Trip Date
            </label>
            <input
              id="testimonial-tripDate"
              {...register("tripDate")}
              placeholder="March 2026"
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label
              htmlFor="testimonial-rating"
              className="text-xs font-['DM_Sans'] text-(--color-text-secondary) block mb-1.5"
            >
              Rating (1–5)
            </label>
            <input
              id="testimonial-rating"
              {...register("rating")}
              type="number"
              min={1}
              max={5}
              className={INPUT_CLASS}
            />
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="testimonial-quote"
              className="text-xs font-['DM_Sans'] text-(--color-text-secondary) block mb-1.5"
            >
              Quote *
            </label>
            <textarea
              id="testimonial-quote"
              {...register("quote", { required: true })}
              rows={3}
              placeholder="The trip was absolutely magical..."
              className={`${INPUT_CLASS} resize-none`}
            />
          </div>
          <div className="md:col-span-2 flex items-center gap-2">
            <input
              {...register("isFeatured")}
              type="checkbox"
              id="isFeatured"
              className="w-4 h-4 accent-(--color-gold)"
            />
            <label
              htmlFor="isFeatured"
              className="text-sm font-['DM_Sans'] text-(--color-white-muted)"
            >
              Feature on homepage
            </label>
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-lg bg-(--color-gold)/20 border border-(--color-gold)/40 text-(--color-gold) text-sm font-['DM_Sans'] font-medium hover:bg-(--color-gold)/30 transition-colors disabled:opacity-50"
            >
              {submitting ? "Saving…" : "Save Testimonial"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2.5 rounded-lg border border-(--color-navy-border) text-(--color-text-secondary) text-sm font-['DM_Sans'] hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-20 bg-(--color-navy-surface) border border-(--color-navy-border) rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-20 text-(--color-text-secondary) font-['DM_Sans'] text-sm">
          No testimonials yet. Add one above.
        </div>
      ) : (
        <div className="space-y-3">
          {testimonials.map((t) => (
            <div
              key={t._id}
              className="bg-(--color-navy-surface) border border-(--color-navy-border) rounded-xl p-5 flex items-start gap-4"
            >
              {t.imageUrl ? (
                <Image
                  src={t.imageUrl}
                  alt={t.clientName}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-(--color-navy-border) shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-['DM_Sans'] text-sm font-medium text-white truncate">
                    {t.clientName}
                  </p>
                  {t.clientTitle && (
                    <span className="text-xs text-(--color-text-secondary)">
                      · {t.clientTitle}
                    </span>
                  )}
                  <div className="flex gap-0.5 ml-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star
                        key={i}
                        size={10}
                        fill="var(--color-gold)"
                        style={{ color: "var(--color-gold)" }}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-(--color-text-secondary) line-clamp-2">
                  &ldquo;{t.quote}&rdquo;
                </p>
                {t.destination && (
                  <p className="text-xs text-(--color-gold) mt-1">
                    📍 {t.destination}
                    {t.tripDate ? ` · ${t.tripDate}` : ""}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onToggleFeatured(t)}
                  title={
                    t.isFeatured ? "Hide from homepage" : "Feature on homepage"
                  }
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-(--color-navy-border) hover:border-(--color-gold)/40 transition-colors"
                >
                  {t.isFeatured ? (
                    <Eye size={14} className="text-(--color-gold)" />
                  ) : (
                    <EyeOff
                      size={14}
                      className="text-(--color-text-secondary)"
                    />
                  )}
                </button>
                <button
                  onClick={() => onDelete(t)}
                  title="Delete testimonial"
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-(--color-navy-border) hover:border-red-500/40 transition-colors"
                >
                  <Trash2
                    size={14}
                    className="text-(--color-text-secondary) hover:text-red-400"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
