# Jopeem Pharmacy image and gallery plan

## Goal and guardrails

Keep the existing premium Jopeem site identity. Add real pharmacy imagery only where it supports real services or spaces. Leave generic photos in place where the supplied images are not a fit. Do not overwrite or edit originals in `new images/`.

All image working copies are in `plan/gallery/`; the approved entrance edit is in `plan/assets/hero-entrance-polished.png` and `plan/gallery/hero-entrance-polished.png`.

## User-approved service visuals

- **Talk with our pharmacy team:** video is implemented from `plan/gallery/talk-with-our-team.mp4`, muted, looping, inline, without visible controls, and with a poster/fallback. The source video remains unchanged.
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

- `Talk with our pharmacy team`: `plan/gallery/talk-with-our-team.mp4` is a byte-for-byte copy of the supplied video. It is used muted, autoplay, loop, and playsinline without controls; `gallery-consultation-poster.jpg` is a representative still at 6 seconds, with `gallery-counter-consultation-original.jpg` as the failure/reduced-motion fallback. Sampled frames at 0, 2, 4, 6, and 8 seconds show a steady portrait consultation across the counter without disruptive cuts.
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

## New product-photo batch and catalog expansion (2026-11-27)

The initial 10 product photos have already been matched and integrated as documented above. A second batch has been added to `new images/Products/`; current inventory is 25 files total. The 15 newly added files requiring fresh visual identification and catalog comparison are:

- `IMG-20261126-WA0753.jpg.jpeg`
- `IMG-20261126-WA0784.jpg.jpeg`
- `IMG-20261126-WA1808.jpg.jpeg`
- `IMG-20261126-WA3721.jpg.jpeg`
- `IMG-20261126-WA4238.jpg.jpeg`
- `IMG-20261126-WA4551.jpg.jpeg`
- `IMG-20261126-WA5025.jpg.jpeg`
- `IMG-20261126-WA5105.jpg.jpeg`
- `IMG-20261126-WA6294.jpg.jpeg`
- `IMG-20261126-WA7153.jpg.jpeg`
- `IMG-20261126-WA7308.jpg.jpeg`
- `IMG-20261126-WA7398.jpg.jpeg`
- `IMG-20261126-WA8432.jpg.jpeg`
- `IMG-20261126-WA8821.jpg.jpeg`
- `IMG-20261126-WA9441.jpg.jpeg`

For each new file, visually read the package label, then compare it with all existing names in `assets/source-data.md` and the existing verified mappings in `products.js`. If a clearly identified product has no existing matching catalog record, add a new product entry to the right category/group using only identity details confirmed on the package. Do not invent formulation, size, SKU, price, availability, or claims. If identity or catalog classification remains uncertain, record it as unresolved and do not add/show a guessed item.

Archive the new source images without editing originals; record a full mapping/status table for this batch in this plan. Only confirmed exact products receive image links. Keep image-bearing products first in each filtered catalog view, preserving existing category/subgroup/search behavior and stable source order among ties. Document new total/category counts after adding records.

## Nyanama Google Maps / Business Profile location verification

The user requests verification of the Nyanama location using Jopeem Pharmacy's Google Business Profile (Google Maps listing) and correction of the website's map if needed. The current homepage map uses a hard-coded Google Maps embed URL in `index.html` and a directions search link in the Nyanama branch card.

- Identify the official Jopeem Pharmacy Nyanama Google Business Profile / Maps place. Confirm the match using official business name, address/landmark, and listing identity; do not rely on an approximate neighborhood query or guessed coordinates.
- Update the website's Nyanama map embed and directions target to the verified place/listing. Keep the Nalumunye map choice and branch behavior intact.
- Record the verified public listing name, address/landmark, Maps URL or place identifier, and what was updated here. If the public listing cannot be reliably distinguished from similar businesses, report the ambiguity and do not guess a new map target.
- This scope is to verify the public listing and update the website map. Do not edit Google Business Profile information/settings itself.
- Verify that selecting Nyanama and Nalumunye still swaps the correct map and directions, and the default Nyanama map lands on the verified pharmacy listing.

### Second-batch visual identification and catalog additions (2026-11-27)

