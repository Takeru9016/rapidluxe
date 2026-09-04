# PHASES.md — RapidLuxe Complete Build Plan

> Read at every Claude Code session start. Check off tasks as completed.
> Each task = one focused Claude Code session. Update CLAUDE.md "Current Build State" after each.
> Phase 1 = dummy data only. No real API calls. No env vars except Clerk publishable key.
>
> ── NOTIFICATION CHANGE (June 2026) ──────────────────────────────
> MSG91 WhatsApp removed. Resend handles ALL booking notifications (email only).
> WhatsApp can be added in a future phase via Interakt when client requests it.
> ─────────────────────────────────────────────────────────────────

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
| **1G** | Booking Flow — redesigned 4-step with GST + PAN + new request model     | Days 22–24 |
| **1H** | Admin Panel — all admin pages incl. new booking workflow                | Days 25–29 |
| **1I** | Polish + QA — loading states, errors, audits                            | Days 30–32 |
| **2A** | DB + Auth Foundation — Neon, Prisma, Clerk, webhooks                    | Week 5     |
| **2B** | Package + Search APIs — all read endpoints                              | Week 5     |
| **2C** | Booking Request Model — enquiry→quote→payment flow, Razorpay            | Week 6     |
| **2D** | Reviews + Wishlist — verified gate, optimistic UI                       | Week 6     |
| **2E** | CMS + Communications — Sanity, Resend emails, contact form              | Week 7     |
| **2F** | Admin Backend + Media — Cloudinary, invoices, booking workflow CRUD     | Week 7     |
| **3A** | Third-Party APIs — Mapbox, weather, Viator, Booking.com, Useful Links   | Week 8     |
| **3B** | Analytics + SEO — PostHog, Sentry, metadata, sitemap                    | Week 9     |
| **3C** | Performance + Final QA — bundle, Lighthouse, audit                      | Week 10    |

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
  - **Add `metadataBase`:** `new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000')`

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

### Phase 1B–1I

> Phases 1B through 1I are complete. See git history.
> All components, pages, booking flow, and admin panel built with dummy data.

---

## ━━━━━━━━━━ PHASE 2 — BACKEND ━━━━━━━━━━

---

### Phase 2A — Database + Auth Foundation

- [ ] Neon DB project → copy `DATABASE_URL` + `DATABASE_DIRECT_URL` to `.env.local`
- [ ] `prisma/schema.prisma` — full schema per RAPIDLUXE.md §05, plus all Phase 2C Booking fields
- [ ] `npx prisma migrate dev --name init`
- [ ] `prisma/seed.ts` — destinations, packages, coupons
- [ ] `src/lib/prisma.ts` — singleton client
- [ ] `src/lib/validations/` — Zod schemas for booking, package, review, coupon
- [ ] `src/lib/query-client.ts` — TanStack Query singleton
- [ ] `src/lib/env.ts` — startup env validation
- [ ] `src/lib/rate-limit.ts` — Upstash Redis rate limiting (apiLimiter + strictLimiter)
- [ ] `app/api/health/route.ts` — health check endpoint
- [ ] Clerk production keys → `.env.local`
- [ ] `proxy.ts` at project root — Clerk middleware, admin route guard, user route protection
- [ ] `app/api/webhooks/clerk/route.ts` — sync Clerk user events → DB User record
- [ ] `app/api/webhooks/razorpay/route.ts` — HMAC signature verification + booking status update

### Phase 2B — Package + Search APIs

- [ ] `GET /api/packages` — list with filter (destination, duration, price, tags, type) + sort + pagination
- [ ] `GET /api/packages/[slug]` — single package with reviews count, avg rating
- [ ] `POST /api/packages` — create (admin only, Zod validation)
- [ ] `PUT /api/packages/[id]` — update (admin only)
- [ ] `DELETE /api/packages/[id]` — archive (set status ARCHIVED)
- [ ] `GET /api/packages/availability` — overbooking prevention
- [ ] `GET /api/destinations` — list with continent filter
- [ ] `GET /api/destinations/[slug]` — single destination + packages count
- [ ] `GET /api/search` — full-text Postgres search across packages + destinations
- [ ] `GET /api/search/suggestions` — prefix search autocomplete
- [ ] Seed DB with 8 packages + 8 destinations + 4 deals
- [ ] Replace dummy data imports with TanStack Query hooks, one page at a time

