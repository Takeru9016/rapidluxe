# RapidLuxe 2.0 — Deferred Post-Release Backlog

> Source: Final Post-Release-Readiness Audit (verdict: **RELEASE READY WITH DEFERRED P2/P3**, 0 P0, 0 P1). This list contains only items confirmed by that audit — not a general wishlist.

## P2

- **Item:** Static hardcoded `images.unsplash.com` hero/OG constants (`destinations`, `corporate`, `deals`, `TherapycationIntro`, plus OG-image fallbacks on several public pages).
  **Reason:** Content/architecture debt, not an engineering defect — all currently resolve (200), no user-facing failure. No CMS field exists yet for these static banners; `next.config.ts`'s `images.unsplash.com` `remotePatterns` entry remains required while they're live.
  **Dependency:** Real RapidLuxe-owned photography/licensing decision; a product decision on whether these become CMS-editable.
  **Suggested future scope:** Source/license real imagery, then either hardcode the new URLs or add a small CMS field — a product/content decision, not a code-first one.

- **Item:** Mapbox vector-tile 403 on destination-detail map (`/destinations/[slug]`).
  **Reason:** Root-caused to a token-scope (`tilesets:read`) or URL-restriction issue per Mapbox's own documentation — not proven to be an application code defect.
  **Dependency:** Mapbox account dashboard access (not available in this environment).
  **Suggested future scope:** Whoever holds Mapbox dashboard access checks the production token's scopes/URL restrictions and reissues/adjusts as needed.

## P3

- **Item:** `dangerouslySetInnerHTML` for JSON-LD structured data (`src/app/(public)/packages/[slug]/page.tsx`).
  **Reason:** Standard `JSON.stringify`-based structured-data pattern, not user-input-driven; only a theoretical low-severity concern if admin-entered package copy contained script-breaking sequences.
  **Suggested future scope:** Optional extra escaping hardening if ever revisited; not urgent.

- **Item:** Repo-wide Biome findings (214 errors / 44 warnings at last full-repo check — mostly `noArrayIndexKey`, `useImportType`, `useTemplate`, a11y button-type rules).
  **Reason:** Pre-existing style/hygiene debt across the codebase, confirmed not to be new regressions introduced by any 2.0 release-hardening commit.
  **Suggested future scope:** A dedicated repo-wide Biome cleanup pass, unrelated to any specific feature.

- **Item:** Intentional Sanity/Unsplash fallback pattern (`about/page.tsx`, `lib/blog.ts`, `BlogPreview.tsx`) — Unsplash used only as a documented fallback when Sanity content is missing.
  **Reason:** Already correctly architected (Sanity-first, Unsplash-fallback); the only residual concern is long-term third-party hotlink dependency, not a defect.
  **Suggested future scope:** Low priority; revisit only if Sanity content coverage becomes complete enough to remove the fallback entirely.

- **Item:** Lighthouse Performance/bundle-analyzer/cross-device QA checklist (`docs/PHASES.md` Phase 3C) — not run to completion against the stated ≥90/cross-device criteria this cycle.
  **Reason:** Out of scope for the commercial/booking-flow QA that Stage 6 and the post-Stage-6 hardening batches targeted; the destination-detail CLS defect was fixed and measured directly, but a full Lighthouse Performance pass, `@next/bundle-analyzer` elimination pass, and the full device matrix (iPhone SE/15, iPad, MacBook, 27") were not performed.
  **Suggested future scope:** A dedicated performance/cross-device QA pass if/when prioritized; not a release blocker per the final audit.
