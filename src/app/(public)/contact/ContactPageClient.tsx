"use client";

import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { MapboxMap } from "@/components/shared/MapboxMap";
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

interface FormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

const SUPPORT_PHONE = process.env.NEXT_PUBLIC_SUPPORT_PHONE ?? "+919137456611";
const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "info@rapidluxe.com";

const CONTACT_BLOCKS = [
  {
    icon: Phone,
    heading: "Phone",
    detail: SUPPORT_PHONE,
    href: `tel:${SUPPORT_PHONE}`,
  },
  {
    icon: Mail,
    heading: "Email",
    detail: SUPPORT_EMAIL,
    href: `mailto:${SUPPORT_EMAIL}`,
  },
  {
    icon: Clock,
    heading: "Business Hours",
    detail: "Mon–Sat, 9AM–8PM IST",
    href: null,
  },
  {
    icon: MapPin,
    heading: "Location",
    detail:
      "Ground Floor, 20/21, Ekta Tripolis, Siddharth Nagar, Goregaon West, Mumbai - 400104, Maharashtra",
    href: null,
  },
];

export default function ContactPageClient() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone ?? "",
          subject: data.subject,
          message: data.message,
          type: "GENERAL",
        }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Message sent! We'll be in touch within 2 hours.");
      reset();
    } catch {
      toast.error("Failed to send. Please try WhatsApp or email us directly.");
    }
  };

  return (
    <main className="min-h-screen bg-(--color-navy)">
      {/* Hero */}
      <section className="py-20 text-center border-b border-(--color-navy-border)">
        <p className="font-sans text-sm tracking-widest uppercase text-(--color-gold) mb-3">
          We&apos;d Love to Hear from You
        </p>
        <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl text-(--color-white) font-light">
          Get in Touch
        </h1>
        <p className="font-sans text-(--color-text-secondary) text-sm mt-4 max-w-md mx-auto leading-relaxed">
          Whether you have a question, a custom itinerary request, or just want
          to say hello — our team is here to help.
        </p>
      </section>

      {/* Main grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* ── Form ─────────────────────────────────────────── */}
          <div className="lg:col-span-3">
            <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-(--color-white) mb-8">
              Send us a message
            </h2>

            {isSubmitSuccessful && (
              <div className="mb-6 rounded-lg border border-(--color-teal)/40 bg-(--color-teal)/10 px-5 py-4 font-sans text-sm text-(--color-teal)">
                Your message has been sent. We&apos;ll get back to you within 24
                hours.
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
              noValidate
            >
              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="font-sans text-xs font-medium uppercase tracking-widest text-(--color-white-muted)">
                    Full Name <span className="text-(--color-coral)">*</span>
                  </label>
                  <Input
                    {...register("name", {
                      required: "Name is required",
                      minLength: { value: 2, message: "Name is required" },
                    })}
                    placeholder="Priya Sharma"
                    className="bg-(--color-navy-surface) border-(--color-navy-border) text-(--color-white) placeholder:text-(--color-text-secondary) focus-visible:ring-(--color-gold)/40 focus-visible:border-(--color-gold)/60"
                  />
                  {errors.name && (
                    <p className="font-sans text-xs text-(--color-coral)">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="font-sans text-xs font-medium uppercase tracking-widest text-(--color-white-muted)">
                    Email <span className="text-(--color-coral)">*</span>
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
                    placeholder="priya@example.com"
                    className="bg-(--color-navy-surface) border-(--color-navy-border) text-(--color-white) placeholder:text-(--color-text-secondary) focus-visible:ring-(--color-gold)/40 focus-visible:border-(--color-gold)/60"
                  />
                  {errors.email && (
                    <p className="font-sans text-xs text-(--color-coral)">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone + Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="font-sans text-xs font-medium uppercase tracking-widest text-(--color-white-muted)">
                    Phone{" "}
                    <span className="text-(--color-text-secondary)">
                      (optional)
                    </span>
                  </label>
                  <Input
                    {...register("phone")}
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="bg-(--color-navy-surface) border-(--color-navy-border) text-(--color-white) placeholder:text-(--color-text-secondary) focus-visible:ring-(--color-gold)/40 focus-visible:border-(--color-gold)/60"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-sans text-xs font-medium uppercase tracking-widest text-(--color-white-muted)">
                    Subject <span className="text-(--color-coral)">*</span>
                  </label>
                  <input
                    type="hidden"
                    {...register("subject", {
                      required: "Please select a subject",
                    })}
                  />
                  <Select
                    onValueChange={(val) =>
                      setValue("subject", val, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger className="bg-(--color-navy-surface) border-(--color-navy-border) text-(--color-text-secondary) focus:ring-(--color-gold)/40 data-placeholder:text-(--color-text-secondary)">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent className="bg-(--color-navy-surface) border-(--color-navy-border)">
                      {[
                        "General",
                        "Booking",
                        "Custom Itinerary",
                        "Cancellation",
                        "Partnership",
                      ].map((s) => (
                        <SelectItem
                          key={s}
                          value={s}
                          className="font-sans text-sm text-(--color-white-muted) focus:bg-(--color-navy-border) focus:text-(--color-white)"
                        >
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.subject && (
                    <p className="font-sans text-xs text-(--color-coral)">
                      {errors.subject.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="font-sans text-xs font-medium uppercase tracking-widest text-(--color-white-muted)">
                  Message <span className="text-(--color-coral)">*</span>
                </label>
                <Textarea
                  {...register("message", {
                    required: "Message is required",
                    minLength: {
                      value: 10,
                      message: "Message must be at least 10 characters",
                    },
                  })}
                  rows={5}
                  placeholder="Tell us about your dream trip or any questions you have..."
                  className="bg-(--color-navy-surface) border-(--color-navy-border) text-(--color-white) placeholder:text-(--color-text-secondary) focus-visible:ring-(--color-gold)/40 focus-visible:border-(--color-gold)/60 resize-none"
                />
                {errors.message && (
                  <p className="font-sans text-xs text-(--color-coral)">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="coral"
                disabled={isSubmitting}
                className="font-sans font-medium px-8 h-11 gap-2"
              >
                <Send size={14} />
                {isSubmitting ? "Sending..." : "Send Message →"}
              </Button>
            </form>
          </div>

          {/* ── Contact Info ──────────────────────────────────── */}
          <div className="lg:col-span-2">
            <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-(--color-white) mb-8">
              Reach Us Directly
            </h2>

            <div className="space-y-6">
              {CONTACT_BLOCKS.map(({ icon: Icon, heading, detail, href }) => (
                <div key={heading} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-(--color-gold)/10 border border-(--color-gold)/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={16} className="text-(--color-gold)" />
                  </div>
                  <div>
                    <p className="font-sans text-xs uppercase tracking-widest text-(--color-text-secondary) mb-0.5">
                      {heading}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="font-sans text-sm text-(--color-white-muted) hover:text-(--color-white) transition-colors"
                      >
                        {detail}
                      </a>
                    ) : (
                      <p className="font-sans text-sm text-(--color-white-muted)">
                        {detail}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* WhatsApp CTA */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <MessageCircle size={16} className="text-[#25D366]" />
                </div>
                <div>
                  <p className="font-sans text-xs uppercase tracking-widest text-(--color-text-secondary) mb-1.5">
                    WhatsApp
                  </p>
                  <a
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] text-white font-sans text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#25D366]/90 transition-colors"
                  >
                    <MessageCircle size={14} />
                    Chat with us on WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="mt-10">
              <MapboxMap
                lat={18.9388}
                lng={72.8354}
                zoom={13}
                className="h-48"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
