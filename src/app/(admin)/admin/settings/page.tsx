"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Info } from "lucide-react";
import { toast } from "sonner";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SettingsForm {
  companyName: string;
  gstin: string;
  hsnCode: string;
  invoicePrefix: string;
  contactEmail: string;
  whatsappNumber: string;
}

interface SocialForm {
  social_instagram: string;
  social_facebook: string;
  social_youtube: string;
  social_twitter: string;
  social_whatsapp: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const INPUT_CLASS =
  "w-full bg-(--color-navy) border border-(--color-navy-border) rounded-lg px-3 py-2.5 text-sm font-['DM_Sans'] text-white placeholder:text-(--color-text-secondary) focus:outline-none focus:border-(--color-gold)/60 transition-colors";

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-6">
      <h2 className="font-['Cormorant_Garamond'] text-xl text-(--color-gold) mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-['DM_Sans'] text-(--color-text-secondary)">
        {label}
      </label>
      {children}
      {hint && (
        <p className="text-xs font-['DM_Sans'] text-(--color-text-secondary) mt-0.5">
          {hint}
        </p>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const DEFAULT_VALUES: SettingsForm = {
  companyName: "Rapidluxe Pvt. Ltd.",
  gstin: "27AAPCR1322N1Z",
  hsnCode: "998551",
  invoicePrefix: "RL-INV",
  contactEmail: "info@rapidluxe.com",
  whatsappNumber: "+91 91374 56611",
};

export default function AdminSettingsPage() {
  const { register, handleSubmit } = useForm<SettingsForm>({
    defaultValues: DEFAULT_VALUES,
  });

  const {
    register: registerSocial,
    handleSubmit: handleSocialSubmit,
    reset: resetSocial,
  } = useForm<SocialForm>({
    defaultValues: {
      social_instagram: "",
      social_facebook: "",
      social_youtube: "",
      social_twitter: "",
      social_whatsapp: "",
    },
  });

  const [savingSocial, setSavingSocial] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data: Record<string, string>) => {
        resetSocial({
          social_instagram: data.social_instagram ?? "",
          social_facebook: data.social_facebook ?? "",
          social_youtube: data.social_youtube ?? "",
          social_twitter: data.social_twitter ?? "",
          social_whatsapp: data.social_whatsapp ?? "",
        });
      })
      .catch(() => null);
  }, [resetSocial]);

  function onSubmit(data: SettingsForm) {
    console.log("Save settings:", data);
  }

  async function onSocialSubmit(data: SocialForm) {
    setSavingSocial(true);
    try {
      const body = Object.entries(data).map(([key, value]) => ({ key, value }));
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Social media links saved");
    } catch {
      toast.error("Failed to save social links");
    } finally {
      setSavingSocial(false);
    }
  }

  return (
    <div className="px-4 md:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-white">
          Settings
        </h1>
      </div>

      <div className="flex flex-col gap-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* 1. Company Info */}
          <SectionCard title="Company Info">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Company Name">
                <input
                  {...register("companyName")}
                  type="text"
                  className={INPUT_CLASS}
                />
              </Field>
              <Field label="GSTIN">
                <input
                  {...register("gstin")}
                  type="text"
                  className={INPUT_CLASS}
                />
              </Field>
            </div>
          </SectionCard>

          {/* 2. Tax Settings */}
          <SectionCard title="Tax Settings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="HSN Code" hint="998551 — Tour Operator Services">
                <input
                  {...register("hsnCode")}
                  type="text"
                  className={INPUT_CLASS}
                />
              </Field>
              <Field label="Invoice Prefix">
                <input
                  {...register("invoicePrefix")}
                  type="text"
                  className={INPUT_CLASS}
                />
              </Field>
            </div>
          </SectionCard>

          {/* 3. Contact Details */}
          <SectionCard title="Contact Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Contact Email">
                <input
                  {...register("contactEmail")}
                  type="email"
                  className={INPUT_CLASS}
                />
              </Field>
              <Field label="WhatsApp Number">
                <input
                  {...register("whatsappNumber")}
                  type="text"
                  className={INPUT_CLASS}
                />
              </Field>
            </div>
          </SectionCard>

          {/* 4. Payment Gateway (info only) */}
          <div className="bg-(--color-navy-surface) rounded-xl border border-(--color-navy-border) p-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-(--color-navy-border) flex items-center justify-center shrink-0 mt-0.5">
                <Info size={16} className="text-(--color-text-secondary)" />
              </div>
              <div>
                <h2 className="font-['Cormorant_Garamond'] text-xl text-white mb-1">
                  Payment Gateway
                </h2>
                <p className="font-['DM_Sans'] text-sm text-(--color-text-secondary) leading-relaxed">
                  Razorpay is configured. API keys are managed via environment
                  variables.
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div>
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-2.5 rounded-lg bg-(--color-gold)/20 border border-(--color-gold)/40 text-(--color-gold) text-sm font-['DM_Sans'] font-medium hover:bg-(--color-gold)/30 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </form>

        {/* 5. Social Media */}
        <form
          onSubmit={handleSocialSubmit(onSocialSubmit)}
          className="flex flex-col gap-6"
        >
          <SectionCard title="Social Media">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Instagram URL">
                <input
                  {...registerSocial("social_instagram")}
                  type="url"
                  placeholder="https://instagram.com/rapidluxe"
                  className={INPUT_CLASS}
                />
              </Field>
              <Field label="Facebook URL">
                <input
                  {...registerSocial("social_facebook")}
                  type="url"
                  placeholder="https://facebook.com/rapidluxe"
                  className={INPUT_CLASS}
                />
              </Field>
              <Field label="YouTube URL">
                <input
                  {...registerSocial("social_youtube")}
                  type="url"
                  placeholder="https://youtube.com/@rapidluxe"
                  className={INPUT_CLASS}
                />
              </Field>
              <Field label="Twitter / X URL">
                <input
                  {...registerSocial("social_twitter")}
                  type="url"
                  placeholder="https://twitter.com/rapidluxe"
                  className={INPUT_CLASS}
                />
              </Field>
              <Field
                label="WhatsApp Number"
                hint="Include country code, e.g. 919167621232"
              >
                <input
                  {...registerSocial("social_whatsapp")}
                  type="text"
                  placeholder="919167621232"
                  className={INPUT_CLASS}
                />
              </Field>
            </div>
          </SectionCard>

          <div>
            <button
              type="submit"
              disabled={savingSocial}
              className="w-full md:w-auto px-8 py-2.5 rounded-lg bg-(--color-gold)/20 border border-(--color-gold)/40 text-(--color-gold) text-sm font-['DM_Sans'] font-medium hover:bg-(--color-gold)/30 transition-colors disabled:opacity-50"
            >
              {savingSocial ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
