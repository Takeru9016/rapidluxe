# RapidLuxe 2.0 — Documentation Index & Review

This pack is a **new canonical 2.0 documentation set reconstructed from the current repository architecture and the prior review discussion**. It is not a byte-for-byte recovery of older chat attachments.

## Verified repository documentation

The current GitHub repository visibly contains `CLAUDE.md`, `README.md`, and `docs/PHASES.md`. The repository tree does not currently contain a separate folder of page-by-page RapidLuxe 2.0 `.md` specifications.

## Recommended source of truth

1. `00-MASTER-IA.md`
2. `01-GLOBAL-SHELL.md`
3. `29-2.0-IMPLEMENTATION-ORDER.md`
4. P0 correctness specifications
5. Remaining page specifications

## Critical findings

- Keep **Package** as the internal/domain entity; use **Journey** as customer-facing terminology.
- Harden booking persistence before a major redesign: traveler data is currently saved separately from booking creation.
- Server-side pricing must remain authoritative.
- Decide whether coupon usage is consumed at enquiry or successful payment.
- Standardize authorization so Clerk role metadata and database role cannot silently diverge.
- The project state documentation is behind the implementation and should be synchronized.
- Therapycation should be the brand/experience layer, not an unnecessary new core database entity.

## First implementation target

`00-MASTER-IA.md` → `01-GLOBAL-SHELL.md` → P0 correctness audit → `02-HOME.md` → `03-JOURNEYS-LISTING.md` → `04-JOURNEY-DETAIL.md`.
