import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  type?: string;
  name?: string;
}

export default function SEO({ 
  title, 
  description, 
  canonical,
  type = 'website', 
  name = 'GTA Budget Painting' 
}: SEOProps) {
  const siteUrl = 'https://gtabudgetpainting.ca';
  const fullUrl = canonical ? (canonical.startsWith('http') ? canonical : `${siteUrl}${canonical}`) : siteUrl;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name='description' content={description} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph tags (Facebook, LinkedIn) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={name} />
      <meta property="og:url" content={fullUrl} />
      
      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content={type === 'article' ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {/* Structured Data (Schema.org) - Local Business */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HomeAndConstructionBusiness",
          "name": "GTA Budget Painting",
          "image": "https://gtabudgetpainting.ca/logo.png",
          "description": "Specialized division of GTA Home Painting for small residential projects. Affordable, quick turnaround painting services in Toronto and the GTA.",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Toronto",
            "addressRegion": "ON",
            "addressCountry": "CA"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "43.6532",
            "longitude": "-79.3832"
          },
          "url": "https://gtabudgetpainting.ca",
          "telephone": "+1-647-390-7181",
          "priceRange": "$$",
          "openingHoursSpecification": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
              ],
              "opens": "08:00",
              "closes": "20:00"
            }
          ],
          "areaServed": [
            { "@type": "City", "name": "Toronto" },
            { "@type": "City", "name": "North York" },
            { "@type": "City", "name": "Etobicoke" },
            { "@type": "City", "name": "Scarborough" },
            { "@type": "City", "name": "Vaughan" },
            { "@type": "City", "name": "Richmond Hill" },
            { "@type": "City", "name": "Markham" },
            { "@type": "City", "name": "Mississauga" },
            { "@type": "City", "name": "Brampton" },
            { "@type": "City", "name": "Oakville" },
            { "@type": "City", "name": "Burlington" },
            { "@type": "City", "name": "Milton" },
            { "@type": "City", "name": "Caledon" },
            { "@type": "City", "name": "Thornhill" },
            { "@type": "City", "name": "Woodbridge" },
            { "@type": "City", "name": "Maple" },
            { "@type": "City", "name": "York" },
            { "@type": "City", "name": "East York" },
            { "@type": "City", "name": "Downtown Toronto" }
          ],
          "parentOrganization": {
            "@type": "LocalBusiness",
            "name": "GTA Home Painting",
            "url": "https://gtahomepainting.ca"
          }
        })}
      </script>
    </Helmet>
  );
}

