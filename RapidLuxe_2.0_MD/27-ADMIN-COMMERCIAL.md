# RapidLuxe 2.0 — Admin Commercial

**Priority:** P0

## Requirements

- Deals: create/edit/archive, validity and Journey linkage.
- Coupons: code, discount, minimum amount, usage limit, expiry and active state.
- Server-side pricing validation.
- Explicit coupon consumption semantics.
- Editable site settings where intentionally exposed.

## Review

**P0 FOR COUPONS.** Current behavior increments usage at enquiry creation. Decide whether the business intends consumption at enquiry or successful payment and implement consistently.
