"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  Heart,
  Calendar,
  User,
  Settings,
  Bell,
  Pencil,
  MapPin,
} from "lucide-react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/shared/Badge";
import { EmptyState } from "@/components/shared/EmptyState";

import { useWishlistStore } from "@/store/wishlistStore";

import { dummyPackages } from "@/lib/dummy/packages";
import { formatPrice, formatDate } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────────────────────

type BookingStatus = "upcoming" | "completed" | "cancelled";

interface DummyBooking {
  id: string;
  packageId: string;
  packageTitle: string;
  packageImage: string;
  departureDate: string;
  returnDate: string;
  travellers: number;
  totalAmount: number;
  status: BookingStatus;
  slug: string;
}

// ── Dummy booking data ────────────────────────────────────────────────────────

const dummyBookings: DummyBooking[] = [
  {
    id: "BKG-20250101",
    packageId: "pkg-bali",
    packageTitle: "Bali Serenity Escape",
    packageImage:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80",
    departureDate: "2025-09-14",
    returnDate: "2025-09-21",
    travellers: 2,
    totalAmount: 170000,
    status: "upcoming",
    slug: "bali-serenity-escape",
  },
  {
    id: "BKG-20250202",
    packageId: "pkg-maldives",
    packageTitle: "Maldives Overwater Luxury",
    packageImage:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80",
    departureDate: "2025-03-05",
    returnDate: "2025-03-10",
    travellers: 2,
    totalAmount: 290000,
    status: "completed",
    slug: "maldives-overwater-luxury",
  },
  {
    id: "BKG-20250303",
    packageId: "pkg-santorini",
    packageTitle: "Santorini Sunset Romance",
    packageImage:
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&q=80",
    departureDate: "2025-07-20",
    returnDate: "2025-07-27",
    travellers: 2,
    totalAmount: 310000,
    status: "cancelled",
    slug: "santorini-sunset-romance",
  },
];

const statusConfig: Record<
  BookingStatus,
  { label: string; variant: "teal" | "ghost" | "coral" }
> = {
  upcoming: { label: "Upcoming", variant: "teal" },
  completed: { label: "Completed", variant: "ghost" },
  cancelled: { label: "Cancelled", variant: "coral" },
};

const travelTypes = [
  "Adventure",
  "Luxury",
  "Cultural",
  "Beach",
  "Honeymoon",
  "Family",
  "Solo",
  "Corporate",
];

const destinationOptions = [
  "Bali",
  "Maldives",
  "Europe",
  "Kerala",
  "Rajasthan",
  "Dubai",
  "Singapore",
  "Japan",
];

// ── Sub-components ────────────────────────────────────────────────────────────

