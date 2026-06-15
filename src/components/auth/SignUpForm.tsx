"use client";

import { useSignUp } from "@clerk/nextjs/legacy";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v3";

import { cn } from "@/lib/utils";

// ── Schemas

const step1Schema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const otpSchema = z.object({
  code: z
    .string()
    .length(6, "Code must be exactly 6 digits")
    .regex(/^\d+$/, "Digits only"),
});

type Step1Data = z.infer<typeof step1Schema>;
type OtpData = z.infer<typeof otpSchema>;

// ── Shared icons

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58Z"
        fill="#EA4335"
      />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// ── Field wrapper ─────────────────────────────────────────────────────────────

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium uppercase tracking-wide text-(--color-white-muted)">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-[#E07A5F] flex items-center gap-1">
          <span>✕</span> {error}
        </p>
      )}
    </div>
  );
}

const inputBase =
  "w-full h-12 rounded-xl px-4 text-sm outline-none transition-all duration-200 " +
  "bg-(--color-navy-surface) border border-(--color-navy-border) " +
  "text-(--color-white) placeholder:text-(--color-text-secondary) " +
  "focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 " +
  "aria-[invalid=true]:border-[#E07A5F] aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-[#E07A5F]/20";

const ctaBase =
  "w-full h-12 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200 " +
  "bg-[#E07A5F] text-white hover:bg-[#c9684e] " +
  "shadow-lg shadow-[#E07A5F]/25 hover:shadow-[#E07A5F]/40 " +
  "disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2";

// ── OTP Step ──────────────────────────────────────────────────────────────────

