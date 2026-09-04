"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  Heart,
  Pencil,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useBookings } from "@/hooks/api/useBookings";
import { useWishlist } from "@/hooks/api/useWishlist";

import type { UserProfile } from "@/types/user";

// ── Errors ────────────────────────────────────────────────────────────────────

class ProfileSaveError extends Error {
  kind: "validation" | "session" | "server";
  details?: { path: (string | number)[]; message: string }[];

  constructor(
    kind: "validation" | "session" | "server",
    message: string,
    details?: { path: (string | number)[]; message: string }[],
  ) {
    super(message);
    this.kind = kind;
    this.details = details;
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────

function AccountSummaryCard({
  icon: Icon,
  title,
  description,
  href,
  linkLabel,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="rounded-2xl border border-(--color-navy-border) bg-(--color-navy-surface) p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
      <div className="flex items-center gap-4">
        <div className="bg-(--color-gold)/10 rounded-full p-3 shrink-0">
          <Icon className="w-6 h-6 text-(--color-gold)" />
        </div>
        <div>
          <p className="font-(--font-display) text-xl text-white leading-tight">
            {title}
          </p>
          <p className="font-(--font-body) text-sm text-(--color-text-secondary) mt-1">
            {description}
          </p>
        </div>
      </div>
      <Link
        href={href}
        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg border border-(--color-gold) text-(--color-gold) font-(--font-body) text-sm font-medium hover:bg-(--color-gold)/10 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-gold) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-navy)"
      >
        {linkLabel}
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("bookings");

  // Personal details form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [nationality, setNationality] = useState("");
  const [passport, setPassport] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | undefined>();

  // Last-known persisted values, used to diff the form and send only what
  // actually changed — see handleSave. Set alongside the form state itself
  // so a post-save refetch establishes a fresh baseline too.
  const baselineRef = useRef<{
    name: string;
    phone: string;
    dob: string;
    nationality: string;
    passport: string;
  } | null>(null);

  // ── Fetch user profile ──
  const {
    data: profileData,
    isLoading: profileLoading,
    isError: profileError,
    isSuccess: profileLoaded,
    refetch: refetchProfile,
  } = useQuery<{ data: UserProfile }>({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const res = await fetch("/api/user/me");
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json() as Promise<{ data: UserProfile }>;
    },
  });

  // A valid editable baseline requires BOTH a successful query and the
  // effect below having actually run to populate baselineRef — isSuccess
  // alone can be true for one render before the effect commits the
  // baseline, and baselineRef alone can't distinguish "never loaded" from
  // "loaded, fields genuinely empty". Combining both closes that gap.
  const hasValidBaseline = profileLoaded && baselineRef.current !== null;

  useEffect(() => {
    if (!profileData?.data) return;
    const p = profileData.data;
    const nextFullName = p.name ?? "";
    const nextPhone = p.phone ?? "";
    const nextDob = p.dateOfBirth ? p.dateOfBirth.split("T")[0] : "";
    const nextNationality = p.nationality ?? "";
    const nextPassport = p.passportNumber ?? "";
    setFullName(nextFullName);
    setPhone(nextPhone);
    setDob(nextDob);
    setNationality(nextNationality);
    setPassport(nextPassport);
    baselineRef.current = {
      name: nextFullName,
      phone: nextPhone,
      dob: nextDob,
      nationality: nextNationality,
      passport: nextPassport,
    };
  }, [profileData]);

  // Builds a PATCH payload containing only fields that changed from the
  // last-known persisted state, so an unrelated edit never re-validates (and
  // can never be blocked by) another field's pre-existing legacy value.
  function buildChangedPayload(): Record<string, string | null> {
    const baseline = baselineRef.current;
    const payload: Record<string, string | null> = {};

    const nameTrimmed = fullName.trim();
    const phoneTrimmed = phone.trim();
    const nationalityTrimmed = nationality.trim();
    const passportTrimmed = passport.trim();

    if (!baseline || nameTrimmed !== baseline.name.trim()) {
      payload.name = nameTrimmed;
    }
    if (!baseline || phoneTrimmed !== baseline.phone.trim()) {
      payload.phone = phoneTrimmed || null;
    }
    if (!baseline || dob !== baseline.dob) {
      payload.dateOfBirth = dob || null;
    }
    if (!baseline || nationalityTrimmed !== baseline.nationality.trim()) {
      payload.nationality = nationalityTrimmed || null;
    }
    if (!baseline || passportTrimmed !== baseline.passport.trim()) {
      payload.passportNumber = passportTrimmed || null;
    }

    return payload;
  }

