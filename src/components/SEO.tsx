import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  type?: 'website' | 'article';
  siteName?: string;
  image?: string;
  imageAlt?: string;
  robots?: string;
}

export default function SEO({ 
  title, 
  description, 
  canonical,
  type = 'website', 
  siteName = 'GTA Budget Painting',
  image,
  imageAlt,
  robots
}: SEOProps) {
  const siteUrl = 'https://gtabudgetpainting.ca';
  const location = useLocation();

  const normalizeCanonicalPath = (inputPath: string) => {
    const withLeadingSlash = inputPath.startsWith('/') ? inputPath : `/${inputPath}`;
    if (withLeadingSlash === '/') return '/';
    return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
  };

  const canonicalPath = canonical ?? location.pathname;
  const fullUrl = canonicalPath.startsWith('http')
    ? (() => {
        try {
          const parsed = new URL(canonicalPath);
          parsed.pathname = normalizeCanonicalPath(parsed.pathname);
          parsed.search = '';
          parsed.hash = '';
          return parsed.toString();
        } catch {
          return canonicalPath;
        }
      })()
    : `${siteUrl}${normalizeCanonicalPath(canonicalPath)}`;

  const imageUrl = (() => {
    if (!image) return `${siteUrl}/logo.png`;
    return image.startsWith('http') ? image : `${siteUrl}${image.startsWith('/') ? image : `/${image}`}`;
  })();
  const resolvedImageAlt =
    imageAlt ?? `${siteName} - budget-friendly painters with fast turnaround in the Greater Toronto Area`;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name='description' content={description} />
      <link rel="canonical" href={fullUrl} />
      {robots && <meta name="robots" content={robots} />}
      <link rel="alternate" hrefLang="en-CA" href={fullUrl} />
      <link rel="alternate" hrefLang="x-default" href={fullUrl} />

      {/* Open Graph tags (Facebook, LinkedIn) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={resolvedImageAlt} />
      <meta property="og:locale" content="en_CA" />
      
      {/* Twitter tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={resolvedImageAlt} />
    </Helmet>
  );
}
