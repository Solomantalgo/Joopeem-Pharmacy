# Jopeem Pharmacy image and gallery plan

## Goal and guardrails

Keep the existing premium Jopeem site identity. Add real pharmacy imagery only where it supports real services or spaces. Leave generic photos in place where the supplied images are not a fit. Do not overwrite or edit originals in `new images/`.

All image working copies are in `plan/gallery/`; the approved entrance edit is in `plan/assets/hero-entrance-polished.png` and `plan/gallery/hero-entrance-polished.png`.

## User-approved service visuals

- **Talk with our pharmacy team:** video is implemented from `plan/gallery/talk-with-our-team.mp4`, muted, looping, inline, with controls and a poster/fallback. The source video remains unchanged.
- **Medicine Advice & Counselling:** use `plan/gallery/gallery-pharmacist-customer-care-original.jpg`.
- These images contain people. Do not retouch, crop the source files, or regenerate them. CSS may control the presentation. The current desktop cards make images too tall/stretchy: use a deliberate fixed/clamped media aspect ratio or height and `object-fit: cover`, with tuned `object-position` so all relevant faces remain visible. Keep card proportions compact and similar to the earlier service card treatment. Verify desktop and mobile crops.
- Keep the video silent; provide accessible controls only if needed, and respect reduced-motion preferences. Prefer muted autoplay only if the browser allows it; otherwise show the poster and a clear play control.

## Gallery direction

The current “Our spaces” gallery felt like images patched into placeholders. Redesign this portion as a coherent, editorial **“Inside Jopeem”** gallery using a deliberate masonry/editorial grid: one larger anchor image, smaller supporting images, consistent rounded corners, restrained green/red accents, clear image captions, and varied card sizes that feel intentional. Use only real supplied pharmacy imagery. Avoid a generic equal-card grid if it makes the set feel like a patchwork.

Use suitable photos from `plan/gallery/` after reviewing each visually. Do not create unsupported categories or imply staff/team portraits where no suitable image exists. Remove/omit any gallery category or card that claims to show a dedicated team, treatment room, or service space when available photos do not support that claim. The gallery can focus on storefront, pharmacy interiors, product shelves, cosmetics, waiting area, and real customer interactions as the images support. Omit exact duplicate brand-wall imagery from the displayed gallery.

Retain generic site imagery in unrelated areas when no real photo is a better fit. Never remove genuine pharmacy services simply because current photography is limited; this task is about the gallery and photo presentation, not deleting existing service offerings.

## Existing site references

- `index.html:102-110`: “Talk with our pharmacy team” service feature.
- `index.html:139-147` (verify current lines): “Medicine Advice & Counselling” feature.
- `index.html` around lines 250-340: inspect the existing “Our spaces” gallery and remove unsupported gallery cards/categories.
- `styles.css`: `.service-feature`, `.service-feature-media`, `.counselling-feature`, `.counselling-feature-media`, gallery layout, and responsive breakpoints.
- `app.js:409-415`: gallery reveal behavior; preserve or adapt it to the new gallery structure.
- Video source: `new images/Talk with our team.mp4` (4,276,755 bytes at inventory). Keep original in place; if site serving requires a copy, store a copy under `plan/gallery/` and/or the appropriate app media directory while retaining the archive copy.

## Image archive map

