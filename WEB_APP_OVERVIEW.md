# Vacation Vibes — Web App Overview

This document describes the **logic, structure, and features** of the Vacation Vibes web application for use in AI-assisted analysis and further development.

---

## 1. Tech Stack & Repo Structure

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL via **Prisma** (primary for commerce/trip builder) + **Supabase** (optional for CMS-style content: destinations, experiences, packages for home, blog, inquiries)
- **Auth:** NextAuth.js (credentials, admin only)
- **Payments:** Stripe (checkout sessions, webhooks)
- **Email:** Resend
- **AI Chat:** OpenAI (GPT-4o-mini) with context from Prisma + optional Supabase
- **Animations:** Framer Motion, GSAP
- **UI:** Radix primitives, custom components (Button, Container, Card, etc.)

**Key directories:**

- `app/` — Routes and API
  - `app/(public)/` — Public pages (home, tour-packages, build-your-trip, packages/[slug], contact, track, etc.)
  - `app/admin/` — Admin dashboard and login
  - `app/api/` — API routes (trip-orders, checkout, chat, inquiry, track, webhooks, etc.)
- `components/` — React components (home, trip-designer, packages, admin, chat, ui, layout)
- `lib/` — Business logic, data access, validators, trip-builder, trip-designer, chat, auth, email
- `prisma/` — Schema and migrations

---

## 2. Data Sources (Dual: Prisma + Supabase)

The app uses **two data backends**:

### 2.1 Prisma (PostgreSQL)

- **Packages (trip commerce):** `Package`, `PackageDay`, `PackageListItem`, `PackagePricingOption` — used for **Tour Packages** page, **package detail** (`/packages/[slug]`), and **checkout/trip orders**.
- **Trip builder:** `TripBuilderOption`, `ItineraryTemplate` — options (duration, hotel class, transport, etc.) and day-by-day templates for “Build Your Trip”.
- **Orders & payments:** `TripOrder`, `PaymentReceipt`, `InvoiceSequence` — all trip orders (from package or build-your-trip), Stripe payment tracking.
- **Legacy/CMS:** `Tour`, `Destination`, `Testimonial`, `TripRequest` — some legacy or alternate flows; `TripRequest` status is PENDING/CONTACTED/CONFIRMED/CANCELLED.

### 2.2 Supabase (optional)

Used for CMS-style content when configured (see `lib/data/public.ts`, `lib/supabase/*`):

- **Destinations** — focus_inbound, hero, summary (e.g. for home “Beyond Sri Lanka”).
- **Experiences** — name, slug, destination_id, tags, price_from (for home experiences grid and trip designer interests).
- **Packages** — for **home page** “featured packages” and for **trip designer blueprint** scoring (travel_type, duration_days, budget_tier, price_from, route_summary). If Supabase fails or is empty, home falls back to static data in `lib/homeData.ts`.
- **Blog** — blog_posts (if used).
- **Inquiries** — contact form submissions stored in Supabase `inquiries` table; also email via Resend.

**Important:** Tour Packages listing (`/tour-packages`) and package detail/checkout use **Prisma only**. Home page and trip designer blueprint use **Supabase** (with static fallback for home).

---

## 3. Public Routes & Features

### 3.1 Home (`/`)

- **Hero:** Full-viewport hero with video (`HeroVideo`), transparent navbar overlay (no top padding on main for home), scroll-triggered volume, mute/unmute.
- **Sections (in order):** HomeTrustStrip, WhySriLanka, Packages (featured from Supabase or `sriLankaPackages` from homeData), HomeBuildHighlight, ExperiencesGrid, Testimonials, AboutVacationVibes, BeyondSriLanka (destinations), Services, FinalCTA.
- **Data:** `getPackages({ featured: true, limit: 6 })`, `getExperiences()`, `getDestinations()` from `lib/data/public.ts` (Supabase). On error, empty arrays; Packages component falls back to `sriLankaPackages` from `lib/homeData.ts`.

### 3.2 Tour Packages (`/tour-packages`)

- **Tabs:** “Sri Lanka” (INBOUND) / “Beyond Sri Lanka” (OUTBOUND). Query param `?tab=beyond` switches to OUTBOUND.
- **Data:** Prisma `Package` by `tripType` and `isPublished`, with `packagePricingOptions`. Lists link to `/packages/[slug]`.

### 3.3 Package Detail (`/packages/[slug]`)

- **Data:** Prisma `Package` with `packageDays`, `packageListItems`, `packagePricingOptions`. Highlights/inclusions/exclusions from list items.
- **CTA:** “Pay now” or “Get quote” per package `ctaMode`. Checkout can create a TripOrder (source PACKAGE) and redirect to Stripe or hand off to agent.
- **SEO:** JSON-LD (breadcrumb, tour) via `lib/seo/json-ld.ts`.

### 3.4 Build Your Trip (`/build-your-trip`)

