# CLAUDE.md — RapidLuxe

## Current Build State

```
Phase:          3C — Performance + Final QA
Active Task:    none
Last Completed: Mechanical fixes batch (6 items). (1) PackageCard destination badge now reads pkg.destination.{name,country} instead of a slugified destinationId — required widening PackageCardProps to ApiPackage and dropping `as unknown as Package` casts in FeaturedPackages/PackagesPageClient/DestinationDetailClient/wishlist/PackageDetailClient. (2) Removed the permanently-disabled "Download Voucher" button on /bookings/[id] — no backend ever existed for it. (3) Fixed wishlist heart button: it bubbled into the parent Link (missing stopPropagation, so clicks also navigated away) and could misfire to /sign-in for signed-in users while Clerk was still loading (missing isLoaded guard). (4) CloudinaryUpload: added onRemove callback and a currentUrl-sync useEffect (preview state wasn't updating when async-loaded edit forms populated currentUrl after mount); wired onRemove into package/destination/blog forms; replaced a raw URL text input with CloudinaryUpload in the package edit form's gallery section; added a new `imageUrl` string field (+ Prisma-style Sanity schema field, deployed via `pnpm exec sanity schema deploy`) to testimonials since no client-image field existed before, then wired the admin form. (5) Removed the departure-date picker from the package detail booking sidebar (dead state, never read elsewhere). (6) Rebuilt admin enquiries page as a 35/65 inbox layout (list + detail), adding `type` (CORPORATE/GENERAL) and `status` (OPEN/RESOLVED) enums to the Enquiry model via a Neon migration (backfilled CORPORATE from existing "Corporate Account Request" subject prefix) since neither existed before — wired through /api/enquiries (type) and /api/admin/enquiries/[id] (status), with Reply-via-Email/WhatsApp/Mark-Resolved actions. Known pre-existing bug found, not fixed (out of scope): the public Contact page form (ContactPageClient.tsx) never calls the enquiries API — onSubmit just does `console.log(data); reset()`, so General enquiries never reach the database. npx tsc --noEmit: 0 errors.
```

> Update after every completed task.

---

## Reference Files — Load Only What the Task Needs

| When you need                                                 | Load                        |
| ------------------------------------------------------------- | --------------------------- |
| Core project context (stack, design tokens, folder structure) | `@RAPIDLUXE.md`             |
| Page layout, sections, tabs, admin pages                      | `@docs/spec/PAGES.md`       |
| DB schema, API routes, env vars, third-party APIs             | `@docs/spec/SCHEMA.md`      |
| Auth gating, payment flow, SEO, code patterns                 | `@docs/spec/CONVENTIONS.md` |
| Phase tasks + checklists                                      | `@docs/PHASES.md`           |
| Design rules (colors, fonts, spacing, animation)              | `@docs/DESIGN_RULES.md`     |
| Component specs + design references                           | `@docs/COMPONENT_SPECS.md`  |
| Session workflow + prompt patterns                            | `@docs/WORKFLOW.md`         |
| Sanity CMS integration                                        | `@docs/SANITY_CMS.md`       |

---

## Project

Dark-first luxury travel agency. Next.js 16 App Router · Tailwind v4 · shadcn/ui · Clerk · Prisma · Neon · Sanity v3 · Razorpay · Cloudinary · Resend · MSG91.

---

## Project Structure (Next.js src/ layout)

Package manager: pnpm — never npm

Root level (config only):
- prisma/ — schema, migrations, seed
- docs/ — DESIGN_RULES, PHASES, PROMPTS etc.
- public/ — static assets

src/ (all application code):
- src/app/ — ALL routes, pages, API routes
- src/app/api/ — API route handlers
- src/components/ — shadcn + custom components
- src/lib/ — prisma.ts, utils, validations, rate-limit, resend, etc.
- src/hooks/ — react hooks
- src/store/ — zustand stores
- src/types/ — typescript interfaces and types
- src/emails/ — React Email templates (Phase 2E)
- src/proxy.ts — Clerk auth middleware

Path alias: @/ → src/
- @/lib/prisma = src/lib/prisma.ts
- @/lib/validations/ = src/lib/validations/
- @/components/ = src/components/
- @/hooks/ = src/hooks/
- @/store/ = src/store/
- @/types/ = src/types/

API routes live at: src/app/api/[route]/route.ts

---

## Non-Negotiable Rules

1. No `any` TypeScript — proper interfaces in `src/types/`
2. No `<img>` — always `next/image` with `alt`
3. No raw prices — always `formatPrice()` → ₹1,25,000
4. No real API calls in Phase 1 — dummy data from `src/lib/dummy/` only
5. No off-palette colors — tokens in `@RAPIDLUXE.md §02`
6. No fonts outside Cormorant Garamond / DM Sans / JetBrains Mono
7. No `new PrismaClient()` outside `lib/prisma.ts`
8. No secrets in client components
9. Mobile-first — `grid-cols-1` then expand
10. Never edit `components/ui/` — shadcn auto-generated

---

## India GST (Legal Requirement)

- 5% on travel packages: `calculateGST(amount)` → `{ base, gst, total }`
- Show GST line in Booking Step 3 and every invoice
- PAN card field: show conditionally when `totalAmount > 200000`

---

## Key Paths

```
src/lib/dummy/   ← Phase 1 data (all pages read from here)
src/types/       ← All TypeScript interfaces
src/lib/utils.ts ← cn() formatPrice() calculateGST() generateSlug() formatDate()
src/store/       ← bookingStore searchStore wishlistStore uiStore
components/ui/   ← shadcn — READ ONLY, never modify
```

---

## Session Start Checklist

- [ ] What is the active task? (check Current Build State above)
- [ ] Phase 1? → dummy data only, no API calls
- [ ] Load only the specific `@` file needed — not all of them
