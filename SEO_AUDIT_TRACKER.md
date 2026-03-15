# SEO Audit Tracker

Last updated: 2026-03-14  
Project: `gta-budget-painting`  
Stack: React + TypeScript + Vite SPA (with prerender step)

## How to use this file
- Keep this file as the single source of truth for SEO remediation.
- Move each item from `Open` to `In Progress` to `Done` as fixes ship.
- Add PR links, deployment date, and Search Console validation notes per item.

## Status legend
- `Open` = not fixed yet
- `In Progress` = fix in progress
- `Done` = fixed and deployed
- `Validated` = confirmed in Search Console / live crawl tests

---

## 1) Critical Indexing Issues

### 1.1 Missing prerender coverage for valid indexable routes
- Status: `Done`
- Severity: Critical
- Why it matters:
  - Multiple valid routes serve homepage metadata/content to crawlers instead of route-specific HTML.
  - This can suppress indexing and ranking for those routes.
- Evidence (live):
  - `/specials`
  - `/services/interior-painting/stucco-ceiling-removal`
  - `/services/interior-painting/drywall-repair`
  - `/services/interior-painting/hallway-painting`
  - `/services/interior-painting/bathroom-vanity-cabinet`
  - `/services/interior-painting/stairway-painting`
  - `/services/exterior-painting/driveway-sealing`
  - These return homepage title/canonical (`https://gtabudgetpainting.ca/`).
- Affected files:
  - `public/sitemap.xml`
  - `scripts/prerender.mjs`
  - `package.json`
  - `src/home.tsx`
  - `src/data/services.ts`
- Fix plan:
  - Create a single route manifest.
  - Generate sitemap and prerender route list from that manifest.
  - Ensure all indexable routes are included.

### 1.2 Soft-404 behavior (unknown URLs return 200 homepage)
- Status: `Done`
- Severity: Critical
- Why it matters:
  - Crawl budget waste and low-quality indexing signals.
- Evidence:
  - `/non-existent-test-url-12345` returns HTTP `200` with homepage HTML/canonical.
- Affected files:
  - `firebase.json`
  - `netlify.toml`
  - `src/home.tsx`
- Fix plan:
  - Add `Route path="*"` with a real Not Found page.
  - Configure hosting to return 404 for unknown non-app routes where possible.

### 1.3 Prerender pipeline instability / hangs
- Status: `Done`
- Severity: Critical
- Why it matters:
  - Build can stall in prerender, causing incomplete route HTML output.
- Evidence:
  - `scripts/prerender.mjs` uses `waitUntil: 'networkidle0'`.
  - Third-party widget script/iframe in base HTML can keep network active.
- Affected files:
  - `scripts/prerender.mjs`
  - `index.html`
- Fix plan:
  - Use `domcontentloaded` or `networkidle2`.
  - Block third-party widget requests during prerender.
  - Load widget after hydration / user interaction.

---

## 2) High Priority SEO Problems

### 2.1 JS-only internal navigation on key pages
- Status: `Done`
- Severity: High
- Why it matters:
  - Many cards use `onClick + navigate()` on `div/button`, reducing crawl discoverability.
- Affected files:
  - `src/pages/ServicesPage.tsx`
  - `src/pages/InteriorPaintingPage.tsx`
  - `src/pages/ExteriorPaintingPage.tsx`
  - `src/pages/LandingPage.tsx`
- Fix plan:
  - Replace card wrappers with `<Link to="...">` / `<a href="...">`.

### 2.2 Sitemap omissions and route mismatch
- Status: `Done`
- Severity: High
- Why it matters:
  - Important routes are absent from sitemap and therefore absent from prerender scope.
- Affected files:
  - `public/sitemap.xml`
  - `src/home.tsx`
  - `src/data/services.ts`
- Fix plan:
  - Auto-generate sitemap from route manifest.

### 2.3 Utility routes noindex reliability
- Status: `Done`
- Severity: High
- Why it matters:
  - `/admin`, `/cart`, `/checkout` are disallowed in robots, but non-prerender paths can still serve homepage HTML.
- Affected files:
  - `public/robots.txt`
  - `src/pages/AdminPanel.tsx`
  - `src/pages/CartPage.tsx`
  - `src/pages/CheckoutPage.tsx`
