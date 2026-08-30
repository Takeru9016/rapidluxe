"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar, Heart, MapPin, Pencil, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/shared/Badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useBookings } from "@/hooks/api/useBookings";
import { useWishlist } from "@/hooks/api/useWishlist";

import { formatDate, formatPrice } from "@/lib/utils";
import type { DisplayStatus, UserBooking } from "@/types/booking";
import type { UserProfile } from "@/types/user";

// ── Types ─────────────────────────────────────────────────────────────────────

type FilterTab = "all" | DisplayStatus;

// ── Helpers ───────────────────────────────────────────────────────────────────

const statusConfig: Record<
  DisplayStatus,
  { label: string; variant: "teal" | "ghost" | "coral" }
> = {
  upcoming: { label: "Upcoming", variant: "teal" },
  completed: { label: "Completed", variant: "ghost" },
  cancelled: { label: "Cancelled", variant: "coral" },
  refunded: { label: "Refunded", variant: "ghost" },
};

// ── Sub-components ────────────────────────────────────────────────────────────

function BookingCard({ booking }: { booking: UserBooking }) {
  const { label, variant } = statusConfig[booking.displayStatus];
  const coverImage = booking.package.images[0] ?? null;
  return (
    <div className="flex flex-col sm:flex-row gap-4 rounded-2xl border border-(--color-navy-border) bg-(--color-navy-surface) overflow-hidden">
      <div className="relative w-full sm:w-40 h-40 sm:h-auto shrink-0 bg-(--color-navy-border)">
        {coverImage && (
          <Image
            src={coverImage}
            alt={booking.package.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 160px"
          />
        )}
      </div>
      <div className="flex flex-col justify-between p-4 flex-1 gap-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-['Cormorant_Garamond'] text-xl text-white leading-tight">
              {booking.package.title}
            </p>
            {booking.bookingRef && (
              <p className="font-['DM_Sans'] text-xs text-(--color-text-secondary) mt-1">
                {booking.bookingRef}
              </p>
            )}
          </div>
          <Badge variant={variant} size="sm">
            {label}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-(--color-white-muted) font-['DM_Sans']">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} className="text-(--color-gold)" />
            {formatDate(booking.departureDate)}
            {booking.returnDate ? ` → ${formatDate(booking.returnDate)}` : ""}
          </span>
          <span className="flex items-center gap-1.5">
            <User size={14} className="text-(--color-gold)" />
            {booking.adults + booking.children} travellers
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-(--color-gold) text-base">
            {formatPrice(booking.totalAmount)}
          </span>
          <Link
            href={`/bookings/${booking.id}`}
            className="text-xs font-['DM_Sans'] font-medium text-(--color-gold) hover:text-(--color-gold-light) transition-colors"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("bookings");
  const [bookingFilter, setBookingFilter] = useState<FilterTab>("all");

  // Personal details form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [nationality, setNationality] = useState("");
  const [passport, setPassport] = useState("");

  // ── Fetch user profile ──
  const { data: profileData } = useQuery<{ data: UserProfile }>({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const res = await fetch("/api/user/me");
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json() as Promise<{ data: UserProfile }>;
    },
  });

  useEffect(() => {
    if (!profileData?.data) return;
    const p = profileData.data;
    setFullName(p.name ?? "");
    setPhone(p.phone ?? "");
    setDob(p.dateOfBirth ? p.dateOfBirth.split("T")[0] : "");
    setNationality(p.nationality ?? "");
    setPassport(p.passportNumber ?? "");
  }, [profileData]);

  // ── Save profile mutation ──
  const saveMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/user/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          phone: phone || null,
          dateOfBirth: dob || null,
          nationality: nationality || null,
          passportNumber: passport || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      return res.json() as Promise<{ data: UserProfile }>;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success("Profile updated successfully");
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });

  // ── Bookings ──
  const { data: bookingsData, isLoading: bookingsLoading } = useBookings();
  const allBookings = bookingsData?.data ?? [];
  const filteredBookings =
    bookingFilter === "all"
      ? allBookings
      : allBookings.filter((b) => b.displayStatus === bookingFilter);

  // ── Wishlist ──
  const { packages: wishlistPackages, isLoading: wishlistLoading } =
    useWishlist();

  const inputClass =
    "bg-(--color-navy-surface) border-(--color-navy-border) text-(--color-white) placeholder:text-(--color-text-secondary) focus:border-(--color-gold) focus:ring-1 focus:ring-(--color-gold)/30 rounded-xl h-11 font-['DM_Sans'] text-sm";

  const labelClass =
    "block text-xs font-medium uppercase tracking-wide text-(--color-white-muted) mb-1.5 font-['DM_Sans']";

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
            <h1 className="font-['Cormorant_Garamond'] text-3xl text-white leading-tight">
              {profileData?.data?.name ?? user?.fullName ?? "Traveller"}
            </h1>
            <p className="font-['DM_Sans'] text-sm text-(--color-text-secondary) mt-0.5">
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
              className="flex items-center gap-1.5 text-xs font-['DM_Sans'] data-[state=active]:bg-(--color-gold) data-[state=active]:text-(--color-navy) rounded-xl px-3 py-2 flex-1"
            >
              <Calendar size={13} />
              My Bookings
            </TabsTrigger>
            <TabsTrigger
              value="wishlist"
              className="flex items-center gap-1.5 text-xs font-['DM_Sans'] data-[state=active]:bg-(--color-gold) data-[state=active]:text-(--color-navy) rounded-xl px-3 py-2 flex-1"
            >
              <Heart size={13} />
              Wishlist
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="flex items-center gap-1.5 text-xs font-['DM_Sans'] data-[state=active]:bg-(--color-gold) data-[state=active]:text-(--color-navy) rounded-xl px-3 py-2 flex-1"
            >
              <User size={13} />
              Personal Details
            </TabsTrigger>
          </TabsList>

          {/* ── MY BOOKINGS ── */}
          <TabsContent value="bookings">
            <div className="flex flex-wrap gap-2 mb-6">
              {(
                [
                  ["all", "All"],
                  ["upcoming", "Upcoming"],
                  ["completed", "Completed"],
                  ["cancelled", "Cancelled"],
                ] as const
              ).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setBookingFilter(val)}
                  className={`px-4 py-1.5 rounded-full text-sm font-['DM_Sans'] border transition-colors ${
                    bookingFilter === val
                      ? "border-(--color-gold) bg-(--color-gold)/10 text-(--color-gold)"
                      : "border-(--color-navy-border) text-(--color-text-secondary) hover:border-(--color-gold)/40"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {bookingsLoading ? (
              <div className="flex flex-col gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-40 rounded-2xl bg-(--color-navy-surface) animate-pulse"
                  />
                ))}
              </div>
            ) : filteredBookings.length === 0 ? (
              <EmptyState
                title="No bookings yet"
                description="Start planning your next journey."
                action={{ label: "Explore Packages", href: "/packages" }}
              />
            ) : (
              <div className="flex flex-col gap-4">
                {filteredBookings.map((b) => (
                  <BookingCard key={b.id} booking={b} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── WISHLIST ── */}
          <TabsContent value="wishlist">
            {wishlistLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-28 rounded-2xl bg-(--color-navy-surface) animate-pulse"
                  />
                ))}
              </div>
            ) : wishlistPackages.length === 0 ? (
              <EmptyState
                icon={Heart}
                title="Your wishlist is empty"
                description="Browse packages and save your favourites."
                action={{ label: "Browse Packages", href: "/packages" }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wishlistPackages.map((pkg) => (
                  <Link
                    key={pkg.id}
                    href={`/packages/${pkg.slug}`}
                    className="group flex gap-4 rounded-2xl border border-(--color-navy-border) bg-(--color-navy-surface) overflow-hidden hover:border-(--color-gold)/40 transition-colors"
                  >
                    <div className="relative w-28 h-28 shrink-0">
                      <Image
                        src={
                          pkg.images?.[0] ??
                          "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=70"
                        }
                        alt={pkg.title}
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    </div>
                    <div className="flex flex-col justify-center p-3 gap-1">
                      <p className="font-['Cormorant_Garamond'] text-lg text-white group-hover:text-(--color-gold) transition-colors leading-tight">
                        {pkg.title}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-(--color-text-secondary) font-['DM_Sans']">
                        <MapPin size={11} />
                        {pkg.durationNights}N · from{" "}
                        {formatPrice(pkg.pricePerPerson)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── PERSONAL DETAILS ── */}
          <TabsContent value="details">
            <div className="rounded-2xl border border-(--color-navy-border) bg-(--color-navy-surface) p-6 md:p-8">
              <h2 className="font-['Cormorant_Garamond'] text-2xl text-white mb-6">
                Personal Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <Input
                    className={inputClass}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <Input
                    className={inputClass}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className={labelClass}>Date of Birth</label>
                  <Input
                    className={inputClass}
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Nationality</label>
                  <Input
                    className={inputClass}
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    placeholder="Indian"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Passport Number</label>
                  <Input
                    className={inputClass}
                    value={passport}
                    onChange={(e) => setPassport(e.target.value)}
                    placeholder="A1234567"
                  />
                </div>
              </div>
              <Button
                variant="outline-gold"
                onClick={() => saveMutation.mutate()}
                disabled={saveMutation.isPending}
                className="h-auto mt-8 px-6 py-2.5 rounded-full font-sans font-medium"
              >
                {saveMutation.isPending ? "Saving…" : "Save Changes"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
