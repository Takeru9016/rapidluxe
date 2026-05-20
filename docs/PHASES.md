# PHASES.md — RapidLuxe Complete Build Plan

> Read at every Claude Code session start. Check off tasks as completed.
> Each task = one focused Claude Code session. Update CLAUDE.md "Current Build State" after each.
> Phase 1 = dummy data only. No real API calls. No env vars except Clerk publishable key.

---

## Phase Summary

| Phase  | Focus                                                                   | Duration   |
| ------ | ----------------------------------------------------------------------- | ---------- |
| **1A** | Foundation — tokens, types, dummy data, config                          | Days 1–2   |
| **1B** | Core Components — layout + all reusable components                      | Days 3–6   |
| **1C** | Homepage — all sections assembled                                       | Days 7–9   |
| **1D** | Package Pages — listing + detail (all tabs)                             | Days 10–13 |
| **1E** | Supporting Pages — destinations, deals, blog, about, contact, corporate | Days 14–18 |
| **1F** | Auth + User Pages — Clerk, profile, bookings, wishlist                  | Days 19–21 |
| **1G** | Booking Flow — 4-step with GST + PAN logic                              | Days 22–24 |
| **1H** | Admin Panel — all 16 admin pages                                        | Days 25–29 |
| **1I** | Polish + QA — loading states, errors, audits                            | Days 30–32 |
| **2A** | DB + Auth Foundation — Neon, Prisma, Clerk, webhooks                    | Week 5     |
| **2B** | Package + Search APIs — all read endpoints                              | Week 5     |
| **2C** | Booking + Payments — Razorpay, GST, PAN, MSG91                          | Week 6     |
| **2D** | Reviews + Wishlist — verified gate, optimistic UI                       | Week 6     |
| **2E** | CMS + Communications — Sanity, Resend, contact form                     | Week 7     |
| **2F** | Admin Backend + Media — Cloudinary, invoices, CRUD                      | Week 7     |
| **3A** | AI Trip Planner — OpenAI streaming, rate limiting                       | Week 8     |
| **3B** | Third-Party APIs — Maps, weather, Viator, Booking.com                   | Week 8–9   |
| **3C** | Analytics + SEO — PostHog, Sentry, metadata, sitemap                    | Week 9     |
| **3D** | Performance + Final QA — bundle, Lighthouse, audit                      | Week 10    |

---

## ━━━━━━━━━━ PHASE 1 — FRONTEND ━━━━━━━━━━

> All data from `src/lib/dummy/*.ts`. No API calls. Mobile-first on every task.

---

### Phase 1A — Foundation

**Goal:** Everything subsequent tasks depend on. Do not skip or cut corners here.

- [x] **1A-1** — `next.config.ts`

  ```ts
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "images.pexels.com" },
    ];
  }
  ```

- [x] **1A-2** — `.env.example` — commit this (no real values, just keys documented)
      Include all keys from RAPIDLUXE.md §07

- [x] **1A-3** — `src/lib/dummy/` — all dummy data files
  - `packages.ts` — 8 packages, full fields, Unsplash image URLs
  - `destinations.ts` — 8 destinations with continents
  - `deals.ts` — 4 deals with `expiresAt` timestamps
  - `reviews.ts` — 8 reviews with `isVerified` flag
  - `blog.ts` — 4 blog post previews
  - `team.ts` — 4 team members
  - `hotels.ts` — shared hotel objects (referenced by packages)
  - `activities.ts` — shared activity objects
  - `coupons.ts` — 3 sample coupons
    > All dummy data types must match `src/types/` interfaces exactly

- [x] **1A-4** — `src/types/` — all TypeScript interfaces
  - `package.ts` → Package, ItineraryDay, Hotel, Activity, CancellationPolicy
  - `destination.ts` → Destination
  - `booking.ts` → Booking, Traveler, BookingStep
  - `user.ts` → UserProfile, TravelPreference
  - `review.ts` → Review
  - `deal.ts` → Deal
  - `coupon.ts` → Coupon
  - `api.ts` → ApiResponse\<T\>, PaginatedResponse\<T\>

- [x] **1A-5** — `src/app/globals.css`
  - Google Fonts `@import` (Cormorant Garamond 300/400/600 italic variants, DM Sans, JetBrains Mono)
  - All CSS custom properties (full token list from DESIGN_RULES.md §2)
  - Tailwind `@layer base` — body background, body color, font-family defaults
  - Font utility classes: `.font-display`, `.font-body`, `.font-mono`
  - Custom scrollbar: thin, navy-border track, gold thumb
  - Selection color: gold background, navy text
  - `*` box-sizing border-box

- [x] **1A-6** — `src/app/layout.tsx`
  - `next/font/google` — load all three fonts as CSS variables
  - Apply font variables to `<html className={...}>`
  - ClerkProvider stub (publishable key from env)
  - QueryClientProvider
  - Sonner `<Toaster>` with dark theme
  - Default metadata object
  - Viewport meta