- Fix plan:
  - Ensure these URLs always return intended robots behavior or protected/404 responses.

---

## 3) Medium Priority Improvements

### 3.1 Multiple H1s on homepage
- Status: `Done`
- Severity: Medium
- Affected file:
  - `src/pages/LandingPage.tsx`
- Fix plan:
  - Keep one `<h1>`, convert second heading to `<h2>`.

### 3.2 Generic service page descriptions
- Status: `Done`
- Severity: Medium
- Affected files:
  - `src/pages/ServicePage.tsx`
  - `src/data/services.ts`
- Fix plan:
  - Use `service.seoDescription` where available for meta description.

### 3.3 URL canonicalization consistency (slash format)
- Status: `Done`
- Severity: Medium
- Why it matters:
  - Sitemap URLs redirect to slash URLs before serving content.
- Affected file:
  - `public/sitemap.xml`
- Fix plan:
  - Align sitemap URLs with final canonical URL format.

---

## 4) Performance Issues (SEO-impacting)

### 4.1 Oversized JS/CSS payload
- Status: `Done`
- Severity: High
- Evidence:
  - Historical build warning is resolved, and payload is significantly improved:
    - `index` route chunk is now ~23.3KB JS.
    - Vendor is split into smaller chunks:
      - `vendor-react` (~242.9KB)
      - `vendor-firebase-firestore` (~300.5KB)
      - `vendor-firebase-core` (~102.2KB)
      - `vendor-firebase-auth` (~76.1KB)
      - `vendor-firebase-storage` (~22.3KB)
    - No chunk currently exceeds the Vite 500KB warning threshold.
- Affected files:
  - `package.json`
  - route entry/app composition in `src/home.tsx`
  - `vite.config.ts`
- Fix plan:
  - Introduce route-level code splitting via `React.lazy`.

### 4.2 Large image assets
- Status: `Done`
- Severity: High
- Evidence:
  - Several images were 500KB–1.2MB; partial optimization applied on highest-impact referenced assets.
  - Added repeatable optimizer command: `npm run optimize:images`.
  - Latest optimizer pass saved an additional ~1.22MB across 27 files.
- Affected paths:
  - `public/gallery/*`
  - `public/services/*`
  - `scripts/optimize_images.py`
  - `package.json`
- Fix plan:
  - Convert to AVIF/WebP, resize, use responsive variants.

### 4.3 Third-party widget loaded globally in head
- Status: `Done`
- Severity: High
- Affected file:
  - `index.html`
- Fix plan:
  - Defer loading and exclude from prerender mode.

### 4.4 Cache headers for hashed assets
- Status: `Done`
- Severity: Medium
- Why it matters:
  - Live headers currently show short max-age for assets.
- Affected file:
  - `firebase.json`
- Fix plan:
  - Add immutable cache headers for `/assets/**`.

---

## 5) React Architecture SEO Risks

### 5.1 SEO depends on manual prerender list quality
- Status: `Done`
- Severity: High
- Fix plan:
  - Route manifest + generated sitemap + generated prerender targets.

### 5.2 No SSR fallback
- Status: `Open`
- Severity: Medium
- Fix plan:
  - Keep prerender robust now; evaluate SSR framework migration later if needed.

### 5.3 Missing explicit 404 route
- Status: `Done`
- Severity: High
- Fix plan:
  - Add NotFound route and matching metadata.

---

## 6) Missing Metadata / Structured Data

### 6.1 Missing correct metadata on non-prerendered valid routes
- Status: `Done`
- Severity: Critical
- Fix plan:
  - Ensure these routes are prerendered and included in sitemap.

### 6.2 Structured data not route-specific
- Status: `Done`
- Severity: Medium
- Affected file:
  - `index.html` (global LocalBusiness schema only)
- Fix plan:
  - Add per-page `Service` schema (and `FAQPage` where applicable).

---

## 7) Prioritized Action Plan

### Phase 1 (Blockers)
- [x] Build a single source-of-truth route manifest.
- [x] Auto-generate sitemap from route manifest.
- [x] Auto-generate prerender routes from route manifest.
- [x] Add missing indexable URLs (`/specials` + missing service detail pages).
- [x] Add explicit app 404 route and metadata.

