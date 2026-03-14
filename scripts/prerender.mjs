import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import puppeteer from 'puppeteer';
import { getPrerenderRoutes, toCanonicalUrl } from './route-manifest.mjs';

const DIST_DIR = path.resolve('dist');
const PORT = process.env.PRERENDER_PORT ? Number(process.env.PRERENDER_PORT) : 4173;
const BASE_URL = process.env.PRERENDER_BASE_URL ?? `http://127.0.0.1:${PORT}`;

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

function routeToOutputFile(routePath) {
  if (routePath === '/' || routePath === '') return path.join(DIST_DIR, 'index.html');
  const cleaned = routePath.startsWith('/') ? routePath.slice(1) : routePath;
  return path.join(DIST_DIR, cleaned, 'index.html');
}

async function ensureDirForFile(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function createPrerenderPage(browser) {
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(60_000);
  await page.setRequestInterception(true);
  page.on('request', request => {
    if (/bidclips\.com/i.test(request.url())) {
      request.abort().catch(() => {
        // ignore
      });
      return;
    }
    request.continue().catch(() => {
      // ignore
    });
  });
  return page;
}

async function renderRouteHtml(browser, route, attempts = 3) {
  const url = `${BASE_URL}${route}`;
  const expectedCanonical = toCanonicalUrl(route);
  let lastError = null;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const page = await createPrerenderPage(browser);
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45_000 });
      await page.waitForFunction(
        expected => {
          if (document.readyState !== 'complete') return false;
          const canonical = document.querySelector('link[rel="canonical"]');
          if (!canonical) return false;
          if (canonical.getAttribute('href') !== expected) return false;
          const root = document.getElementById('root');
          if (!root) return false;
          return !root.innerHTML.includes('route-loading');
        },
        { timeout: 30_000 },
        expectedCanonical,
      );
      return await page.content();
    } catch (error) {
      lastError = error;
      // eslint-disable-next-line no-console
      console.warn(`Prerender retry ${attempt}/${attempts} failed for ${route}`);
      await new Promise(r => setTimeout(r, 250 * attempt));
    } finally {
      await page.close();
    }
  }

  const reason = lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(`Prerender failed for ${route}: ${reason}`);
}

async function main() {
  const routes = getPrerenderRoutes();

  if (routes.length === 0) {
    throw new Error('No prerender routes found in route manifest');
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
      for (const route of routes) {
        const html = await renderRouteHtml(browser, route);
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
