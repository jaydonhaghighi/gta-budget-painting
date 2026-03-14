import {
  SITE_URL,
  getIndexableRoutes,
  toCanonicalPath,
  toCanonicalUrl,
  toRoutePath,
} from './route-manifest.mjs';

const LIVE_SITE_URL = process.env.SITE_URL || SITE_URL;
const UNKNOWN_PATH = '/non-existent-test-url-12345';
const REDIRECT_STATUS_CODES = new Set([301, 302, 307, 308]);

function expectedCanonical(pathname) {
  const normalized = toRoutePath(pathname);
  return toCanonicalUrl(normalized);
}

function hasNonEmptyTitle(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return Boolean(m?.[1]?.trim());
}

function hasNonEmptyMetaDescription(html) {
  const m = html.match(/<meta\s+name=\"description\"\s+content=\"([^\"]+)\"/i);
  return Boolean(m?.[1]?.trim());
}

function hasCanonicalForRoute(html, pathname) {
  const expected = expectedCanonical(pathname);
  return new RegExp(`<link\\s+rel=\"canonical\"\\s+href=\"${expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\"`, 'i').test(html);
}

async function fetchRoute(pathname) {
  const normalizedPath = (() => {
    if (!pathname || pathname === '/') return '/';
    const withLeadingSlash = pathname.startsWith('/') ? pathname : `/${pathname}`;
    return withLeadingSlash;
  })();
  const url = `${LIVE_SITE_URL}${normalizedPath}`;
  const res = await fetch(url, {
    redirect: 'manual',
    headers: { 'User-Agent': 'live-seo-verify/1.0' },
  });
  const text = await res.text();
  return {
    requestPath: normalizedPath,
    status: res.status,
    html: text,
    location: res.headers.get('location') || '',
  };
}

function resolveLocationPath(locationHeader) {
  if (!locationHeader) return '';
  try {
    return new URL(locationHeader, LIVE_SITE_URL).pathname;
  } catch {
    return '';
  }
}

async function fetchRouteForValidation(route) {
  const first = await fetchRoute(toRoutePath(route));
  const expectedPath = toCanonicalPath(route);

  if (!REDIRECT_STATUS_CODES.has(first.status) || !first.location) {
    return {
      final: first,
      redirectedToExpectedCanonical: false,
      unexpectedRedirect: false,
    };
  }

  const redirectedPath = resolveLocationPath(first.location);
  if (redirectedPath !== expectedPath) {
    return {
      final: first,
      redirectedToExpectedCanonical: false,
      unexpectedRedirect: true,
    };
  }

  const second = await fetchRoute(redirectedPath);
  return {
    final: second,
    redirectedToExpectedCanonical: true,
    unexpectedRedirect: false,
  };
}

async function main() {
  const failures = [];
  const routes = getIndexableRoutes();

  for (const route of routes) {
    const result = await fetchRouteForValidation(route);
    const { final, redirectedToExpectedCanonical, unexpectedRedirect } = result;

    if (unexpectedRedirect) {
      failures.push(
        `${route}: unexpected redirect ${final.status}${final.location ? ` -> ${final.location}` : ''}`,
      );
      continue;
    }

    if (final.status !== 200) {
      failures.push(
        `${route}: expected 200, got ${final.status}${final.location ? ` (location: ${final.location})` : ''}`,
      );
      continue;
    }

    if (!hasCanonicalForRoute(final.html, route)) {
      failures.push(`${route}: canonical does not match ${expectedCanonical(route)}`);
    }
    if (!hasNonEmptyTitle(final.html)) {
      failures.push(`${route}: missing/empty <title>`);
    }
    if (!hasNonEmptyMetaDescription(final.html)) {
      failures.push(`${route}: missing/empty meta description`);
    }

    if (redirectedToExpectedCanonical && final.requestPath !== toCanonicalPath(route)) {
      failures.push(`${route}: redirect target path mismatch (${final.requestPath})`);
    }
  }

  const unknownFirst = await fetchRoute(UNKNOWN_PATH);
  if (unknownFirst.status === 404) {
    // pass
  } else if (REDIRECT_STATUS_CODES.has(unknownFirst.status) && unknownFirst.location) {
    const redirectedPath = resolveLocationPath(unknownFirst.location);
    if (redirectedPath !== toCanonicalPath(UNKNOWN_PATH)) {
      failures.push(
        `${UNKNOWN_PATH}: unexpected redirect ${unknownFirst.status}${unknownFirst.location ? ` -> ${unknownFirst.location}` : ''}`,
      );
    } else {
      const unknownFinal = await fetchRoute(redirectedPath);
      if (unknownFinal.status !== 404) {
        failures.push(`${UNKNOWN_PATH}: expected 404 after redirect, got ${unknownFinal.status}`);
      }
    }
  } else {
    failures.push(`${UNKNOWN_PATH}: expected 404, got ${unknownFirst.status}`);
  }

  if (failures.length) {
    console.error(`Live SEO verification failed (${failures.length} issues, showing first 25):`);
    for (const f of failures.slice(0, 25)) console.error(`- ${f}`);
    process.exit(1);
  }

  console.log(`Live SEO verification passed for ${routes.length} routes on ${LIVE_SITE_URL}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