### Phase 2 (Crawl + Metadata Quality)
- [x] Replace JS-only navigation cards with crawlable `<Link>/<a>`.
- [x] Ensure all indexable pages have unique title/description/canonical.
- [x] Keep utility pages (`/admin`, `/cart`, `/checkout`) reliably non-indexable or protected.

### Phase 3 (Performance + Discoverability)
- [x] Code-split main bundle by route.
- [x] Optimize heavy images and deliver modern formats.
- [x] Add repeatable image optimization command for future assets.
- [x] Defer third-party widget loading.
- [x] Add immutable cache headers for static assets.
- [x] Add route-specific structured data.

---

## 8) Validation Log

Use this section after each deployment.

### Deployment checklist
- [x] `npm run build` completes (no prerender hang)
- [x] `dist` contains HTML for all indexable routes
- [x] sitemap contains all indexable routes and no non-indexable routes
- [x] unknown URL returns proper 404 behavior (not homepage 200) in local `dist` check
- [x] route source HTML has correct title, canonical, description, H1 in local verifier check
- [x] `npm run verify:live` passes against production domain

### Search Console checks
- [ ] URL Inspection passes for homepage
- [ ] URL Inspection passes for `/services`
- [ ] URL Inspection passes for `/specials`
- [ ] URL Inspection passes for each missing-service page
- [ ] Page indexing report shows decline in soft 404 / excluded anomalies

### Automation checks
- [x] GitHub Action runs live SEO verification automatically after successful production deploys
- [x] Daily scheduled live SEO verification is configured

### Notes
- 2026-03-14: Implemented route-manifest-driven sitemap/prerender pipeline, added missing indexable routes, switched prerender navigation strategy to avoid widget-related hangs, and added app-level `*` NotFound page with `noindex`.
- 2026-03-14: `npm run build` passes with prerender verification; hosting configs were updated to remove catch-all SPA rewrites so unknown URLs can return 404 (deployment validation still required).
- 2026-03-14: Replaced key JS-only navigation cards/buttons with crawlable links on `ServicesPage`, `InteriorPaintingPage`, `ExteriorPaintingPage`, and landing service CTAs.
- 2026-03-14: Reduced homepage heading conflict by changing the second hero heading from `<h1>` to `<h2>`.
- 2026-03-14: Updated `ServicePage` SEO description logic to use `service.seoDescription` first, then service description, then generic fallback.
- 2026-03-14: Removed catch-all SPA fallback rewrites from `firebase.json` and `netlify.toml`; prerender now includes `/admin`, `/cart`, `/checkout`, and `/404` so known utility routes still serve static HTML with `noindex`.
- 2026-03-14: `verify-prerender` now explicitly checks unknown URL behavior (`/non-existent-test-url-12345` must return 404 in static output).
- 2026-03-14: Deferred BidClips widget load until interaction/idle and skipped it in local/headless contexts by replacing static script/iframe injection in `index.html`.
- 2026-03-14: Added route-level code splitting with `React.lazy` + `Suspense` in `src/home.tsx`; initial main JS chunk dropped substantially but still needs further vendor chunk splitting.
- 2026-03-14: Added Firebase hosting cache headers for `/assets/**` and common image extensions to improve repeat-load performance and CWV.
- 2026-03-14: Added Vite `manualChunks` split for `react` and `firebase` vendor code in `vite.config.ts`, eliminating the single oversized app bundle.
- 2026-03-14: Added route-specific JSON-LD (`Service` + `BreadcrumbList`) to `ServicePage` and confirmed it appears in prerendered HTML.
- 2026-03-14: Further split Firebase into `firestore`, `auth`, `storage`, and core vendor chunks to remove remaining >500KB warning.
- 2026-03-14: Deferred homepage Firestore imports to runtime (`LandingPage` inquiry submit) so Firebase is no longer eagerly required at initial render.
- 2026-03-14: Added route-specific JSON-LD (`Service` + `BreadcrumbList`) to `LocationPage` and confirmed in prerendered location HTML.
- 2026-03-14: Performed initial image optimization pass with recompression and targeted downscaling on heavy assets; reduced >1MB across key hero/gallery images.
- 2026-03-14: Converted heavily referenced PNGs to JPEG for runtime delivery:
  - `gallery/gbp-work-1-after` (~1,019,838B -> ~106,501B)
  - `gallery/gbp-work-2-after` (~1,203,023B -> ~132,211B)
  - `services/drywall-repair/...project-overview` (~807,997B -> ~85,573B)
