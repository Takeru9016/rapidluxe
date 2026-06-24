"use client";

import { CheckCircle, X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const EXCLUDED_PREFIXES = [
  "/admin",
  "/studio",
  "/sign-in",
  "/sign-up",
  "/pay/",
];

const FIRST_DELAY_MS = 10_000;
const REPEAT_DELAY_MS = 5 * 60 * 1000;

const TRAVEL_INTERESTS = [
  "Honeymoon",
  "Family Holiday",
  "Solo Adventure",
  "Corporate Retreat",
  "Weekend Getaway",
  "Custom Trip",
] as const;

type TravelInterest = (typeof TRAVEL_INTERESTS)[number];

interface FormState {
  name: string;
  email: string;
  phone: string;
  interest: TravelInterest;
  message: string;
}

const BLANK_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  interest: TRAVEL_INTERESTS[0],
  message: "",
};

export function LeadCaptureModal() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>(BLANK_FORM);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const shouldHide = EXCLUDED_PREFIXES.some((p) => pathname.startsWith(p));

  const scheduleShow = (delay: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setOpen(true), delay);
  };

  useEffect(() => {
    if (shouldHide) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }
    scheduleShow(FIRST_DELAY_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldHide]);

  const close = () => {
    setOpen(false);
    setSubmitted(false);
    setForm(BLANK_FORM);
    scheduleShow(REPEAT_DELAY_MS);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) close();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const combined = `Interest: ${form.interest}. ${form.message}`.trim();

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject: "Travel Enquiry — Lead Capture",
          message: combined,
        }),
      });

      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    const phone = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP?.replace(/\D/g, "");
    const msg = encodeURIComponent(
      "Hi! I'd like to know more about your travel packages.",
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
  };

  if (!open || shouldHide) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center px-4"
      onClick={handleOverlayClick}
    >
      <div className="max-w-lg w-full mt-20 bg-(--color-navy-surface) rounded-2xl overflow-hidden border border-(--color-navy-border)">
        {/* image header — text always white, sits on dark gradient */}
        <div className="relative h-48">
          <Image
            src="/auth-hero.png"
            alt="Luxury travel destination"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <h2
              className="font-display text-3xl font-semibold leading-tight"
              style={{ color: "#fff" }}
            >
              Your Next Journey Awaits
            </h2>
            <p
              className="font-body text-sm mt-1"
              style={{ color: "rgba(255,255,255,0.8)" }}
            >
              Let our experts craft your perfect escape.
            </p>
          </div>
          <button
            onClick={close}
            aria-label="Close"
            className="absolute top-4 right-4 transition-colors"
            style={{ color: "rgba(255,255,255,0.5)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(255,255,255,0.5)")
            }
          >
            <X size={20} />
          </button>
        </div>

        {/* form / success */}
        <div className="p-6 bg-(--color-navy)">
          {submitted ? (
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <CheckCircle className="text-(--color-gold)" size={48} />
              <p className="text-white font-semibold text-lg">
                Thank you! We&apos;ll be in touch within 24 hours.
              </p>
              <button
                onClick={handleWhatsApp}
                className="flex items-center gap-2 bg-[#25D366] font-medium px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
                style={{ color: "#fff" }}
              >
                In the meantime, chat with us on WhatsApp →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                required
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-(--color-navy-surface) border border-(--color-navy-border) rounded-lg px-4 py-2.5 text-white placeholder-(--color-text-secondary) text-sm focus:outline-none focus:border-(--color-gold) transition-colors"
              />
              <input
                required
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-(--color-navy-surface) border border-(--color-navy-border) rounded-lg px-4 py-2.5 text-white placeholder-(--color-text-secondary) text-sm focus:outline-none focus:border-(--color-gold) transition-colors"
              />
              <input
                required
                type="tel"
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-(--color-navy-surface) border border-(--color-navy-border) rounded-lg px-4 py-2.5 text-white placeholder-(--color-text-secondary) text-sm focus:outline-none focus:border-(--color-gold) transition-colors"
              />
              <select
                value={form.interest}
                onChange={(e) =>
                  setForm({
                    ...form,
                    interest: e.target.value as TravelInterest,
                  })
                }
                className="w-full bg-(--color-navy-surface) border border-(--color-navy-border) rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-(--color-gold) transition-colors"
              >
                {TRAVEL_INTERESTS.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
              <textarea
                rows={3}
                placeholder="Tell us about your dream trip..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-(--color-navy-surface) border border-(--color-navy-border) rounded-lg px-4 py-2.5 text-white placeholder-(--color-text-secondary) text-sm focus:outline-none focus:border-(--color-gold) transition-colors resize-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-(--color-coral) font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 mt-1"
                style={{ color: "#fff" }}
              >
                {loading ? "Sending…" : "Get a Free Consultation →"}
              </button>
              <p className="text-center text-(--color-text-secondary) text-xs">
                No spam. We&apos;ll contact you within 24 hours.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
