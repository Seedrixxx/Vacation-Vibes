# About Page

**URL:** `/about`  
**Route:** `app/(public)/about/page.tsx`

---

## Overview

The About page introduces Vacation Vibes as a travel agency, highlights why to choose the brand, shares a message from the CEO, and showcases the team. The page is static (edge, force-static) and uses no API calls.

---

## Page Structure (top to bottom)

### 1. Hero

- **Headline:** “Travel made easy with *Vacation Vibes.*”
- **Subtext:** “Your gateway to unforgettable travel across Sri Lanka, the UAE, and beyond.”
- **CTA:** None in hero (primary CTA is in “Who We Are”).

---

### 2. Who We Are

- **Heading:** “Who We Are”
- **Body:** Two paragraphs describing Vacation Vibes as a Sri Lanka & UAE–based agency offering personalized packages (adventure, relaxation, culture, luxury), smooth itineraries, desert safaris, beach escapes, cultural tours, etc.
- **CTA:** “Plan Your Trip” → `/contact`

---

### 3. Why Choose Vacation Vibes?

- **Heading:** “Why Choose Vacation Vibes?”
- **Intro:** “Let Vacation Vibes take you on a journey full of joy, relaxation, and unforgettable memories. Contact us today to plan your next adventure.”
- **Four cards:**
  - **Personalised Travel Plans** – Customized itineraries for preferences and budget.
  - **Expert Guidance** – Advisors with deep local knowledge.
  - **Hassle-Free Services** – Flights, hotels, excursions, transfers handled.
  - **24/7 Customer Support** – Your peace of mind is our priority.

---

### 4. Message from the CEO

- **Layout:** Centered; circular CEO photo above the heading.
- **Image:** `/images/Team/CEO.png` in a circle (128px / 160px on sm+), `object-cover`, `object-[center_30%]`, `scale-110`.
- **Heading:** “Message from the CEO” (with quote icon).
- **Body:** Four paragraphs (welcome, Sri Lanka & UAE presence, happiness and detail focus, thank-you). All text center-aligned.

---

### 5. Team Members

- **Component:** `TeamMembersSection` from `@/components/about/TeamMembersSection`.
- **Data:** `teamMembers` array (see below).
- **Behavior:** Full-screen-style section with:
  - Faded background image of active member + name overlay
  - Translucent card with profile photo (overflowing top), name, role, social placeholders, short bio, pill pagination + play/pause
  - Auto-advance every 5s (toggleable)
  - Fade left/right on change
  - Circular thumbnail strip below

**Team members (current data):**

| Image        | Name         | Role           |
|-------------|--------------|----------------|
| /images/Team/4.png  | Team Member | Travel Expert |
| /images/Team/5.png  | Team Member | Travel Expert |
| /images/Team/6.png  | Team Member | Travel Expert |
| /images/Team/7.png  | Team Member | Travel Expert |
| /images/Team/8.png  | Team Member | Travel Expert |
| /images/Team/9.png  | Team Member | Travel Expert |
| /images/Team/10.png | Team Member | Travel Expert |

Optional per-member fields: `bio`, `instagram`, `twitter`, `facebook`, `linkedin`.

---

### 6. CTA

- **Heading:** “Ready to explore the world?”
- **Subtext:** “Let’s plan your perfect getaway.”
- **Buttons:** “Contact Us Now” and “Plan Your Trip” (both → `/contact`).

---

## SEO & Meta

- **Title:** “About Us | Vacation Vibez”
- **Description:** “Trusted travel agency in Sri Lanka & UAE. Personalized packages, expert guidance, hassle-free services, and 24/7 support. Plan your dream trip with Vacation Vibes.”

---

## Assets

| Asset              | Path                    | Usage                    |
|--------------------|-------------------------|--------------------------|
| CEO photo          | `/images/Team/CEO.png`  | Message from the CEO     |
| Team photos        | `/images/Team/4.png` … `10.png` | Team carousel |

---

## Editing Content

- **Copy:** Hero, Who We Are, Why Choose, CEO message, and CTA text are in `app/(public)/about/page.tsx`.
- **Why Choose cards:** Edit the `whyChooseUs` array (title + description).
- **Team list:** Edit the `teamMembers` array; add/remove entries or set `name`, `role`, `bio`, and social URLs.
- **CEO image:** Replace `public/images/Team/CEO.png` or change the `src` in the About page.

---

## Technical Notes

- **Runtime:** Edge, force-static.
- **Imports:** `Container`, `Button`, `TeamMembersSection`, `Image` (Next), Lucide icons (MapPin, Compass, Shield, Headphones, Quote).
- **Team section:** Client component with state (active index, direction, isPlaying) and Framer Motion for transitions.