- [x] **1A-7** — `src/lib/utils.ts`

  ```ts
  cn(); // className merge (clsx + tailwind-merge)
  formatPrice(n); // INR formatter → ₹1,25,000
  generateSlug(s); // string → url-slug
  formatDate(d); // Date → "12 Jan 2026"
  calculateDiscount(); // (original, current) → percent off
  getDaysUntil(d); // Date → days remaining
  calculateGST(n); // amount → { base, gst, total } (5% rate)
  truncate(s, n); // string truncation helper
  ```

- [x] **1A-8** — `components.json` — shadcn/ui config (dark theme, `@/components/ui` path)

- [x] **1A-9** — Install all shadcn components needed for Phase 1:
      `Button, Input, Textarea, Select, Dialog, Sheet, NavigationMenu, Tabs, Accordion,
Badge, Avatar, Skeleton, Sonner, Separator, Slider, Calendar, Popover`

- [x] **1A-10** — `src/store/uiStore.ts` — Zustand: `mobileMenuOpen`, `activeModal`, `setMobileMenu`, `openModal`, `closeModal`

- [x] **1A-11** — `src/store/wishlistStore.ts` — Zustand: `ids: string[]`, `toggle(id)`, `has(id)`, `count` (Phase 1 local-only; Phase 2D syncs to DB)

- [x] **1A-12** — `src/store/searchStore.ts` — Zustand: `query`, `filters`, `sort`, `setQuery`, `setFilter`, `resetFilters`, `setSort`

**1A Gate:** Fonts render in browser. Gold token visible. Navy background global. TypeScript `npx tsc --noEmit` = 0 errors.

---

### Phase 1B — Core Components

**Rule:** Do NOT start any page until every component that page needs exists and passes QA.

**Session prompt format:**

```
Read CLAUDE.md + docs/DESIGN_RULES.md + docs/COMPONENT_SPECS.md §[ComponentName].
Phase 1B — Task [1B-X]. Build [ComponentName] at [file path].
Design reference: [URL or "none — follow COMPONENT_SPECS.md strictly"]
Mobile-first. Dummy data from src/lib/dummy/[file].ts.
```

#### Layout Components

- [x] **1B-1** — `components/layout/Navbar.tsx` _(client)_
  - Transparent → `bg-[#111827]/95 backdrop-blur-md border-b border-navy-border` on scroll >50px
  - Logo: "Rapid**Luxe**" — "Rapid" in gold, "Luxe" in white, Cormorant Garamond
  - Desktop: NavigationMenu dropdowns (Packages, Destinations), nav links, search icon, Sign In (ghost), Book Now (coral)
  - Mobile: hamburger icon → opens MobileMenu (Sheet)
  - Transition: `transition-all duration-300`
  - Uses `uiStore` for mobile menu state

- [x] **1B-2** — `components/layout/MobileMenu.tsx` _(client)_
  - Full-height Sheet from right
  - All nav links (accordion for Packages/Destinations dropdowns)
  - Sign In + Book Now buttons
  - Gold on active link

- [x] **1B-3** — `components/layout/Footer.tsx`
  - 4-col grid (lg) → 2-col (md) → 1-col (mobile)
  - Col 1: Logo + tagline + social icons (gold hover)
  - Col 2: Company links
  - Col 3: Support links
  - Col 4: Newsletter — email input (gold focus) + subscribe button
  - Bottom bar: © | payment icons (UPI, Visa, Mastercard, Razorpay)

#### Shared Atoms

- [x] **1B-4** — `components/shared/Badge.tsx`
  - Variants: `gold` | `teal` | `coral` | `ghost` | `outline`
  - Sizes: `sm` (JetBrains Mono) | `md` (DM Sans 500)

- [x] **1B-5** — `components/shared/Rating.tsx`
  - Filled/half/empty stars in gold
  - `4.8 ★ (142 reviews)` — JetBrains Mono for numbers

- [x] **1B-6** — `components/shared/PriceDisplay.tsx`
  - JetBrains Mono, gold color
  - Variants: base price only | with strikethrough original + coral discount badge

- [x] **1B-7** — `components/shared/SearchBar.tsx` _(client)_
  - Variants: `hero` (large floating) | `inline` (compact)
  - Fields: Destination | Date | Travelers | Search (coral button)
  - Mobile: stacked full-width
  - Container: `bg-[#111827]/90 backdrop-blur-md rounded-2xl`

- [x] **1B-8** — `components/shared/ImageGallery.tsx` _(client)_
  - Hero image (16:9) + thumbnail strip below
  - Click thumbnail → swap main image
  - Used on package detail

- [x] **1B-9** — `components/shared/EmptyState.tsx`
  - Lucide icon + heading + subtext + optional CTA button
  - Used for empty wishlist, no bookings, no results

- [x] **1B-10** — `components/shared/CountdownTimer.tsx` _(client)_
  - Accepts `expiresAt: Date`
  - Variants: `inline` ("02d:14h:33m" coral text) | `blocks` (separated blocks with labels)
  - Uses `hooks/useCountdown.ts`

- [x] **1B-11** — `hooks/useCountdown.ts` — `setInterval` countdown logic → `{ days, hours, minutes, seconds }`

