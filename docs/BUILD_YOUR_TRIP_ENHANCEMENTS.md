# Build Your Trip — Enhancement Summary

This document summarizes the enhancements made to the Build Your Trip flow (`/build-your-trip` and `/build-your-trip/result`) and any migration or config requirements.

---

## 1. Wizard UX and Input Model

**Files:** `components/trip-designer/TripDesignerWizard.tsx`

- **URL prefill:** `package` and `destination` query params are now read and sent to the backend in `inputsJson` as `package_slug` and `destination`, so template matching and blueprint can use them.
- **Template matching:** `inputsJson` now includes `style` and `interest` set from `travel_type` (e.g. `cultural`, `beach`), so backend template selection can match itinerary templates by tag.
- **Review before submit:** Step 5 (Contact & Submit) shows a short “Your selections” summary (travel type, duration, budget, interests) so users can confirm before submitting.
- **Handoff:** The wizard no longer sends a fixed `handoffMode`; the backend sets CHECKOUT or AGENT from pricing.

---

## 2. Template Matching / Scoring

**Files:** `lib/trip-builder/generator.ts`

- **Scoring:** New `scoreTemplateMatch()` scores templates by tag overlap with `style`/`interest`/`travel_type` and optional `interest_slugs`; used to break ties when multiple templates match.
- **Flexible duration:** If no template matches exact `durationNights`/`durationDays`, the code now looks for templates within ±1 night/day and picks the closest by duration distance.
- **Selection order:** Exact duration match first; then flexible duration; then best score by tag overlap.

---

## 3. Grounded Explanation Layer with Fallback

**Files:** `lib/services/trip-order.service.ts`

- **At order creation (BUILD_TRIP):** After generating itinerary and pricing, the service calls `buildBlueprint()` (trip-designer) with the same inputs to get a grounded `summary_paragraph` and optional `suggested_package_slug` / `suggested_package_title`.
- **Storage:** These are stored in `itineraryJson.meta`: `summaryParagraph`, `suggestedPackageSlug`, `suggestedPackageTitle`. No new DB columns.
- **Fallback:** If `buildBlueprint` or package/experience fetch fails, a simple summary is built from itinerary days and duration (e.g. “Your 7-day trip includes A → B → C…”).
- **Data:** Blueprint uses `getPackages()` and `getExperiences()` from `lib/data/public` (Prisma packages, Supabase experiences when configured).

---

## 4. Result Page — Conversion-Focused Layout

**Files:** `components/trip-designer/TripBlueprintResult.tsx`

- **Types:** `TripOrderResult.itineraryJson` now includes optional `meta` with `summaryParagraph`, `suggestedPackageSlug`, `suggestedPackageTitle`.
- **Layout:**
  1. **Title:** “Your Trip Blueprint” and invoice.
  2. **Next step (CTA):** Prominent block with copy that depends on `handoffMode` (pay vs. quote). Buttons: Pay deposit, Pay in full (when CHECKOUT and total > 0), WhatsApp us, Track your trip.
  3. **Grounded summary:** If `meta.summaryParagraph` exists, it is shown in a card.
  4. **Suggested package:** If `meta.suggestedPackageSlug` exists, a card with title and “View package” linking to `/packages/[slug]`.
  5. **Your itinerary:** Day-by-day list (unchanged).
  6. **Pricing:** Line items and total (unchanged).
  7. **Start over** link at bottom.
- **Duplicate CTA:** The extra CTA block that was below itinerary/pricing was removed; all primary actions are in the top “Next step” block.

---

## 5. Checkout / Agent Compatibility

- **BUILD_TRIP orders:** Backend sets `handoffMode` to CHECKOUT when pricing is PRICED and total > 0, otherwise AGENT. Result page shows Pay deposit / Pay in full only when `handoffMode === "CHECKOUT"` and `total > 0`.
- **Checkout API:** POST `/api/checkout` with `{ invoiceNumber, mode: "deposit" | "full" }` is unchanged; result page uses it correctly for BUILD_TRIP orders.
- **Track:** “Track your trip” uses `trackingToken` from the order when available.
- **Fallback (no invoice):** When the result page is opened without an invoice (e.g. old link), the fallback view still shows “Pay deposit” linking to GET `/api/checkout?package=...` for guest deposit by package slug; that flow is separate and unchanged.

---

## 6. Migration and Config

- **Database:** No schema or migrations. All new data lives in existing `itineraryJson` (JSON) as `meta`.
- **Env:** No new environment variables. Existing Prisma, Supabase (for experiences), and Stripe config are sufficient.
- **Backward compatibility:** Orders created before this change have no `itineraryJson.meta`. The result page treats missing `meta` safely: no summary paragraph, no suggested package card; CTA and itinerary/pricing still work.

---

## File Change List

| File | Change |
|------|--------|
| `components/trip-designer/TripDesignerWizard.tsx` | URL params `package`/`destination`, `inputsJson` extended with `style`, `interest`, `package_slug`, `destination`; review summary on step 5; removed fixed `handoffMode`. |
| `lib/trip-builder/generator.ts` | `scoreTemplateMatch()`, flexible duration fallback, template selection by score. |
| `lib/services/trip-order.service.ts` | BUILD_TRIP: call `buildBlueprint`, set `itineraryWithMeta`, store in `itineraryJson`. |
| `components/trip-designer/TripBlueprintResult.tsx` | `ResultMeta` type, read `meta` from order; conversion-first layout; suggested package card; single CTA block. |
| `docs/BUILD_YOUR_TRIP_ENHANCEMENTS.md` | This summary. |
