# RapidLuxe 2.0 — Booking / Journey Request Flow

**Priority:** P0

## Steps

### Step 1 — Travel Details

- Journey
- Travellers
- Occasion
- Exact/flexible dates
- Requirements

### Step 2 — Traveller Details

- Lead traveller
- Additional travellers
- Contact details
- PAN only when required

### Step 3 — Review

- Journey summary
- Dates
- Travellers
- Requirements
- Price/GST/discount summary
- Terms

### Step 4 — Request Confirmed

- Booking reference
- Enquiry received state
- What happens next
- Account link

## Backend contract

- Server is authoritative for pricing.
- Traveler persistence must not be lossy.
- Coupon usage semantics must be explicit.
- Submission must be safe to retry/idempotent.
- Lifecycle: ENQUIRY → QUOTE_SENT → AWAITING_PAYMENT → PAID → CONFIRMED.

## Review

**P0 / MUST HARDEN.** Current implementation creates the booking and persists traveler information separately. Make the request submission effectively atomic from the user's perspective.