| Source in `new images/` | Archive in `plan/gallery/` | Role/status |
|---|---|---|
| `Entrance.jpg` | `hero-entrance-polished.png` | Approved entrance polish; possible hero/gallery use |
| `1000379100.jpg.jpeg` | `gallery-pharmacy-brand-wall-original.jpg` | Interior/brand image |
| `20261123_134941.jpg` | `gallery-cosmetics-shelves-original.jpg` | Cosmetics shelves |
| `20261123_135625.jpg` | `gallery-counter-consultation-original.jpg` | Pharmacy-team conversation; approved card photo fallback |
| `20261123_140051.jpg` | `gallery-pharmacy-waiting-area-original.jpg` | Waiting area |
| `20261123_140641.jpg` | `gallery-pharmacist-customer-care-original.jpg` | Medicine advice/counselling |
| `20261123_141226.jpg` | `gallery-pharmacy-shelves-team-original.jpg` | Interior with people; only use if suitable |
| `IMG_20261123_154915.jpg.jpeg` | `gallery-pharmacy-front-shelves-original.jpg` | Pharmacy interior |
| `IMG_20261123_154943.jpg.jpeg` | `gallery-brand-wall-duplicate-original.jpg` | Byte-identical duplicate; do not show in gallery |
| `IMG_20261123_155119.jpg.jpeg` | `gallery-pharmacy-interior-corner-original.jpg` | Pharmacy interior |
| `IMG_20261123_155325.jpg.jpeg` | `gallery-pharmacy-product-shelves-original.jpg` | Product shelves |
| `IMG_20261123_155442.jpg.jpeg` | `gallery-pharmacist-service-original.jpg` | People/service photo; use only if appropriate |
| `IMG_20261123_160137.jpg.jpeg` | `gallery-pharmacy-team-service-original.jpg` | People/team photo; do not use to imply a team feature unless clearly suitable |
| `IMG_20261123_160237.jpg.jpeg` | `gallery-pharmacy-team-wide-original.jpg` | People/team photo; do not use to imply a team feature unless clearly suitable |
| `Talk with our team.mp4` | Not yet copied | Candidate silent looping consultation visual; inspect before use |

## Completion status

- `Talk with our pharmacy team`: `plan/gallery/talk-with-our-team.mp4` is a byte-for-byte copy of the supplied video. It is used muted, autoplay, loop, and playsinline with controls; `gallery-consultation-poster.jpg` is a representative still at 6 seconds, with `gallery-counter-consultation-original.jpg` as the failure/reduced-motion fallback. Sampled frames at 0, 2, 4, 6, and 8 seconds show a steady portrait consultation across the counter without disruptive cuts.
- `Medicine Advice & Counselling`: `gallery-pharmacist-customer-care-original.jpg`, source unchanged. Both service images use compact CSS media boxes with cover fitting and face-forward positions; responsive styling sets shorter crops on smaller screens.
- The gallery is titled **Inside Jopeem** and uses an asymmetrical storefront anchor with supporting pharmacy interior and cosmetics views. The displayed sources are `hero-entrance-polished.png`, `gallery-pharmacy-brand-wall-original.jpg`, and `gallery-cosmetics-shelves-original.jpg`. The duplicate brand-wall file is not displayed. The unsupported team card/category and service-space/team claims have been removed; actual service offerings remain unchanged.
- Visual review was performed using a contact sheet of every `plan/gallery/` candidate and sampled video frames. `node --check app.js` passed. Live desktop/mobile viewport verification remains pending because the browser preview host was unavailable.
- No image originals were edited. The video source in `new images/` remains unchanged; its serving copy and poster are archived under `plan/gallery/`. Generic hero and unrelated product/site imagery remain in their existing placements.
- Faithful polishing of other people-free photos remains pending. Earlier cosmetics and waiting-area edit trials changed store details and were rejected; those originals remain untouched.

## Product photography task (added 2026-11-25)

The product photos are in `new images/Products/`. Current inventory: `1000360390.jpg.jpeg`, `1000360394.jpg.jpeg`, `1000360395.jpg.jpeg`, `1000360397.jpg.jpeg`, `1000360399.jpg.jpeg`, `1000360402.jpg.jpeg`, `1000360404.jpg.jpeg`, `1000360406.jpg.jpeg`, `1000360410.jpg.jpeg`, and `1000360414.jpg.jpeg` (10 files).

The homepage product preview and standalone `products.html` catalog load `assets/source-data.md` through `app.js` and `products.js` respectively. Both render the Cosmetics, Sundries, Diagnostics, and Medical Devices product groups; medicine catalog display has separate handling. Products without photos use the existing category-themed placeholders.

Required product image work:

