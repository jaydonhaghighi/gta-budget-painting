import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import puppeteer from 'puppeteer';

const SITE_URL = 'https://gtabudgetpainting.ca';
const DIST_DIR = path.resolve('dist');
const PORT = process.env.PRERENDER_PORT ? Number(process.env.PRERENDER_PORT) : 4173;
const BASE_URL = process.env.PRERENDER_BASE_URL ?? `http://127.0.0.1:${PORT}`;

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function waitForHttpOk(url, timeoutMs = 60_000) {
  const start = Date.now();
  // Node 18+ has global fetch
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const res = await fetch(url, { redirect: 'follow' });
      if (res.ok) return;
    } catch {
      // ignore
    }
    if (Date.now() - start > timeoutMs) {
      throw new Error(`Timed out waiting for server at ${url}`);
    }
    await new Promise(r => setTimeout(r, 500));
  }
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
      // ignore malformed
    }
  }

  const unique = [...new Set(paths)];
  return unique.filter(p => !['/admin', '/cart', '/checkout'].some(prefix => p === prefix || p.startsWith(`${prefix}/`)));
}

function routeToOutputFile(routePath) {
  if (routePath === '/' || routePath === '') return path.join(DIST_DIR, 'index.html');
  const cleaned = routePath.startsWith('/') ? routePath.slice(1) : routePath;
  return path.join(DIST_DIR, cleaned, 'index.html');
}

async function ensureDirForFile(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function main() {
  const sitemapPath = (await exists(path.join(DIST_DIR, 'sitemap.xml')))
    ? path.join(DIST_DIR, 'sitemap.xml')
    : path.resolve('public', 'sitemap.xml');

  const sitemapXml = await fs.readFile(sitemapPath, 'utf8');
  const routes = extractPathsFromSitemapXml(sitemapXml);

  if (routes.length === 0) {
    throw new Error(`No routes found in sitemap: ${sitemapPath}`);
  }

  // Start a local preview server for dist
  const preview = spawn(
    process.platform === 'win32' ? 'npm.cmd' : 'npm',
    ['run', 'preview', '--', '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'],
    { stdio: 'inherit' },
  );

  try {
    await waitForHttpOk(`${BASE_URL}/`);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(60_000);

      for (const route of routes) {
        const url = `${BASE_URL}${route}`;
        await page.goto(url, { waitUntil: 'networkidle0' });

        // Give Helmet a beat to flush tags in case of late effects
        await page.waitForFunction(() => document.readyState === 'complete');

        const html = await page.content();
        const outFile = routeToOutputFile(route);
        await ensureDirForFile(outFile);
        await fs.writeFile(outFile, html, 'utf8');
      }

      // Optional: keep the root index as-is for base route; already covered by '/'
      // Nothing else to do.
    } finally {
      await browser.close();
    }
  } finally {
    preview.kill('SIGTERM');
  }
}

main().catch(err => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
