# Top 10 SEO Page Optimization Plan

Date: 2026-03-14
Goal: improve ranking on pages with highest business/search intent after indexing completion.

## 1) /services/
- Priority: P1
- Status: Done (implemented 2026-03-14)
- File: `src/pages/ServicesPage.tsx`
- Replace title with:
  - `House Painting Services in Toronto & GTA | Free Quotes`
- Replace meta description with:
  - `Affordable interior, exterior, and custom house painting services across Toronto and the GTA. Fast turnaround, transparent pricing, and free estimates.`
- Replace H1 with:
  - `Affordable House Painting Services in Toronto & GTA`
- Add H2 under hero subtitle:
  - `Interior, Exterior, and Custom Painting for Small Residential Jobs`

## 2) /specials/
- Priority: P1
- Status: Done (implemented 2026-03-14)
- File: `src/pages/SpecialsPage.tsx`
- Replace title with:
  - `Painting Specials in Toronto & GTA | Limited-Time Packages`
- Replace meta description with:
  - `Save on bundled interior painting packages in Toronto and the GTA. See current limited-time offers, pricing, and what's included.`
- Replace H1 with:
  - `Painting Specials and Package Deals in Toronto & GTA`
- Replace H2 "Current Deals" with:
  - `Current Painting Offers`

## 3) /services/interior-painting/drywall-repair/
- Priority: P1
- Status: Done (implemented 2026-03-14)
- File: `src/data/services.ts` (entry id: `drywall-repair`)
- Set `seoTitle` to:
  - `Drywall Repair in Toronto & GTA`
- Set `seoH1` to:
  - `Drywall Repair in Toronto & GTA`
- Replace `seoDescription` with:
  - `Need drywall repair in Toronto or the GTA? We fix holes, cracks, dents, and water-damaged walls, then prepare surfaces for a smooth paint-ready finish. Fast scheduling and free quotes.`
- In `src/pages/ServicePage.tsx`, add H2 below the H1 (for all services via conditional map):
  - `Patch, Sand, Prime, and Paint-Ready Wall Repairs`

## 4) /services/interior-painting/stucco-ceiling-removal/
- Priority: P1
- Status: Done (implemented 2026-03-15)
- File: `src/data/services.ts` (entry id: `stucco-ceiling-removal`)
- Set `seoTitle` to:
  - `Popcorn Ceiling Removal in Toronto & GTA`
- Set `seoH1` to:
  - `Popcorn Ceiling Removal in Toronto & GTA`
- Replace `seoDescription` with:
  - `Professional popcorn ceiling removal in Toronto and the GTA. We remove textured ceilings and deliver clean, smooth, modern finishes ready for painting.`
- Add H2 in `src/pages/ServicePage.tsx` (service-specific conditional):
  - `Dust-Controlled Ceiling Removal and Smooth Finishing`

## 5) /services/interior-painting/bathroom-vanity-cabinet/
- Priority: P1
- Status: Done (implemented 2026-03-15)
- File: `src/data/services.ts` (entry id: `bathroom-vanity-cabinet`)
- Set `seoTitle` to:
  - `Bathroom Vanity Painting in Toronto & GTA`
- Set `seoH1` to:
  - `Bathroom Vanity Painting in Toronto & GTA`
- Replace `seoDescription` with:
  - `Refresh your bathroom vanity cabinets in Toronto and the GTA without full replacement. Durable cabinet painting with smooth, moisture-resistant finishes and fast turnaround.`
- Add H2 in `src/pages/ServicePage.tsx` (service-specific conditional):
  - `Cabinet Refinishing That Looks New Without Renovation Cost`

## 6) /services/exterior-painting/driveway-sealing/
- Priority: P1
- Status: Done (implemented 2026-03-15)
- File: `src/data/services.ts` (entry id: `driveway-sealing`)
- Set `seoTitle` to:
  - `Driveway Sealing in Toronto & GTA`
- Set `seoH1` to:
  - `Driveway Sealing in Toronto & GTA`
- Replace `seoDescription` with:
  - `Protect your asphalt driveway in Toronto and the GTA with professional sealing. Prevent cracking, fading, salt damage, and water penetration with clean-edged sealcoat application.`
- Add H2 in `src/pages/ServicePage.tsx` (service-specific conditional):
  - `Extend Asphalt Life With Professional Sealcoating`

## 7) /painters-toronto/
- Priority: P1
- Status: Done (implemented 2026-03-15)
- File: `src/pages/LocationPage.tsx` (city-specific SEO override map)
- Set title to:
  - `Toronto Painters for Small Jobs | Affordable House Painting`
- Set meta description to:
  - `Looking for affordable painters in Toronto? We handle small residential painting jobs for condos, apartments, and homes with fast turnaround and free quotes.`
- Set H1 to:
  - `Affordable Painters in Toronto for Small Residential Jobs`

## 8) /painters-mississauga/
- Priority: P1
- Status: Done (implemented 2026-03-15)
- File: `src/pages/LocationPage.tsx` (city-specific SEO override map)
- Set title to:
  - `Mississauga Painters for Small Jobs | Affordable House Painting`
- Set meta description to:
  - `Need painters in Mississauga for a small residential project? We provide interior and exterior painting with quick scheduling, fair pricing, and free estimates.`
- Set H1 to:
  - `Affordable Painters in Mississauga for Small Residential Jobs`

## 9) /painters-brampton/
- Priority: P1
- Status: Done (implemented 2026-03-15)
- File: `src/pages/LocationPage.tsx` (city-specific SEO override map)
- Set title to:
  - `Brampton Painters for Small Jobs | Affordable House Painting`
- Set meta description to:
  - `Affordable painters in Brampton for walls, ceilings, trim, and exterior touch-ups. Fast turnaround, professional results, and free quotes for small residential jobs.`
- Set H1 to:
  - `Affordable Painters in Brampton for Small Residential Jobs`

## 10) /painters-north-york/
- Priority: P1
- Status: Done (implemented 2026-03-15)
- File: `src/pages/LocationPage.tsx` (city-specific SEO override map)
- Set title to:
  - `North York Painters for Small Jobs | Affordable House Painting`
- Set meta description to:
  - `Looking for trusted painters in North York? We complete small home painting projects quickly and affordably with clean workmanship and free estimates.`
- Set H1 to:
  - `Affordable Painters in North York for Small Residential Jobs`

## Implementation notes
- Keep canonical URLs and sitemap entries in trailing-slash format to match current production behavior.
- For location pages, implement a `CITY_SEO_OVERRIDES` object in `LocationPage.tsx` so priority cities get stronger copy while non-priority cities keep template defaults.
- After applying copy changes, run:
  - `npm run build`
  - `npm run verify:prerender`
  - `npm run verify:live`

## Validation status
- 2026-03-15: All 10 page-level updates are live on production and verified via `npm run verify:live` plus direct metadata spot-checks on each target URL.
