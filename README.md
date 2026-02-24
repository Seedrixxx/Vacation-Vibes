# Vacation Vibez — Phase 1 Platform

Production-ready Phase 1: public website, admin CMS, Trip Designer, deposit payments (Stripe), and analytics. Built with Next.js 14 App Router, TypeScript, Tailwind, Framer Motion, GSAP, Supabase, and Stripe.

## Tech stack

- **Framework**: Next.js 14 App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS, tailwindcss-animate
- **UI**: Radix primitives (accordion, etc.), custom components
- **Motion**: Framer Motion, GSAP + ScrollTrigger (client-only)
- **Database & CMS**: Supabase (Postgres + Storage)
- **Auth**: Supabase Auth (admin)
- **Payments**: Stripe Checkout (deposit only) + webhooks
- **Email**: Resend (or swap with nodemailer)
- **Validation**: Zod
- **Rate limiting**: In-memory (optional Upstash)
- **Sanitization**: isomorphic-dompurify
- **SEO**: Metadata, sitemap, robots, JSON-LD (Organization, Breadcrumb, Article, Tour)

## Setup

### 1. Install dependencies

```bash
pnpm install
# or
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_GA4_ID` (optional)
- `RESEND_API_KEY` (optional; inquiry + deposit emails), `RESEND_FROM_EMAIL`, `ADMIN_EMAIL`
- `DEFAULT_DEPOSIT_AMOUNT` (e.g. 500)
- `NEXT_PUBLIC_WHATSAPP_NUMBER` (e.g. 94771234567)
- `NEXT_PUBLIC_APP_URL` (e.g. https://yoursite.com, for sitemap/redirects)

### 3. Supabase

1. Create a Supabase project.
2. In SQL Editor, run in order:
   - `db/migrations/001_initial_schema.sql`
   - `db/migrations/002_rls_policies.sql`
   - `db/migrations/003_storage_bucket.sql` (for admin image uploads)
   - `db/seed.sql`
3. In Authentication → Providers, enable Email.
4. Create an admin user (e.g. your email + password) for admin login.

### 4. Stripe

1. Create a Stripe account and get **Secret key** and **Webhook signing secret**.
2. For local webhook testing: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
3. Use the webhook signing secret from that command in `STRIPE_WEBHOOK_SECRET`.

### 5. Run locally

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 6. Admin

- Go to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- Sign in with the Supabase user you created (admin email/password)
- Dashboard: destinations (CRUD), experiences (list), packages (CRUD + itinerary days), blog (CRUD + markdown), inquiries, payments. Image upload via `POST /api/upload` (Supabase Storage bucket `assets`).

**Dev seed**: After running the seed, you can log in with any user created in Supabase Auth. There is no separate “admin role” in seed; protect admin by only creating one Supabase user for yourself.

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

## Phase 2 (future)

- AI-powered summary in Trip Designer
- Full booking engine
- More admin CRUD (experiences with upload)