- **Flow:** Multi-step wizard (`TripDesignerWizard`): travel type → duration → interests (from Supabase experiences) → budget tier → contact (name, email, WhatsApp, message).
- **State:** All in React state; optional query params: `travel_type`, `duration`, `experience`, `budget`.
- **Submit:** POST `/api/trip-orders` with `source: "BUILD_TRIP"`. Backend:
  - Resolves **ItineraryTemplate** (Prisma) by tripType, country, durationNights/Days; optional tag match (interest/style).
  - **Generates itinerary** from template + optional/interest modules (`lib/trip-builder/generator.ts`).
  - **Pricing:** `pricingEngine()` uses Prisma `TripBuilderOption` (e.g. HOTEL_CLASS, TRANSPORT); if required options missing or zero price → `REQUEST_QUOTE` (handoff AGENT); else PRICED with total/deposit → handoff CHECKOUT or AGENT.
- **Result:** Redirect to `/build-your-trip/result?invoice=VV-...`. Result page fetches order data from GET `/api/trip-orders/{invoice}` (no sessionStorage). Shows summary, “Pay deposit/full” (if CHECKOUT) or “Contact us” / WhatsApp.

### 3.5 Trip Designer Blueprint (API only, used by wizard or future UI)

- **Endpoint:** POST `/api/trip-designer/blueprint`. Body: `travel_type`, `duration_days`, `budget_tier`, `interest_slugs`, optional `package_slug`.
- **Logic:** `lib/trip-designer/blueprint.ts` uses `getPackages()` and `getExperiences()` (Supabase). Scores packages by duration, travel_type, budget_tier, featured (`lib/trip-designer/scoring.ts`), picks best match and builds a blueprint (route outline, highlights, budget range, suggested package). Used for “preview” or suggested package; actual order creation is via trip-orders with BUILD_TRIP.

### 3.6 Contact (`/contact`)

- Form submits to POST `/api/inquiry`. Validates with `inquirySchema`; stores in Supabase `inquiries`; sends confirmation and internal notification via Resend. Rate-limited.

### 3.7 Track Your Trip (`/track`)

- Single input: tracking link or token. GET `/api/track?token={trackingToken}` returns trip status, payment status, itinerary summary, amount paid, receipt link (from Prisma TripOrder + PaymentReceipt). No auth; access by secure token only.

### 3.8 Checkout & Payments

- **Create session:** POST `/api/checkout` with `invoiceNumber` and `mode: "deposit" | "full"`. Looks up TripOrder, creates Stripe Checkout session for that amount, returns `{ url }` to redirect.
- **Webhook:** POST `/api/webhooks/stripe`. On `checkout.session.completed`: creates `PaymentReceipt`, sets TripOrder `paymentStatus` and `tripStatus` to PAID, optionally sends deposit confirmation email.

### 3.9 Other Public Pages

- **Visit Sri Lanka,** **About,** **Services,** **Blog,** **Terms,** **Privacy,** **Destinations (e.g. /destinations/[slug])** — content and data as implemented (Supabase or static where applicable).

---

## 4. Chat Widget (AI)

- **UI:** `ChatWidget` (floating button + conversation panel). Sends user message + conversation history to POST `/api/chat`.
- **API:** Validates body (message, optional conversationHistory). Builds context string via `buildChatContext()` (`lib/chat/build-context.ts`): general FAQs (`general-context`), Prisma itinerary templates + packages with days, optional Supabase destinations/experiences; caps total length. System prompt: travel advisor for Vacation Vibes; answer only from context; suggest “Chat with our live agent” when not answerable.
- **Model:** OpenAI GPT-4o-mini. Returns `{ reply, suggestLiveAgent }`. Requires `OPENAI_API_KEY` in env.

---

## 5. Admin Dashboard

- **Auth:** NextAuth credentials; env `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NEXTAUTH_SECRET`. Session has `role: "admin"`. Protected layout redirects unauthenticated users to `/admin/login`.
- **Layout:** Sidebar (`AdminSidebarWrapper` / `AdminSidebar`) + main content. Sections: Dashboard, Packages, Tours, Destinations, Trip Builder (Templates, Options), Trip Orders, Trip Requests, Testimonials, Blog, Experiences, Inquiries, Payments.
- **CRUD:** Admin can manage Prisma entities: packages (with days, list items, pricing options), itinerary templates, trip builder options, destinations (Prisma), testimonials, blog posts, etc. Trip orders and trip requests are view/update (e.g. status). Stripe webhook updates payment/trip status; admin can view payments/receipts.
- **Uploads:** Image upload APIs (e.g. `/api/upload`, `/api/upload/cloudinary`) for hero images, galleries (Cloudinary when configured).

---

## 6. Layout & UX Details

- **Navbar:** Fixed; on home when not scrolled (“hero mode”) it’s transparent and overlays hero; after scroll or on other pages it gets `bg-white/90 backdrop-blur`. Logo and nav links switch style by hero mode. Main content top padding: on home, **no** top padding (hero full viewport under navbar); on other pages, `pt-16 lg:pt-20` via `MainWithNavbarSpace` (client component using pathname).
- **Footer:** Links, contact, social from `lib/homeData.ts` (footerColumns, footerContact, socialLinks).
- **Chat widget:** Rendered in public layout; can be hidden on certain sections via `data-chat-section` if needed.
- **Scroll progress:** `ScrollProgress` in layout for reading indicator.