- Visually inspect every one of the 10 source images at readable resolution and identify the actual product/brand/variant shown. Read package labels from the image; do not infer from filename alone.
- Compare each image against the actual product names and categories in `assets/source-data.md` and any existing image metadata. Match only when brand, product name, formulation/strength/size, and packaging are sufficiently consistent. Record ambiguous and unmatched images rather than guessing.
- Create a source-to-product mapping table in this plan with image filename, observed package identity, exact catalog product name, category/group, confidence, and status. Preserve source files unchanged; keep any site-ready copies and product images used under `plan/` archive as well.
- Attach images only to verified exact/strong matches. Never show a misleading pack image for a different formulation or product.
- In product results, place products with verified available images before products without a verified image, while preserving the existing category/group/search filters and the relative order within each group. Image-less products retain their current category-themed placeholder. Ensure the image-prioritization is deterministic and explain in source code comments.
- Review the product photos on desktop and mobile for legibility and appropriate `object-fit`; do not stretch packs or crop away product identity.

### Product image review and catalog additions (2026-11-25)

The user asked for unmatched pictured products to be created as new products. All 10 packages were visually reviewed and added to the existing catalog source. Nine are in Sundries → General Health & Miscellaneous and Contractubex is in Cosmetics → Skincare (Face & Body). No existing similar-but-different product was repurposed. The package photos are copied unchanged to `plan/products/` and linked to their exact new catalog names in the verified-image maps in `app.js` and `products.js`.

| Source filename | Observed package identity | Exact catalog name | Category/group | Confidence | Status |
|---|---|---|---|---|---|
| `1000360390.jpg.jpeg` | BioMan by Bionutrica food supplement, 60 tablets; front describes male fertility support | BioMan Food Supplement, 60 Tablets | Sundries / General Health & Miscellaneous | High | Added; image attached |
| `1000360394.jpg.jpeg` | France Lait 1 infant formula, 0–6 months, 900g | France Lait 1 Infant Formula, 0–6 Months, 900g | Sundries / General Health & Miscellaneous | High | Added; image attached |
| `1000360395.jpg.jpeg` | France Lait 2 follow-on formula, 6–12 months, 400g | France Lait 2 Follow-on Formula, 6–12 Months, 400g | Sundries / General Health & Miscellaneous | High | Added; image attached |
| `1000360397.jpg.jpeg` | WelTek Keto ketogenic powder, 300g | WelTek Keto Ketogenic Powder, 300g | Sundries / General Health & Miscellaneous | High | Added; image attached |
| `1000360399.jpg.jpeg` | WelTek Joint collagen peptides with glucosamine and vitamin C; 10 sachets × 12g | WelTek Joint Collagen Peptides, 10 Sachets × 12g | Sundries / General Health & Miscellaneous | High | Added; image attached |
| `1000360402.jpg.jpeg` | Orthoboost with hyaluronic acid; 30 sachets × 5g | Orthoboost with Hyaluronic Acid, 30 Sachets × 5g | Sundries / General Health & Miscellaneous | High | Added; image attached |
| `1000360404.jpg.jpeg` | Biotica Megacal Fizzy Forte; 1000mg calcium, 20 tablets, lemon-lime | Biotica Megacal Fizzy Forte, 1000mg Calcium, 20 Tablets, Lemon-Lime | Sundries / General Health & Miscellaneous | High | Added; image attached |
| `1000360406.jpg.jpeg` | Vitabiotics Jointace Omega-3, 30 capsules | Vitabiotics Jointace Omega-3, 30 Capsules | Sundries / General Health & Miscellaneous | High | Added; image attached |
| `1000360410.jpg.jpeg` | Contractubex scar treatment gel, 20g | Contractubex Scar Treatment Gel, 20g | Cosmetics / Skincare (Face & Body) | High | Added; image attached |
| `1000360414.jpg.jpeg` | Sugar Free Gold low-calorie sweetener; pack weight/variant unreadable | Sugar Free Gold Low-Calorie Sweetener | Sundries / General Health & Miscellaneous | Medium for pack details; brand/product readable | Added; image attached; size left unspecified |

