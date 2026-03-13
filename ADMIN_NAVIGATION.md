# Admin Sidebar Navigation — Where It’s Defined and Where It’s Used

This document describes the **admin sidebar**: where it’s implemented, each nav item’s route and page, and how it relates to the **public homepage**.

---

## 1. Where the sidebar is defined and used

### 1.1 Component definition

| File | Role |
|------|------|
| **`components/admin/AdminSidebar.tsx`** | Defines the sidebar UI and the list of nav items. Renders the “Vacation Vibes” brand link, the nav links, and the Sign out button. |
| **`components/admin/AdminSidebarWrapper.tsx`** | Wraps `AdminSidebar` and owns the mobile open/close state; renders the mobile menu toggle button. |

The **nav items** are defined in `AdminSidebar.tsx` as the `navItems` array (lines 22–31). Each item has `href`, `label`, and `icon`.

### 1.2 Where the sidebar is rendered (layout)

The sidebar is rendered in the **admin dashboard layout**, so it appears on every page under `/admin` except the login page:

| File | Role |
|------|------|
| **`app/admin/(dashboard)/layout.tsx`** | Wraps all dashboard routes. Renders `AdminSidebarWrapper` (which renders `AdminSidebar`) and the main content area. Protects routes: redirects to `/admin/login` if the user is not an admin. |

**Route group:** The `(dashboard)` segment is a Next.js route group, so it does not appear in the URL. All of these routes are under `/admin/...`.

**Result:** Any page that matches `app/admin/(dashboard)/**/*` shows the sidebar. The **login** page (`app/admin/login/page.tsx`) is **outside** the `(dashboard)` layout, so it does **not** show the sidebar.

---

## 2. Sidebar nav items and corresponding pages

Each sidebar link points to a route; below is the mapping from **label → href → page file(s)** and how that content is used (including on the public homepage where relevant).

| Sidebar label   | href                      | Page file(s) | Purpose |
|-----------------|---------------------------|--------------|--------|
| **Dashboard**   | `/admin`                  | `app/admin/(dashboard)/page.tsx` | Admin home: stats (tours, destinations, testimonials, trip requests), quick links to those sections, and `AdminAnalytics`. **Not** the public homepage. |
| **Packages**    | `/admin/packages`        | `app/admin/(dashboard)/packages/page.tsx` (list)<br>`app/admin/(dashboard)/packages/new/page.tsx`<br>`app/admin/(dashboard)/packages/[id]/page.tsx`<br>`app/admin/(dashboard)/packages/[id]/edit/page.tsx` | CRUD for Prisma `Package` (trip packages). List page has “+ New Package”. These packages drive **Tour Packages** (`/tour-packages`) and **package detail** (`/packages/[slug]`) on the **public** site. |
| **Tours**       | `/admin/tours`            | `app/admin/(dashboard)/tours/page.tsx` (list)<br>`tours/new/page.tsx`, `tours/[id]/edit/page.tsx` | CRUD for Prisma `Tour`. Used in the app for tour-related admin; public usage depends on your features. |
| **Destinations**| `/admin/destinations`    | `app/admin/(dashboard)/destinations/page.tsx` (list)<br>`destinations/new/page.tsx`, `destinations/[id]/page.tsx`, `destinations/[id]/edit/page.tsx` | CRUD for destinations. Data can feed the public **homepage** “Beyond Sri Lanka” (destinations) and related sections via `lib/data/public.ts` (Supabase) or similar. |
| **Testimonials**| `/admin/testimonials`    | `app/admin/(dashboard)/testimonials/page.tsx` (list)<br>`testimonials/new/page.tsx`, `testimonials/[id]/edit/page.tsx` | CRUD for testimonials. Typically shown in a **Testimonials** section on the **public homepage** (`/`). |
| **Trip Requests** | `/admin/trip-requests` | `app/admin/(dashboard)/trip-requests/page.tsx` | List/manage trip requests (e.g. from contact or “Get quote” flows). Not a public page; admin-only. |
| **Trip Builder** | `/admin/trip-builder/options` | `app/admin/(dashboard)/trip-builder/options/page.tsx`<br>Also: `trip-builder/options/new/page.tsx`, `options/[id]/edit/page.tsx`<br>And: `trip-builder/templates/page.tsx`, `templates/new/page.tsx`, `templates/[id]/edit/page.tsx` | Manage Trip Builder options and templates. The **public** “Build Your Trip” flow (`/build-your-trip`) uses this configuration. A sub-layout under `trip-builder/` adds links to “Options” and “Templates”. |
| **Trip Orders** | `/admin/trip-orders`     | `app/admin/(dashboard)/trip-orders/page.tsx` (list)<br>`trip-orders/[id]/page.tsx` (detail) | List and view trip orders (e.g. from package checkout or build-your-trip). Admin-only. |
| **Sign out**    | (button, no href)        | — | Calls NextAuth `signOut({ callbackUrl: "/admin/login" })`. |

