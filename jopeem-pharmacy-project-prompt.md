# Project Prompt — Jopeem Pharmacy Website Build

> Instructions for the AI build agent. Read this file fully before writing any code. Do not invent business facts — every content fact (business info, services, pricing, catalog, colors, mission/values) lives in `assets/source-data.md`. Pull from there, not from imagination.

---

## 1. Project Summary

Build a one-page (or lightly multi-section) marketing website for **Jopeem Pharmacy and Health Care Centre Ltd**, a pharmacy with two branches in Kampala, Uganda.

This is a **200,000 UGX package tier** — keep the feature set intentionally lean. Don't add anything beyond what's listed in Section 3. Do not add a shopping cart, checkout flow, flash-deal popups, location-detection prompts, or fabricated customer testimonials — those belong to a higher package tier and none were requested for this build.

Despite the limited feature set, the UI must be **modern and visually polished** — this client's site should look and feel premium, not stripped-down. Treat visual quality as non-negotiable even though feature count is capped.

---

## 2. Reference Site — Improve On This, Don't Copy It

Reference: `https://vita-care-five.solomantalgo.com/` (a prior demo by the same builder, for a different fictional pharmacy).

Use it only as a loose structural/tonal reference (hero → catalog → about → gallery → contact → footer flow, WhatsApp-first contact pattern). Concretely improve on it:

- **Drop**: the cart/checkout system, the countdown flash-deal popup, the location-share popup, and the fabricated star-rating testimonials block (none of that is in scope here, and testimonials should never be fabricated for a real client).
- **Keep the spirit of**: WhatsApp as the primary contact/booking mechanism, a clean catalog browsing experience, a confident hero section.
- **Raise the bar on**: visual polish, typography, spacing/rhythm, and making the brand colors (not a generic template palette) feel intentional throughout.

`widespectrum.co.ug` was suggested by the client as a color reference but was inaccessible for review and the client dislikes its structure — disregard it beyond the color direction already captured in `source-data.md`.

---

## 3. Required Sections (Scope Ceiling — Nothing Beyond This List)

1. **Hero** — pharmacy name, tagline, a strong CTA to WhatsApp, branch highlight (main branch hours/location)
2. **Services & Pricing** — pull from `source-data.md`. Where a service has no price listed, do not invent one — display it without a price or with "Enquire" rather than a fabricated number.
3. **Product Catalog** — see Section 5, this is the most involved section
4. **About the Pharmacy** — mission statement + 5 core values + a short "who we are" intro built from the business info in `source-data.md`
5. **Gallery** — placeholder "Coming Soon" section only. Client is relocating branches; do not build a real gallery or use stock images to fake one here.
6. **Location & Contact** — both branches: address/area, hours, phone numbers, WhatsApp numbers, email
7. **WhatsApp Booking/Contact** — primary action throughout the site, wired to **0788 570 123** (Nyanama, main branch)
8. **Social Media Links** — footer icons/links. Handles not yet provided by the client — implement the UI slots (Facebook/Instagram/WhatsApp icons) pointing to placeholder `#` links, clearly marked in code comments as `TODO: awaiting client social handles`, so they're easy to wire up later.
9. **Mobile-first responsive design** — this audience is majority-mobile; design mobile-first, then scale up.

---

## 4. Assets & Content Sourcing

Folder structure for this project:

```
/assets
  source-data.md      ← all business facts, services, pricing, catalog, brand colors, mission/values
  logo.*               ← client logo (provided separately, drop in when available)
/images
  ...                  ← AI-generated images per service/category, provided by the builder
```

Rules:
- **All written content** (copy, numbers, hours, prices, category names, item names) must come from `assets/source-data.md`. Do not fabricate services, prices, testimonials, stats (e.g. don't invent a "12 years in business" or "8,500+ customers" stat the way the reference demo did — Jopeem's real facts are in the source file, use only those).
- **Images**: no client photos exist yet. Use AI-generated images (from `/images`) as the primary visual layer — especially for service tiles and catalog category cards. Fall back to licensed stock photography only where an AI image genuinely doesn't fit (e.g. a generic pharmacy-counter mood shot). Never use another real pharmacy's photos.
- **Logo**: not handled in this build pass — leave a clearly marked logo slot in the header/footer for it to be dropped in later.

---

## 5. Product Catalog — Build Guidance

The stock data has 7,291 SKUs across 5 categories (Medicine, Sundries, Cosmetics, Diagnostics, Medical Devices) — full breakdown and sub-groupings are in `assets/source-data.md`.

**Do not render Medicine (6,817 items) as a flat static list.** Instead:
- Show it as a summary stat card ("6,800+ medicines in stock") with the dosage-form breakdown as a visual (chart or tag cloud), plus a clear "Ask us on WhatsApp" CTA for availability of a specific medicine.
- The other four categories (Sundries, Cosmetics, Diagnostics, Medical Devices — all under 220 items each) can be browsed properly: category → sub-group (as grouped in `source-data.md`) → item list. Keep this lightweight (accordion/tabs/filterable grid), not a full e-commerce catalog with cart — items are for browsing/awareness, not online ordering, in this package tier.
- Every catalog entry should route back to the WhatsApp contact button for enquiries, since there's no cart in this tier.

---

## 6. Visual/Brand Direction

- Primary: Brand Green `#4CAA4C`
- Accent/CTA: Red `#E3242B` (sparing use — buttons, phone numbers, key highlights)
- Text/neutral dark: `#1A1A1A`
- Base background: `#FFFFFF`, with the olive-green (`#B5B92A`) available as an optional secondary/section-background accent
- Modern UI expectations: generous whitespace, clear visual hierarchy, real typographic scale (not default browser sizing), smooth but restrained motion/hover states, rounded-modern component style consistent with current (2026) web design norms — avoid dated template aesthetics.
- Tone: trustworthy healthcare provider, not a flashy retail brand — confident but calm.

---

## 7. Open Items Not Yet Blocking This Build

These are known-missing and shouldn't block starting the build — wire the UI to support them, populate when available:

- Domain name — not yet decided
- Social media handles — placeholders only for now
- Prices for 7 of the 8 listed services — display without a price for now
- Logo file — slot left open in header/footer
