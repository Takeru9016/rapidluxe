# RapidLuxe 2.0 — Payment

**Priority:** P0

## Requirements

- Booking reference, Journey, quoted amount and due date.
- Public payment-token validation.
- Razorpay payment.
- Server-side signature verification.
- Idempotent payment/webhook handling.
- States: valid, expired, already paid, failed, successful.
- Post-payment confirmation and invoice access where available.

## Review

**P0 TECHNICAL.** Existing token and Razorpay routes provide the foundation. Production readiness requires an audit of expiry, signature verification, idempotency and reconciliation.
