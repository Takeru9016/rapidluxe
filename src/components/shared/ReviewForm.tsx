"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Lock, Star, Upload } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  body: z.string().min(50, "Review must be at least 50 characters"),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  packageId: string;
  isEligible: boolean;
}

export function ReviewForm({ packageId, isEligible }: ReviewFormProps) {
  const queryClient = useQueryClient();
  const [hovered, setHovered] = useState<number>(0);
  const [selected, setSelected] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    defaultValues: { rating: 0, title: "", body: "" },
  });

  const body = watch("body") ?? "";

  async function onSubmit(data: ReviewFormData) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, packageId }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Failed to submit review");
        return;
      }
      toast.success("Review submitted! It will appear after approval.");
      await queryClient.invalidateQueries({ queryKey: ["reviews", packageId] });
      reset();
      setSelected(0);
    } catch {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleStarClick(i: number) {
    setSelected(i + 1);
    setValue("rating", i + 1, { shouldValidate: true });
  }

  return (
    <div className="bg-(--color-navy-surface) rounded-xl p-6 border border-(--color-navy-border)">
      <h2 className="font-serif text-2xl text-white">Share Your Experience</h2>

      {!isEligible ? (
        <div className="mt-4 bg-(--color-navy-border)/30 rounded-lg p-4 flex items-center gap-3">
          <Lock size={20} className="text-(--color-gold) shrink-0" />
          <p className="font-sans text-(--color-white-muted) text-sm">
            Complete your trip to share your experience
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-5 flex flex-col gap-5"
        >
          {/* Star selector */}
          <div>
            <input
              type="hidden"
              {...register("rating", {
                validate: (v) => (v >= 1 && v <= 5) || "Please select a rating",
              })}
            />
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => {
                const active = i < (hovered || selected);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleStarClick(i)}
                    onMouseEnter={() => setHovered(i + 1)}
                    onMouseLeave={() => setHovered(0)}
                    className="p-0.5"
                  >
                    <Star
                      size={28}
                      className={cn(
                        "transition-colors",
                        active
                          ? "text-(--color-gold) fill-(--color-gold)"
                          : "text-(--color-navy-border)",
                      )}
                    />
                  </button>
                );
              })}
            </div>
            {errors.rating && (
              <p className="mt-1 text-xs text-(--color-coral)">
                {errors.rating.message}
              </p>
            )}
          </div>

          {/* Title */}
          <Input
            {...register("title")}
            placeholder="Review headline (optional)"
            className="bg-transparent border-(--color-navy-border) text-white placeholder:text-(--color-text-secondary)"
          />

          {/* Body */}
          <div>
            <Textarea
              {...register("body", {
                minLength: {
                  value: 50,
                  message: "Review must be at least 50 characters",
                },
              })}
              rows={5}
              placeholder="Tell us about your experience..."
              className="bg-transparent border-(--color-navy-border) text-white placeholder:text-(--color-text-secondary) resize-none"
            />
            <div className="flex justify-between mt-1">
              {errors.body ? (
                <p className="text-xs text-(--color-coral)">
                  {errors.body.message}
                </p>
              ) : (
                <span />
              )}
              <p className="text-xs text-(--color-text-secondary) ml-auto">
                {body.length}/500
              </p>
            </div>
          </div>

          {/* Photo upload — Phase 2F */}
          <div className="border border-dashed border-(--color-navy-border) rounded-lg p-4 flex flex-col items-center gap-2 text-center">
            <Upload size={20} className="text-(--color-text-secondary)" />
            <p className="font-sans text-sm text-(--color-text-secondary)">
              Photo uploads coming soon
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-(--color-coral) text-white font-sans font-medium py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}
    </div>
  );
}