- [x] **1B-12** — `components/shared/Skeletons.tsx`
  - Export: `PackageCardSkeleton`, `DestinationCardSkeleton`, `DealCardSkeleton`, `ReviewCardSkeleton`, `BlogCardSkeleton`
  - All `animate-pulse`, navy-surface/navy-border colors
  - Match real card proportions exactly

- [x] **1B-13** — `components/shared/MapEmbed.tsx`
  - Phase 1: styled placeholder (navy-surface, map pin icon, label text)
  - Props: `lat?`, `lng?`, `zoom?`, `label?`, `height?`, `variant?: 'static' | 'interactive'`

- [x] **1B-14** — `components/shared/ReviewForm.tsx` _(client)_
  - Clickable star selector (1–5)
  - Title input + body textarea
  - Photo upload UI (disabled in Phase 1, enabled Phase 2D)
  - `isEligible` prop — if false, shows locked state with explanation
  - React Hook Form + Zod

- [x] **1B-15** — `hooks/useSearch.ts` — debounced search (300ms), syncs to `searchStore`

#### Card Components

- [x] **1B-16** — `components/cards/PackageCard.tsx`
  - Image (4:3), hover: scale-105
  - Destination badge (teal), wishlist heart (top-right)
  - Hover overlay: "View Details →" button (outline-gold)
  - Name (Cormorant), duration + tags, Rating component, PriceDisplay
  - "✈ Flights included" badge (teal) if true
  - Variants: `default` | `compact`

- [x] **1B-17** — `components/cards/DestinationCard.tsx`
  - Full-bleed image (3:4), gradient overlay bottom-to-top
  - Country + city + "X packages" overlay at bottom
  - Hover: scale-105 + gold border

- [x] **1B-18** — `components/cards/DealCard.tsx`
  - Image (16:9), "⚡ FLASH SALE" coral badge (top-left), "30% OFF" gold badge (top-right)
  - Price block: original strikethrough → new price (gold, JetBrains Mono) → "Save ₹X" coral
  - `CountdownTimer` inline variant
  - Coral CTA button

- [x] **1B-19** — `components/cards/ReviewCard.tsx`
  - Avatar + name + trip name
  - Rating component
  - Body (3-line clamp, "Read more" toggle)
  - "✓ Verified Booking" teal badge + date

- [x] **1B-20** — `components/cards/HotelCard.tsx`
  - Image (4:3), star rating display (gold stars)
  - Hotel name (Cormorant), location (MapPin icon), "Included" / "Optional Upgrade" badge

- [x] **1B-21** — `components/cards/ActivityCard.tsx`
  - Horizontal layout: icon/thumbnail (64px square) + content
  - Name, duration (JetBrains Mono), "✓ Included" (teal) or "Add-On + price" (gold)

**1B Gate:** All components render with dummy data. Mobile layouts correct. Zero TypeScript errors. Hover states working.

---

### Phase 1C — Homepage

- [ ] **1C-1** — `components/sections/Hero.tsx` _(client for GSAP)_
  - Full-bleed image/video bg, gradient overlay: `from-navy/60 via-transparent to-navy/80`
  - Eyebrow (gold, DM Sans, tracking-widest, uppercase) → H1 (Cormorant, 5xl–7xl, font-light) → subtext → SearchBar hero variant
  - Scroll indicator with bounce
  - GSAP timeline on mount: eyebrow → H1 → sub → search (stagger 0.2s, y:30→0, opacity:0→1)

- [ ] **1C-2** — `components/sections/TrustBar.tsx`
  - 4 stats with Lucide icons: "10,000+ Trips" | "4.8★ Rated" | "100% Money-Back" | "24/7 Support"
  - Numbers in gold JetBrains Mono, labels DM Sans
  - Horizontal scroll on mobile

- [ ] **1C-3** — `components/sections/FeaturedPackages.tsx` _(client for tabs)_
  - Tab filter: "Trending" | "Luxury" | "Budget" — active tab bg-gold text-navy
  - 3→2→1 col grid of PackageCard
  - "View All Packages →" outline-gold CTA
  - GSAP stagger reveal on scroll

- [ ] **1C-4** — `components/sections/Destinations.tsx` _(client for scroll)_
  - Horizontal scroll with prev/next arrows (desktop) OR grid (mobile)
  - DestinationCard components
  - Arrow buttons: ghost, gold on hover

- [ ] **1C-5** — `components/sections/HotDeals.tsx` _(client for timer)_
  - Section header with ⚡ icon + global countdown (CountdownTimer blocks variant)
  - 3-col grid of DealCard
  - "See All Deals →" CTA

- [ ] **1C-6** — `components/sections/HowItWorks.tsx` _(client for GSAP)_
  - 3 steps: Search → Book → Travel
  - Numbered circles + icon + title + description
  - Connector line between steps (desktop)
  - GSAP stagger on scroll

- [ ] **1C-7** — `components/sections/Testimonials.tsx`
  - Section heading with gold ★
  - 3-col grid of ReviewCard