---

## 3. Homepage vs admin Dashboard

- **Public homepage** = **`/`**  
  - Implemented under `app/(public)/` (e.g. `app/(public)/page.tsx` or the main home page in your public layout).  
  - Contains hero, featured packages, experiences, testimonials, destinations, etc.  
  - **No** admin sidebar; uses the public layout and navbar.

- **Admin “home”** = **Dashboard** at **`/admin`**  
  - This is the **admin** landing page after login, not the public site.  
  - Sidebar “Dashboard” and the “Vacation Vibes” brand in the sidebar both go to **`/admin`**.

To let admins go from the sidebar back to the **public** homepage, add a link in the sidebar (e.g. in the footer area above “Sign out”) that points to **`/`** with label like “Back to homepage” or “View site”. That link would be implemented in `components/admin/AdminSidebar.tsx` in the same footer `<div>` that contains the Sign out button.

---

## 4. Where sidebar data is used on the public homepage

Content managed via the sidebar often feeds the **public homepage** (`/`):

| Admin section   | Typical use on homepage (`/`) |
|-----------------|--------------------------------|
| **Packages**    | “Featured” or similar packages (from Prisma or Supabase) shown in a packages section. |
| **Destinations**| “Beyond Sri Lanka” or other destination blocks; data from `lib/data/public.ts` (e.g. Supabase). |
| **Testimonials**| Testimonials section on the home page. |
| **Tours**       | If you surface tours on the home page, they come from this admin data. |
| **Trip Builder**| Options and templates power the public **Build Your Trip** flow at `/build-your-trip`. |

So: the **sidebar** is only in the **admin** app; the **homepage** does not render the sidebar. The **homepage** consumes **data** that you edit via those admin sections.

---

## 5. Admin routes without sidebar links

These admin pages exist but do **not** have a link in the main sidebar. They are reached from the Dashboard cards, in-app links, or direct URL:

- **Blog:** `app/admin/(dashboard)/blog/page.tsx`, `blog/new/page.tsx`, `blog/[id]/page.tsx`
- **Payments:** `app/admin/(dashboard)/payments/page.tsx`
- **Experiences:** `app/admin/(dashboard)/experiences/page.tsx`
- **Inquiries:** `app/admin/(dashboard)/inquiries/page.tsx`

To expose any of these in the sidebar, add a new entry to the `navItems` array in `components/admin/AdminSidebar.tsx`.

---

## 6. Quick reference: file locations

```
components/admin/
  AdminSidebar.tsx        ← nav items array + sidebar UI
  AdminSidebarWrapper.tsx ← mobile toggle + sidebar wrapper

app/admin/
  login/page.tsx         ← no sidebar (outside dashboard layout)
  (dashboard)/
    layout.tsx           ← renders AdminSidebarWrapper + main content
    page.tsx             ← Dashboard (/admin)
    packages/page.tsx    ← Packages list
    tours/page.tsx      ← Tours list
    destinations/page.tsx
    testimonials/page.tsx
    trip-requests/page.tsx
    trip-orders/page.tsx
    trip-builder/options/page.tsx
    trip-builder/templates/page.tsx
    …
```

Public homepage and other public pages live under `app/(public)/` and do **not** use the admin sidebar.
