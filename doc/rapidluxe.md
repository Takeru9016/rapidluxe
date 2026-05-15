# RapidLuxe — Project Source of Truth

> This file is the single source of truth for the RapidLuxe Travel Agency Website.
> Use this as context for all AI-assisted development in this project.
> Do not contradict anything in this file without explicit instruction.

---
## 🤖 AGENT INSTRUCTIONS — READ FIRST, ALWAYS

> **This file is the single source of truth for the RapidLuxe project.**
> All agents, assistants, and IDE tools MUST follow these rules on every session — no exceptions.

### Persistent Behavior Rules

1. **Always load this file first** before generating any code, making any decision, or answering any question related to this project.
2. **Always use all installed Skills, Knowledge Files, and Memory** available in the current IDE environment (Cursor, Antigravity, or any other tool) to improve output quality, reduce hallucinations, and align with existing codebase patterns.
3. **Never contradict** the design system, tech stack, naming conventions, folder structure, or feature scope defined in this file.
4. **Never ask** for the tech stack, colors, fonts, component names, or page structure — they are all defined here.
5. **Always reference the relevant Section** of this file when generating code (e.g., "as per Section 02 design tokens", "as per Section 04 homepage layout").
6. **Always check existing files and patterns** in the codebase before writing new code — reuse, extend, don't duplicate.
7. **Follow the build order in Section 09** (Phase 1 → Phase 2 → Phase 3). Do not skip ahead.
8. **Maintain consistency** — every component must match the design tokens, spacing scale, and typography defined in Section 02.
9. **When in doubt**, re-read this file. The answer is here.

### How to Auto-Load This File (IDE Setup)

- **Cursor**: This file is referenced in `.cursorrules` — it is always active.
- **Antigravity**: This file is registered in **Settings → Rules** — it is always active.
- **Any other IDE**: Add `@RAPIDLUXE.md` to your system/project rules to activate.

---

## 00. Project Overview

| Key               | Value                                                                                               |
| ----------------- | --------------------------------------------------------------------------------------------------- |
| **Project Name**  | RapidLuxe                                                                                           |
| **Type**          | Travel Agency Website (B2C + B2B Corporate)                                                         |
| **Positioning**   | Mid-Premium + Community-driven + AI-powered                                                         |
| **Target Market** | India-first. Urban millennials, luxury-conscious travelers, solo/group explorers, corporate clients |
| **Primary Goal**  | Allow users to browse, plan, and book travel packages with a luxury editorial feel                  |
| **Developer**     | Sahil Jadhav (Fullstack Developer)                                                                  |

---

## 01. Tech Stack

### Frontend

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Animations**: GSAP + CSS transitions
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Data Fetching**: TanStack Query

### Backend

- **Auth**: Clerk (with roles: user, admin)
- **Database**: Neon DB (PostgreSQL, serverless)
- **ORM**: Prisma
- **CMS**: Sanity v3 (for blog, editorial content)
- **API Routes**: Next.js Route Handlers (Edge Runtime where possible)
- **File/Media**: Cloudinary
- **Email**: Resend
- **SMS / WhatsApp**: MSG91

### Payments

- **Primary**: Razorpay (INR, EMI, UPI, Cards, Netbanking)
- **International**: Stripe (Phase 2)
- **Cardless EMI**: Cashfree (Phase 2)

### AI (Phase 3)

- **LLM**: OpenAI GPT-4o (full itinerary generation)
- **LLM (cost-optimized)**: OpenAI GPT-4o mini (single-day edits, suggestions)
- **Streaming**: Vercel AI SDK (`streamText`, `useCompletion`)
- **Rate Limiting**: Upstash Redis

### Infrastructure

- **Hosting**: Vercel
- **Database**: Neon DB (serverless Postgres)
- **Caching**: Upstash Redis
- **Analytics**: PostHog + Vercel Analytics
- **Error Tracking**: Sentry
- **CI/CD**: Vercel Git integration

---

## 02. Design System

### Brand Identity

RapidLuxe is a **dark-first**, editorial luxury travel brand. Think cinematic, full-bleed photography, warm gold accents, and clean serif display text.

### Color Palette

| Token                    | Name           | Hex       |
| ------------------------ | -------------- | --------- |
| `--color-navy`           | Deep Navy      | `#0B0F1A` |
| `--color-navy-surface`   | Navy Surface   | `#111827` |
| `--color-navy-border`    | Navy Border    | `#1F2937` |
| `--color-gold`           | Sunset Gold    | `#C9A84C` |
| `--color-gold-light`     | Gold Light     | `#E2C47A` |
| `--color-gold-muted`     | Gold Muted     | `#A07C30` |
| `--color-teal`           | Ocean Teal     | `#0D9488` |
| `--color-coral`          | Terra Coral    | `#E07A5F` |
| `--color-white`          | Warm White     | `#FAF9F6` |
| `--color-white-muted`    | Muted White    | `#D1CBC0` |
| `--color-text-primary`   | Primary Text   | `#FAF9F6` |
| `--color-text-secondary` | Secondary Text | `#9CA3AF` |

> **Dark-first**: Default theme is dark. Light mode is a secondary consideration (Phase 2).

### Typography