- [ ] **1C-8** — `components/sections/BlogPreview.tsx`
  - 3 blog post preview cards from dummy data
  - Image + category badge + title + excerpt + read time
  - "Read More on the Blog →" CTA

- [ ] **1C-9** — `components/sections/Newsletter.tsx`
  - Lead magnet copy + email input + "Subscribe" gold button
  - Background: subtle gradient or slightly lighter navy strip

- [ ] **1C-10** — `app/(public)/page.tsx` — assemble all sections in order with Navbar + Footer

**1C Gate:** Full homepage end-to-end. GSAP triggers on scroll. No hydration errors. Correct on 375px.

---

### Phase 1D — Package Pages

- [ ] **1D-1** — `app/(public)/packages/page.tsx`
  - Desktop: filter sidebar (left, w-72) + package grid (right)
  - Mobile: "Filters" button → Sheet drawer
  - Filter sidebar: Destination multiselect, Duration range, Price slider (shadcn Slider), Travel type checkboxes, Group size
  - Sort bar: "Most Popular" | "Price ↑" | "Price ↓" | "Rating" | "Newest"
  - 3→2→1 col PackageCard grid
  - Pagination UI (non-functional Phase 1)
  - Filter state in `searchStore`

- [ ] **1D-2** — `app/(public)/packages/[slug]/page.tsx` ⭐ Most complex page
  - `ImageGallery` full-width
  - Header: title, destination, duration, rating, share icon, wishlist button
  - Desktop sticky sidebar (right, w-80): price, date picker (shadcn Calendar), travelers selector, total calculator, "Book Now" coral CTA, "Get Custom Quote" ghost → Dialog modal
  - Tabs (shadcn): Overview | Itinerary | Hotels | Activities | Reviews
  - **Overview tab:** description, highlights, inclusions (✓) / exclusions (✗), `MapEmbed` placeholder, cancellation policy
  - **Itinerary tab:** day-by-day shadcn Accordion
  - **Hotels tab:** grid of `HotelCard` from `pkg.hotels` dummy JSON
  - **Activities tab:** "Included" section + "Optional Add-Ons" section using `ActivityCard`
  - **Reviews tab:** summary block (avg + bar breakdown), list of `ReviewCard`, `ReviewForm` (disabled in Phase 1)
  - Similar packages horizontal scroll (compact PackageCard) at bottom

- [ ] **1D-3** — `store/bookingStore.ts` — Zustand booking state (see CLAUDE.md for full interface)

---

### Phase 1E — Supporting Pages

- [ ] **1E-1** — `app/(public)/destinations/page.tsx`
  - Hero with SearchBar
  - Continent tab filter (shadcn Tabs): All | Asia | Europe | Africa | Americas | Middle East | Oceania
  - Destination grid 4→3→2→1 col
  - "Popular Destinations" curated horizontal scroll section
  - "Best places this month" seasonal section (dummy)

- [ ] **1E-2** — `app/(public)/destinations/[slug]/page.tsx`
  - Hero full-bleed + destination name overlay
  - Quick facts grid: Best time | Currency | Language | Visa for Indians
  - About section (dummy rich text paragraphs — Phase 2E wires to Sanity)
  - Packages from this destination (filtered grid, PackageCard)
  - "Things To Do" — ActivityCard grid (dummy Viator-shaped data)
  - Weather widget (static dummy data table: monthly temp + rainfall)
  - Travel Tips section (dummy — Phase 2E wires to Sanity)
  - `MapEmbed` placeholder

- [ ] **1E-3** — `app/(public)/deals/page.tsx`
  - Flash sale banner: full-width coral/gold gradient + CountdownTimer blocks variant
  - Deal cards grid (DealCard)
  - "Early Bird Deals" section (separate DealCard grid)
  - "Last-Minute Deals" section

- [ ] **1E-4** — `app/(public)/blog/page.tsx`
  - Featured post: large hero card (image + title + excerpt + read time)
  - Category filter tabs
  - Blog grid 3→2→1 (image, badge, title, excerpt, author, date)
  - Sidebar (desktop): Popular posts, tags cloud, Newsletter CTA

- [ ] **1E-5** — `app/(public)/blog/[slug]/page.tsx`
  - Full-width hero image
  - Post header: title, author (avatar + name), date, read time, share buttons
  - Body: styled dummy paragraphs (Phase 2E → Portable Text)
  - Author card at bottom
  - Related posts (3 cards)
  - CTA banner: "Ready to travel? Browse Packages →"

- [ ] **1E-6** — `app/(public)/about/page.tsx`
  - All sections with dummy data: Hero, Our Story, Stats bar, Team (4 cards), Awards/Press logos grid, CTA

- [ ] **1E-7** — `app/(public)/contact/page.tsx`
  - Contact form (React Hook Form: name, email, phone, subject dropdown, message) — `console.log` on submit Phase 1
  - Contact details block: phone, email, WhatsApp CTA button (links to wa.me)
  - `MapEmbed` placeholder for office location

- [ ] **1E-8** — `app/(public)/corporate/page.tsx`
  - All sections: Hero, Features (centralized billing, GST invoices, account manager), How It Works, Client Logos, Testimonials, Corporate Contact Form