function OtpStep({
  email,
  onVerify,
  onResend,
  onBack,
}: {
  email: string;
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  onBack: () => void;
}) {
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OtpData>({ resolver: zodResolver(otpSchema) });

  const handleResend = async () => {
    try {
      await onResend();
      setResendCooldown(30);
      const interval = setInterval(() => {
        setResendCooldown((c) => {
          if (c <= 1) {
            clearInterval(interval);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    } catch {
      setGlobalError("Failed to resend code.");
    }
  };

  const onSubmit = async ({ code }: OtpData) => {
    setGlobalError(null);
    try {
      await onVerify(code);
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setGlobalError(err.errors[0]?.longMessage ?? "Invalid code.");
      } else {
        setGlobalError("Verification failed. Please try again.");
      }
    }
  };

  return (
    <div className="w-full space-y-5">
      {/* Back */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-(--color-text-secondary) hover:text-[#C9A84C] transition-colors"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path d="M19 12H5m7-7-7 7 7 7" />
        </svg>
        Back
      </button>

      <div className="space-y-1">
        <p className="text-sm text-(--color-white-muted)">
          We&apos;ve sent a 6-digit code to
        </p>
        <p className="font-medium text-white">{email}</p>
      </div>

      {globalError && (
        <div className="rounded-xl border border-[#E07A5F]/30 bg-[#E07A5F]/10 px-4 py-3 text-sm text-[#E07A5F]">
          {globalError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Verification Code" error={errors.code?.message}>
          <input
            id="sign-up-otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="000000"
            aria-invalid={!!errors.code}
            className={cn(
              inputBase,
              "text-center text-lg tracking-[0.5em] font-mono",
            )}
            {...register("code")}
          />
        </Field>

        <button
          id="sign-up-verify"
          type="submit"
          disabled={isSubmitting}
          className={ctaBase}
        >
          {isSubmitting ? (
            <>
              <Spinner /> Verifying…
            </>
          ) : (
            "Verify Email"
          )}
        </button>
      </form>

      <p className="text-center text-sm text-(--color-text-secondary)">
        Didn&apos;t receive it?{" "}
        {resendCooldown > 0 ? (
          <span className="text-(--color-text-secondary)">
            Resend in {resendCooldown}s
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="text-[#C9A84C] hover:text-[#E2C47A] font-medium transition-colors"
          >
            Resend code
          </button>
        )}
      </p>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function SignUpForm() {
  const { signUp, isLoaded, setActive } = useSignUp();
  const router = useRouter();

  const [step, setStep] = useState<"details" | "otp">("details");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [oauthProvider, setOauthProvider] = useState<"google" | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Step1Data>({ resolver: zodResolver(step1Schema) });

  // ── Step 1: create account ────────────────────────────────────────────────

  const onSubmit = async (data: Step1Data) => {
    if (!isLoaded || !signUp) return;
    setGlobalError(null);
    try {
      await signUp.create({
        firstName: data.firstName,
        lastName: data.lastName,
        emailAddress: data.email,
        password: data.password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingEmail(data.email);
      setStep("otp");
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setGlobalError(err.errors[0]?.longMessage ?? "Sign up failed.");
      } else {
        setGlobalError("Something went wrong. Please try again.");
      }
    }
  };

  // ── Step 2: verify OTP ────────────────────────────────────────────────────

  const onVerify = async (code: string) => {
    if (!isLoaded || !signUp) return;
    const result = await signUp.attemptEmailAddressVerification({ code });
    if (result.status === "complete") {
      await setActive({ session: result.createdSessionId });
      router.push("/");
    }
  };

  const onResend = async () => {
    if (!signUp) return;
    await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
  };

  // ── Google OAuth ──────────────────────────────────────────────────────────

  const handleOAuth = async (provider: "google") => {
    if (!isLoaded || !signUp) return;
    setOauthProvider(provider);
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch {
      setOauthProvider(null);
      setGlobalError("Google sign-up failed. Please try again.");
    }
  };

  const busy = isSubmitting || oauthProvider !== null;

  // ── OTP step ──────────────────────────────────────────────────────────────

  if (step === "otp") {
    return (
      <OtpStep
        email={pendingEmail}
        onVerify={onVerify}
        onResend={onResend}
        onBack={() => setStep("details")}
      />
    );
  }

  // ── Step 1 ────────────────────────────────────────────────────────────────

  return (
    <div className="w-full space-y-5">
      {globalError && (
        <div className="rounded-xl border border-[#E07A5F]/30 bg-[#E07A5F]/10 px-4 py-3 text-sm text-[#E07A5F]">
          {globalError}
        </div>
      )}

      {/* OAuth buttons */}
      <button
        id="sign-up-google"
        type="button"
        onClick={() => handleOAuth("google")}
        disabled={busy}
        className={cn(
          "w-full flex items-center justify-center gap-2.5 h-12 rounded-xl border text-sm font-medium transition-all duration-200",
          "bg-(--color-navy-surface) border-(--color-navy-border) text-white",
          "hover:border-[#C9A84C]/40 hover:bg-(--color-navy-border)",
          "disabled:opacity-50 disabled:cursor-not-allowed",
        )}
      >
        {oauthProvider === "google" ? <Spinner /> : <GoogleIcon />}
        Continue with Google
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-(--color-navy-border)" />
        <span className="text-xs text-(--color-text-secondary)">or</span>
        <div className="h-px flex-1 bg-(--color-navy-border)" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {/* Name row */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="First Name" error={errors.firstName?.message}>
            <input
              id="sign-up-first-name"
              type="text"
              placeholder="Aarav"
              autoComplete="given-name"
              aria-invalid={!!errors.firstName}
              className={inputBase}
              {...register("firstName")}
            />
          </Field>
          <Field label="Last Name" error={errors.lastName?.message}>
            <input
              id="sign-up-last-name"
              type="text"
              placeholder="Shah"
              autoComplete="family-name"
              aria-invalid={!!errors.lastName}
              className={inputBase}
              {...register("lastName")}
            />
          </Field>
        </div>

        {/* Email */}
        <Field label="Email" error={errors.email?.message}>
          <input
            id="sign-up-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            className={inputBase}
            {...register("email")}
          />
        </Field>

        {/* Password */}
        <Field label="Password" error={errors.password?.message}>
          <div className="relative">
            <input
              id="sign-up-password"
              type={showPassword ? "text" : "password"}
              placeholder="Min. 8 chars, 1 uppercase, 1 number"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              className={cn(inputBase, "pr-12")}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-(--color-text-secondary) hover:text-[#C9A84C] transition-colors"
            >
              {showPassword ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </button>
          </div>
        </Field>

        {/* Confirm password */}
        <Field label="Confirm Password" error={errors.confirmPassword?.message}>
          <div className="relative">
            <input
              id="sign-up-confirm-password"
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              className={cn(inputBase, "pr-12")}
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? "Hide password" : "Show password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-(--color-text-secondary) hover:text-[#C9A84C] transition-colors"
            >
              {showConfirm ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </button>
          </div>
        </Field>

        {/* Terms */}
        <p className="text-xs text-(--color-text-secondary) leading-relaxed">
          By creating an account, you agree to our{" "}
          <Link
            href="/terms"
            className="text-[#C9A84C] hover:text-[#E2C47A] transition-colors"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-[#C9A84C] hover:text-[#E2C47A] transition-colors"
          >
            Privacy Policy
          </Link>
          .
        </p>

        {/* Submit */}
        <button
          id="sign-up-submit"
          type="submit"
          disabled={busy}
          className={ctaBase}
        >
          {isSubmitting ? (
            <>
              <Spinner /> Creating account…
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-(--color-text-secondary)">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="text-[#C9A84C] hover:text-[#E2C47A] font-medium transition-colors"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}