All 15 newly supplied package photos were opened individually at readable resolution. Their package labels identify the listed products; none exactly matched an existing catalog item, including the existing Vitabiotics Jointace Omega-3 item (different product). Each clear product was added as a new item to Sundries → General Health & Miscellaneous. Sizes, strengths, and dosage forms are included only where visible on the front of the photographed pack; omitted details were not inferred.

| Source filename | Observed label/product identity | Exact catalog name | Category/group | Confidence | Action/status |
|---|---|---|---|---|---|
| `IMG-20261126-WA0753.jpg.jpeg` | Vitabiotics Neurozan; 30 Advanced Tablets | Vitabiotics Neurozan, 30 Advanced Tablets | Sundries / General Health & Miscellaneous | High | New item; exact image attached |
| `IMG-20261126-WA0784.jpg.jpeg` | Valupak Omega-3 Fish Oil (18:12); 30 capsules | Valupak Omega-3 Fish Oil (18:12), 30 Capsules | Sundries / General Health & Miscellaneous | High | New item; exact image attached |
| `IMG-20261126-WA1808.jpg.jpeg` | Zandros dietary supplement; fish oil 1200mg, vitamin E 19 I.U.; 20 soft gelatin capsules | Zandros Fish Oil 1200mg with Vitamin E, 20 Soft Gelatin Capsules | Sundries / General Health & Miscellaneous | High | New item; exact image attached |
| `IMG-20261126-WA3721.jpg.jpeg` | Vitabiotics Neuromind Original; 30 tablets | Vitabiotics Neuromind Original, 30 Tablets | Sundries / General Health & Miscellaneous | High | New item; exact image attached |
| `IMG-20261126-WA4238.jpg.jpeg` | Vitabiotics Visionace Original with Bilberry; pack size/form not readable on photographed face | Vitabiotics Visionace Original with Bilberry | Sundries / General Health & Miscellaneous | High for identity; pack details not visible | New item; exact image attached; no size/form inferred |
| `IMG-20261126-WA4551.jpg.jpeg` | Good Omega Fish Oil 1000mg; 1 × 10 softgel capsules | Good Omega Fish Oil 1000mg, 10 Softgel Capsules | Sundries / General Health & Miscellaneous | High | New item; exact image attached |
| `IMG-20261126-WA5025.jpg.jpeg` | NeoCell Grassfed Collagen Peptides + Vitamin C & Biotin; 6000mg per serving; 180 tablets | NeoCell Grassfed Collagen Peptides with Vitamin C & Biotin, 180 Tablets | Sundries / General Health & Miscellaneous | High | New item; exact image attached |
| `IMG-20261126-WA5105.jpg.jpeg` | Doctor's Choice Replenish+ Plant-Based; 30 veggie capsules; package mentions SelenoExcell Selenium and organic Moringa oleifera | Doctor's Choice Replenish+ Plant-Based, 30 Veggie Capsules | Sundries / General Health & Miscellaneous | High | New item; exact image attached |
| `IMG-20261126-WA6294.jpg.jpeg` | Five Oceans Ultimate Omega Plus Multivitamins; 30 softgels | Five Oceans Ultimate Omega Plus Multivitamins, 30 Softgels | Sundries / General Health & Miscellaneous | High | New item; exact image attached |
| `IMG-20261126-WA7153.jpg.jpeg` | Denk Brain Active nutrient complex; 30 shown; dosage form not stated on photographed face | Denk Brain Active, 30 | Sundries / General Health & Miscellaneous | High for identity; dosage form unspecified | New item; exact image attached; form not inferred |
| `IMG-20261126-WA7308.jpg.jpeg` | WelTek Omega high-strength Omega 3 fatty acids; 30 softgels | WelTek Omega 3 Fatty Acids, 30 Softgels | Sundries / General Health & Miscellaneous | High | New item; exact image attached |
| `IMG-20261126-WA7398.jpg.jpeg` | Vitabiotics Ultra Omega 3·6·9, 3-in-1 Formula; pack size/form not visible | Vitabiotics Ultra Omega 3-6-9 3-in-1 Formula | Sundries / General Health & Miscellaneous | High for identity; pack details not visible | New item; exact image attached; no size/form inferred |
| `IMG-20261126-WA8432.jpg.jpeg` | Seven Seas Omega-3 Fish Oil Plus Cod Liver Oil; 60 capsules; 480mg fish oil / 120mg Omega-3 printed | Seven Seas Cod Liver Oil, 60 Capsules | Sundries / General Health & Miscellaneous | High | New item; exact image attached |
| `IMG-20261126-WA8821.jpg.jpeg` | Hovid Omega-3 1000mg molecularly distilled fish oil; 18% EPA, 12% DHA; 60 softgels | Hovid Omega-3 1000mg, 60 Softgels | Sundries / General Health & Miscellaneous | High | New item; exact image attached |
| `IMG-20261126-WA9441.jpg.jpeg` | NeoCell Super Collagen+C; Type 1 & 3, Vitamin C; 6g collagen per serving; 250 tablets | NeoCell Super Collagen+C Type 1 & 3, 250 Tablets | Sundries / General Health & Miscellaneous | High | New item; exact image attached |