---

### Phase 1F — Auth + User Pages

- [ ] **1F-1** — `app/(auth)/sign-in/[[...sign-in]]/page.tsx`
  - Clerk `<SignIn>` component, centered, RapidLuxe dark layout wrapper

- [ ] **1F-2** — `app/(auth)/sign-up/[[...sign-up]]/page.tsx`
  - Clerk `<SignUp>` component, same dark wrapper

- [ ] **1F-3** — `app/(user)/profile/page.tsx`
  - Profile header: Clerk avatar, name, email, "Edit Profile" button
  - Tabs: My Bookings | Wishlist | Personal Details (form) | Travel Preferences | Notifications (toggles)
  - All tab content UI with dummy data

- [ ] **1F-4** — `app/(user)/bookings/page.tsx`
  - Filter tabs: All | Upcoming | Completed | Cancelled
  - Booking cards (dummy): package image, name, dates, travelers, status badge (teal/coral/ghost), booking ID (JetBrains Mono), "View Details" link

- [ ] **1F-5** — `app/(user)/bookings/[id]/page.tsx`
  - Booking header: ID, status badge, package name + thumbnail
  - Trip summary: dates, travelers, package details
  - Traveler details table
  - Payment summary: base amount, GST (5%), total, payment method, booking ID
  - "Download Voucher" button (disabled Phase 1) | "Raise a Request" | "Cancel Booking" (if policy allows)
  - Invoice download button (disabled Phase 1)

- [ ] **1F-6** — `app/(user)/wishlist/page.tsx`
  - Grid of PackageCard (compact) from dummy wishlistStore
  - Remove heart → removes from wishlistStore
  - EmptyState when `wishlistStore.count === 0`

---

### Phase 1G — Booking Flow

- [ ] **1G-1** — `store/bookingStore.ts` — complete Zustand store

  ```ts
  currentStep: 1 | 2 | 3 | 4
  packageId: string | null
  departureDate: Date | null
  adults: number (default 2)
  children: number (default 0)
  infants: number (default 0)
  travelerDetails: TravelerDetail[]
  specialRequests: string
  baseAmount: number
  gstAmount: number          // 5% via calculateGST()
  discountAmount: number
  totalAmount: number
  couponCode: string | null
  appliedCoupon: Coupon | null
  bookingId: string | null
  bookingRef: string | null
  setStep / setDates / setTravelers / setTravelerDetails
  setCoupon / setBookingResult / reset
  ```

- [ ] **1G-2** — `app/(booking)/book/[packageId]/page.tsx`
  - Step indicator: 4 circles (gold filled = active, gold check = done, ghost = future)
  - Sticky booking summary sidebar (desktop): package name, dates, travelers, base, GST line, total
  - **Step 1 — Review Package:** package summary card, date picker, travelers selector, coupon input + "Apply" (UI only Phase 1)
  - **Step 2 — Traveler Details:** lead traveler form (name, DOB, passport no., email, phone) + additional travelers; PAN card field (conditional: shows when `totalAmount > 200000`); special requests
  - **Step 3 — Review & Pay:** final price breakdown (Base: ₹X | GST 5%: ₹Y | Discount: -₹Z | **Total: ₹W**), payment method selector UI (UPI / Card / EMI / Netbanking), "Pay Now" coral button (no real payment Phase 1)
  - **Step 4 — Confirmation:** success animation, booking ID, "Download Voucher" (disabled), "View My Bookings" link
  - Back/Next navigation buttons

**1G Gate:** All 4 steps navigate correctly. GST displayed in Step 3. PAN field conditional. bookingStore persists across steps.

---

### Phase 1H — Admin Panel

**Note:** Admin sidebar layout wraps all admin pages.

- [ ] **1H-1** — Admin layout: `app/(admin)/admin/layout.tsx`
  - Sidebar (`components/admin/Sidebar.tsx`) + main content area
  - Sidebar fixed left, w-64, full-height, dark

- [ ] **1H-2** — `components/admin/Sidebar.tsx` _(client)_
  - Nav groups with separators:
    - Dashboard
    - Packages | Destinations | Blog
    - Bookings | Reviews | Users | Enquiries
    - Deals | Coupons
    - Analytics | Settings
    - ← Back to Site
  - Active link: `bg-gold/10 text-gold`

- [ ] **1H-3** — `components/admin/StatsCard.tsx` — icon, value (JetBrains Mono), label, change indicator (↑ teal / ↓ coral)

- [ ] **1H-4** — `components/admin/DataTable.tsx` — generic table built on `@tanstack/react-table`, dark theme, skeleton loading state

- [ ] **1H-5** — `app/(admin)/admin/page.tsx` — Dashboard
  - Stats row: Total Bookings | Revenue MTD | Active Packages | New Users
  - Recent bookings table (DataTable, 10 rows dummy)
  - Revenue bar chart (Recharts, dummy monthly data)
  - Quick actions: "Add Package" | "Create Deal" | "View Enquiries"

- [ ] **1H-6** — `app/(admin)/admin/packages/page.tsx`
  - DataTable: name, destination, price, status (Draft/Published badge), actions (Edit | Archive | Delete)
  - "Add New Package" coral button

