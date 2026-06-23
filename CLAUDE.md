# CLAUDE.md — RapidLuxe

## Current Build State

```
Phase:          3C — Performance + Final QA
Active Task:    none
Last Completed: Pricing model revamp + itemized invoice + booking autofill (3 changes). (1) PRICING MODEL: added `childPrice`/`infantPrice`/`toursPrice` (all Float?) to Package model via Neon migration `add_package_pricing_fields`; added to `createPackageSchema` (drives both POST /api/packages and PUT /api/packages/[slug] since both share it) and the `Package` type; wired into both admin package forms (new + [id] edit) as a new 3-field row under Pricing (renamed adult label to "Adults 12+"), using `Number.isFinite()` in the payload so empty inputs → undefined while 0 is preserved (infantPrice 0 = free vs empty = not accepted). Rebuilt the package-detail sidebar (PackageDetailClient.tsx) into a static "Price Guide": adults "From" price (honors active deal via effectivePrice) + conditional children/infants(free badge when 0)/tours rows + transparency note + "no payment to enquire" CTA copy. Removed the now-dead traveller counter, live GST total, and currency-conversion line from the sidebar (dropped useState/calculateGST/useCurrencyRates usages); mobile bottom bar kept. (2) INVOICE: rewrote src/pdfs/InvoiceDocument.tsx into a full 7-section itemized invoice (booking summary two-col, traveller table, Description|Rate|Qty|Amount breakdown with conditional child/infant/tours/discount rows, subtotal−discount → 5% GST → gold TOTAL row, payment-confirmation block, notes, footer). Widened InvoiceBooking interface (now needs infants/discountAmount/couponCode/updatedAt + package.pricePerPerson/childPrice/infantPrice/toursPrice/destination.country) — the invoices/[bookingId] route already passes the full Prisma booking so no route change needed. NOTE: line-item TOTAL is computed from package rack rates × counts; "Amount Paid" still shows booking.quotedAmount (admin-negotiated) — the two can legitimately differ. Verified by rendering full + minimal (no child/infant/tours/discount/destination) bookings to PDF buffers. (3) AUTOFILL: booking flow Step 2 (book/[packageId]/page.tsx) now fetches /api/user/me via react-query (enabled when Clerk isSignedIn), shows a gold "Pre-fill with your saved details?" banner when profile has name+phone (handleAutofill uses setValue on leadName/leadPhone/leadEmail/leadDob/leadPassport — no nationality field exists in this form so it's skipped; dateOfBirth sliced to YYYY-MM-DD), and a "save your details" soft prompt linking /profile?tab=personal when signed-in but profile incomplete. Still-open pre-existing bug (unchanged): Contact page form never calls the enquiries API. npx tsc --noEmit: 0 errors. Biome reformatted touched files; remaining Biome errors are pre-existing button-default-type warnings in untouched code.
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