The 15 source files were copied byte-for-byte to `plan/products/` and the archived copies are also the serving URLs used by the catalog. Product listings in `assets/source-data.md` now total 7,316 items: Medicine 6,817; Sundries 244; Cosmetics 169; Diagnostics 46; Medical Devices 40. The Sundries General Health & Miscellaneous group now has 89 entries. The four parsed web-catalog categories total 499 products (244 + 169 + 46 + 40). Verified-image sorting in `app.js` and `products.js` remains after the current filters/search and uses original filtered index as its stable tie-breaker; products without verified images retain their category-themed placeholders. The existing product-image CSS uses `object-fit: contain`.

### Nyanama Google Maps listing check (2026-11-27)

Public business and directory sources associate **Jopeem Pharmacy and Health Care Center** with **Nyanama Trading Centre**, and the current directory also lists the Nalumunye Road, Lebron Shopping Centre branch separately. Medpages describes the Nyanama address as **Nyanama Trading Centre, Nyanama Road, Central Kampala**, while noting that its provider information has not been fully verified ([Medpages listing](https://www.medpages.info/sf/index.php?orgcode=318709&page=organisation)). The Uganda Health Care Directory 2025–26 lists Jopeem Pharmacy and Health Care Center at **Nyanama Trading Center** and gives phone `0702 774 852`, matching the website's Nyanama contact; it separately identifies the Nalumunye branch ([directory entry](https://www.zaddockassociates.com/public/flipbooks/UHD-2025/files/basic-html/page241.html)).

The official Google Maps/Business Profile place could not be confirmed. Search indexing also surfaced a third-party Cybo result titled “Jopeem Pharmacy” in Nyanama with a different phone number (`+256 782 085703`), and it did not expose a Maps place ID/CID or an official Google Maps share URL ([Cybo directory result](https://www.cybo.com/UG/mengo-uganda/pharmacies-and-drug-stores/?p=4)). The computer-use browser could not start in this environment (`failed to write kernel assets`), so the Google Maps place itself could not be inspected. Because the public listing identity remains ambiguous, the website map and directions have **not** been changed.

The existing Nyanama map targets remain the hard-coded Google Maps embed in `index.html` and the generic directions search for `Jopeem Pharmacy Nyanama Trading Centre`; `app.js` still dynamically sets Nyanama directions to the existing coordinates `0.27092, 32.55366`. The existing Nalumunye embed and branch target remain intact. Code review confirms Nyanama is the default branch and both branch buttons continue to call the shared map-switch behavior, but an interactive browser verification was unavailable. To replace the Nyanama target confidently, obtain the official Google Maps **Share** link or visible Place ID/CID from the listing owner and confirm its Nyanama address/landmark and official contact details.

### Verification performed for the second batch

- Individually inspected all 15 new product photos at readable resolution and compared their visible product identities against the complete catalog text and verified image-name maps.
- Confirmed that all 15 added names were absent as exact catalog entries before addition; retained the prior 10 mappings.
- Copied source files unchanged into `plan/products/`; SHA-256 comparisons confirmed all 15 archive copies match their originals. All 15 product URLs returned HTTP 200 from a local static server and their served bytes matched the originals. `products.html`, `products.js`, `assets/source-data.md`, and `index.html` also returned HTTP 200.
- `node --check app.js` and `node --check products.js` passed. A catalog parse confirmed Cosmetics 169, Sundries 244, Diagnostics 46, and Medical Devices 40 (499 browsable items); all 15 new names exist in the source catalog and in both verified-image maps.
- Browser checks for product ordering and branch map switching remain unavailable due to the computer-use initialization error; no desktop/mobile visual result is claimed.