---

## 7. Key Libraries & Patterns

- **Validators:** Zod schemas in `lib/validators/*` (trip-order-create, checkout, inquiry, package, testimonial, etc.) for API body validation.
- **Rate limiting:** `lib/rate-limit.ts` used on inquiry and trip-orders to prevent abuse.
- **Invoice numbers:** `lib/trip-builder/invoice.ts` — next number from Prisma `InvoiceSequence` (e.g. VV-YYYYMM-NNNNNN).
- **Activity labels:** `lib/trip-builder/activity-labels.ts` — human-readable labels for module/activity keys used in itinerary and chat context.
- **Email:** `lib/email.ts` — Resend (inquiry received, inquiry notification, deposit confirmation). Uses `RESEND_API_KEY`, `RESEND_FROM_EMAIL`.

---

## 8. Environment Variables (see .env.example)

- **Database:** `DATABASE_URL` (Prisma).
- **Auth:** `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
- **Supabase:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (optional; used for destinations, experiences, packages for home/blueprint, blog, inquiries).
- **Stripe:** `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`.
- **Resend:** `RESEND_API_KEY`, `RESEND_FROM_EMAIL`.
- **OpenAI:** `OPENAI_API_KEY` (chat).
- **Cloudinary:** `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (admin uploads).
- **App/WhatsApp:** `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`.
- **Payments:** `DEFAULT_DEPOSIT_AMOUNT` (used when no package, e.g. GET checkout).
- **Analytics:** `NEXT_PUBLIC_GA4_ID` (optional).

---

## 9. Trip Order Flow Summary

1. **From package:** User on `/packages/[slug]` selects pricing option and submits. Frontend calls POST `/api/trip-orders` with `source: "PACKAGE"`, `packageId`, `pricingOptionId`, customer details, handoffMode (CHECKOUT or AGENT). Backend creates TripOrder with itinerary from package days and pricing from selected option; returns `invoiceNumber`, `tripOrderId`. If CHECKOUT, frontend can call POST `/api/checkout` and redirect to Stripe.
2. **From Build Your Trip:** User completes wizard; frontend calls POST `/api/trip-orders` with `source: "BUILD_TRIP"`, `inputsJson`, customer details. Backend selects template, generates itinerary, runs pricing engine; sets handoffMode to CHECKOUT (if PRICED and total > 0) or AGENT. Returns invoice, itineraryJson, pricingJson, handoffMode, trackingToken. Frontend redirects to result page with `?invoice=...`; result page fetches from GET `/api/trip-orders/{invoice}` and can “Pay deposit/full” via `/api/checkout` or offer WhatsApp/contact.
3. **After payment:** Stripe webhook updates TripOrder (PAID) and creates PaymentReceipt; optional email. User can use Track page with invoice + email to see status and receipt.

---

## 10. File Reference (key files)

| Area | Files |
|------|--------|
| Public layout / nav | `app/(public)/layout.tsx`, `components/home/Navbar.tsx`, `components/layout/MainWithNavbarSpace.tsx` |
| Home | `app/(public)/page.tsx`, `components/home/*`, `lib/homeData.ts`, `lib/data/public.ts` |
| Tour packages | `app/(public)/tour-packages/page.tsx`, `components/tour-packages/TourPackagesSubNav.tsx` |
| Package detail | `app/(public)/packages/[slug]/page.tsx`, `components/packages/PackageDetailClient.tsx` |
| Build your trip | `app/(public)/build-your-trip/page.tsx`, `app/(public)/build-your-trip/result/page.tsx`, `components/trip-designer/TripDesignerWizard.tsx`, `components/trip-designer/TripBlueprintResult.tsx` |
| Trip orders | `app/api/trip-orders/route.ts`, `lib/trip-builder/generator.ts`, `lib/trip-builder/invoice.ts`, `lib/validators/trip-order-create.ts` |
| Trip designer blueprint | `app/api/trip-designer/blueprint/route.ts`, `lib/trip-designer/blueprint.ts`, `lib/trip-designer/scoring.ts` |
| Checkout / Stripe | `app/api/checkout/route.ts`, `app/api/webhooks/stripe/route.ts` |
| Track | `app/(public)/track/page.tsx`, `app/api/track/route.ts` |
| Contact / inquiry | `app/api/inquiry/route.ts`, `components/contact/ContactForm.tsx`, `lib/email.ts` |
| Chat | `app/api/chat/route.ts`, `lib/chat/build-context.ts`, `lib/chat/general-context.ts`, `components/chat/ChatWidget.tsx` |
| Auth / admin | `lib/auth.ts`, `app/api/auth/[...nextauth]/route.ts`, `app/admin/(dashboard)/layout.tsx`, `lib/require-admin.ts` |
| Data / DB | `prisma/schema.prisma`, `lib/prisma.ts`, `lib/data/public.ts` (Supabase), `lib/data/prisma-packages.ts` |
| Config | `lib/config/nav.ts`, `.env.example` |

---

Use this overview to reason about existing behavior, add features, or refactor. For implementation details, refer to the listed files and the Prisma schema.