| Role                     | Font               | Weight        | Usage                               |
| ------------------------ | ------------------ | ------------- | ----------------------------------- |
| Display / Hero headings  | Cormorant Garamond | 300, 400, 600 | H1, hero titles, section headers    |
| Body / UI                | DM Sans            | 400, 500, 600 | All body copy, nav, buttons, labels |
| Code / Price tags / Tags | JetBrains Mono     | 400           | Price display, booking IDs, tags    |

```css
/* Font import (in globals.css) */
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap");
```

### Spacing Scale

Use Tailwind's default spacing scale. Key values used frequently:

- Section padding: `py-20 md:py-32`
- Container max-width: `max-w-7xl mx-auto px-4 md:px-8`
- Card gap: `gap-6 md:gap-8`
- Section gap between elements: `space-y-4` or `space-y-6`

### Design Principles

1. **Dark Cinematic First** — Full-bleed hero images with overlay gradients
2. **Serif Display + Sans Body** — Cormorant for drama, DM Sans for clarity
3. **Gold as the Only Accent** — No neon, no bright colors except Coral for CTAs
4. **Cards as Editorial Tiles** — Masonry or 3-col grid, image-first
5. **Floating / Sticky Search** — Search widget always accessible
6. **Micro-interactions** — Hover reveals, fade-ins on scroll (GSAP)
7. **Trust Signals** — Ratings, review count, verified badges always visible
8. **Mobile First** — All layouts designed mobile → desktop

### UI Component Conventions

- All buttons use shadcn/ui `Button` with custom variants (`gold`, `outline-gold`, `ghost`)
- All form inputs use shadcn/ui `Input`, `Select`, `DatePicker`
- Cards are custom components (not shadcn) — see `/components/cards/`
- Modals use shadcn/ui `Dialog`
- Toasts use shadcn/ui `Sonner`
- Navigation dropdowns use shadcn/ui `NavigationMenu`

---

## 03. Folder Structure

```
rapidluxe/
├── src/
│   ├── app/
│   │   ├── (public)/                  # Public-facing pages
│   │   │   ├── page.tsx               # Homepage
│   │   │   ├── packages/
│   │   │   │   ├── page.tsx           # Package listing
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx       # Package detail
│   │   │   ├── destinations/
│   │   │   │   ├── page.tsx           # Destinations listing
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx       # Destination detail
│   │   │   ├── deals/
│   │   │   │   └── page.tsx           # Hot deals / flash sales
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx           # Blog listing (Sanity)
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx       # Blog post (Sanity)
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   ├── contact/
│   │   │   │   └── page.tsx
│   │   │   └── corporate/
│   │   │       └── page.tsx           # B2B corporate travel
│   │   ├── (auth)/                    # Clerk auth pages
│   │   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   │   └── sign-up/[[...sign-up]]/page.tsx
│   │   ├── (user)/                    # Authenticated user pages
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   ├── bookings/
│   │   │   │   ├── page.tsx           # My bookings list
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx       # Booking detail
│   │   │   ├── wishlist/
│   │   │   │   └── page.tsx
│   │   │   └── trip-planner/          # AI Trip Planner (Phase 3)
│   │   │       └── page.tsx
│   │   ├── (booking)/                 # Booking flow (multi-step)
│   │   │   └── book/
│   │   │       └── [packageId]/
│   │   │           └── page.tsx
│   │   ├── (admin)/                   # Admin panel (role-gated)
│   │   │   └── admin/
│   │   │       ├── page.tsx           # Dashboard
│   │   │       ├── packages/
│   │   │       │   ├── page.tsx       # Manage packages
│   │   │       │   ├── new/page.tsx
│   │   │       │   └── [id]/page.tsx
│   │   │       ├── bookings/
│   │   │       │   └── page.tsx
│   │   │       ├── users/
│   │   │       │   └── page.tsx
│   │   │       ├── deals/
│   │   │       │   └── page.tsx
│   │   │       └── analytics/
│   │   │           └── page.tsx
│   │   ├── api/
│   │   │   ├── packages/
│   │   │   │   └── route.ts
│   │   │   ├── bookings/
│   │   │   │   └── route.ts
│   │   │   ├── payments/
│   │   │   │   ├── create-order/route.ts
│   │   │   │   └── verify/route.ts
│   │   │   ├── search/
│   │   │   │   └── route.ts
│   │   │   ├── wishlist/
│   │   │   │   └── route.ts
│   │   │   ├── reviews/
│   │   │   │   └── route.ts
│   │   │   └── ai/
│   │   │       └── planner/route.ts   # Phase 3
│   │   ├── studio/                    # Sanity Studio (embedded)
│   │   │   └── [[...tool]]/page.tsx
│   │   ├── layout.tsx                 # Root layout
│   │   ├── globals.css
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── ui/                        # shadcn/ui auto-generated
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── MobileMenu.tsx
│   │   ├── cards/
│   │   │   ├── PackageCard.tsx
│   │   │   ├── DestinationCard.tsx
│   │   │   ├── DealCard.tsx
│   │   │   └── ReviewCard.tsx
│   │   ├── sections/                  # Homepage + page sections
│   │   │   ├── Hero.tsx
│   │   │   ├── SearchWidget.tsx
│   │   │   ├── FeaturedPackages.tsx
│   │   │   ├── Destinations.tsx
│   │   │   ├── HotDeals.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── TrustBar.tsx
│   │   │   ├── Newsletter.tsx
│   │   │   └── CTA.tsx
│   │   ├── booking/
│   │   │   ├── BookingForm.tsx
│   │   │   ├── TravelerDetails.tsx
│   │   │   ├── PaymentStep.tsx
│   │   │   └── BookingSummary.tsx
│   │   ├── admin/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   └── DataTable.tsx
│   │   └── shared/
│   │       ├── ThemeToggle.tsx
│   │       ├── SearchBar.tsx
│   │       ├── Rating.tsx
│   │       ├── Badge.tsx
│   │       ├── ImageGallery.tsx
│   │       ├── PriceDisplay.tsx
│   │       └── EmptyState.tsx
│   ├── lib/
│   │   ├── prisma.ts                  # Prisma client singleton
│   │   ├── razorpay.ts                # Razorpay instance
│   │   ├── cloudinary.ts              # Cloudinary config
│   │   ├── resend.ts                  # Resend client
│   │   ├── sanity.ts                  # Sanity client
│   │   ├── openai.ts                  # OpenAI client (Phase 3)
│   │   ├── upstash.ts                 # Upstash Redis client
│   │   └── utils.ts                   # cn(), formatPrice(), etc.
│   ├── hooks/
│   │   ├── useSearch.ts
│   │   ├── useWishlist.ts
│   │   ├── useBooking.ts
│   │   └── useAIPlanner.ts            # Phase 3
│   ├── store/
│   │   ├── bookingStore.ts            # Zustand booking state
│   │   └── searchStore.ts             # Zustand search/filter state
│   ├── types/
│   │   ├── package.ts
│   │   ├── booking.ts
│   │   ├── user.ts
│   │   └── api.ts
│   ├── actions/                       # Next.js Server Actions
│   │   ├── packages.ts
│   │   ├── bookings.ts
│   │   └── reviews.ts
│   └── middleware.ts                  # Clerk auth + role gating
├── prisma/
│   └── schema.prisma
├── sanity/
│   ├── schemas/
│   │   ├── post.ts
│   │   └── destination.ts
│   └── sanity.config.ts
├── public/
│   └── images/
├── .env.local
├── RAPIDLUXE.md                       # ← This file
├── next.config.ts
├── tailwind.config.ts                 # Only if needed (v4 is CSS-first)
└── components.json                    # shadcn config
```