- [ ] **1H-7** — `app/(admin)/admin/packages/new/page.tsx` + `[id]/page.tsx`
  - Full form per RAPIDLUXE.md §04 admin spec
  - Title, slug (auto-gen), description (Textarea)
  - Destination (Select from dummy destinations)
  - Duration, min/max group size
  - Price per person, original price
  - Inclusions multi-input + Exclusions multi-input
  - Itinerary builder: Add Day button → Accordion with day title + description + meals
  - Hotels builder: Add Hotel → name, stars (1–5), location, image URL
  - Activities builder: Add Activity → name, duration, included toggle, price (if optional)
  - Tags multi-select (Luxury, Honeymoon, Adventure, Beach, etc.)
  - Cancellation policy: 3 threshold inputs (days before, refund %)
  - Featured toggle, Status (Draft/Published) select
  - Image upload placeholder (shows URL input Phase 1 → Cloudinary Phase 2F)
  - SEO fields (meta title, meta description)

- [ ] **1H-8** — `app/(admin)/admin/destinations/page.tsx`
  - DataTable: name, country, continent, packages count, actions
  - "Add Destination" button

- [ ] **1H-9** — `app/(admin)/admin/destinations/new/page.tsx` + `[id]/page.tsx`
  - Postgres fields: name, slug, country, continent, imageUrl, bestTimeFrom, bestTimeTo, visaType, currency, language
  - Sanity editorial fields: About (Tiptap placeholder → Phase 2E), Travel Tips (Tiptap placeholder)
  - SEO fields
  - Note: "Dual-write on submit: Postgres + Sanity (Phase 2E)"

- [ ] **1H-10** — `app/(admin)/admin/bookings/page.tsx`
  - DataTable with filter tabs: All | Upcoming | Completed | Cancelled | Refunded
  - Columns: ID, user, package, dates, travelers, total, payment status, booking status, actions
  - "Update Status" dropdown per row (UI only Phase 1)

- [ ] **1H-11** — `app/(admin)/admin/users/page.tsx`
  - DataTable: avatar, name, email, bookings count, joined date, role badge
  - Click row → view user details

- [ ] **1H-12** — `app/(admin)/admin/reviews/page.tsx`
  - DataTable: reviewer, package, rating (stars), body preview, date, status (Approved/Hidden badge)
  - "Approve" | "Hide" action buttons (UI only Phase 1)

- [ ] **1H-13** — `app/(admin)/admin/deals/page.tsx`
  - Active deals table + "Create Deal" button
  - Deal form: select package, type (FLASH_SALE / EARLY_BIRD / LAST_MINUTE), discount %, expiry date picker, active toggle

- [ ] **1H-14** — `app/(admin)/admin/coupons/page.tsx`
  - Coupons table: code, type (% or ₹), value, min amount, uses/max-uses, expiry, active toggle
  - "Create Coupon" button → modal or inline form

- [ ] **1H-15** — `app/(admin)/admin/enquiries/page.tsx`
  - DataTable: name, email, subject, message preview, date, "Read" toggle
  - Click row → expand full message panel

- [ ] **1H-16** — `app/(admin)/admin/blog/page.tsx`
  - DataTable: title, author, category, date, status
  - "New Post" button

- [ ] **1H-17** — `app/(admin)/admin/blog/new/page.tsx` + `[id]/page.tsx`
  - Title, slug (auto-gen from title)
  - Author (Select, dummy authors)
  - Category (Select, dummy categories)
  - Excerpt (Textarea), Read Time (Number), Published At (DatePicker), Tags multi-input
  - Body: Textarea placeholder (Phase 1) → Tiptap (Phase 2E)
  - Main image (URL input Phase 1 → Cloudinary Phase 2E)
  - SEO fields

- [ ] **1H-18** — `app/(admin)/admin/analytics/page.tsx`
  - Revenue over time line chart (Recharts, 12 months dummy)
  - Top 5 packages by bookings (horizontal bar chart, Recharts)
  - Top destinations (donut chart, Recharts)
  - User acquisition sources (dummy bar chart)

- [ ] **1H-19** — `app/(admin)/admin/settings/page.tsx`
  - Site settings form: contact email, WhatsApp number, GST number, invoice prefix, company name, address
  - "Save Settings" gold button (UI only Phase 1)

**1H Gate:** All admin pages render. DataTable shows dummy data. Sidebar navigation works. Zero TypeScript errors.

---

### Phase 1I — Polish + QA

- [ ] **1I-1** — `loading.tsx` files for all key routes:

  ```
  app/(public)/packages/loading.tsx         ← PackageCardSkeleton 3×3 grid
  app/(public)/packages/[slug]/loading.tsx  ← detail skeleton
  app/(public)/destinations/loading.tsx
  app/(user)/bookings/loading.tsx           ← BookingCardSkeleton ×5
  app/(admin)/admin/loading.tsx             ← StatsCard skeletons + table skeleton
  ```

