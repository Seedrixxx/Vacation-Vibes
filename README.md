# Vacation Vibez — Phase 1 Platform

Production-ready Phase 1: public website, admin CMS, Trip Designer, deposit payments (Stripe), and analytics. Built with Next.js 14 App Router, TypeScript, Tailwind, Framer Motion, GSAP, Supabase, and Stripe.

## Tech stack

- **Framework**: Next.js 14 App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS, tailwindcss-animate
- **UI**: Radix primitives (accordion, etc.), custom components
- **Motion**: Framer Motion, GSAP + ScrollTrigger (client-only)
- **Database & CMS**: Supabase (legacy), Prisma + PostgreSQL (Trip Commerce: packages, trip orders, itinerary templates)
- **Auth**: NextAuth (admin), Supabase Auth (legacy)
- **Payments**: Stripe Checkout (deposit only) + webhooks
- **Email**: Resend (or swap with nodemailer)
- **Validation**: Zod
- **Rate limiting**: In-memory (optional Upstash)
- **Sanitization**: isomorphic-dompurify
- **SEO**: Metadata, sitemap, robots, JSON-LD (Organization, Breadcrumb, Article, Tour)

## Setup

**Full step-by-step instructions:** see **[SETUP.md](./SETUP.md)** (database, env vars, Stripe, Supabase optional, run locally).

### Quick start

```bash
npm install
cp .env.example .env
# Edit .env: DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, ADMIN_EMAIL, ADMIN_PASSWORD, etc.
npx prisma generate
npx prisma migrate dev --name init   # or npx prisma db push
npm run dev
```

- **App:** [http://localhost:3000](http://localhost:3000)
- **Admin:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login) — sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD` (NextAuth credentials; see `lib/auth.ts`).

<details>
<summary>Environment variables (summary)</summary>

Copy `.env.example` to `.env` and fill in:

- `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
- `STRIPE_*`, `CLOUDINARY_*`, optional: Supabase, Resend, GA4, WhatsApp, etc.

See [SETUP.md](./SETUP.md) for the full table.

</details>

### Admin

- **Dashboard**: Tours, Destinations, Testimonials, Trip Requests (Prisma).
- **Packages** (Prisma): CRUD for prebuilt packages (days, list items, pricing options). Images via Cloudinary (`POST /api/upload/cloudinary`).
- **Trip Builder**: Options (wizard choices) and Itinerary Templates. Use **Seed Sri Lanka Defaults** in Admin → Trip Builder to create options (cities, durations, activities, hotel, transport, meal plan) and 6N/7D, 9N/10D, 13N/14D Sri Lanka inbound templates. Re-running is idempotent. Alternatively run `npx prisma db seed` to seed from the CLI.
- **Trip Orders**: List and detail; filter by status; update trip status (PENDING → PAID → PROCESSING → APPROVED).

## Scripts

- `pnpm dev` / `npm run dev` — development server
- `pnpm build` / `npm run build` — production build
- `pnpm start` / `npm start` — start production server
- `pnpm lint` / `npm run lint` — ESLint
- `pnpm typecheck` / `npm run typecheck` — TypeScript check

## Project structure (summary)

```
app/
  (public)/                 # Public site (layout: Nav + Footer + WhatsApp)
    page.tsx                 # Home
    packages/                # Packages index + [slug] detail
    build-your-trip/         # Trip Designer wizard + result
    services, about, contact, blog, blog/[slug], privacy, terms
    destinations/[slug]
  admin/
    login/page.tsx           # Admin login
    (dashboard)/             # Protected admin (layout: header + nav)
      page.tsx               # Dashboard
      destinations/          # CRUD
      experiences, packages, blog, inquiries, payments
  api/
    inquiry/                 # POST inquiry
    checkout/                # GET redirect to Stripe
    trip-designer/blueprint/ # POST Trip Blueprint
    webhooks/stripe/         # Stripe webhook
  layout.tsx, globals.css, sitemap.ts, robots.ts
components/
  home/                      # Home sections
  layout/                    # WhatsAppButton
  packages/                  # PackageGrid, PackageFilters, PackageItinerary
  contact/                   # ContactForm
  trip-designer/             # TripDesignerWizard, TripBlueprintResult
  admin/                     # AdminDestinationForm
  motion/                    # Reveal, Stagger, Parallax, useGsap
  ui/                        # Container, SectionHeading, Button, Card, accordion
lib/
  supabase/                  # client, server, admin, types
  data/public.ts             # getDestinations, getPackages, getBlogPosts, etc.
  validators/inquiry.ts
  rate-limit.ts, sanitize.ts, analytics.ts, utils.ts
  config/nav.ts
db/
  migrations/                # 001_initial_schema.sql, 002_rls_policies.sql
  seed.sql
middleware.ts                # Protects /admin (except /admin/login)
```

## Where to put assets

- **Video**: `public/video/srilanka-hero.mp4` (hero)
- **Images**: `public/images/` — collage, experiences, packages, testimonials, destinations. Use `public/images/placeholder.svg` when no image.

## Hosting

Build is portable (not Vercel-only). Use any Node host (e.g. Vercel, Railway, Render, or a VPS). Set env vars and run `pnpm build` then `pnpm start`. For Stripe webhooks, point your live webhook URL to `https://yourdomain.com/api/webhooks/stripe`.

## Email (Resend)

- **Inquiry**: On contact form submit, customer gets "We received your inquiry" and admin gets "New inquiry" (set `ADMIN_EMAIL`).
- **Deposit**: After Stripe webhook `checkout.session.completed`, customer gets "Deposit received". Requires `RESEND_API_KEY` and optionally `RESEND_FROM_EMAIL`.

## SEO (JSON-LD)

- **Organization**: On every page (root layout).
- **Breadcrumb + Tour**: Package detail page.
- **Breadcrumb + Article**: Blog post page.

## Trip Commerce + CMS

- **Visit Sri Lanka** (`/visit-sri-lanka`): INBOUND packages from Prisma. **Tour Packages** (`/tour-packages`): OUTBOUND packages.
- **Package detail** (`/packages/[slug]`): Prisma Package with itinerary, pricing, Pay deposit/full (→ `/checkout`) or Request quote.
- **Build Your Trip** (`/build-your-trip`): Wizard submits to `POST /api/trip-orders` (source BUILD_TRIP). Result page shows invoice, itinerary, pricing, and Pay/WhatsApp CTAs.
- **Checkout** (`/checkout`): With `packageId` + `pricingOptionId` → form → create TripOrder → redirect to payment. With `invoiceNumber` → Pay deposit/full via `POST /api/checkout` → Stripe. Webhook updates TripOrder (PaymentReceipt, paymentStatus PAID, tripStatus PAID) and sends receipt email.
- **Track your trip** (`/track`): Enter invoice + email; `GET /api/track` returns status, itinerary summary, receipt link if paid.
- **Invoice numbers**: Format `VV-YYYYMM-######` via `InvoiceSequence` and `lib/trip-builder/invoice.ts`.
- **WhatsApp**: `lib/whatsapp.ts` — `getWhatsAppLink(phone?, text?)`, `getTripHandoffMessage(...)` for agent handoff.

## Phase 2 (future)

- AI-powered summary in Trip Designer
- Wire trip-created and status-update emails into order creation and admin actions
- More admin CRUD (experiences with upload)
