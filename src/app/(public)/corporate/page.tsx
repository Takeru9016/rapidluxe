"use client";

import {
  ArrowRight,
  Building2,
  ClipboardList,
  FileText,
  Headphones,
  Plane,
  Receipt,
  ShieldCheck,
  Tag,
  UserCheck,
} from "lucide-react";
import Image from "next/image";
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
    icon: Receipt,
    title: "Centralized Billing",
    description:
      "One invoice per trip or one monthly consolidated statement. Full visibility into your company's travel spend with category-level breakdowns.",
  },
  {
    icon: FileText,
    title: "GST Invoices",
    description:
      "Every booking comes with a GST-compliant B2B invoice. Input tax credit ready, with GSTIN support for seamless corporate accounting.",
  },
  {
    icon: UserCheck,
    title: "Dedicated Account Manager",
    description:
      "A single point of contact who knows your company's travel policy, preferred airlines, hotel tier standards, and escalation contacts.",
  },
  {
    icon: Tag,
    title: "Bulk Booking Discounts",
    description:
      "Volume-based pricing unlocked from the first booking. The more your team travels, the better your rates — with no hidden conditions.",
  },
  {
    icon: Headphones,
    title: "24/7 Corporate Helpline",
    description:
      "Dedicated priority support line available around the clock. Your travellers are never stranded — anywhere in the world, any hour.",
  },
  {
    icon: ShieldCheck,
    title: "Travel Policy Compliance",
    description:
      "We configure every booking to your internal travel policy — preferred vendors, fare class rules, approval workflows, and spend caps.",
  },
];

const STEPS = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Share Your Requirements",
    description:
      "Tell us about your team size, travel frequency, destinations, and policy requirements. We set up your corporate account in 24 hours.",
  },
  {
    number: "02",
    icon: Building2,
    title: "We Configure Your Account",
    description:
      "Your account manager onboards your travel policy, preferred vendors, and approval hierarchy. Your team starts booking immediately.",
  },
  {
    number: "03",
    icon: Plane,
    title: "Your Team Travels",
    description:
      "Employees book directly through RapidLuxe. You get full visibility, consolidated invoices, and a monthly spend report.",
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
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
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
      toast.success(
        "Request submitted! We'll be in touch within one business day.",
      );
      reset();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="font-sans text-xs font-medium uppercase tracking-widest text-(--color-white-muted)">
            Your Name <span className="text-(--color-coral)">*</span>
          </label>
          <Input
            {...register("contactName", { required: "Name is required" })}
            placeholder="Vikram Nair"
            className="bg-(--color-navy) border-(--color-navy-border) text-(--color-white) placeholder:text-(--color-text-secondary) focus-visible:ring-(--color-gold)/40 focus-visible:border-(--color-gold)/60"
          />
          {errors.contactName && (
            <p className="font-sans text-xs text-(--color-coral)">
              {errors.contactName.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <label className="font-sans text-xs font-medium uppercase tracking-widest text-(--color-white-muted)">
            Work Email <span className="text-(--color-coral)">*</span>
          </label>
          <Input
            {...register("email", {
              required: "Enter a valid email",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email",
              },
            })}
            type="email"
            placeholder="vikram@company.com"
            className="bg-(--color-navy) border-(--color-navy-border) text-(--color-white) placeholder:text-(--color-text-secondary) focus-visible:ring-(--color-gold)/40 focus-visible:border-(--color-gold)/60"
          />
          {errors.email && (
            <p className="font-sans text-xs text-(--color-coral)">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="font-sans text-xs font-medium uppercase tracking-widest text-(--color-white-muted)">
            Company Name <span className="text-(--color-coral)">*</span>
          </label>
          <Input
            {...register("companyName", {
              required: "Company name is required",
            })}
            placeholder="Acme Enterprises Pvt. Ltd."
            className="bg-(--color-navy) border-(--color-navy-border) text-(--color-white) placeholder:text-(--color-text-secondary) focus-visible:ring-(--color-gold)/40 focus-visible:border-(--color-gold)/60"
          />
          {errors.companyName && (
            <p className="font-sans text-xs text-(--color-coral)">
              {errors.companyName.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <label className="font-sans text-xs font-medium uppercase tracking-widest text-(--color-white-muted)">
            GST Number{" "}
            <span className="text-(--color-text-secondary)">(optional)</span>
          </label>
          <Input
            {...register("gstNumber")}
            placeholder="27AABCU9603R1ZX"
            className="font-['JetBrains_Mono'] bg-(--color-navy) border-(--color-navy-border) text-(--color-white) placeholder:text-(--color-text-secondary) focus-visible:ring-(--color-gold)/40 focus-visible:border-(--color-gold)/60"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="font-sans text-xs font-medium uppercase tracking-widest text-(--color-white-muted)">
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
          <SelectTrigger className="bg-(--color-navy) border-(--color-navy-border) text-(--color-text-secondary) focus:ring-(--color-gold)/40">
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
          <p className="font-sans text-xs text-(--color-coral)">
            {errors.teamSize.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="font-sans text-xs font-medium uppercase tracking-widest text-(--color-white-muted)">
          Travel Requirements <span className="text-(--color-coral)">*</span>
        </label>
        <Textarea
          {...register("requirements", {
            required: "Please describe your requirements",
            minLength: { value: 10, message: "Please provide more detail" },
          })}
          rows={4}
          placeholder="Describe your travel frequency, typical destinations, budget range, and any specific requirements..."
          className="bg-(--color-navy) border-(--color-navy-border) text-(--color-white) placeholder:text-(--color-text-secondary) focus-visible:ring-(--color-gold)/40 focus-visible:border-(--color-gold)/60 resize-none"
        />
        {errors.requirements && (
          <p className="font-sans text-xs text-(--color-coral)">
            {errors.requirements.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="bg-(--color-coral) hover:bg-(--color-coral)/90 text-white font-sans font-medium px-8 h-11 gap-2"
      >
        <ArrowRight size={14} />
        Request a Corporate Account
      </Button>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CorporatePage() {
  return (
    <main className="min-h-screen bg-(--color-navy)">
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
            End-to-end business travel management — from policy configuration to
            consolidated GST invoicing — built for India&apos;s leading
            enterprises.
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
            Fill in your details and a dedicated account manager will reach out
            within one business day.
          </p>
        </div>
        <div className="bg-(--color-navy-surface) border border-(--color-navy-border) rounded-2xl p-8 md:p-10">
          <CorporateForm />
        </div>
      </section>
    </main>
  );
}