- [ ] **1I-2** — `error.tsx` files:

  ```
  app/(public)/packages/error.tsx
  app/(public)/packages/[slug]/error.tsx
  app/(admin)/admin/error.tsx
  ```

  Each: "Something went wrong" heading + description + "Try again" + "Go home" buttons

- [ ] **1I-3** — `app/not-found.tsx` — branded 404 with illustration or large "404" in Cormorant, description, "Go Home" coral button

- [ ] **1I-4** — `app/opengraph-image.tsx` — default OG image (dark, gold "RapidLuxe" wordmark, tagline), 1200×630

- [ ] **1I-5** — Cross-browser audit: Chrome, Safari, Firefox — layout + fonts + animations
- [ ] **1I-6** — Mobile audit: test at 375px, 390px, 430px — no horizontal overflow, tap targets ≥44px
- [ ] **1I-7** — GSAP audit: all scroll triggers fire once, `prefers-reduced-motion` respected
- [ ] **1I-8** — Typography audit: Cormorant on all headings, DM Sans on all UI/body, Mono on all prices/IDs/tags
- [ ] **1I-9** — Color audit: no hex codes outside palette, all interactive elements have gold hover
- [ ] **1I-10** — `npx tsc --noEmit` — zero errors
- [ ] **1I-11** — Lighthouse run: target Performance ≥85, Accessibility ≥90, Best Practices ≥90

---

## ━━━━━━━━━━ PHASE 2 — BACKEND ━━━━━━━━━━

> Phase 2 begins only when all Phase 1I QA checks pass.

---

### Phase 2A — Database + Auth Foundation

- [ ] Neon DB project → copy `DATABASE_URL` to `.env.local`
- [ ] `prisma/schema.prisma` — full schema per RAPIDLUXE.md §05, plus:
  - Add `gstAmount Float @default(0)` to Booking model
  - Add `panCard String?` to Booking model
  - Add `cancellationPolicy Json?` to Package model
- [ ] `npx prisma migrate dev --name init`
- [ ] `src/lib/prisma.ts` — singleton client
- [ ] Clerk production keys → `.env.local`
- [ ] `src/middleware.ts` — Clerk middleware, admin route guard, user route protection (per RAPIDLUXE.md §12)
- [ ] `app/api/webhooks/clerk/route.ts` — sync Clerk `user.created` event → create DB User record
- [ ] `app/api/webhooks/razorpay/route.ts` — HMAC signature verification + booking status update

### Phase 2B — Package + Search APIs

- [ ] `GET /api/packages` — list with filter (destination, duration, price, tags, type) + sort + pagination
- [ ] `GET /api/packages/[slug]` — single package with reviews count, avg rating
- [ ] `POST /api/packages` — create (admin only, Zod validation)
- [ ] `PUT /api/packages/[id]` — update (admin only)
- [ ] `DELETE /api/packages/[id]` — archive (set status ARCHIVED)
- [ ] `GET /api/destinations` — list with continent filter
- [ ] `GET /api/destinations/[slug]` — single destination + packages count
- [ ] `GET /api/search` — full-text Postgres search across packages + destinations
- [ ] `POST /api/upload/sign` — Cloudinary signed upload URL
- [ ] Seed DB with 8 packages + 8 destinations + 4 deals
- [ ] Replace dummy data imports with TanStack Query hooks, one page at a time

### Phase 2C — Booking + Payments

- [ ] `src/lib/razorpay.ts` — Razorpay instance
- [ ] `POST /api/payments/create-order` — creates Razorpay order, creates Booking record (PENDING), returns `orderId`
- [ ] `POST /api/payments/verify` — HMAC verification, updates Booking → PAID
- [ ] `POST /api/coupons/validate` — checks coupon exists, active, within usage limit, min amount
- [ ] Booking Step 3: wire "Pay Now" → Razorpay checkout modal (Razorpay JS SDK)
- [ ] Post-payment: Resend booking confirmation email (template with booking ID, package, dates)
- [ ] Post-payment: MSG91 WhatsApp confirmation message
- [ ] GST amount stored in DB (`gstAmount` field)
- [ ] PAN card stored in DB (`panCard` field, conditional collection)

### Phase 2D — Reviews + Wishlist

- [ ] `GET /api/reviews?packageId=` — paginated reviews for a package
- [ ] `POST /api/reviews` — create review (auth required, must have COMPLETED booking for package)
- [ ] `POST /api/wishlist` — toggle wishlist (add if not exists, delete if exists)
- [ ] Wire `ReviewForm` — submits to `/api/reviews` (verified booking check via server)
- [ ] Wire wishlist heart button → `POST /api/wishlist` with optimistic UI (Zustand + TanStack Query)
- [ ] `wishlistStore` → hydrate from DB on auth, persist changes optimistically

### Phase 2E — CMS + Communications

