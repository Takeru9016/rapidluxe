# CLAUDE.md — RapidLuxe

## Current Build State

```
Phase:          3C — Performance + Final QA
Active Task:    none
Last Completed: RapidLuxe 2.0 FINAL STATUS — Stage 0 through Stage 6 complete, Stage 6 Final QA PASS. No Stage 7 exists in the canonical 2.0 implementation order (`RapidLuxe_2.0_MD/29-2.0-IMPLEMENTATION-ORDER.md`) — Stage 6 is the last stage. A Final Post-Release-Readiness Audit was run after Stage 6 and returned **RELEASE READY WITH DEFERRED P2/P3** (0 P0 blockers, 0 P1 blockers). All three findings left "deferred (non-blocking)" in the prior Stage 6 note below are now resolved: F3 lead-capture modal (Escape dismissal + excluded from `/book/*` routes, commit `5dbe644`); F2 coupon input (clears/syncs when a traveler-count change invalidates the applied coupon, commit `0c3b19e`); F4 in two parts — seed no longer restores Unsplash gallery URLs into `Destination.images`/`Package.images` (commit `af9a579`), and seed no longer restores an Unsplash `Destination.imageUrl` (commit `9d3a76a`); no replacement photography was fabricated in either case, both are pure filters. Also fixed: destination-detail loading-skeleton CLS stabilization, measured 0.16–0.97 → 0.00 across 3 repeated production traces (commit `5086879`). Final P2 hardening from the release audit, commit `0de9e57`: `/api/admin/*` is now recognized by the admin middleware backstop in `src/proxy.ts` (defense-in-depth; all 30 existing per-route `role === "admin"` checks remain independently intact); `Package.maxGroupSize` is now enforced server-side in `POST /api/bookings` (`adults + children`, infants excluded, per confirmed product rule) so a crafted request can no longer exceed a package's group-size cap. Deferred, not release-blocking: static hardcoded `images.unsplash.com` hero/OG constants and the `about`/blog Sanity-fallback pattern (P2/P3 content-architecture debt — `next.config.ts`'s Unsplash `remotePatterns` entry remains required while these are live); the Mapbox vector-tile 403 (P2, root-caused to a token-scope/URL-restriction issue per Mapbox's own docs, requires Mapbox dashboard access not available in this environment, not proven to be an application code defect); JSON-LD `dangerouslySetInnerHTML` on `/packages/[slug]` (P3, standard structured-data pattern, low-risk); repo-wide Biome a11y/style findings (P3, pre-existing hygiene backlog, not new regressions). See `RapidLuxe_2.0_MD/30-DEFERRED-BACKLOG.md` for the full deferred-item list. Note: `/admin/content` is not an actual route — real content-management routes are `/admin/pages`, `/admin/blog`, `/admin/blog/authors`, `/admin/blog/categories`, `/admin/testimonials`.

Previously completed: RapidLuxe 2.0 Stage 6 Final QA — STATUS: PASS. Commercial/booking-flow QA verified end-to-end in-browser against the isolated `qa-stage6` Neon branch (production database confirmed untouched throughout): No Deal, Deal only, Coupon only, Deal + Coupon, invalid Deal, traveler-count changes (with Deal active and with Coupon active), CTA propagation (`/deals` → package detail → `/book/[packageId]`), payment-link generation, and `/pay/[token]` noindex/nofollow — all PASS. Verified commercial order: travelerSubtotal → Deal → Coupon → GST. Observed Deal + WELCOME20 example: ₹1,70,000 − ₹17,000 Deal = ₹1,53,000 − ₹30,600 Coupon = ₹1,22,400 + ₹6,120 GST = ₹1,28,520. P0 resolved — Deal booking render loop, commit `e6251f6`: the booking page's Deal-resolution `useEffect` now depends on stable package identity (`pkg?.id`) instead of an object literal rebuilt every render, and explicitly clears stale Deal state for invalid/missing deal parameters. Deferred findings at the time (since resolved — see FINAL STATUS above): F2 (P1 UX), F3 (P2), F4 (P2). Note: `/admin/content` is not an actual route — real content-management routes are `/admin/pages`, `/admin/blog`, `/admin/blog/authors`, `/admin/blog/categories`, `/admin/testimonials`.

Previously completed: About/Therapycation 2.0 Stage 2 (commit `4c70159`) — Stage 1 audit then approved implementation. Removed unsupported metadata claims (fabricated founding year, "50+ destinations") from `about/page.tsx`, replaced with `generateMetadata()` sourced from the same Sanity `aboutPage` fetch (deduped via React `cache()`). Fixed a real data-source mismatch found in the audit: trust stats now read from `aboutPage.stats` (page-scoped, admin-managed, matches an explicit "public /about page can read it too" comment in `/api/admin/sanity/about/route.ts`) instead of the sitewide `siteContent.trustBarStats` (which powers the homepage's separate `TrustBar` component and would have duplicated its numbers verbatim). CTA copy aligned to "Explore Journeys" (route unchanged, still `/packages`); added a secondary "Bespoke Planning" CTA (`/contact`) matching the Hero pattern. Added a visible "Our Story" `<h2>` — heading hierarchy now H1 → H2×5, no skips, single `<h1>`/`<main>` confirmed. Founder/Therapycation copy (heal/recharge/mental/emotional language) deliberately left untouched, not auto-rewritten — flagged for brand/legal review per explicit instruction. `npx tsc --noEmit`: 0 errors. `npx next build`: succeeded. `npx biome check`: clean (1 real line-width issue found and fixed via `biome format --write`). Not yet live-browser-tested (responsive breakpoints, light/dark, console) — dev server wasn't started this pass per standing instruction not to run it unprompted; recommend a live QA pass before considering this page fully shipped.

Previously completed: Admin dashboard + light-mode bug-fix batch (10 issues). ADMIN: (1) Gallery duplication bug fixed at the root — `Destination` had no `images` field at all (only single `imageUrl`), so its detail page always fell back to 1 photo; added `images String[]` + a Package-style multi-upload section to both destination admin forms, and removed `DetailPhotoGrid.tsx`'s old padding logic that repeated images via modulo when <5 were uploaded (now renders 1-4 images without duplicating, "View gallery" button anchors to the last real thumb). (2) Replaced `bestTimeFrom`/`bestTimeTo` range with `bestMonths String[]` multi-select checklist (Neon migration backfilled existing ranges into month arrays). (3) Hotel image field swapped from a raw URL `<input>` to `CloudinaryUpload`. (4) `ActivityCard` now hides the duration row when empty, matching the existing price guard. (5) Removed "External Platform Score"/"Review Summary" everywhere — admin form sections, `MultiPlatformRatings`/`ReviewSummaryCards` components (deleted), and `platformRatings`/`reviewSummary` columns dropped from `Package` via migration. (6) "Search Pixel" = "Search Pexels" (mishearing) — removed the Pexels tab from `CloudinaryUpload` entirely + deleted `/api/pexels`. USER-SIDE: (7) Removed hardcoded review/rating fakes: `DUMMY_RATINGS` dicts in both `PackageDetailClient.tsx` and `PackagesPageClient.tsx` (the latter backed a "Sort by Rating" option that's now removed since no real per-package aggregate exists), `PackageCard`'s hardcoded `<Rating rating={4.5} reviewCount={24}>`, and the orphaned `src/lib/dummy/reviews.ts`. Real review submission flow (`ReviewForm` → `/api/reviews`, eligibility-gated, admin-moderated) was already built and untouched. (8) Light-mode text/icon visibility — turned out to be a sitewide pattern (not just the 4 reported spots): components built dark-first hardcode literal `text-white` on surfaces that go light in light mode (theme tokens `--color-navy`/`--color-navy-surface`/`--color-white` flip per `.dark` class via next-themes), and the inverse — theme-flipping tokens like `--color-white-muted` used on permanently-dark image overlays going dark-on-dark. Fixed via `text-(--color-white)` (theme-following surfaces) or literal `text-white`/`text-white/NN` (permanently-dark surfaces: image+gradient overlays, `bg-black/NN`, brand-color buttons) across ~35 files — cards, homepage sections, every static public page, both listing pages, both detail pages. Brand-button text (gold/coral/teal/WhatsApp green) and genuinely-dark overlays (hardcoded `#0B0F1A` hex) were left as literal white. npx tsc --noEmit: 0 errors. Biome --write applied to all touched files (import sorting); remaining Biome errors are pre-existing a11y/button-type warnings in untouched code.
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

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