---

## 04. All Pages — Detailed Breakdown

### Public Pages

#### `/` — Homepage

**Sections (top → bottom):**

1. **Navbar** — Logo | Nav links | Search icon | Sign In | CTA button
2. **Hero** — Full-bleed video/image background, headline, sub-headline, floating search widget
3. **Trust Bar** — "10,000+ trips booked" | "4.8★ rated" | "100% money back" | "24/7 support"
4. **Featured Packages** — 3-col card grid, filtered by "Trending" | "Luxury" | "Budget"
5. **Top Destinations** — Horizontal scroll or masonry grid of destination cards
6. **Hot Deals** — Time-limited flash sale cards with countdown timer
7. **How It Works** — 3-step process (Search → Book → Travel)
8. **Testimonials** — Review cards with avatar, rating, trip name
9. **Blog Preview** — Latest 3 blog posts from Sanity
10. **Newsletter** — Email capture with lead magnet copy
11. **Footer**

---

#### `/packages` — Package Listing

**Sections:**

1. **Page Header** — Title + breadcrumb
2. **Filters Sidebar (desktop) / Filter Drawer (mobile)**:
   - Destination
   - Duration (nights)
   - Price range (slider)
   - Travel type (Beach, Mountain, Heritage, Adventure, Luxury, Honeymoon)
   - Group size
   - Departure date range
3. **Sort Bar** — "Most Popular" | "Price: Low→High" | "Rating" | "Newest"
4. **Package Grid** — 3-col (desktop), 2-col (tablet), 1-col (mobile)
5. **Pagination / Infinite scroll**
6. **Sticky floating "View Map" button** (Phase 2 — opens interactive destination map)

**Package Card contains:**

- Cover image (hover: second image)
- Destination badge
- Package name
- Duration
- Star rating + review count
- Price (per person, "from ₹X")
- "Includes flights" badge (if applicable)
- Wishlist heart icon
- CTA: "View Details"

---

#### `/packages/[slug]` — Package Detail ⭐ Most Complex Page

**Sections:**

1. **Image Gallery** — Full-width hero + thumbnail strip (Cloudinary)
2. **Header Block** — Title, destination, duration, rating, review count, share + wishlist
3. **Sticky Booking Sidebar** (desktop) — Price, date picker, travelers count, "Book Now" CTA, EMI teaser ("From ₹X/month with Razorpay")
4. **Overview Tab** — Description, highlights, inclusions/exclusions, map embed
5. **Itinerary Tab** — Day-by-day accordion (Day 1: Arrival → Day 7: Departure)
6. **Hotels Tab** — Hotel cards with name, stars, location, images
7. **Activities Tab** — Activity cards with name, duration, included/optional tag
8. **Reviews Tab** — Paginated review list + review submission form (auth required)
9. **Policies Section** — Cancellation policy, payment terms
10. **Similar Packages** — Horizontal scroll of related package cards

**Booking Sidebar (sticky):**

