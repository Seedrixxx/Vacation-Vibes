# Vacation Vibes – Setup Instructions

## 1. Database (PostgreSQL + Prisma)

The app uses PostgreSQL via Prisma (`lib/prisma.ts`, `prisma/schema.prisma`). The connection string comes from `DATABASE_URL`.

### Option A: Local PostgreSQL

1. Install and run PostgreSQL (e.g. [Postgres.app](https://postgresapp.com/), [Homebrew](https://formulae.brew.sh/formula/postgresql), or [Docker](https://hub.docker.com/_/postgres)).
2. Create a database:

   ```bash
   createdb vacation_vibes
   ```

3. In `.env`:

   ```
   DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/vacation_vibes
   ```

   Replace `USER` and `PASSWORD` with your Postgres user.

### Option B: Hosted PostgreSQL (Supabase, Neon, Railway, etc.)

1. Create a project and get the connection string (often under “Connection string” or “Database URL”).
2. Use the **direct** (non-pooler) URL for migrations. Example format:

   ```
   DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require
   ```

### Apply schema and generate client

From the project root:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

- **`prisma generate`** – generates the Prisma client (required before `npm run build` and before running the app).
- **`prisma migrate dev`** – creates the DB tables from `prisma/schema.prisma`. Run this once when setting up; for Netlify/production you only need the build to run `prisma generate` (migrations are usually run separately or via CI).

If the DB is empty and you prefer to push the schema without migration history:

```bash
npx prisma db push
```

---

## 2. Environment variables

Copy `.env.example` to `.env` and fill in values.

| Variable | Purpose | Required for |
|----------|---------|--------------|
| **Database** | | |
| `DATABASE_URL` | PostgreSQL connection string for Prisma | App + build (Netlify needs this to build) |
| **Admin auth (NextAuth)** | | |
| `NEXTAUTH_SECRET` | Secret for JWT/session (min 32 chars) | Admin login |
| `NEXTAUTH_URL` | App URL (e.g. `http://localhost:3000` or `https://yoursite.com`) | Admin login |
| `ADMIN_EMAIL` | Admin login email | Admin login |
| `ADMIN_PASSWORD` | Admin login password | Admin login |
| **Cloudinary** | | |
| `CLOUDINARY_CLOUD_NAME` | Cloud name | Admin image uploads (packages, etc.) |
| `CLOUDINARY_API_KEY` | API key | Same |
| `CLOUDINARY_API_SECRET` | API secret | Same |
| **Supabase** | | |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Legacy/Supabase features |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key | Same |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key | Same |
| **Stripe** | | |
| `STRIPE_SECRET_KEY` | Stripe secret key (e.g. `sk_test_...`) | Checkout + webhooks |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret (e.g. `whsec_...`) | Stripe webhooks |
| **Email (Resend)** | | |
| `RESEND_API_KEY` | Resend API key | Inquiry/deposit emails |
| `RESEND_FROM_EMAIL` | Sender (e.g. `Vacation Vibez <onboarding@resend.dev>`) | Emails |
| **Other** | | |
| `DEFAULT_DEPOSIT_AMOUNT` | Default deposit amount (e.g. `500`) | Payments |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number (e.g. `94771234567`) | WhatsApp CTA |
| `NEXT_PUBLIC_GA4_ID` | Google Analytics 4 ID | Analytics (optional) |

Admin login is **credentials-only** (see `lib/auth.ts`): it checks `ADMIN_EMAIL` and `ADMIN_PASSWORD`; no Supabase Auth is used for admin.

---

## 3. Supabase (optional / legacy)

The README and `db/migrations/` refer to Supabase SQL migrations and Auth. The **current admin auth** is NextAuth with `ADMIN_EMAIL` / `ADMIN_PASSWORD`. If you still use Supabase for storage or other features:

1. Create a Supabase project.
2. Run the SQL files in order: `001_initial_schema.sql`, `002_rls_policies.sql`, `003_storage_bucket.sql`, then `seed.sql` if you use it.
3. Set the Supabase env vars above in `.env`.

---

## 4. Stripe

1. Create a Stripe account and get the **Secret key** and, for webhooks, the **Webhook signing secret**.
2. **Local webhook testing:**

   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

   Use the signing secret it prints as `STRIPE_WEBHOOK_SECRET`.

3. In production, add a webhook endpoint `https://yourdomain.com/api/webhooks/stripe` and set `STRIPE_WEBHOOK_SECRET` to that endpoint’s secret.

---

## 5. Run locally

```bash
npm install
cp .env.example .env
# Edit .env with DATABASE_URL, NEXTAUTH_*, ADMIN_EMAIL, ADMIN_PASSWORD, etc.
npx prisma generate
npx prisma migrate dev --name init   # or npx prisma db push
npm run dev
```

- **App:** http://localhost:3000  
- **Admin:** http://localhost:3000/admin/login (use `ADMIN_EMAIL` / `ADMIN_PASSWORD`).

### Trip Builder seed (optional)

To make **Build Your Trip** work for Sri Lanka inbound with pre-filled options and itinerary templates:

- **From Admin:** Go to **Trip Builder** and click **Seed Sri Lanka Defaults**. This creates/updates TripBuilderOption records (cities, durations, activities, hotel class, transport, meal plan) and three ItineraryTemplates (6N/7D, 9N/10D, 13N/14D). Safe to run multiple times (idempotent).
- **From CLI:** `npx prisma db seed` (runs the same logic). Requires `tsx` (e.g. `npm i -D tsx`).