- 2026-03-14: Removed obsolete replaced PNG files from `public/` after reference migration to avoid shipping duplicate heavy assets in production.
- 2026-03-14: Additional WebP migration on referenced heavy assets:
  - `/exterior.jpeg` -> `/exterior.webp`
  - `/services/fence/739...jpg` -> `/services/fence/739...webp`
  - `/services/garage/garage2.jpeg` -> `/services/garage/garage2.webp`
  - `/gallery/gbp-work-{5,7,12}-before.jpeg` -> `.webp`
  - `/bc3b5c629ebb79ac398492a345c50337.jpg` -> `.webp`
- 2026-03-14: Manual chunk splitting now removes Vite >500KB warnings in local build output.
- 2026-03-14: Prerendered metadata audit over all indexable routes confirms no missing title/description/canonical tags and no duplicate titles/descriptions.
- 2026-03-14: Added server-level `X-Robots-Tag: noindex, nofollow` headers for `/admin*`, `/cart*`, and `/checkout*` in both Firebase and Netlify configs.
- 2026-03-14: Added `npm run optimize:images` (`scripts/optimize_images.py`) for repeatable large-image compression/downscaling during future content updates.
- 2026-03-14: Latest optimizer run processed 27 files and reduced payload by ~1,222,662 bytes; followed by a successful full `npm run build` (sitemap + Vite + prerender + verify).
- 2026-03-14: Local static serving check now confirms `/services/` returns `200` and `/non-existent-test-url-12345` returns `404` (production re-check still required post-deploy).
- 2026-03-14: Extended `scripts/verify-prerender.mjs` to enforce non-empty `<title>`, meta description, canonical, hreflang, and single `<h1>` on indexable pages; local verification now passes.
- 2026-03-14: Live-site spot check still shows old production behavior (not yet reflecting local fixes): `/non-existent-test-url-12345` returns `200`, `/services` redirects (`301`), and sampled deep routes still expose homepage canonical/title.
- 2026-03-14: Added `npm run verify:live` (`scripts/verify-live-seo.mjs`) to test all indexable routes for HTTP 200, canonical/title/description correctness, and unknown-route 404 on the deployed domain.
- 2026-03-14: Current production baseline fails `verify:live` (44 issues): route canonical mismatches across indexable URLs plus unknown-route 200 behavior, consistent with stale/old production output.
- 2026-03-14: Normalized canonical URL format to trailing slash for non-root routes in `SEO.tsx`, sitemap generation, and prerender verification to match static-host URL behavior.
- 2026-03-14: Updated `verify:live` redirect handling to follow one expected slash-normalization redirect and then validate final-page canonical/metadata; failures now isolate true production canonical/indexing problems.
- 2026-03-14: Post-deploy live verification now passes: `npm run verify:live` reports all 44 indexable routes valid on `https://gtabudgetpainting.ca`.
- 2026-03-14: Confirmed utility routes return `X-Robots-Tag: noindex, nofollow` and cache headers on `/assets/*` are `public, max-age=31536000, immutable`.
- 2026-03-14: Added `.github/workflows/seo-live-verification.yml` to run `npm run verify:live` automatically after successful main deploy workflows and daily on schedule (with retry window for CDN propagation).
- 2026-03-14: Implemented SEO Top-10 optimization items 1-3 (`/services/`, `/specials/`, and `drywall-repair`) with updated metadata/headings and SEO-specific service title/H1 support; `npm run build` and `npm run verify:live` both pass after changes.
- 2026-03-15: Implemented SEO Top-10 optimization items 4-6 (`stucco-ceiling-removal`, `bathroom-vanity-cabinet`, `driveway-sealing`) using `seoTitle`/`seoH1`/`seoDescription` + service-specific H2 subheadings; `npm run build`, `npm run verify:prerender`, and `npm run verify:live` pass.
- 2026-03-15: Implemented SEO Top-10 optimization items 7-10 via city-specific metadata/H1 overrides in `LocationPage.tsx` for Toronto, Mississauga, Brampton, and North York; build/prerender/live verification pass after update.
