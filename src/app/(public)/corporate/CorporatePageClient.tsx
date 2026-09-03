"use client";

import {
  ArrowRight,
  Building2,
  ClipboardList,
  FileText,
  Headphones,
  Plane,
  Tag,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Plane,
    title: "Business & Executive Travel",
    description:
      "Point-to-point coordination for business trips and executive travel, planned around your schedule and priorities.",
  },
  {
    icon: Building2,
    title: "Retreats & Offsites",
    description:
      "From stays to full itineraries, we coordinate retreats and offsites end-to-end for your team.",
  },
  {
    icon: Users,
    title: "Group Travel",
    description:
      "Coordinated bookings for teams travelling together, kept aligned across stays, transfers, and experiences.",
  },
  {
    icon: Tag,
    title: "Curated Stays & Experiences",
    description:
      "Bespoke stays and curated experiences selected around your team's pace and priorities, not a fixed package.",
  },
  {
    icon: FileText,
    title: "Coordinated Itineraries",
    description:
      "We handle the details of your journey — bookings, private transfers, and on-ground support — coordinated end to end.",
  },
  {
    icon: Headphones,
    title: "On-Ground Coordination",
    description:
      "Local support and on-ground coordination throughout your trip, so your team can travel without the back-and-forth.",
  },
];

const STEPS = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Share Your Requirements",
    description:
      "Tell us about your team size, travel type — business, executive, retreat, or group — and destinations.",
  },
  {
    number: "02",
    icon: Building2,
    title: "We Coordinate the Details",
    description:
      "We design and coordinate your itinerary — stays, experiences, transfers, and on-ground support — around your priorities.",
  },
  {
    number: "03",
    icon: Plane,
    title: "Your Team Travels",
    description:
      "Your team travels with coordinated bookings and on-ground support throughout the journey.",
  },
];

const TEAM_SIZES = ["1–10", "11–50", "51–200", "201–500", "500+"];

// ─── Form ─────────────────────────────────────────────────────────────────────

interface CorporateFormData {
  contactName: string;
  email: string;
  companyName: string;
  gstNumber?: string;
  teamSize: string;
  requirements: string;
}

