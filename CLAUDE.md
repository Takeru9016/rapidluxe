# CLAUDE.md — RapidLuxe

## Current Build State

```
Phase:          3C — Performance + Final QA
Active Task:    none
Last Completed: Admin dashboard + light-mode bug-fix batch (10 issues). ADMIN: (1) Gallery duplication bug fixed at the root — `Destination` had no `images` field at all (only single `imageUrl`), so its detail page always fell back to 1 photo; added `images String[]` + a Package-style multi-upload section to both destination admin forms, and removed `DetailPhotoGrid.tsx`'s old padding logic that repeated images via modulo when <5 were uploaded (now renders 1-4 images without duplicating, "View gallery" button anchors to the last real thumb). (2) Replaced `bestTimeFrom`/`bestTimeTo` range with `bestMonths String[]` multi-select checklist (Neon migration backfilled existing ranges into month arrays). (3) Hotel image field swapped from a raw URL `<input>` to `CloudinaryUpload`. (4) `ActivityCard` now hides the duration row when empty, matching the existing price guard. (5) Removed "External Platform Score"/"Review Summary" everywhere — admin form sections, `MultiPlatformRatings`/`ReviewSummaryCards` components (deleted), and `platformRatings`/`reviewSummary` columns dropped from `Package` via migration. (6) "Search Pixel" = "Search Pexels" (mishearing) — removed the Pexels tab from `CloudinaryUpload` entirely + deleted `/api/pexels`. USER-SIDE: (7) Removed hardcoded review/rating fakes: `DUMMY_RATINGS` dicts in both `PackageDetailClient.tsx` and `PackagesPageClient.tsx` (the latter backed a "Sort by Rating" option that's now removed since no real per-package aggregate exists), `PackageCard`'s hardcoded `<Rating rating={4.5} reviewCount={24}>`, and the orphaned `src/lib/dummy/reviews.ts`. Real review submission flow (`ReviewForm` → `/api/reviews`, eligibility-gated, admin-moderated) was already built and untouched. (8) Light-mode text/icon visibility — turned out to be a sitewide pattern (not just the 4 reported spots): components built dark-first hardcode literal `text-white` on surfaces that go light in light mode (theme tokens `--color-navy`/`--color-navy-surface`/`--color-white` flip per `.dark` class via next-themes), and the inverse — theme-flipping tokens like `--color-white-muted` used on permanently-dark image overlays going dark-on-dark. Fixed via `text-(--color-white)` (theme-following surfaces) or literal `text-white`/`text-white/NN` (permanently-dark surfaces: image+gradient overlays, `bg-black/NN`, brand-color buttons) across ~35 files — cards, homepage sections, every static public page, both listing pages, both detail pages. Brand-button text (gold/coral/teal/WhatsApp green) and genuinely-dark overlays (hardcoded `#0B0F1A` hex) were left as literal white. npx tsc --noEmit: 0 errors. Biome --write applied to all touched files (import sorting); remaining Biome errors are pre-existing a11y/button-type warnings in untouched code. Not yet visually verified in a running browser (no screenshot tool available this session) — recommend a manual light/dark toggle pass before shipping.
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