- Package price (per person)
- Date picker (departure date)
- Travelers selector (adults, children, infants)
- Total price calculator (live)
- EMI breakdown ("₹X/month × 6")
- "Book Now" button → goes to `/book/[packageId]`
- "Get Custom Quote" button → opens contact form modal

---

#### `/destinations` — Destinations Listing

**Sections:**

1. **Hero** — Full-bleed image, "Where do you want to go?"
2. **Continent Filter** — Asia | Europe | Africa | Americas | Middle East | Oceania
3. **Destination Grid** — Cards with image, country, city name, "X packages" count
4. **Popular Destinations** — Curated horizontal scroll
5. **Seasonal Recommendations** — "Best places to visit this month"

---

#### `/destinations/[slug]` — Destination Detail

**Sections:**

1. **Hero** — Full-bleed image + overlay with destination name + country
2. **Quick Facts** — Best time to visit | Currency | Language | Visa type for Indians
3. **About** — Description from Sanity CMS
4. **Packages from this Destination** — Filtered package grid
5. **Activities** — Top things to do (Viator API)
6. **Weather Widget** — Monthly temp + rainfall (OpenWeatherMap API)
7. **Travel Tips** — Editor's tips from Sanity
8. **Map** — Google Maps embed

---

#### `/deals` — Hot Deals / Flash Sales

**Sections:**

1. **Banner** — "⚡ Flash Sale — Ends in 04:22:11" (countdown)
2. **Deal Cards Grid** — Package cards with original price strikethrough, % discount badge
3. **Early Bird Deals** — Separate section for advance bookings
4. **Last-Minute Deals** — Departures within 7–14 days

---

#### `/blog` — Blog Listing (Sanity CMS)

**Sections:**

1. **Featured Post** — Large hero card
2. **Category Filter** — All | Destinations | Tips | Luxury | Solo Travel | Group Travel
3. **Blog Grid** — Cards with image, category tag, title, excerpt, read time, date
4. **Sidebar** — Popular posts, tags cloud, newsletter CTA

---

#### `/blog/[slug]` — Blog Post

**Sections:**

1. **Hero Image** — Full-width
2. **Post Header** — Title, author, date, read time, share buttons
3. **Rich Text Body** — From Sanity Portable Text
4. **Related Posts** — 3 cards at bottom
5. **CTA Banner** — "Ready to travel? Browse Packages →"

---

#### `/about` — About Page

**Sections:**

1. **Hero** — Headline + team photo
2. **Our Story** — Founding story, mission, values
3. **Stats Bar** — "10,000+ bookings | 50+ destinations | 4.8★ avg rating"
4. **Team Section** — Team member cards with photo, name, role
5. **Awards & Press** — Logo grid
6. **CTA** — "Start Planning Your Trip"

---

#### `/contact` — Contact Page

**Sections:**

1. **Hero** — "We're here to help"
2. **Contact Form** — Name, email, phone, subject (dropdown), message — sent via Resend
3. **Contact Details** — Phone, email, WhatsApp, office address
4. **WhatsApp CTA** — "Chat with us on WhatsApp" button (MSG91)
5. **Google Maps embed** — Office location

---

#### `/corporate` — B2B Corporate Travel

**Sections:**

1. **Hero** — "Corporate Travel, Simplified"
2. **Features** — Centralized billing, GST invoices, dedicated account manager
3. **How It Works** — 3 steps for corporates
4. **Client Logos** — Trusted companies
5. **Testimonials** — Corporate client quotes
6. **Contact Form** — Specific to corporate inquiries

---

### Auth Pages (Clerk)

#### `/sign-in` and `/sign-up`

- Clerk's pre-built UI components, wrapped in RapidLuxe layout
- Social login: Google, Email OTP
- Redirect after auth: `/profile` (new users) or previous page (returning users)

---

### User Pages (Auth Required)

#### `/profile` — User Profile

**Sections:**

1. **Profile Header** — Avatar, name, email, edit button
2. **Tabs**:
   - My Bookings (links to `/bookings`)
   - Wishlist (links to `/wishlist`)
   - Personal Details (editable form)
   - Travel Preferences (adventure, luxury, beach, etc.)
   - Notifications (email, WhatsApp toggle)

---

#### `/bookings` — My Bookings

**Sections:**

1. **Filter Tabs** — All | Upcoming | Completed | Cancelled
2. **Booking Cards** — Package name, dates, travelers, status badge, booking ID, "View Details" CTA

---

#### `/bookings/[id]` — Booking Detail

**Sections:**

1. **Booking Header** — Booking ID, status badge, package name
2. **Trip Summary** — Dates, travelers, package details
3. **Traveler Details** — All traveler info submitted
4. **Payment Summary** — Amount paid, EMI breakdown, invoice download
5. **Actions** — "Download Voucher" | "Raise a Request" | "Cancel Booking" (if policy allows)

---

#### `/wishlist` — Wishlist

- Grid of saved package cards
- Remove from wishlist option
- "Book Now" CTA on each card

---

### Booking Flow (Multi-Step)

#### `/book/[packageId]`

**Step 1 — Review Package**

- Package summary (image, name, price, date, travelers)
- Editable: date, travelers count
- Coupon code input

**Step 2 — Traveler Details**

- Lead traveler: name, DOB, passport number, email, phone
- Additional travelers: same fields
- Special requests textarea