function CorporateForm() {
  const [submitted, setSubmitted] = useState(false);
  const teamSizeTriggerRef = useRef<HTMLButtonElement>(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
    clearErrors,
  } = useForm<CorporateFormData>();

  const onSubmit = async (data: CorporateFormData) => {
    try {
      const message = [
        `Company: ${data.companyName}`,
        `Team Size: ${data.teamSize}`,
        data.gstNumber ? `GST: ${data.gstNumber}` : null,
        "",
        data.requirements,
      ]
        .filter((l) => l !== null)
        .join("\n");

      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.contactName,
          email: data.email,
          subject: `Corporate Account Request — ${data.companyName}`,
          message,
          type: "CORPORATE",
        }),
      });
      if (!res.ok) throw new Error("Failed");
      reset();
      clearErrors();
      setSubmitted(true);
      toast.success(
        "We've received your corporate enquiry and will be in touch soon.",
      );
      // A pending validation from the Team Size select's own onValueChange
      // (shouldValidate: true) can resolve after reset() and re-populate
      // errors.teamSize against the now-empty value. Clear it again once
      // that microtask has had a chance to settle.
      setTimeout(() => clearErrors(), 0);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const onInvalid = (formErrors: typeof errors) => {
    if (formErrors.teamSize) {
      teamSizeTriggerRef.current?.focus();
    }
  };

  return (
    <>
      {submitted && (
        <div
          role="status"
          className="mb-6 rounded-lg border border-(--color-teal)/40 bg-(--color-teal)/10 px-5 py-4 font-sans text-sm text-(--color-teal)"
        >
          We&apos;ve received your corporate enquiry and will be in touch soon.
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        noValidate
        className="space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label
              htmlFor="corporate-contact-name"
              className="font-sans text-xs font-medium uppercase tracking-widest text-(--color-white-muted)"
            >
              Your Name <span className="text-(--color-coral)">*</span>
            </label>
            <Input
              id="corporate-contact-name"
              {...register("contactName", { required: "Name is required" })}
              placeholder="Vikram Nair"
              aria-invalid={!!errors.contactName}
              aria-describedby={
                errors.contactName ? "corporate-contact-name-error" : undefined
              }
              className="bg-(--color-navy) border-(--color-navy-border) text-(--color-white) placeholder:text-(--color-text-secondary) focus-visible:ring-(--color-gold)/40 focus-visible:border-(--color-gold)/60"
            />
            {errors.contactName && (
              <p
                id="corporate-contact-name-error"
                className="font-sans text-xs text-(--color-coral)"
              >
                {errors.contactName.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="corporate-email"
              className="font-sans text-xs font-medium uppercase tracking-widest text-(--color-white-muted)"
            >
              Work Email <span className="text-(--color-coral)">*</span>
            </label>
            <Input
              id="corporate-email"
              {...register("email", {
                required: "Enter a valid email",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              })}
              type="email"
              placeholder="vikram@company.com"
              aria-invalid={!!errors.email}
              aria-describedby={
                errors.email ? "corporate-email-error" : undefined
              }
              className="bg-(--color-navy) border-(--color-navy-border) text-(--color-white) placeholder:text-(--color-text-secondary) focus-visible:ring-(--color-gold)/40 focus-visible:border-(--color-gold)/60"
            />
            {errors.email && (
              <p
                id="corporate-email-error"
                className="font-sans text-xs text-(--color-coral)"
              >
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label
              htmlFor="corporate-company-name"
              className="font-sans text-xs font-medium uppercase tracking-widest text-(--color-white-muted)"
            >
              Company Name <span className="text-(--color-coral)">*</span>
            </label>
            <Input
              id="corporate-company-name"
              {...register("companyName", {
                required: "Company name is required",
              })}
              placeholder="Acme Enterprises Pvt. Ltd."
              aria-invalid={!!errors.companyName}
              aria-describedby={
                errors.companyName ? "corporate-company-name-error" : undefined
              }
              className="bg-(--color-navy) border-(--color-navy-border) text-(--color-white) placeholder:text-(--color-text-secondary) focus-visible:ring-(--color-gold)/40 focus-visible:border-(--color-gold)/60"
            />
            {errors.companyName && (
              <p
                id="corporate-company-name-error"
                className="font-sans text-xs text-(--color-coral)"
              >
                {errors.companyName.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="corporate-gst-number"
              className="font-sans text-xs font-medium uppercase tracking-widest text-(--color-white-muted)"
            >
              GST Number{" "}
              <span className="text-(--color-text-secondary)">(optional)</span>
            </label>
            <Input
              id="corporate-gst-number"
              {...register("gstNumber")}
              placeholder="27AABCU9603R1ZX"
              className="font-mono bg-(--color-navy) border-(--color-navy-border) text-(--color-white) placeholder:text-(--color-text-secondary) focus-visible:ring-(--color-gold)/40 focus-visible:border-(--color-gold)/60"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            id="corporate-team-size-label"
            htmlFor="corporate-team-size-trigger"
            className="font-sans text-xs font-medium uppercase tracking-widest text-(--color-white-muted)"
          >
            Team Size <span className="text-(--color-coral)">*</span>
          </label>
          <input
            type="hidden"
            {...register("teamSize", { required: "Please select team size" })}
          />
          <Select
            onValueChange={(val) =>
              setValue("teamSize", val, { shouldValidate: true })
            }
          >
            <SelectTrigger
              id="corporate-team-size-trigger"
              ref={teamSizeTriggerRef}
              aria-labelledby="corporate-team-size-label"
              aria-invalid={!!errors.teamSize}
              aria-describedby={
                errors.teamSize ? "corporate-team-size-error" : undefined
              }
              className="bg-(--color-navy) border-(--color-navy-border) text-(--color-text-secondary) focus:ring-(--color-gold)/40 data-placeholder:text-(--color-text-secondary)"
            >
              <SelectValue placeholder="Select team size" />
            </SelectTrigger>
            <SelectContent className="bg-(--color-navy-surface) border-(--color-navy-border)">
              {TEAM_SIZES.map((size) => (
                <SelectItem
                  key={size}
                  value={size}
                  className="font-sans text-sm text-(--color-white-muted) focus:bg-(--color-navy-border) focus:text-(--color-white)"
                >
                  {size} employees
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.teamSize && (
            <p
              id="corporate-team-size-error"
              className="font-sans text-xs text-(--color-coral)"
            >
              {errors.teamSize.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="corporate-requirements"
            className="font-sans text-xs font-medium uppercase tracking-widest text-(--color-white-muted)"
          >
            Travel Requirements <span className="text-(--color-coral)">*</span>
          </label>
          <Textarea
            id="corporate-requirements"
            {...register("requirements", {
              required: "Please describe your requirements",
              minLength: { value: 10, message: "Please provide more detail" },
            })}
            rows={4}
            placeholder="Describe your travel frequency, typical destinations, and any specific requirements..."
            aria-invalid={!!errors.requirements}
            aria-describedby={
              errors.requirements ? "corporate-requirements-error" : undefined
            }
            className="bg-(--color-navy) border-(--color-navy-border) text-(--color-white) placeholder:text-(--color-text-secondary) focus-visible:ring-(--color-gold)/40 focus-visible:border-(--color-gold)/60 resize-none"
          />
          {errors.requirements && (
            <p
              id="corporate-requirements-error"
              className="font-sans text-xs text-(--color-coral)"
            >
              {errors.requirements.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="coral"
          disabled={isSubmitting}
          className="font-sans font-medium px-8 h-11 gap-2"
        >
          <ArrowRight size={14} />
          {isSubmitting ? "Sending..." : "Request a Corporate Account"}
        </Button>
      </form>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CorporatePageClient() {
  return (
    <div className="min-h-screen bg-(--color-navy)">
      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-end pb-16 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1600&auto=format&fit=crop&q=80"
          alt="Corporate travel solutions"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-(--color-navy) via-(--color-navy)/60 to-(--color-navy)/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full">
          <p className="font-sans text-sm tracking-widest uppercase text-(--color-gold) mb-3">
            For Businesses &amp; Enterprises
          </p>
          <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-7xl text-(--color-white) font-light leading-none max-w-3xl">
            Corporate Travel Solutions
          </h1>
          <p className="font-sans text-(--color-white-muted) mt-4 max-w-xl text-sm leading-relaxed">
            Tailored coordination for business trips, executive travel,
            retreats, offsites, and group travel — planned around your team's
            pace and priorities.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-14">
          <p className="font-sans text-sm tracking-widest uppercase text-(--color-gold) mb-2">
            Everything Your Team Needs
          </p>
          <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl text-(--color-white) font-light">
            Built for Business Travel
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-(--color-navy-surface) border border-(--color-navy-border) rounded-xl p-7 hover:border-(--color-gold)/30 transition-colors group"
            >
              <div className="w-11 h-11 rounded-lg bg-(--color-gold)/10 border border-(--color-gold)/20 flex items-center justify-center mb-5 group-hover:bg-(--color-gold)/15 transition-colors">
                <Icon size={20} className="text-(--color-gold)" />
              </div>
              <h3 className="font-['Cormorant_Garamond'] text-xl text-(--color-white) mb-2">
                {title}
              </h3>
              <p className="font-sans text-sm text-(--color-text-secondary) leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-(--color-navy-surface) border-y border-(--color-navy-border)">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl text-(--color-white) font-light">
              How It Works
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line — desktop only */}
            <div className="hidden md:block absolute top-10 left-[calc(16.67%+20px)] right-[calc(16.67%+20px)] h-px bg-(--color-navy-border)" />

            {STEPS.map(({ number, icon: Icon, title, description }) => (
              <div
                key={number}
                className="flex flex-col items-center text-center gap-4 relative"
              >
                <div className="w-20 h-20 rounded-full bg-(--color-navy) border-2 border-(--color-gold)/30 flex items-center justify-center shrink-0 relative z-10">
                  <Icon size={28} className="text-(--color-gold)" />
                </div>
                <span className="font-['JetBrains_Mono'] text-xs text-(--color-gold-muted) tracking-widest">
                  STEP {number}
                </span>
                <h3 className="font-['Cormorant_Garamond'] text-xl text-(--color-white)">
                  {title}
                </h3>
                <p className="font-sans text-sm text-(--color-text-secondary) leading-relaxed max-w-xs">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section className="py-20 max-w-4xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <p className="font-sans text-sm tracking-widest uppercase text-(--color-gold) mb-2">
            Get Started Today
          </p>
          <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl text-(--color-white) font-light">
            Request a Corporate Account
          </h2>
          <p className="font-sans text-(--color-text-secondary) text-sm mt-4 max-w-md mx-auto">
            Tell us about your team's travel needs and we'll be in touch.
          </p>
        </div>
        <div className="bg-(--color-navy-surface) border border-(--color-navy-border) rounded-2xl p-8 md:p-10">
          <CorporateForm />
        </div>
      </section>
    </div>
  );
}
