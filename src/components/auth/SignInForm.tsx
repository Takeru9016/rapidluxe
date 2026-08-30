"use client";

import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { useSignIn } from "@clerk/nextjs/legacy";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v3";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ── Schema ──────────────────────────────────────────────────────────────────

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

// ── Icons ─────────────────────────────────────────────────────────────────────

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
          <span aria-hidden="true">✕</span> {error}
        </p>
      )}
    </div>
  );
}

const inputBase =
  "w-full h-12 rounded-lg px-4 text-sm outline-none transition-all duration-200 " +
  "bg-(--color-navy-surface) border border-(--color-navy-border) " +
  "text-(--color-white) placeholder:text-(--color-text-secondary) " +
  "focus:border-(--color-gold) focus:ring-2 focus:ring-(--color-gold)/20 " +
  "aria-[invalid=true]:border-[#E07A5F] aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-[#E07A5F]/20";

// ── Component ────────────────────────────────────────────────────────────────

export function SignInForm() {
  const { signIn, isLoaded, setActive } = useSignIn();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [oauthProvider, setOauthProvider] = useState<"google" | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (!isLoaded || !signIn) return;
    setGlobalError(null);
    try {
      const result = await signIn.create({
        identifier: data.email,
        password: data.password,
      });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/");
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setGlobalError(err.errors[0]?.longMessage ?? "Sign in failed.");
      } else {
        setGlobalError("Something went wrong. Please try again.");
      }
    }
  };

  const handleOAuth = async (provider: "google") => {
    if (!isLoaded || !signIn) return;
    setOauthProvider(provider);
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch {
      setOauthProvider(null);
      setGlobalError("Google sign-in failed. Please try again.");
    }
  };

  const busy = isSubmitting || oauthProvider !== null;

  return (
    <div className="w-full space-y-5">
      {/* Global error */}
      {globalError && (
        <div className="rounded-xl border border-[#E07A5F]/30 bg-[#E07A5F]/10 px-4 py-3 text-sm text-[#E07A5F]">
          {globalError}
        </div>
      )}

      {/* OAuth buttons */}
      <button
        id="sign-in-google"
        type="button"
        onClick={() => handleOAuth("google")}
        disabled={busy}
        className={cn(
          "w-full flex items-center justify-center gap-2.5 h-12 rounded-xl border text-sm font-medium transition-all duration-200",
          "bg-(--color-navy-surface) border-(--color-navy-border) text-white",
          "hover:border-(--color-gold)/40 hover:bg-(--color-navy-border)",
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
        <Field label="Email" error={errors.email?.message}>
          <input
            id="sign-in-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            className={inputBase}
            {...register("email")}
          />
        </Field>

        <Field label="Password" error={errors.password?.message}>
          <div className="relative">
            <input
              id="sign-in-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              className={cn(inputBase, "pr-12")}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-(--color-text-secondary) hover:text-(--color-gold) transition-colors"
            >
              {showPassword ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </button>
          </div>
        </Field>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              id="sign-in-remember"
              type="checkbox"
              {...register("rememberMe")}
              className="h-4 w-4 rounded border-(--color-navy-border) accent-(--color-gold)"
            />
            <span className="text-sm text-(--color-text-secondary)">
              Remember me
            </span>
          </label>
          <Link
            href="/sign-in/forgot-password"
            className="text-sm text-(--color-gold) hover:text-(--color-gold-light) transition-colors font-medium"
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          id="sign-in-submit"
          type="submit"
          variant="coral"
          disabled={busy}
          className="w-full h-12 font-semibold text-sm tracking-wide gap-2"
        >
          {isSubmitting ? (
            <>
              <Spinner /> Signing in…
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-(--color-text-secondary)">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="text-(--color-gold) hover:text-(--color-gold-light) font-medium transition-colors"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}