  function handleSave() {
    // Defense in depth — the Save button is only ever rendered when
    // hasValidBaseline is true, but guard here too so this function can
    // never act on an unestablished baseline regardless of caller.
    if (!hasValidBaseline) return;
    const payload = buildChangedPayload();
    if (Object.keys(payload).length === 0) {
      toast("No changes to save");
      return;
    }
    saveMutation.mutate(payload);
  }

  // ── Save profile mutation ──
  const saveMutation = useMutation({
    mutationFn: async (payload: Record<string, string | null>) => {
      const res = await fetch("/api/user/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        throw new ProfileSaveError(
          "session",
          "Your session has expired. Please sign in again.",
        );
      }
      if (res.status === 400) {
        const body = (await res.json().catch(() => null)) as {
          details?: { path: (string | number)[]; message: string }[];
        } | null;
        throw new ProfileSaveError(
          "validation",
          "Please fix the highlighted fields.",
          body?.details,
        );
      }
      if (!res.ok) {
        throw new ProfileSaveError(
          "server",
          "Something went wrong. Please try again.",
        );
      }
      return res.json() as Promise<{ data: UserProfile }>;
    },
    onSuccess: () => {
      setFieldErrors({});
      setGeneralError(undefined);
      void queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success("Profile updated successfully");
    },
    onError: (err) => {
      if (err instanceof ProfileSaveError) {
        if (err.kind === "validation" && err.details) {
          const mapped: Record<string, string> = {};
          for (const issue of err.details) {
            const key = issue.path[0];
            if (typeof key === "string") mapped[key] = issue.message;
          }
          setFieldErrors(mapped);
          setGeneralError(undefined);
        } else {
          setFieldErrors({});
          setGeneralError(err.message);
        }
        toast.error(err.message);
        return;
      }
      setFieldErrors({});
      setGeneralError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    },
  });

  // ── Bookings ──
  const {
    data: bookingsData,
    isLoading: bookingsLoading,
    isError: bookingsError,
    refetch: refetchBookings,
  } = useBookings();
  const bookingCount = bookingsData?.data?.length ?? 0;

  // ── Wishlist ──
  const {
    packages: wishlistPackages,
    isLoading: wishlistLoading,
    isError: wishlistError,
    refetch: refetchWishlist,
  } = useWishlist();
  const wishlistCount = wishlistPackages.length;

  const todayLocalYMD = (() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  })();

  const inputClass =
    "bg-(--color-navy-surface) border-(--color-navy-border) text-(--color-white) placeholder:text-(--color-text-secondary) focus:border-(--color-gold) focus:ring-1 focus:ring-(--color-gold)/30 rounded-xl h-11 font-(--font-body) text-sm";

  const labelClass =
    "block text-xs font-medium uppercase tracking-wide text-(--color-white-muted) mb-1.5 font-(--font-body)";

  const errorClass = "mt-1.5 text-xs text-(--color-coral) font-(--font-body)";

  return (
    <main className="min-h-screen bg-(--color-navy) pt-24">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12">
        {/* ── Profile Header ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-10">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-(--color-gold)/30 shrink-0 bg-(--color-navy-surface)">
            {user?.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt={user.fullName ?? "Profile"}
                fill
                className="object-cover"
                sizes="80px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User size={32} className="text-(--color-text-secondary)" />
              </div>
            )}
          </div>
          <div className="flex-1">
            {/* Live Clerk identity is preferred here — Prisma only supplies
                fields Clerk doesn't have (phone/DOB/nationality/passport).
                Clerk's SDK state is always current; Prisma's name mirror can
                lag behind a Clerk-native edit until the user.updated webhook
                lands. */}
            <h1 className="font-(--font-display) text-3xl text-white leading-tight">
              {user?.fullName ?? profileData?.data?.name ?? "Traveller"}
            </h1>
            <p className="font-(--font-body) text-sm text-(--color-text-secondary) mt-0.5">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
          <Button
            variant="outline-gold"
            onClick={() => setActiveTab("details")}
            className="h-auto gap-2 px-4 py-2 rounded-full font-sans"
          >
            <Pencil size={14} />
            Edit Profile
          </Button>
        </div>

        {/* ── Tabs ── */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex flex-wrap gap-1 h-auto bg-(--color-navy-surface) border border-(--color-navy-border) p-1 rounded-2xl mb-8 w-full">
            <TabsTrigger
              value="bookings"
              className="flex items-center gap-1.5 text-xs font-(--font-body) data-[state=active]:bg-(--color-gold) data-[state=active]:text-(--color-navy) rounded-xl px-3 py-2 flex-1"
            >
              <Calendar size={13} />
              My Bookings
            </TabsTrigger>
            <TabsTrigger
              value="wishlist"
              className="flex items-center gap-1.5 text-xs font-(--font-body) data-[state=active]:bg-(--color-gold) data-[state=active]:text-(--color-navy) rounded-xl px-3 py-2 flex-1"
            >
              <Heart size={13} />
              Wishlist
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="flex items-center gap-1.5 text-xs font-(--font-body) data-[state=active]:bg-(--color-gold) data-[state=active]:text-(--color-navy) rounded-xl px-3 py-2 flex-1"
            >
              <User size={13} />
              Personal Details
            </TabsTrigger>
          </TabsList>

          {/* ── MY BOOKINGS ──
              Summary only — the dedicated /bookings page owns statuses,
              Pay Now, cancellation, and invoices. No second BookingCard
              implementation here. */}
          <TabsContent value="bookings">
            {bookingsLoading ? (
              <div className="h-28 rounded-2xl bg-(--color-navy-surface) animate-pulse" />
            ) : bookingsError ? (
              <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-(--color-navy-border) bg-(--color-navy-surface)">
                <AlertTriangle
                  size={32}
                  className="text-(--color-coral) mb-3"
                />
                <p className="font-(--font-display) text-lg text-white mb-1">
                  Couldn&apos;t load your bookings
                </p>
                <p className="font-(--font-body) text-sm text-(--color-text-secondary) mb-5 max-w-sm">
                  Something went wrong while fetching your bookings. Please try
                  again.
                </p>
                <Button variant="coral" onClick={() => refetchBookings()}>
                  Try again
                </Button>
              </div>
            ) : bookingCount === 0 ? (
              <EmptyState
                title="No bookings yet"
                description="Start planning your next journey."
                action={{ label: "Explore Journeys", href: "/packages" }}
              />
            ) : (
              <AccountSummaryCard
                icon={Calendar}
                title="My Bookings"
                description={`${bookingCount} booking${bookingCount !== 1 ? "s" : ""} — view statuses, payments, and invoices.`}
                href="/bookings"
                linkLabel="View all bookings"
              />
            )}
          </TabsContent>

          {/* ── WISHLIST ──
              Summary only — the dedicated /wishlist page owns Journey cards
              and wishlist management. No second wishlist card implementation
              here. */}
          <TabsContent value="wishlist">
            {wishlistLoading ? (
              <div className="h-28 rounded-2xl bg-(--color-navy-surface) animate-pulse" />
            ) : wishlistError ? (
              <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-(--color-navy-border) bg-(--color-navy-surface)">
                <AlertTriangle
                  size={32}
                  className="text-(--color-coral) mb-3"
                />
                <p className="font-(--font-display) text-lg text-white mb-1">
                  Couldn&apos;t load your wishlist
                </p>
                <p className="font-(--font-body) text-sm text-(--color-text-secondary) mb-5 max-w-sm">
                  Something went wrong while fetching your saved Journeys.
                  Please try again.
                </p>
                <Button variant="coral" onClick={() => refetchWishlist()}>
                  Try again
                </Button>
              </div>
            ) : wishlistCount === 0 ? (
              <EmptyState
                icon={Heart}
                title="Your wishlist is empty"
                description="Start exploring Journeys and save the ones you love"
                action={{ label: "Browse Journeys", href: "/packages" }}
              />
            ) : (
              <AccountSummaryCard
                icon={Heart}
                title="Wishlist"
                description={`${wishlistCount} saved Journey${wishlistCount !== 1 ? "s" : ""} — manage them anytime.`}
                href="/wishlist"
                linkLabel="View wishlist"
              />
            )}
          </TabsContent>

          {/* ── PERSONAL DETAILS ── */}
          <TabsContent value="details">
            <div className="rounded-2xl border border-(--color-navy-border) bg-(--color-navy-surface) p-6 md:p-8">
              <h2 className="font-(--font-display) text-2xl text-white mb-6">
                Personal Details
              </h2>

              {profileLoading ? (
                <div
                  aria-hidden="true"
                  className="grid grid-cols-1 md:grid-cols-2 gap-5"
                >
                  {["full-name", "phone", "dob", "nationality", "passport"].map(
                    (field, i) => (
                      <div
                        key={field}
                        className={
                          i === 4
                            ? "md:col-span-2 flex flex-col gap-1.5"
                            : "flex flex-col gap-1.5"
                        }
                      >
                        <div className="h-3 w-24 rounded bg-(--color-navy-border) animate-pulse" />
                        <div className="h-11 rounded-xl bg-(--color-navy-border) animate-pulse" />
                      </div>
                    ),
                  )}
                </div>
              ) : profileError ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <AlertTriangle
                    size={32}
                    className="text-(--color-coral) mb-3"
                  />
                  <p
                    role="alert"
                    className="font-(--font-display) text-lg text-white mb-1"
                  >
                    Couldn&apos;t load your profile
                  </p>
                  <p className="font-(--font-body) text-sm text-(--color-text-secondary) mb-5 max-w-sm">
                    Something went wrong while fetching your profile. Please try
                    again.
                  </p>
                  <Button
                    type="button"
                    variant="coral"
                    onClick={() => refetchProfile()}
                  >
                    Try again
                  </Button>
                </div>
              ) : (
                <>
                  {generalError && (
                    <p
                      role="alert"
                      className="mb-5 rounded-lg border border-(--color-coral)/40 bg-(--color-coral)/10 px-4 py-3 text-sm text-(--color-coral) font-(--font-body)"
                    >
                      {generalError}
                    </p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="profile-full-name" className={labelClass}>
                        Full Name
                      </label>
                      <Input
                        id="profile-full-name"
                        className={inputClass}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                        disabled={saveMutation.isPending}
                        aria-invalid={Boolean(fieldErrors.name)}
                        aria-describedby={
                          fieldErrors.name
                            ? "profile-full-name-error"
                            : undefined
                        }
                      />
                      {fieldErrors.name && (
                        <p id="profile-full-name-error" className={errorClass}>
                          {fieldErrors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="profile-phone" className={labelClass}>
                        Phone Number
                      </label>
                      <Input
                        id="profile-phone"
                        className={inputClass}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        disabled={saveMutation.isPending}
                        aria-invalid={Boolean(fieldErrors.phone)}
                        aria-describedby={
                          fieldErrors.phone ? "profile-phone-error" : undefined
                        }
                      />
                      {fieldErrors.phone && (
                        <p id="profile-phone-error" className={errorClass}>
                          {fieldErrors.phone}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="profile-dob" className={labelClass}>
                        Date of Birth
                      </label>
                      <Input
                        id="profile-dob"
                        className={inputClass}
                        type="date"
                        value={dob}
                        max={todayLocalYMD}
                        onChange={(e) => setDob(e.target.value)}
                        disabled={saveMutation.isPending}
                        aria-invalid={Boolean(fieldErrors.dateOfBirth)}
                        aria-describedby={
                          fieldErrors.dateOfBirth
                            ? "profile-dob-error"
                            : undefined
                        }
                      />
                      {fieldErrors.dateOfBirth && (
                        <p id="profile-dob-error" className={errorClass}>
                          {fieldErrors.dateOfBirth}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="profile-nationality"
                        className={labelClass}
                      >
                        Nationality
                      </label>
                      <Input
                        id="profile-nationality"
                        className={inputClass}
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        placeholder="Indian"
                        disabled={saveMutation.isPending}
                        aria-invalid={Boolean(fieldErrors.nationality)}
                        aria-describedby={
                          fieldErrors.nationality
                            ? "profile-nationality-error"
                            : undefined
                        }
                      />
                      {fieldErrors.nationality && (
                        <p
                          id="profile-nationality-error"
                          className={errorClass}
                        >
                          {fieldErrors.nationality}
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="profile-passport" className={labelClass}>
                        Passport Number
                      </label>
                      <Input
                        id="profile-passport"
                        className={inputClass}
                        value={passport}
                        onChange={(e) => setPassport(e.target.value)}
                        placeholder="A1234567"
                        disabled={saveMutation.isPending}
                        aria-invalid={Boolean(fieldErrors.passportNumber)}
                        aria-describedby={
                          fieldErrors.passportNumber
                            ? "profile-passport-error"
                            : undefined
                        }
                      />
                      {fieldErrors.passportNumber && (
                        <p id="profile-passport-error" className={errorClass}>
                          {fieldErrors.passportNumber}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline-gold"
                    onClick={handleSave}
                    disabled={saveMutation.isPending || !hasValidBaseline}
                    className="h-auto mt-8 px-6 py-2.5 rounded-full font-sans font-medium"
                  >
                    {saveMutation.isPending ? "Saving…" : "Save Changes"}
                  </Button>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
