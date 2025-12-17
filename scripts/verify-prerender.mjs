import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';

const SITE_URL = 'https://gtabudgetpainting.ca';
const DIST_DIR = path.resolve('dist');
const PORT = process.env.VERIFY_PORT ? Number(process.env.VERIFY_PORT) : 4174;
const BASE_URL = `http://127.0.0.1:${PORT}`;

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

function routeToDistIndex(routePath) {
  if (routePath === '/' || routePath === '') return path.join(DIST_DIR, 'index.html');
  const cleaned = routePath.startsWith('/') ? routePath.slice(1) : routePath;
  return path.join(DIST_DIR, cleaned, 'index.html');
}

function extractPathsFromSitemapXml(xml) {
  const re = /<loc>([^<]+)<\/loc>/g;
  const paths = [];
  let m;
  while ((m = re.exec(xml)) !== null) {
    const loc = m[1].trim();
    try {
      const u = new URL(loc);
      if (u.origin !== new URL(SITE_URL).origin) continue;
      paths.push(u.pathname);
    } catch {
      // ignore
    }
  }
  return [...new Set(paths)];
}

function isProbablyPrerendered(html) {
  // If we served the plain SPA shell, root is empty.
  // If prerendered, root contains lots of markup, often including header/footer.
  const rootMatch = html.match(/<div\s+id="root"[^>]*>([\s\S]*?)<\/div>/i);
  if (!rootMatch) return false;
  const inner = rootMatch[1].trim();
  if (!inner) return false;
  // Heuristics: presence of common app markup
  return /<header\b|<footer\b|<main\b|class="header"|class="footer"/i.test(inner);
}

function expectedCanonical(pathname) {
  const p = pathname === '/' ? '/' : pathname;
  return `${SITE_URL}${p}`;
}

function hasCanonicalForRoute(html, pathname) {
  const expected = expectedCanonical(pathname);
  // Helmet inserts <link rel="canonical" href="..." data-rh="true">
  return new RegExp(`<link\\s+rel=\"canonical\"\\s+href=\"${expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\"`, 'i').test(html);
}

function hasHreflangForRoute(html, pathname) {
  const expected = expectedCanonical(pathname);
  const reEn = new RegExp(`<link\\s+rel=\"alternate\"[^>]*hreflang=\"en-CA\"[^>]*href=\"${expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\"`, 'i');
  const reXd = new RegExp(`<link\\s+rel=\"alternate\"[^>]*hreflang=\"x-default\"[^>]*href=\"${expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\"`, 'i');
  return reEn.test(html) && reXd.test(html);
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    redirect: 'follow',
    headers: { 'User-Agent': 'prerender-verify/1.0' },
  });
  return { status: res.status, html: await res.text() };
}

function createStaticServer(rootDir) {
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? '/', 'http://localhost');
      let pathname = decodeURIComponent(url.pathname);
      if (!pathname.startsWith('/')) pathname = `/${pathname}`;

      // Map URL to file path:
      // / -> /index.html
      // /foo -> /foo/index.html (directory index)
      // /foo/ -> /foo/index.html
      // /assets/x.js -> /assets/x.js
      const hasExt = path.extname(pathname) !== '';
      const candidates = [];
      if (pathname === '/') {
        candidates.push(path.join(rootDir, 'index.html'));
      } else if (hasExt) {
        candidates.push(path.join(rootDir, pathname));
      } else {
        const withoutTrailing = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
        candidates.push(path.join(rootDir, `${withoutTrailing}/index.html`));
      }

      let filePath = null;
      for (const c of candidates) {
        if (await exists(c)) {
          filePath = c;
          break;
        }
      }

      if (!filePath) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end('Not Found');
        return;
      }

      const buf = await fs.readFile(filePath);
      const isHtml = filePath.endsWith('.html');
      res.statusCode = 200;
      res.setHeader('Content-Type', isHtml ? 'text/html; charset=utf-8' : 'application/octet-stream');
      res.end(buf);
    } catch (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end(`Server error: ${err instanceof Error ? err.message : String(err)}`);
    }
  });

  return server;
}

async function main() {
  const sitemapPath = (await exists(path.join(DIST_DIR, 'sitemap.xml')))
    ? path.join(DIST_DIR, 'sitemap.xml')
    : path.resolve('public', 'sitemap.xml');

  const sitemapXml = await fs.readFile(sitemapPath, 'utf8');
  const routes = extractPathsFromSitemapXml(sitemapXml)
    .filter(p => !['/admin', '/cart', '/checkout'].some(prefix => p === prefix || p.startsWith(`${prefix}/`)));

  if (routes.length === 0) {
    throw new Error(`No routes found in sitemap: ${sitemapPath}`);
  }

  // 1) Verify the files exist + contain expected tags
  const fileFailures = [];
  for (const route of routes) {
    const outFile = routeToDistIndex(route);
    if (!(await exists(outFile))) {
      fileFailures.push(`${route}: missing ${path.relative(process.cwd(), outFile)}`);
      continue;
    }
    const html = await fs.readFile(outFile, 'utf8');
    if (!isProbablyPrerendered(html)) fileFailures.push(`${route}: dist HTML does not look prerendered`);
    if (!hasCanonicalForRoute(html, route)) fileFailures.push(`${route}: dist HTML missing/incorrect canonical`);
    if (!hasHreflangForRoute(html, route)) fileFailures.push(`${route}: dist HTML missing hreflang tags`);
  }
  if (fileFailures.length > 0) {
    throw new Error(`Prerender file verification failed (showing first 20):\n- ${fileFailures.slice(0, 20).join('\n- ')}`);
  }

  // 2) Verify a static server would actually serve those files at the route URLs
  const server = createStaticServer(DIST_DIR);
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(PORT, '127.0.0.1', resolve);
  });

  try {
    const failures = [];
    for (const route of routes) {
      const variants = route === '/' ? ['/'] : [route, `${route.replace(/\/$/, '')}/`];
      for (const v of variants) {
        const url = `${BASE_URL}${v}`;
        const { status, html } = await fetchHtml(url);
        if (status !== 200) {
          failures.push(`${v}: expected 200, got ${status}`);
          continue;
        }
        const canonicalPath = v.endsWith('/') && v !== '/' ? v.slice(0, -1) : v;
        if (!isProbablyPrerendered(html)) failures.push(`${v}: served HTML does not look prerendered`);
        if (!hasCanonicalForRoute(html, canonicalPath)) failures.push(`${v}: missing/incorrect canonical for ${canonicalPath}`);
        if (!hasHreflangForRoute(html, canonicalPath)) failures.push(`${v}: missing hreflang tags for ${canonicalPath}`);
      }
    }
    if (failures.length > 0) {
      throw new Error(`Prerender server verification failed (showing first 20):\n- ${failures.slice(0, 20).join('\n- ')}`);
    }
  } finally {
    server.close();
  }
}

main().catch(err => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