function BookingCard({ booking }: { booking: DummyBooking }) {
  const { label, variant } = statusConfig[booking.status];
  return (
    <div className="flex flex-col sm:flex-row gap-4 rounded-2xl border border-(--color-navy-border) bg-(--color-navy-surface) overflow-hidden">
      <div className="relative w-full sm:w-40 h-40 sm:h-auto shrink-0">
        <Image
          src={booking.packageImage}
          alt={booking.packageTitle}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 160px"
        />
      </div>
      <div className="flex flex-col justify-between p-4 flex-1 gap-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-['Cormorant_Garamond'] text-xl text-white leading-tight">
              {booking.packageTitle}
            </p>
            <p className="font-['DM_Sans'] text-xs text-(--color-text-secondary) mt-1">
              {booking.id}
            </p>
          </div>
          <Badge variant={variant} size="sm">
            {label}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-(--color-white-muted) font-['DM_Sans']">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} className="text-(--color-gold)" />
            {formatDate(booking.departureDate)} → {formatDate(booking.returnDate)}
          </span>
          <span className="flex items-center gap-1.5">
            <User size={14} className="text-(--color-gold)" />
            {booking.travellers} travellers
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-(--color-gold) text-base">
            {formatPrice(booking.totalAmount)}
          </span>
          <Link
            href={`/packages/${booking.slug}`}
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

  // Personal details form state
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [nationality, setNationality] = useState("");
  const [passport, setPassport] = useState("");

  // Preferences state
  const [selectedTravelTypes, setSelectedTravelTypes] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState([50000, 300000]);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(
    [],
  );

  // Notifications state
  const [notifBookingEmail, setNotifBookingEmail] = useState(true);
  const [notifDealsEmail, setNotifDealsEmail] = useState(true);
  const [notifTipsEmail, setNotifTipsEmail] = useState(false);
  const [notifBookingWA, setNotifBookingWA] = useState(true);
  const [notifPriceWA, setNotifPriceWA] = useState(false);

  // Booking filter
  const [bookingFilter, setBookingFilter] = useState<
    "all" | BookingStatus
  >("all");

  const { ids: wishlistIds } = useWishlistStore();
  const wishlistPackages = dummyPackages.filter((p) =>
    wishlistIds.includes(p.id),
  );

  const filteredBookings =
    bookingFilter === "all"
      ? dummyBookings
      : dummyBookings.filter((b) => b.status === bookingFilter);

  const toggleTravelType = (type: string) =>
    setSelectedTravelTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );

  const toggleDestination = (dest: string) =>
    setSelectedDestinations((prev) =>
      prev.includes(dest) ? prev.filter((d) => d !== dest) : [...prev, dest],
    );

  const inputClass =
    "bg-[var(--color-navy-surface)] border-[var(--color-navy-border)] text-white placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)]/30 rounded-xl h-11 font-['DM_Sans'] text-sm";

  const labelClass =
    "block text-xs font-medium uppercase tracking-wide text-[var(--color-white-muted)] mb-1.5 font-['DM_Sans']";

  return (
    <>
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
                {user?.fullName ?? "Traveller"}
              </h1>
              <p className="font-['DM_Sans'] text-sm text-(--color-text-secondary) mt-0.5">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-(--color-gold) text-(--color-gold) text-sm font-['DM_Sans'] hover:bg-(--color-gold)/10 transition-colors">
              <Pencil size={14} />
              Edit Profile
            </button>
          </div>

          {/* ── Tabs ── */}
          <Tabs defaultValue="bookings">
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
              <TabsTrigger
                value="preferences"
                className="flex items-center gap-1.5 text-xs font-['DM_Sans'] data-[state=active]:bg-(--color-gold) data-[state=active]:text-(--color-navy) rounded-xl px-3 py-2 flex-1"
              >
                <Settings size={13} />
                Preferences
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="flex items-center gap-1.5 text-xs font-['DM_Sans'] data-[state=active]:bg-(--color-gold) data-[state=active]:text-(--color-navy) rounded-xl px-3 py-2 flex-1"
              >
                <Bell size={13} />
                Notifications
              </TabsTrigger>
            </TabsList>

            {/* ── MY BOOKINGS ── */}
            <TabsContent value="bookings">
              {/* Sub-filter */}
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
                    className={`px-4 py-1.5 rounded-full text-sm font-['DM_Sans'] border transition-colors ${bookingFilter === val
                      ? "border-(--color-gold) bg-(--color-gold)/10 text-(--color-gold)"
                      : "border-(--color-navy-border) text-(--color-text-secondary) hover:border-(--color-gold)/40"
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {filteredBookings.length === 0 ? (
                <EmptyState
                  title="No bookings yet"
                  description="When you book a package it will appear here."
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
              {wishlistPackages.length === 0 ? (
                <EmptyState
                  icon={Heart}
                  title="Your wishlist is empty"
                  description="Start saving packages you love."
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
                <button
                  onClick={() =>
                    console.log("Save details", {
                      fullName,
                      phone,
                      dob,
                      nationality,
                      passport,
                    })
                  }
                  className="mt-8 px-6 py-2.5 rounded-full border border-(--color-gold) text-(--color-gold) text-sm font-['DM_Sans'] font-medium hover:bg-(--color-gold)/10 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </TabsContent>

            {/* ── PREFERENCES ── */}
            <TabsContent value="preferences">
              <div className="rounded-2xl border border-(--color-navy-border) bg-(--color-navy-surface) p-6 md:p-8 space-y-8">
                <h2 className="font-['Cormorant_Garamond'] text-2xl text-white">
                  Travel Preferences
                </h2>

                <div>
                  <label className={labelClass}>Travel Type</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {travelTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => toggleTravelType(type)}
                        className={`px-4 py-1.5 rounded-full text-sm font-['DM_Sans'] border transition-colors ${selectedTravelTypes.includes(type)
                          ? "border-(--color-gold) bg-(--color-gold)/10 text-(--color-gold)"
                          : "border-(--color-navy-border) text-(--color-text-secondary) hover:border-(--color-gold)/40"
                          }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>
                    Budget Range:{" "}
                    <span className="text-(--color-gold) normal-case font-mono">
                      {formatPrice(budgetRange[0])} –{" "}
                      {formatPrice(budgetRange[1])}
                    </span>
                  </label>
                  <Slider
                    min={10000}
                    max={1000000}
                    step={5000}
                    value={budgetRange}
                    onValueChange={setBudgetRange}
                    className="mt-3"
                  />
                </div>

                <div>
                  <label className={labelClass}>Preferred Destinations</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {destinationOptions.map((dest) => (
                      <button
                        key={dest}
                        onClick={() => toggleDestination(dest)}
                        className={`px-4 py-1.5 rounded-full text-sm font-['DM_Sans'] border transition-colors ${selectedDestinations.includes(dest)
                          ? "border-(--color-gold) bg-(--color-gold)/10 text-(--color-gold)"
                          : "border-(--color-navy-border) text-(--color-text-secondary) hover:border-(--color-gold)/40"
                          }`}
                      >
                        {dest}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() =>
                    console.log("Save preferences", {
                      selectedTravelTypes,
                      budgetRange,
                      selectedDestinations,
                    })
                  }
                  className="px-6 py-2.5 rounded-full border border-(--color-gold) text-(--color-gold) text-sm font-['DM_Sans'] font-medium hover:bg-(--color-gold)/10 transition-colors"
                >
                  Save Preferences
                </button>
              </div>
            </TabsContent>

            {/* ── NOTIFICATIONS ── */}
            <TabsContent value="notifications">
              <div className="rounded-2xl border border-(--color-navy-border) bg-(--color-navy-surface) p-6 md:p-8 space-y-8">
                <h2 className="font-['Cormorant_Garamond'] text-2xl text-white">
                  Notification Preferences
                </h2>

                {/* Email notifications */}
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest text-(--color-gold) mb-4 font-['DM_Sans']">
                    Email
                  </p>
                  <div className="space-y-4">
                    {[
                      {
                        label: "Booking confirmations",
                        value: notifBookingEmail,
                        set: setNotifBookingEmail,
                      },
                      {
                        label: "Deals & offers",
                        value: notifDealsEmail,
                        set: setNotifDealsEmail,
                      },
                      {
                        label: "Travel tips & inspiration",
                        value: notifTipsEmail,
                        set: setNotifTipsEmail,
                      },
                    ].map(({ label, value, set }) => (
                      <div
                        key={label}
                        className="flex items-center justify-between py-3 border-b border-(--color-navy-border) last:border-0"
                      >
                        <span className="text-sm text-(--color-white-muted) font-['DM_Sans']">
                          {label}
                        </span>
                        <button
                          onClick={() => set(!value)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${value
                            ? "bg-(--color-gold)"
                            : "bg-(--color-navy-border)"
                            }`}
                          aria-checked={value}
                          role="switch"
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${value ? "translate-x-6" : "translate-x-1"
                              }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* WhatsApp notifications */}
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest text-(--color-gold) mb-4 font-['DM_Sans']">
                    WhatsApp
                  </p>
                  <div className="space-y-4">
                    {[
                      {
                        label: "Booking updates",
                        value: notifBookingWA,
                        set: setNotifBookingWA,
                      },
                      {
                        label: "Price alerts",
                        value: notifPriceWA,
                        set: setNotifPriceWA,
                      },
                    ].map(({ label, value, set }) => (
                      <div
                        key={label}
                        className="flex items-center justify-between py-3 border-b border-(--color-navy-border) last:border-0"
                      >
                        <span className="text-sm text-(--color-white-muted) font-['DM_Sans']">
                          {label}
                        </span>
                        <button
                          onClick={() => set(!value)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${value
                            ? "bg-(--color-gold)"
                            : "bg-(--color-navy-border)"
                            }`}
                          aria-checked={value}
                          role="switch"
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${value ? "translate-x-6" : "translate-x-1"
                              }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}
