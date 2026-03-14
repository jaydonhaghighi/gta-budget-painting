export const SITE_URL = 'https://gtabudgetpainting.ca';

export const NON_INDEXABLE_ROUTES = ['/admin', '/cart', '/checkout'];
export const AUXILIARY_PRERENDER_ROUTES = ['/404'];

const STATIC_SITEMAP_ENTRIES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/gallery', changefreq: 'monthly', priority: '0.8' },
  { path: '/services', changefreq: 'weekly', priority: '0.9' },
  { path: '/contact-us', changefreq: 'monthly', priority: '0.8' },
  { path: '/about-us', changefreq: 'monthly', priority: '0.7' },
  { path: '/specials', changefreq: 'weekly', priority: '0.8' },
  { path: '/services/custom-painting', changefreq: 'monthly', priority: '0.7' },
  { path: '/services/interior-painting', changefreq: 'monthly', priority: '0.9' },
  { path: '/services/exterior-painting', changefreq: 'monthly', priority: '0.9' },
];

const INTERIOR_SERVICE_IDS = [
  'kitchen-walls',
  'bedroom-painting',
  'small-bathroom',
  'accent-wall',
  'ceiling',
  'interior-door',
  'trimming-baseboards',
  'stucco-ceiling-removal',
  'drywall-repair',
  'hallway-painting',
  'bathroom-vanity-cabinet',
  'stairway-painting',
];

const EXTERIOR_SERVICE_IDS = [
  'front-door',
  'garage-door',
  'fence-painting',
  'driveway-sealing',
];

const LOCATION_ROUTES = [
  '/painters-toronto',
  '/painters-north-york',
  '/painters-scarborough',
  '/painters-etobicoke',
  '/painters-mississauga',
  '/painters-brampton',
  '/painters-vaughan',
  '/painters-markham',
  '/painters-richmond-hill',
  '/painters-oakville',
  '/painters-burlington',
  '/painters-milton',
  '/painters-caledon',
  '/painters-thornhill',
  '/painters-woodbridge',
  '/painters-maple',
  '/painters-york',
  '/painters-east-york',
  '/painters-downtown-toronto',
];

function dedupeEntries(entries) {
  const seen = new Set();
  const deduped = [];
  for (const entry of entries) {
    if (seen.has(entry.path)) continue;
    seen.add(entry.path);
    deduped.push(entry);
  }
  return deduped;
}

function dedupePaths(paths) {
  return [...new Set(paths)];
}

export function toRoutePath(path) {
  if (!path || path === '/') return '/';
  const withLeadingSlash = path.startsWith('/') ? path : `/${path}`;
  return withLeadingSlash.endsWith('/') ? withLeadingSlash.slice(0, -1) : withLeadingSlash;
}

export function toCanonicalPath(path) {
  const routePath = toRoutePath(path);
  return routePath === '/' ? '/' : `${routePath}/`;
}

export function toCanonicalUrl(path) {
  return `${SITE_URL}${toCanonicalPath(path)}`;
}

function buildServiceEntries() {
  const interiorEntries = INTERIOR_SERVICE_IDS.map(serviceId => ({
    path: `/services/interior-painting/${serviceId}`,
    changefreq: 'monthly',
    priority: '0.8',
  }));

  const exteriorEntries = EXTERIOR_SERVICE_IDS.map(serviceId => ({
    path: `/services/exterior-painting/${serviceId}`,
    changefreq: 'monthly',
    priority: '0.8',
  }));

  return [...interiorEntries, ...exteriorEntries];
}

function buildLocationEntries() {
  return LOCATION_ROUTES.map(path => ({
    path,
    changefreq: 'monthly',
    priority: '0.8',
  }));
}

export function getSitemapEntries() {
  return dedupeEntries([
    ...STATIC_SITEMAP_ENTRIES,
    ...buildServiceEntries(),
    ...buildLocationEntries(),
  ]);
}

export function getIndexableRoutes() {
  return getSitemapEntries().map(entry => entry.path);
}

export function getPrerenderRoutes() {
  return dedupePaths([
    ...getIndexableRoutes(),
    ...NON_INDEXABLE_ROUTES,
    ...AUXILIARY_PRERENDER_ROUTES,
  ]);
}
