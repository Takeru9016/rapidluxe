# RapidLuxe 2.0 — Authentication

**Priority:** P1

## Requirements

- Native-feeling sign-in/sign-up.
- Clear redirect back to intended protected destination.
- Account value explained without clutter.
- One authoritative admin authorization model.

## Review

**KEEP CLERK.** Existing middleware protects user and admin routes. Standardize Clerk metadata versus database role so they cannot silently diverge.
