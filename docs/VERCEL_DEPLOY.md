# Deploy Vacation Vibes to Vercel

This guide walks you through building and deploying the Vacation Vibes Next.js app to Vercel.

---

## 1. Prerequisites

- **Git**: Code pushed to GitHub (e.g. `github.com/Seedrixxx/Vacation-Vibes`)
- **Vercel account**: [vercel.com](https://vercel.com) (sign in with GitHub)
- **Database**: PostgreSQL (e.g. Vercel Postgres, Neon, Supabase, or any Postgres host)

---

## 2. Build command (already configured)

The project uses the standard Next.js build:

- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install` (default)

No `vercel.json` is required unless you need custom settings.

---

## 3. Deploy from Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new).
2. **Import** your GitHub repo: `Seedrixxx/Vacation-Vibes`.
3. **Framework Preset:** Vercel should detect **Next.js** automatically.
4. **Root Directory:** Leave as `.` (repo root).
5. **Branch:** Use `main` (or the branch you want to deploy).

### Environment variables

In the same import screen (or later in **Project → Settings → Environment Variables**), add the variables your app needs. Match the names from `.env.example`:

| Variable | Description | Required for deploy |
|----------|-------------|----------------------|
| `DATABASE_URL` | PostgreSQL connection string | **Yes** (if using DB) |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | **Yes** (if using auth) |
| `NEXTAUTH_URL` | Full app URL, e.g. `https://your-app.vercel.app` | **Yes** (production) |
| `NEXT_PUBLIC_APP_URL` | Same as `NEXTAUTH_URL` for links/SEO | Recommended |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | If using image uploads |
| `CLOUDINARY_API_KEY` | Cloudinary API key | If using image uploads |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | If using image uploads |
| `STRIPE_SECRET_KEY` | Stripe secret key | If using payments |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | If using Stripe webhooks |
| `SENTRY_DSN` | Sentry DSN (optional) | For error tracking |

**Important:** Do **not** commit `.env`. Set all values in Vercel’s **Environment Variables** for Production (and Preview if you want).

6. Click **Deploy**. Vercel will run `npm install` and `npm run build`.

---

## 4. Run build locally before pushing

To avoid failed deployments, run the same build Vercel runs:

```bash
npm install
npm run build
```

If this succeeds, the Vercel build should succeed. Fix any TypeScript or ESLint errors shown locally.

---

## 5. After first deploy

1. **Database:** Ensure your production DB is created and migrated:
   - Either run migrations from your machine with `DATABASE_URL` pointing at production, or use your DB provider’s migration/run tool.
   - Example (from repo root):  
     `npx prisma migrate deploy`  
     (with `DATABASE_URL` set to the production URL in your shell or in Vercel).

2. **NEXTAUTH_URL / NEXT_PUBLIC_APP_URL:** Set these to your Vercel URL, e.g. `https://vacation-vibes-xxx.vercel.app`, and redeploy if you added them after the first deploy.

3. **Stripe webhooks (if used):** In Stripe Dashboard, add an endpoint for `https://your-app.vercel.app/api/webhooks/stripe` and set `STRIPE_WEBHOOK_SECRET` in Vercel.

---

## 6. Redeploying

- **Automatic:** Every push to the connected branch (e.g. `main`) triggers a new deployment.
- **Manual:** In Vercel Dashboard → **Deployments** → **⋯** on a deployment → **Redeploy**.

---

## 7. Optional: Vercel CLI

To deploy from your machine:

```bash
npm i -g vercel
vercel login
vercel
```

Follow prompts (link to existing project or create new one). For production:

```bash
vercel --prod
```

---

## 8. Troubleshooting

| Issue | What to do |
|-------|------------|
| Build fails: TypeScript/ESLint | Run `npm run build` locally and fix reported errors. |
| Build fails: Prisma | Ensure `DATABASE_URL` is set in Vercel and that `prisma generate` runs (it’s part of `postinstall` if configured in `package.json`). |
| “Module not found” | Ensure all dependencies are in `dependencies` (not only `devDependencies`) if they’re needed at build or runtime. |
| 500 / DB errors in production | Check `DATABASE_URL`, run migrations, and confirm the DB is reachable from Vercel’s network. |
| Images (e.g. Unsplash) broken | `next.config.mjs` already allows `images.unsplash.com` and `res.cloudinary.com`. Restart dev/build after config changes. |

---

## Summary

1. Push code to GitHub.
2. In Vercel: Import repo → set **Environment Variables** (especially `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL`).
3. Deploy; Vercel runs `npm run build`.
4. Run DB migrations for production and set `NEXTAUTH_URL` / `NEXT_PUBLIC_APP_URL` to the live URL.
5. Redeploy on every push to the linked branch, or run `vercel --prod` from the CLI.
