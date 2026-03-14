# Build Your Trip — Feature Overview & Technical Guide

A comprehensive guide to the **Build Your Trip** feature in the Vacation Vibes web app: a 6-step, hybrid trip-conversion system that supports **Sri Lanka** and **Beyond Sri Lanka**, smart package matching, package customization requests, and full custom itinerary generation.

---

## Table of Contents

1. [Overview](#overview)
2. [User Journeys & Conversion Paths](#user-journeys--conversion-paths)
3. [Features](#features)
4. [6-Step Wizard Flow](#6-step-wizard-flow)
5. [Smart Package Match](#smart-package-match)
6. [APIs & Endpoints](#apis--endpoints)
7. [Data Model & Schema](#data-model--schema)
8. [Key Files & Architecture](#key-files--architecture)
9. [URL Prefill & Query Params](#url-prefill--query-params)
10. [Fallbacks & Edge Cases](#fallbacks--edge-cases)
11. [Recommended Next Steps](#recommended-next-steps)

---

## Overview

**Build Your Trip** is the main trip-planning and conversion funnel on the Vacation Vibes site. It is no longer a static Sri Lanka–only trip builder; it has been upgraded into a **hybrid conversion engine** that:

- Collects destination, duration, party composition, experiences, style, budget, and contact details in a **6-step wizard**.
- **Compares** the user’s choices against existing travel packages and surfaces **best-fit packages** with a match percentage.
- Offers **three clear paths**: book a matched package directly, request customization of a matched package, or continue building a **fully custom trip** and receive a Trip Blueprint (itinerary + pricing + next steps).

The system preserves the existing custom itinerary and pricing pipeline while adding intelligent package recommendations and a structured customization-request flow. It is built to scale to more countries and admin-driven options later.

---

## User Journeys & Conversion Paths

### Path A — Book a matched package directly

1. User completes the wizard (or enough steps for matching).
2. On the final step (Contact + Summary), the system shows a match card if a package scores **≥ 65%** (e.g. “We found a trip that matches 82% of your preferences”).
3. User clicks **“View itinerary”**.
4. User is taken to the **package detail page** (`/packages/[slug]`) where they can view the itinerary and proceed to **booking, payment, or deposit** via the existing package flow.

**Outcome:** Direct package conversion; no custom blueprint is created.

---

### Path B — Customize a matched package

1. User sees the same match card on the final step.
2. User clicks **“Customize this package”**.
3. A **customization form** is shown: selected package name, match %, and fields for:
   - **What would you like to change?** (required text)
   - Optional: hotel upgrade/downgrade, senior-friendly pacing, budget change.
   - Contact: full name, email, WhatsApp.
4. User submits the form.
5. A **Package Customization Request** is saved via `POST /api/package-customization-requests` (package ref, builder summary, requested changes, contact).
6. User sees a confirmation; the request is available for **agent review**, admin queue, WhatsApp handoff, or CRM follow-up.

**Outcome:** Structured lead (package customization request); no custom blueprint is created unless the user later chooses “Continue building my own trip”.

---

### Path C — Build a fully custom trip

1. User either ignores the match card or explicitly continues with the main CTA.
2. User fills in the final step (contact + summary) and clicks **“Get my Trip Blueprint”**.
3. The wizard submits to **`POST /api/trip-orders`** with `source: "BUILD_TRIP"` and full payload (country, tripType, duration, party, experiences, style, budget, contact, `inputsJson`).
4. Backend:
   - Selects an **itinerary template** (by tripType, country, duration).
   - Generates **itinerary** and **pricing** (Trip Builder options).
   - Builds a **blueprint** (summary, suggested package, highlights).
   - Creates a **TripOrder** with `itineraryJson`, `pricingJson`, `inputsJson`.
5. User is redirected to **`/build-your-trip/result?invoice=...`**.
6. Result page shows: invoice, trip details (country, party), next-step CTAs (pay deposit / pay in full / WhatsApp / track), overview, route, day-by-day itinerary, pricing, and suggested package link.

**Outcome:** Full custom trip request with blueprint; user can pay, track, or contact via WhatsApp.

---

## Features

| Feature | Description |
|--------|-------------|
| **6-step wizard** | Country → Duration → Party → Experiences → Style & budget → Contact & summary. Progress bar and step navigation (Back/Next). |
| **Country / region** | Step 1: “Where do you want to go?” — Sri Lanka \| Beyond Sri Lanka. Drives `tripType` (INBOUND \| OUTBOUND). Extensible for more destinations. |
| **Duration** | Step 2: 5, 7, 10, or 14 days. Aligns with itinerary template matching. |
| **Party composition** | Step 3: Adults (min 1), travelling with children (yes/no + count), 55+ travellers (yes/no + optional count). Used for pricing and suitability matching. |
| **Experience focus** | Step 4: Multi-select from Cultural, Beach, Adventure, Wildlife, Wellness, Nature, Food, Luxury, Family-friendly, Relaxation. Stored as `interest_slugs` / `interest`. |
| **Travel style & budget** | Step 5: Single-select style (e.g. Cultural & Heritage, Beach Escape, Adventure, Luxury, Family, Relaxed, Wellness) and budget (Mid-range \| Luxury). |
| **Contact & summary** | Step 6: Full name, email, WhatsApp, optional message; full summary of all selections; primary CTA “Get my Trip Blueprint”. |
| **Smart package match** | After step 6 loads, the app calls `POST /api/trip-package-match` with current inputs. Results are ranked by a weighted score (country, duration, experience, style, budget, party). Only matches ≥ 65% are shown. |
| **Match card UX** | On step 6: “We found a trip that matches X% of your preferences” with package name, duration, price-from, short reasons, and three actions: View itinerary, Customize this package, or continue below to build own trip. |
| **Package customization request** | Dedicated form and API to save package ref, match score, builder state, requested changes, and contact. Stored in `PackageCustomizationRequest` for agents/admins. |
| **Custom trip pipeline** | Unchanged: template selection, itinerary generation, pricing engine, blueprint, TripOrder creation, result page with invoice, itinerary, pricing, and CTAs. |
| **Result page enhancements** | Optional “Trip details” section (country, adults, children) when returned by the trip-order API. Invoice, payment, track, and suggested package behaviour unchanged. |
| **URL prefill** | Supports `country`, `package`, `destination`, `experience`, `travel_type`, `duration`, `budget` so deep links and campaigns can prefill the wizard. |

---

## 6-Step Wizard Flow

| Step | Question / focus | Key state | Notes |
|------|-------------------|-----------|--------|
| **1** | Where do you want to go? | `country`, `tripType` (derived) | Sri Lanka → INBOUND; Beyond Sri Lanka → OUTBOUND. |
| **2** | How long is your trip? | `duration`, `durationDays`, `durationNights` | 5, 7, 10, 14 days. |
| **3** | Who’s travelling? | `paxAdults`, `hasChildren`, `paxChildren`, `hasSeniors`, `paxSeniors` | Min 1 adult; children/seniors optional. |
| **4** | What sort of experiences do you want? | `selectedExperiences` → `interest_slugs` | Multi-select; maps to package tags. |
| **5** | Travel style & budget | `travelStyle`, `budgetTier` | Single-select each; feed `travel_type`, `style`, `budget_tier`. |
| **6** | Contact + summary | `fullName`, `email`, `whatsapp`, `message` | Summary lists all selections; match card shown when matches exist. |

Submit payload (Path C) includes top-level `source`, `tripType`, `country`, `durationDays`, `durationNights`, `paxAdults`, `paxChildren`, customer fields, and `inputsJson` with all wizard and prefill fields for backend and analytics.

---

## Smart Package Match

### When matching runs

- **Final-step only** (current implementation): when the user reaches **step 6**, the client sends current builder state to `POST /api/trip-package-match`. No blocking; step 6 is usable while the request is in flight.

### Scoring model (100% total)

| Criterion | Weight | Rules (summary) |
|-----------|--------|------------------|
| Country / destination | 25% | Exact country + tripType match; partial for tripType only. |
| Duration | 20% | Exact duration full points; ±1 day partial; ±2 lower; else 0. |
| Experience overlap | 20% | Proportional to overlap between user’s experience slugs and package `tags` (with synonym mapping). |
| Travel style | 15% | Style and synonyms matched against package `tags`. |
| Budget | 10% | Exact budget tier match. |
| Party suitability | 10% | Family-friendly / senior-friendly from package tags; children/seniors flags from user. |

### Thresholds

- **≥ 80%:** Strong match → emphasize “View itinerary” (and “Customize this package”).
- **65–79%:** Moderate match → emphasize “Customize this package”.
- **&lt; 65%:** Not shown in the match card (optional: could show in a subdued way later).

### Match result shape

Each match includes: `packageId`, `packageSlug`, `packageName`, `matchScore`, `matchReasons[]`, `missingCriteria[]`, `recommendedAction` (`VIEW_OR_CUSTOMIZE` \| `CUSTOMIZE`), and optional `priceFrom`, `durationDays`, `country`. Package metadata comes from existing `PublicPackage` (including `tags` and `budget_tier`) so no fake UI; scoring is real.

---

## APIs & Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| **POST** | `/api/trip-orders` | Create trip order. For Build Your Trip: `source: "BUILD_TRIP"`, plus country, tripType, duration, pax, customer, `inputsJson`. Returns `invoiceNumber`, `tripOrderId`, `trackingToken`, `itineraryJson`, `pricingJson`, `handoffMode`. |
| **GET** | `/api/trip-orders/[invoice]` | Fetch order by invoice (public-safe). Used by result page. Returns invoice, itineraryJson, pricingJson, handoffMode, trackingToken, and optionally country, paxAdults, paxChildren. |
| **POST** | `/api/trip-package-match` | Accepts builder inputs (country, tripType, durationDays, experiences, travelStyle, budgetTier, party). Returns `{ matches: PackageMatchResult[] }` (min score 65%, max 5 results). |
| **POST** | `/api/package-customization-requests` | Saves a package customization request: packageId, packageSlug, packageName, matchScore, builderInputsJson, requestedChangesJson, customer fields, message, source. Returns `{ id, success }`. Rate-limited. |

All of these are used by the Build Your Trip wizard or result page; no changes to generic checkout or track APIs are required for this feature.

---

## Data Model & Schema

### TripOrder (existing)

- Used for both **PACKAGE** (direct package booking) and **BUILD_TRIP** (custom trip) orders.
- BUILD_TRIP stores: `source`, `tripType`, `country`, `durationDays`/`durationNights`, `paxAdults`, `paxChildren`, `inputsJson`, `itineraryJson`, `pricingJson`, `handoffMode`, customer fields, amounts, etc.

### PackageCustomizationRequest (new)

- **id**, **packageId**, **packageSlug**, **packageName**, **matchScore** (optional), **builderInputsJson**, **requestedChangesJson** (optional), **customerFullName**, **customerEmail**, **customerWhatsapp**, **message**, **status** (default PENDING), **source** (default BUILD_TRIP), **createdAt**, **updatedAt**.
- Used only for Path B (customize package). Suitable for admin lists, agent workflows, and CRM.

### Package / PublicPackage

- Packages expose `country`, `tripType` (as `travel_type` in DTO), `duration_days`, `duration_nights`, `budget_tier`, `tags[]`, and optional `tags` on `PublicPackage` for match scoring. No new required columns; matching uses existing fields and tags.

### ItineraryTemplate (existing)

- Keyed by `tripType`, `country`, `durationNights`, `durationDays`, `tags`. BUILD_TRIP flow uses these to generate itinerary and pricing; if none match, order is still created with empty/minimal days and AGENT handoff.

---

## Key Files & Architecture

| Area | File(s) | Role |
|------|---------|------|
| **Wizard UI** | `components/trip-designer/TripDesignerWizard.tsx` | 6 steps, state, progress, match card, customization form, submit to trip-orders. |
| **Result page** | `app/(public)/build-your-trip/result/page.tsx`, `components/trip-designer/TripBlueprintResult.tsx` | Load order by invoice, show trip details, itinerary, pricing, CTAs, suggested package. |
| **Build Your Trip page** | `app/(public)/build-your-trip/page.tsx` | Renders wizard with static experiences from `getStaticExperiencesForTripDesigner()`. |
| **Match engine** | `lib/trip-designer/package-match.ts` | `scorePackageAgainstInputs`, `buildMatchReasons`, `rankPackageMatches`; types `TripMatchInputs`, `PackageMatchResult`. |
| **Match API** | `app/api/trip-package-match/route.ts` | POST handler; fetches packages, runs match service, returns matches. |
| **Customization API** | `app/api/package-customization-requests/route.ts` | POST handler; validates and creates `PackageCustomizationRequest`. |
| **Customization validator** | `lib/validators/package-customization-request.ts` | Zod schema for package ref, contact, message, optional requestedChangesJson. |
| **Trip order API** | `app/api/trip-orders/route.ts`, `app/api/trip-orders/[invoice]/route.ts` | Create order (POST); get by invoice (GET). |
| **Trip order service** | `lib/services/trip-order.service.ts` | BUILD_TRIP: buildInputs, selectTemplate, generateItinerary, pricingEngine, buildBlueprint, create TripOrder; returns invoice and result payload. Extends order-by-invoice to include country, paxAdults, paxChildren. |
| **Trip order validator** | `lib/validators/trip-order-create.ts` | Validates create payload; for BUILD_TRIP, refines so country is required and paxAdults ≥ 1, paxChildren ≥ 0. |
| **Generator** | `lib/trip-builder/generator.ts` | `selectTemplate(buildInputs)`, `generateItinerary`, `pricingEngine`. Uses tripType, country, duration, tags. |
| **Blueprint** | `lib/trip-designer/blueprint.ts` | `buildBlueprint(input, packages, experiences)` for summary and suggested package. |
| **Package type / mapping** | `lib/types/package.ts`, `lib/data/map-prisma-package.ts` | `PublicPackage` includes optional `tags`; mapper passes through Prisma `tags` for matching. |

---

## URL Prefill & Query Params

The wizard reads these query parameters to prefill or guide the flow (legacy and new):

| Param | Purpose |
|-------|--------|
| `country` | Step 1: preselect country (e.g. Sri Lanka, Beyond Sri Lanka). |
| `package` | Stored as `package_slug` in payload; can bias blueprint/template. |
| `destination` | Stored as `destination` in payload. |
| `experience` | Step 4: preselect one experience slug (from EXPERIENCE_OPTIONS or legacy experience list). |
| `travel_type` | Step 5: preselect travel style. |
| `duration` | Step 2: preselect duration (e.g. 7). |
| `budget` | Step 5: preselect budget (e.g. mid, luxury). |

All are optional. The flow works with partial or no prefill; step order is fixed (1 → 6).

---

## Fallbacks & Edge Cases

- **No strong package match:** User can always continue to step 6 and submit a custom trip (Path C). Match card is optional and non-blocking.
- **No itinerary template for country/duration:** Backend still creates the TripOrder; itinerary may be empty or minimal; `handoffMode` set to AGENT; result page shows friendly next-step copy and WhatsApp/track.
- **Package metadata incomplete:** Match engine uses available fields (e.g. country, duration, tags, budget_tier); missing data reduces score and can appear in `missingCriteria`; no crash.
- **Validation (BUILD_TRIP):** Country required; paxAdults ≥ 1; paxChildren ≥ 0. Other fields optional or have defaults.

---

## Recommended Next Steps

- **Admin-driven countries:** Replace hardcoded country list with config or DB-driven options.
- **Package metadata:** Enforce or add tags for style/experience; optional family/senior flags for better match quality.
- **Admin UI for customization requests:** List and filter `PackageCustomizationRequest`; status workflow and assignment to agents.
- **Analytics:** Report conversion path (direct package vs customization request vs full custom trip), match rate, and booking by source.
- **CRM / WhatsApp:** Structured handoff for customization requests (e.g. pre-filled message or link to admin).

---

## Summary

**Build Your Trip** is a 6-step, hybrid trip-conversion feature that supports **Sri Lanka** and **Beyond Sri Lanka**, with **smart package matching** (weighted scoring, thresholds, match card on the final step), **package customization requests** (dedicated form and API, stored for agents), and **full custom trip generation** (existing template → itinerary → pricing → blueprint → TripOrder → result page). All three paths—book matched package, customize matched package, or build custom trip—are supported without breaking existing behaviour, and the implementation is documented for future extension (admin countries, richer package metadata, and analytics).