### Phase 2C — Booking Request Model + Payments

> Implements the confirmed Enquiry → Quote → Payment Link flow.
> No MSG91. No WhatsApp. All notifications via Resend email only (wired in 2E).

**Schema additions (add to Phase 2A Prisma migration):**

```prisma
enum BookingStatus {
  ENQUIRY
  QUOTE_SENT
  AWAITING_PAYMENT
  PAID
  CONFIRMED
  CANCELLED
}

model Booking {
  // existing fields +
  status              BookingStatus  @default(ENQUIRY)
  occasion            String?
  dietaryRequirements String[]
  quotedAmount        Float?
  quoteNotes          String?
  paymentDueDate      DateTime?
  paymentToken        String?        @unique
  paymentTokenExpiry  DateTime?
  gstAmount           Float          @default(0)
  panCard             String?
}
```

- [ ] `POST /api/bookings` — create booking with status ENQUIRY (auth required)
      Notification comments left in code — wired in Phase 2E
- [ ] `POST /api/coupons/validate` — checks coupon, returns discount amount
- [ ] `POST /api/admin/bookings/[id]/send-quote` — admin only
  - Saves: quotedAmount, quoteNotes, paymentDueDate → status = QUOTE_SENT
  - Sends: Resend quote email to user (wired in 2E)
- [ ] `POST /api/admin/bookings/[id]/send-payment-link` — admin only
  - Generates unique `paymentToken` (crypto.randomUUID), sets `paymentTokenExpiry` (+48hrs)
  - Status → AWAITING_PAYMENT
  - Sends: Resend payment link email to user (wired in 2E)
- [ ] `GET /api/pay/[token]` — public route, validates token
  - Returns: booking details + package summary + quoted amount (for `/pay/[token]` page)
  - Error states: token not found, token expired, already paid
- [ ] `src/lib/razorpay.ts` — Razorpay instance
- [ ] `POST /api/payments/create-order` — called from `/pay/[token]` page
  - Creates Razorpay order for `quotedAmount`
  - Returns `orderId`
- [ ] `POST /api/payments/verify` — HMAC verification
  - Updates booking → PAID
  - Sends: Resend payment confirmation email (wired in 2E)
- [ ] `POST /api/admin/bookings/[id]/confirm` — admin only → status = CONFIRMED
  - Sends: Resend booking confirmation email (wired in 2E)
- [ ] `POST /api/admin/bookings/[id]/cancel` — admin only → status = CANCELLED
  - Sends: Resend cancellation email (wired in 2E)
- [ ] `PUT /api/bookings/[id]/travelers` — save traveler details + PAN card
- [ ] `app/(public)/pay/[token]/page.tsx` — standalone Razorpay payment page

### Phase 2D — Reviews + Wishlist

- [ ] `GET /api/reviews?packageId=` — paginated reviews for a package
- [ ] `POST /api/reviews` — create review (auth required, must have CONFIRMED booking for package)
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
- [ ] `src/emails/` — all 8 React Email templates (see PROMPTS_2.md §2E-2 for full list)
- [ ] `src/lib/email.ts` — all send functions (sendEnquiryReceivedEmail, sendQuoteEmail, etc.)
- [ ] Uncomment all notification calls in 2C API routes (see PROMPTS_2.md §2E-2 Step 6)
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

## ━━━━━━━━━━ PHASE 3 — INTEGRATIONS + SEO + PERFORMANCE ━━━━━━━━━━

> AI Trip Planner is out of scope. No OpenAI. No Upstash (except rate limiting in 2A).

---

### Phase 3A — Third-Party API Integrations

