import fs from 'node:fs/promises';
import path from 'node:path';
import { getSitemapEntries, toCanonicalUrl } from './route-manifest.mjs';

const PUBLIC_DIR = path.resolve('public');
const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap.xml');

function buildSitemapXml() {
  const entries = getSitemapEntries();
  const urlNodes = entries
    .map(
      entry => `  <url>
    <loc>${toCanonicalUrl(entry.path)}</loc>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlNodes}
</urlset>
`;
}

async function main() {
  const xml = buildSitemapXml();
  await fs.mkdir(PUBLIC_DIR, { recursive: true });
  await fs.writeFile(SITEMAP_PATH, xml, 'utf8');
  // eslint-disable-next-line no-console
  console.log(`Generated sitemap: ${path.relative(process.cwd(), SITEMAP_PATH)}`);
}

main().catch(err => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