The listed catalog total is updated from the source export's 7,291 to 7,301 (10 additions); Cosmetics is 169 and Sundries is 229. The image source files remain unchanged. Product images use `object-fit: contain` inside the existing responsive image frames, so the packaging stays uncropped and undistorted.

`renderCatalog` and the standalone page's `renderProducts` sort the current filtered item list by verified image presence, then original filtered index. This deterministically puts the ten photographed products first in their category/group/search results while preserving source order within both image and no-image sets. Existing category-themed placeholders remain for all products without a verified image.

### Verification performed

- Visually reviewed a contact sheet of all 10 product photographs and individually checked the two formula packages at readable resolution.
- Confirmed that the ten identities did not exist in the original catalog and added them as new records; attached each photo only to its new matching record in the homepage preview and standalone products page.
- Confirmed byte-identical copies in `plan/products/` using SHA-256 comparisons against all ten originals.
- Confirmed the local site server returns HTTP 200 for all ten `plan/products/` image URLs and each served response hashes identically to its original.
- `node --check app.js` and `node --check products.js` passed. The browser preview previously showed an empty product list; the root cause and current fix are recorded below.


## Full gallery page (implemented 2026-11-25)

The homepage “Inside Jopeem” preview now includes a **View full gallery** link to `gallery.html`. The dedicated responsive page uses an editorial masonry-style photo grid with the approved entrance, pharmacy interior/shelves, cosmetics, waiting area, consultation and medicine advice images. It provides descriptive captions and alt text and links visitors back to the main site/contact section. `gallery.css` contains page-specific responsive layout rules. The ten photographed product records and their image links are now implemented as listed above.

## Branch attribution clarification

The gallery photos shown are from **Nyanama branch**. Homepage preview now says “Photo gallery: Nyanama branch,” and `gallery.html` shows a clear branch note while welcoming visitors from Nalumunye to browse. Do not label the current photos as representing both branches unless Nalumunye photos are added and verified.

## Navigation, encoding, and catalog parser fix (2026-11-25)

- **Root cause of the empty product list:** `products.html` loads `products.js` correctly and the local server returns `assets/source-data.md` successfully. The served Markdown uses CRLF line endings. Both `products.js` and the homepage catalog parser in `app.js` split only on LF, leaving a trailing carriage return on each line; the subgroup-heading regular expression then failed, so product entries were never placed into groups. Both parsers now split on `/\r?\n/`.
- **Catalog validation:** the CRLF-aware parse reads 169 Cosmetics, 229 Sundries, 46 Diagnostics, and 40 Medical Devices products (484 total). `products.html`, `products.js`, `assets/source-data.md`, `gallery.html`, and `index.html` each returned HTTP 200 from the local server. The ten verified image mappings in `products.js` still point to the exact new records and existing archived files; image-first sorting remains after category/subgroup/search filtering.
- **Navigation:** added Gallery to desktop navigation on the home, products, and full-gallery pages. The homepage’s existing mobile menu includes the link; the products and gallery pages expose a compact mobile Gallery link. The full gallery marks Gallery as the current page. Existing Nyanama branch attribution remains on the homepage gallery section and full gallery.
- **Encoding:** repaired the actual mojibake punctuation and symbols found in `index.html`, including apostrophes, dashes, arrows, quotation marks, bullet separators, the menu chevron, multiplication sign, and check/star icons. A codepoint scan found `products.html` and `products.js` punctuation was already valid UTF-8; earlier PowerShell output had rendered some characters incorrectly. Edited files are saved as UTF-8.
- **Browser verification limitation:** the Windows computer-use helper failed to activate the Chrome window on both the initial attempt and one fresh-window retry. The page could not be refreshed for desktop/mobile visual inspection or browser-console inspection. HTTP responses and parser behavior were checked directly; visible navigation, rendered product cards/image ordering, and mobile layouts remain to be confirmed in a browser.
