# CLAUDE.md — RapidLuxe

## Current Build State

```
Phase:          1C — Homepage
Active Task:    1C-10
Last Completed: 1C-Homepage "Phase 1C - Homepage Completed"
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