- [ ] **Mapbox GL JS** — replace all `<MapEmbed />` placeholders
  - `NEXT_PUBLIC_MAPBOX_TOKEN` env var
  - `src/lib/mapbox.ts` — Mapbox config + dark style URL (`mapbox://styles/mapbox/dark-v11`)
  - `components/shared/MapboxMap.tsx` — interactive map component (replaces MapEmbed)
  - Destination detail: interactive map + surroundings panel
  - Contact page: static Mapbox map (office pin)
  - Package detail overview tab: destination area map

- [ ] **OpenWeatherMap** — `WhenToVisitTable` real data
  - `OPENWEATHERMAP_API_KEY` env var
  - `GET /api/destinations/[slug]/weather` → fetches + caches monthly data

- [ ] **Viator / TripAdvisor API** — real activities on destination detail
  - Via RapidAPI: `travel-advisor.p.rapidapi.com`
  - `GET /api/destinations/[slug]/activities` → returns top 6 activities

- [ ] **Booking.com Affiliate API** — hotel enrichment on package detail Hotels tab
  - Via RapidAPI: `booking-com.p.rapidapi.com`

- [ ] **ExchangeRate-API** — currency display on package detail
  - `src/lib/currency.ts` — fetch INR → USD/GBP/AED rates
  - Cache rates for 24h via Next.js `revalidate`

- [ ] **Useful Links** — static curated links (Niyo, Scapia, Visa2Fly, Airalo)
  - `components/shared/UsefulLinks.tsx` — already built in Phase 1

- [ ] **RapidAPI setup** — subscribe to all required APIs at rapidapi.com
  - Single `RAPIDAPI_KEY` env var for all

---

### Phase 3B — Analytics + SEO

- [ ] PostHog: install + pageview tracking + custom events
- [ ] Vercel Analytics: enable in vercel.json
- [ ] Sentry: install, configure DSN, error boundary integration
- [ ] `generateMetadata()` export on all public pages
- [ ] `app/opengraph-image.tsx` — dynamic OG for packages + destinations
- [ ] JSON-LD `TouristTrip` schema on `/packages/[slug]`
- [ ] `app/sitemap.ts` — auto-generated XML sitemap
- [ ] `app/robots.ts` — disallow `/admin`, `/api`, allow everything else

---

### Phase 3C — Performance + Final QA

**RapidLuxe 2.0 Stage 6 Final QA: PASS.** Commercial/booking-flow QA (Deal→Coupon→GST pricing, traveler-count recalculation, CTA propagation, payment-link generation, `/pay/[token]` noindex) verified end-to-end in-browser against the isolated `qa-stage6` Neon branch. P0 Deal-booking render loop resolved, commit `e6251f6`: the booking page's Deal-resolution `useEffect` now depends on stable package identity (`pkg?.id`) instead of an object literal rebuilt every render, and explicitly clears stale Deal state for invalid/missing `?deal=` parameters. Deferred, non-blocking: F2 (P1 UX — coupon input stays visually populated after a traveler-count change clears the applied coupon), F3 (P2 — lead-capture modal intermittently intercepts controls/inconsistent Escape dismissal), F4 (P2 — intermittent Unsplash/next-image hero 404). `/admin/content` is not an actual route; real content-management routes are `/admin/pages`, `/admin/blog`, `/admin/blog/authors`, `/admin/blog/categories`, `/admin/testimonials`. The Lighthouse/bundle-analyzer/cross-device items below remain unchecked — out of Stage 6's booking/commercial QA scope, not yet verified.

- [ ] `@next/bundle-analyzer` — identify and eliminate large dependencies
- [ ] Edge runtime on eligible route handlers (no Prisma — fetch only)
- [ ] Image audit: ensure `priority` only on first above-fold image per page
- [ ] Prisma connection pooling check for serverless cold starts
- [ ] Final Lighthouse: Performance ≥90, SEO ≥95, Accessibility ≥90, Best Practices ≥90
- [ ] Final cross-device QA: iPhone SE, iPhone 15, iPad, MacBook, 27" desktop
- [ ] Security audit: no secrets in client components, no missing auth checks
- [ ] Vercel deployment: production env vars, domain, edge config

---

_RapidLuxe | Developer: Sahil Jadhav | Updated: June 2026_
_MSG91 removed. Resend only for all notifications. WhatsApp via Interakt — future phase._