**Step 3 — Review & Pay**

- Final order summary
- Price breakdown (base + taxes + fees)
- EMI options via Razorpay
- "Pay Now" button → Razorpay checkout
- Payment method: UPI | Card | Netbanking | EMI | Wallet

**Step 4 — Confirmation**

- Success screen with booking ID
- "Download Voucher" button
- "View My Bookings" link
- Confirmation email auto-sent via Resend

---

### Admin Pages (Role: admin — Clerk)

#### `/admin` — Dashboard

- **Stats Cards**: Total Bookings | Revenue (MTD) | Active Packages | New Users
- **Recent Bookings Table**: Quick overview of last 10 bookings
- **Revenue Chart**: Monthly bar chart
- **Quick Actions**: "Add Package" | "Create Deal" | "View Enquiries"

#### `/admin/packages` — Manage Packages

- Data table with all packages (name, destination, price, status, actions)
- "Add New Package" button → `/admin/packages/new`
- Edit | Archive | Delete actions per row

#### `/admin/packages/new` and `/admin/packages/[id]` — Package Form

**Fields:**

- Title, slug (auto-generated), description (rich text)
- Destination (dropdown linked to destinations table)
- Duration (nights), group size (min/max)
- Price per person, original price (for discount display)
- Inclusions (multi-input), exclusions (multi-input)
- Itinerary builder (day-by-day accordion builder)
- Hotels (multi-input with name, stars, location)
- Activities (multi-input)
- Tags (Luxury, Honeymoon, Adventure, etc.)
- Featured toggle, Status (Draft / Published)
- Image upload (Cloudinary)
- SEO fields (meta title, meta description)

#### `/admin/bookings` — All Bookings

- Full data table with filters (status, date range, package)
- View, update status, download invoice per row

#### `/admin/users` — All Users

- Data table: name, email, total bookings, joined date
- View user profile, bookings

#### `/admin/deals` — Manage Deals

- Create flash sale or early bird deal
- Link to package, set discount %, set expiry date/time
- Toggle active/inactive

#### `/admin/analytics` — Analytics

- Revenue over time (chart)
- Top packages (by booking count)
- Top destinations
- User acquisition sources
- Embedded PostHog dashboard or custom charts

---

## 05. Database Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String    @id @default(cuid())
  clerkId      String    @unique
  email        String    @unique
  name         String?
  phone        String?
  role         Role      @default(USER)
  preferences  Json?
  bookings     Booking[]
  reviews      Review[]
  wishlist     Wishlist[]
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

enum Role {
  USER
  ADMIN
}

model Destination {
  id           String    @id @default(cuid())
  name         String
  slug         String    @unique
  country      String
  continent    String
  description  String?
  imageUrl     String?
  bestTimeFrom String?
  bestTimeTo   String?
  visaType     String?
  currency     String?
  language     String?
  packages     Package[]
  createdAt    DateTime  @default(now())
}

model Package {
  id              String      @id @default(cuid())
  title           String
  slug            String      @unique
  description     String
  destinationId   String
  destination     Destination @relation(fields: [destinationId], references: [id])
  durationNights  Int
  pricePerPerson  Float
  originalPrice   Float?
  minGroupSize    Int         @default(1)
  maxGroupSize    Int         @default(20)
  inclusions      String[]
  exclusions      String[]
  itinerary       Json        // Array of { day, title, description, meals }
  hotels          Json        // Array of { name, stars, location, imageUrl }
  activities      Json        // Array of { name, duration, included }
  images          String[]    // Cloudinary URLs
  tags            String[]    // ["Luxury", "Honeymoon", "Beach"]
  isFeatured      Boolean     @default(false)
  includesFlights Boolean     @default(false)
  status          PackageStatus @default(DRAFT)
  bookings        Booking[]
  reviews         Review[]
  wishlist        Wishlist[]
  deals           Deal[]
  metaTitle       String?
  metaDescription String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
}

enum PackageStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

model Booking {
  id              String        @id @default(cuid())
  bookingRef      String        @unique @default(cuid())
  userId          String
  user            User          @relation(fields: [userId], references: [id])
  packageId       String
  package         Package       @relation(fields: [packageId], references: [id])
  departureDate   DateTime
  adults          Int
  children        Int           @default(0)
  infants         Int           @default(0)
  travelers       Json          // Array of traveler detail objects
  totalAmount     Float
  discountAmount  Float         @default(0)
  couponCode      String?
  paymentStatus   PaymentStatus @default(PENDING)
  bookingStatus   BookingStatus @default(CONFIRMED)
  razorpayOrderId String?
  razorpayPaymentId String?
  specialRequests String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}

enum PaymentStatus {
  PENDING
  PAID
  REFUNDED
  FAILED
}

enum BookingStatus {
  CONFIRMED
  CANCELLED
  COMPLETED
}

model Review {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  packageId String
  package   Package  @relation(fields: [packageId], references: [id])
  rating    Int      // 1–5
  title     String?
  body      String
  images    String[]
  isVerified Boolean @default(false) // only users who booked this package
  createdAt DateTime @default(now())
}

model Wishlist {
  id        String  @id @default(cuid())
  userId    String
  user      User    @relation(fields: [userId], references: [id])
  packageId String
  package   Package @relation(fields: [packageId], references: [id])
  createdAt DateTime @default(now())

  @@unique([userId, packageId])
}

