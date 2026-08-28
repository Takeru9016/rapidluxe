# RapidLuxe 2.0 — Master Information Architecture

**Priority:** P0

## Purpose

Define the complete product model and navigation before page-by-page implementation.

## Core product model

- RapidLuxe is a luxury travel platform built around the **Therapycation** philosophy.
- Therapycation is the brand/experience layer.
- **Journey** is the customer-facing term for a bookable travel offering.
- **Package** remains the internal transactional/database entity.
- Primary journey: Discover → Explore → Request → Quote → Payment → Confirmation → Travel.

## Primary navigation

- Journeys
- Destinations
- Deals
- Therapycation / About
- Journal
- Corporate
- Contact
- Account

## Conversion model

- Primary CTA: **Request This Journey**, not Buy Now.
- Booking lifecycle: ENQUIRY → QUOTE_SENT → AWAITING_PAYMENT → PAID → CONFIRMED.
- Wishlist and account remain secondary to discovery and enquiry conversion.

## Review

**KEEP as the governing document.** The existing repository has a mature Package/Booking model and enquiry-to-payment workflow. 2.0 should align terminology and UX with that architecture rather than replacing it.