- [ ] Sanity project setup at sanity.io/manage → get project ID, dataset, write token
- [ ] `src/lib/sanity.ts` — read client (CDN) + write client (secret token, server only)
- [ ] `sanity/schemas/` — post.ts, author.ts, category.ts, destination.ts (per SANITY_CMS.md)
- [ ] `sanity/sanity.config.ts`
- [ ] `app/studio/[[...tool]]/page.tsx` — embedded Sanity Studio (admin-gated in middleware)
- [ ] `src/lib/queries/blog.ts` — all GROQ queries (per SANITY_CMS.md)
- [ ] `src/lib/queries/destination.ts` — destination editorial GROQ query
- [ ] Wire `/blog` and `/blog/[slug]` → Sanity data (replace dummy)
- [ ] Wire destination detail About + Travel Tips → Sanity data
- [ ] `components/admin/RichTextEditor.tsx` — Tiptap integration (blog body + destination editorial)
- [ ] `POST /api/admin/sanity/posts` + `PATCH` + `DELETE` — blog CRUD via `sanityWriteClient`
- [ ] Wire `/admin/blog` → Sanity API (replace dummy)
- [ ] `src/lib/resend.ts` — Resend client
- [ ] `POST /api/enquiries` — contact form → creates Enquiry DB record → sends Resend email to admin

### Phase 2F — Admin Backend + Media

- [ ] `src/lib/cloudinary.ts` — Cloudinary config + signed URL helper
- [ ] `components/admin/CloudinaryUpload.tsx` — signed upload → preview → stores Cloudinary URL
- [ ] Wire image upload in package form + blog form
- [ ] `app/api/invoices/[bookingId]/route.ts` — generate GST-compliant PDF (`@react-pdf/renderer`)
  - Include: company name, GSTIN, HSN code, booking ref, itemized: base + GST + total
  - Wire "Download Invoice" button on `/bookings/[id]` + admin booking detail
- [ ] Wire admin packages CRUD → `/api/packages`
- [ ] Wire admin bookings table → DB, status update
- [ ] Wire admin users table → DB
- [ ] Wire admin reviews moderation → `PATCH /api/admin/reviews/[id]` (approve/hide)
- [ ] Wire admin coupons CRUD → `GET/POST/PATCH /api/admin/coupons`
- [ ] Wire admin enquiries → DB (mark read)
- [ ] Wire admin deals CRUD
- [ ] Wire admin destinations dual-write (per SANITY_CMS.md §actions/destinations.ts)
- [ ] Admin analytics page → real DB aggregate queries (bookings count, revenue sum, top packages)

---

## ━━━━━━━━━━ PHASE 3 — AI + INTEGRATIONS ━━━━━━━━━━

### Phase 3A — AI Trip Planner

- [ ] `src/lib/openai.ts` — OpenAI client
- [ ] `src/lib/upstash.ts` — Upstash Redis client
- [ ] `POST /api/ai/planner` — streaming route with Vercel AI SDK `streamText`, Upstash rate limit (10 req/user/day)
- [ ] `app/(user)/trip-planner/page.tsx` — full-page AI planner UI with streaming response
- [ ] `hooks/useAIPlanner.ts` — `useCompletion` hook

### Phase 3B — Third-Party API Integrations

- [ ] **Google Maps** — interactive maps on destination detail + package detail overview tab (replace placeholder)
- [ ] **Google Maps Embed** — static embed on contact page (replace placeholder)
- [ ] **OpenWeatherMap** — real monthly weather data on destination detail weather widget
- [ ] **ExchangeRate-API** — currency display on package detail (show USD/GBP/AED equivalent)
- [ ] **Viator / TripAdvisor** — real activities per destination on destination detail "Things To Do"
- [ ] **Booking.com Affiliate API** — hotel enrichment on package detail Hotels tab
- [ ] **TripAdvisor Content API** — supplemental reviews display on destination pages
- [ ] **Amadeus** — flight search (if scope allows)

### Phase 3C — Analytics + SEO

- [ ] PostHog: install + pageview tracking + custom booking funnel events
- [ ] Vercel Analytics: enable in vercel.json
- [ ] Sentry: install, configure DSN, error boundary integration
- [ ] `generateMetadata()` export on all public pages
- [ ] `app/opengraph-image.tsx` — dynamic OG for packages + destinations via `next/og`
- [ ] JSON-LD `TouristTrip` schema on `/packages/[slug]` pages
- [ ] `app/sitemap.ts` — auto-generated XML sitemap (packages + destinations + blog posts)
- [ ] `app/robots.ts` — disallow `/admin`, `/api`, allow everything else

### Phase 3D — Performance + Final QA

- [ ] `@next/bundle-analyzer` — identify and eliminate large dependencies
- [ ] Edge runtime on eligible route handlers (`export const runtime = 'edge'`)
- [ ] Image audit: ensure `priority` only on first above-fold image per page
- [ ] Prisma Accelerate or connection pooling check for serverless cold starts
- [ ] Final Lighthouse: Performance ≥90, SEO ≥95, Accessibility ≥90, Best Practices ≥90
- [ ] Final cross-device QA: iPhone SE, iPhone 15, iPad, MacBook, 27" desktop
- [ ] Security audit: no secrets in client components, no missing auth checks on protected routes
- [ ] Vercel deployment: production env vars, domain, edge config

---

_RapidLuxe | Developer: Sahil Jadhav | Updated: May 2026_