model Deal {
  id          String   @id @default(cuid())
  packageId   String
  package     Package  @relation(fields: [packageId], references: [id])
  type        DealType
  discountPct Float
  expiresAt   DateTime
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
}

enum DealType {
  FLASH_SALE
  EARLY_BIRD
  LAST_MINUTE
}

model Enquiry {
  id        String   @id @default(cuid())
  name      String
  email     String
  phone     String?
  subject   String
  message   String
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
}

model Coupon {
  id           String   @id @default(cuid())
  code         String   @unique
  discountType String   // "PERCENT" | "FIXED"
  discountValue Float
  minAmount    Float?
  maxUses      Int?
  usedCount    Int      @default(0)
  expiresAt    DateTime?
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
}
```

---

## 06. Third-Party API Stack

### Flights

| API                       | Provider               | Use                                       |
| ------------------------- | ---------------------- | ----------------------------------------- |
| Amadeus Flight Search     | Amadeus for Developers | Search flights by origin/destination/date |
| Skyscanner (via RapidAPI) | RapidAPI               | Price comparison fallback                 |

### Hotels

| API                       | Provider      | Use                                 |
| ------------------------- | ------------- | ----------------------------------- |
| Booking.com Affiliate API | Booking.com   | Hotel search, availability, pricing |
| Expedia Rapid API         | Expedia Group | Phase 2 — additional inventory      |

### Activities & Experiences

| API                              | Provider     | Use                                |
| -------------------------------- | ------------ | ---------------------------------- |
| Viator / TripAdvisor Experiences | TripAdvisor  | Activities per destination         |
| Klook API                        | Klook        | Asia-focused experiences (Phase 2) |
| GetYourGuide API                 | GetYourGuide | Europe fallback (Phase 2)          |

### Reviews

| API                     | Provider    | Use                           |
| ----------------------- | ----------- | ----------------------------- |
| TripAdvisor Content API | TripAdvisor | Hotel and destination reviews |
| Google Places API       | Google      | Business ratings + reviews    |

### Maps

| API                        | Provider | Use                                  |
| -------------------------- | -------- | ------------------------------------ |
| Google Maps JavaScript API | Google   | Destination maps, hotel pins         |
| Google Maps Embed API      | Google   | Static embeds in contact/destination |
| Mapbox GL JS               | Mapbox   | Interactive itinerary map (Phase 2)  |

### Payments

| API                   | Provider | Use                                  |
| --------------------- | -------- | ------------------------------------ |
| Razorpay Payment API  | Razorpay | INR payments, UPI, Cards, Netbanking |
| Razorpay EMI API      | Razorpay | EMI on packages                      |
| Cashfree Cardless EMI | Cashfree | Cardless EMI (Phase 2)               |
| Stripe                | Stripe   | International payments (Phase 2)     |

### Currency

| API              | Provider         | Use                                    |
| ---------------- | ---------------- | -------------------------------------- |
| ExchangeRate-API | ExchangeRate-API | Live INR ↔ foreign currency conversion |

### Weather

| API                | Provider       | Use                             |
| ------------------ | -------------- | ------------------------------- |
| OpenWeatherMap API | OpenWeatherMap | Monthly weather per destination |

### AI (Phase 3)

| API                     | Provider | Use                                  |
| ----------------------- | -------- | ------------------------------------ |
| OpenAI Chat Completions | OpenAI   | GPT-4o for full itinerary generation |
| OpenAI Chat Completions | OpenAI   | GPT-4o mini for single-day edits     |

### Communication

| API                   | Provider       | Use                                                  |
| --------------------- | -------------- | ---------------------------------------------------- |
| Resend                | Resend         | Transactional emails (booking confirm, OTP, enquiry) |
| MSG91                 | MSG91          | SMS OTP, booking alerts                              |
| WhatsApp Business API | Twilio / MSG91 | WhatsApp booking confirmations                       |

### Media

| API          | Provider   | Use                                        |
| ------------ | ---------- | ------------------------------------------ |
| Cloudinary   | Cloudinary | Image upload, optimization, transformation |
| Unsplash API | Unsplash   | Placeholder/editorial destination images   |
| Pexels API   | Pexels     | Fallback stock imagery                     |

### Analytics & Monitoring

| API              | Provider | Use                                           |
| ---------------- | -------- | --------------------------------------------- |
| PostHog          | PostHog  | Product analytics, funnels, session recording |
| Vercel Analytics | Vercel   | Page-level web vitals                         |
| Sentry           | Sentry   | Error tracking + performance monitoring       |

---

## 07. Environment Variables

```bash
# .env.local — DO NOT commit this file

# Database
DATABASE_URL=

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/profile

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=bookings@rapidluxe.com

# MSG91
MSG91_AUTH_KEY=
MSG91_SENDER_ID=

# OpenAI (Phase 3)
OPENAI_API_KEY=

# Upstash Redis (Phase 3 — rate limiting)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Amadeus
AMADEUS_CLIENT_ID=
AMADEUS_CLIENT_SECRET=

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=

# ExchangeRate-API
EXCHANGE_RATE_API_KEY=

# OpenWeatherMap
OPENWEATHER_API_KEY=

