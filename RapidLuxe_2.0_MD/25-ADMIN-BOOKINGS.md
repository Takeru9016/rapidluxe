# RapidLuxe 2.0 — Admin Bookings

**Priority:** P0

## Requirements

- Search/filter by status, reference, customer and dates.
- Booking detail with customer, Journey, travelers, requirements and pricing.
- Actions: Send Quote, Send Payment Link, Confirm, Cancel.
- Explicit valid state transitions.
- Prevent invalid repeated actions.
- Audit/timestamp important transitions where available.

## Review

**P0 BUSINESS CRITICAL.** Backend endpoints already exist for quote, payment link, confirm and cancel. 2.0 should make state transitions explicit and safe.