# TripAdvisor
TRIPADVISOR_API_KEY=

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Sentry
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=
```

---

## 08. MVP Feature List

### Phase 1 — Frontend (Dummy Data)

- [ ] `globals.css` — full design system tokens
- [ ] `layout.tsx` — root layout, fonts, providers
- [ ] Navbar (transparent → solid on scroll, mobile menu)
- [ ] Footer (links, social, newsletter input)
- [ ] Homepage (all sections with dummy data)
- [ ] Package listing page (with filter UI)
- [ ] Package detail page (all tabs, sticky sidebar)
- [ ] Destinations listing page
- [ ] Destination detail page
- [ ] Deals page
- [ ] About page
- [ ] Contact page (form UI only)
- [ ] Auth pages (Clerk UI)
- [ ] Profile page (UI only)
- [ ] Bookings page (UI only)
- [ ] Booking flow — all 4 steps (UI only)
- [ ] Admin dashboard (UI only)
- [ ] Admin packages CRUD (form UI only)
- [ ] 404 page

### Phase 2 — Backend

- [ ] Prisma schema + Neon DB setup
- [ ] Clerk auth + role middleware
- [ ] Package CRUD API routes
- [ ] Booking creation + Razorpay order
- [ ] Razorpay payment verification webhook
- [ ] Booking confirmation email via Resend
- [ ] Review submission (verified bookings only)
- [ ] Wishlist toggle
- [ ] Contact form → Resend
- [ ] Coupon code validation
- [ ] Sanity CMS setup (blog + destinations)
- [ ] Cloudinary image upload in admin
- [ ] Admin analytics (basic stats queries)
- [ ] Search API with filters

### Phase 3 — AI + Integrations

- [ ] OpenAI Trip Planner (streaming, GPT-4o)
- [ ] Upstash rate limiting on AI routes
- [ ] Amadeus flight search integration
- [ ] Booking.com hotel search integration
- [ ] Viator activities per destination
- [ ] OpenWeatherMap weather widget
- [ ] ExchangeRate-API currency display
- [ ] Google Maps on destination pages
- [ ] PostHog analytics integration
- [ ] Sentry error tracking
- [ ] Performance optimization + SEO audit

---

## 09. Build Phases & Timeline

### Phase 1 — Frontend (Weeks 1–3)

Build all pages with dummy/mock data. No real API calls. Focus on design, layout, animations, mobile responsiveness.

**Order of build:**

1. `globals.css` + `layout.tsx`
2. Navbar + Footer
3. Homepage (section by section)
4. Package listing + Package detail
5. Destinations listing + detail
6. Deals page
7. About + Contact
8. Auth pages (Clerk)
9. User pages (Profile, Bookings, Wishlist)
10. Booking flow (4 steps)
11. Admin panel (Dashboard, Packages, Bookings)

### Phase 2 — Backend (Weeks 4–6)

Wire up real data. Build API routes. Connect payments.

**Order of build:**

1. Prisma schema + Neon DB
2. Clerk auth + middleware
3. Package API (GET all, GET by slug, POST/PUT/DELETE for admin)
4. Booking API + Razorpay
5. Review API
6. Wishlist API
7. Contact form + Resend
8. Sanity CMS + blog
9. Cloudinary upload
10. Admin analytics queries

### Phase 3 — AI + Integrations (Weeks 7–8)

Enrich with third-party data. Add AI planner.

**Order of build:**

1. AI Trip Planner (OpenAI + Vercel AI SDK)
2. Flight search (Amadeus)
3. Hotel search (Booking.com)
4. Activities (Viator)
5. Weather widget (OpenWeatherMap)
6. Currency conversion (ExchangeRate-API)
7. Maps (Google Maps)
8. Analytics (PostHog + Sentry)
9. Performance + SEO

---

## 10. Coding Conventions

### General

- Use TypeScript everywhere. No `any` types — use proper interfaces from `/types/`.
- All server-side logic (DB queries, API calls with secrets) in Route Handlers or Server Actions — never in client components.
- Client components must have `"use client"` directive at the top.
- Server components are the default in App Router.

### Naming

- **Components**: PascalCase (`PackageCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useWishlist.ts`)
- **API routes**: kebab-case folders (`/api/create-order/route.ts`)
- **Utilities**: camelCase functions (`formatPrice`, `generateSlug`)
- **Types**: PascalCase interfaces (`type Package = { ... }`)
- **CSS classes**: Tailwind utility classes only — no custom class names unless absolutely necessary

### API Route Pattern

```ts
// All API routes follow this pattern
export async function GET(request: Request) {
  try {
    // 1. Auth check (if required)
    // 2. Parse params/body
    // 3. Validate with Zod
    // 4. DB query via Prisma
    // 5. Return response
    return Response.json({ data }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
```

### Prisma Usage

- Always use the singleton pattern from `lib/prisma.ts`
- Never instantiate `new PrismaClient()` outside of `lib/prisma.ts`

```ts
// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ log: ["query"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### Price Formatting

Always display prices in INR using the `formatPrice` utility:

```ts
// lib/utils.ts
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
// Output: ₹1,25,000
```

### Component Structure Template

```tsx
// components/cards/PackageCard.tsx
import type { Package } from '@/types/package'

interface PackageCardProps {
  package: Package
  variant?: 'default' | 'compact'
}

export function PackageCard({ package: pkg, variant = 'default' }: PackageCardProps) {
  return (
    // JSX
  )
}
```

### Image Convention

- All user-uploaded images stored on **Cloudinary**
- All images rendered with `next/image` component
- Always provide `alt`, `width`, `height` or `fill` prop
- Use `priority` only for above-the-fold images (hero, first card)

### Error Handling

- All async server actions wrapped in try/catch
- User-facing errors shown via shadcn/ui `Sonner` toast
- Critical errors logged to Sentry
- API routes return consistent `{ data, error }` shape

---

## 11. Razorpay Payment Flow

```
1. User clicks "Book Now" on /book/[packageId]
2. Client calls POST /api/payments/create-order
3. Server creates Razorpay order (amount in paise)
4. Server creates Booking record in DB (status: PENDING)
5. Client opens Razorpay checkout modal
6. User pays (UPI / Card / EMI / Netbanking)
7. Razorpay calls POST /api/payments/verify (webhook)
8. Server verifies signature using HMAC SHA256
9. Server updates Booking status → PAID
10. Server sends confirmation email via Resend
11. Client redirects to /book/[packageId]?step=4 (confirmation)
```

---

## 12. Auth & Role Gating (Clerk)

```ts
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isUserRoute = createRouteMatcher([
  "/profile(.*)",
  "/bookings(.*)",
  "/wishlist(.*)",
  "/book(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    const { sessionClaims } = await auth();
    if (sessionClaims?.metadata?.role !== "admin") {
      return Response.redirect(new URL("/", req.url));
    }
  }
  if (isUserRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
```

> Admin role is set via Clerk's `publicMetadata.role = "admin"` — set manually or via Clerk Dashboard for now.

---

## 13. SEO Conventions

- Every page exports a `generateMetadata` function
- OG image: dynamic using `next/og` for package and destination pages
- Sitemap: auto-generated via `app/sitemap.ts`
- Robots: `app/robots.ts`
- Structured data (JSON-LD): Package pages get `TouristTrip` schema

```ts
// Example: app/(public)/packages/[slug]/page.tsx
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const pkg = await getPackageBySlug(params.slug);
  return {
    title: `${pkg.title} | RapidLuxe`,
    description: pkg.description.slice(0, 155),
    openGraph: {
      title: pkg.title,
      description: pkg.description.slice(0, 155),
      images: [pkg.images[0]],
    },
  };
}
```

---

## 14. Design References

> For each reference, a note specifies **what to extract** so AI in your IDE knows exactly which element to borrow — not the whole design.

### Design Reference

1. [Travel Agency Tour Guide Booking Website](https://dribbble.com/shots/24495182-Travel-Agency-Tour-Guide-Booking-Website)
2. [Travel Agency Website Design UI/UX](https://dribbble.com/shots/26951670-Travel-Agency-Website-Design-UI-UX)
3. [Travel Agency Landing Page](https://dribbble.com/shots/26206146-Travel-Agency-Landing-Page)
4. [Flight Booking Search Bar Design](https://dribbble.com/shots/27293695-Flight-booking-Search-bar-design)
5. [Landing Page for a Travel Agency](https://dribbble.com/shots/25312810-Landing-page-for-a-travel-agency)
6. [Destination Travel Agency Website](https://dribbble.com/shots/25364452-Destination-Travel-Agency-Website)
7. [Flypass Travel Agency Landing Page](https://dribbble.com/shots/24339434-Flypass-Travel-Agency-Landing-Page)
8. [Adventure Travel Agency Trip Booking Website](https://dribbble.com/shots/26992336-Adventure-Travel-Agency-Trip-Booking-Website)

---

### Additional References (Add URLs Here)

Always ask user for design inspiration or refernce whenever needed or to clarify the user design requirements. After taking design reference from user, update this section to add external design references as you find them. Format:

```
- [Source Name](URL) — brief description. Extract: **specific element to borrow**.
```

#### Hero / Landing

<!-- Add hero design references here -->

#### Cards / Package Tiles

<!-- Add card design references here -->

#### Navigation

<!-- Add navbar design references here -->

#### Booking Flow / Forms

<!-- Add booking/form design references here -->

#### Destination Pages

<!-- Add destination page references here -->

#### Admin / Dashboard

<!-- Add admin UI references here -->

#### Typography & Color Mood

<!-- Add editorial / brand mood references here -->

#### Micro-interactions & Animation

<!-- Add animation / interaction references here -->

---

### Reference Sources to Browse

| Source         | URL                    | Best For                             |
| -------------- | ---------------------- | ------------------------------------ |
| Dribbble       | https://dribbble.com   | UI polish, card designs, hero shots  |
| Behance        | https://behance.net    | Full case studies, booking flows     |
| Awwwards       | https://awwwards.com   | Top-tier web experiences, typography |
| Mobbin         | https://mobbin.com     | Mobile UI patterns, booking apps     |
| Godly          | https://godly.website  | Landing pages, editorial layouts     |
| Land-book      | https://land-book.com  | Homepage inspiration                 |
| Navbar.gallery | https://navbar.gallery | Navigation patterns                  |
| Footer.design  | https://footer.design  | Footer layout ideas                  |
| Pttrns         | https://pttrns.com     | Mobile travel app patterns           |
| Collect UI     | https://collectui.com  | Component-level UI inspiration       |

---
