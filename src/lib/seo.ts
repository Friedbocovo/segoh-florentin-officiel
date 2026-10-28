export type SEOMetadata = {
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonical?: string;
  noIndex?: boolean;
};

const SITE_URL: string = (import.meta.env.VITE_SITE_URL || '').replace(/\/+$/, '');

/** URL canonique absolue d'un chemin, si VITE_SITE_URL est défini. */
export function canonicalUrl(pathname: string): string | undefined {
  if (!SITE_URL) return undefined;
  return `${SITE_URL}${pathname === '/' ? '' : pathname.replace(/\/+$/, '')}`;
}

export function updateSEO({
  title,
  description,
  ogImage,
  ogType = 'website',
  canonical,
  noIndex = false,
}: SEOMetadata) {
  // Title
  if (title) {
    document.title = title;
    updateMeta('property', 'og:title', title);
    updateMeta('name', 'twitter:title', title);
  }

  // Description
  if (description) {
    updateMeta('name', 'description', description);
    updateMeta('property', 'og:description', description);
    updateMeta('name', 'twitter:description', description);
  }

  // Image
  if (ogImage) {
    updateMeta('property', 'og:image', ogImage);
    updateMeta('name', 'twitter:image', ogImage);
  }

  // Type
  updateMeta('property', 'og:type', ogType);

  // Robots
  let robotsTag = document.querySelector('meta[name="robots"]');
  if (!robotsTag) {
    robotsTag = document.createElement('meta');
    robotsTag.setAttribute('name', 'robots');
    document.head.appendChild(robotsTag);
  }
  robotsTag.setAttribute('content', noIndex ? 'noindex, nofollow' : 'index, follow');

  // Canonical
  let canonicalTag = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', canonical);
  } else if (canonicalTag) {
    canonicalTag.remove();
  }
}

function updateMeta(attrName: 'name' | 'property', attrValue: string, content: string) {
  let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

// Générateur de sitemap.xml pour le SEO
export function generateSitemapXML(baseUrl: string, contestSlugs: string[], articleSlugs: string[]): string {
  const staticUrls = [
    '',
    '/a-propos',
    '/coaching',
    '/jury',
    '/gastronomie',
    '/mes-concours',
    '/galerie',
    '/temoignages',
    '/actualites',
    '/contact',
    '/mentions-legales',
  ];

  const now = new Date().toISOString().split('T')[0];

  const urlElements = [
    ...staticUrls.map(
      (path) => `  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${path === '' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${path === '' ? '1.0' : '0.8'}</priority>
  </url>`
    ),
    ...contestSlugs.map(
      (slug) => `  <url>
    <loc>${baseUrl}/mes-concours/${slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`
    ),
    ...articleSlugs.map(
      (slug) => `  <url>
    <loc>${baseUrl}/actualites/${slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    ),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements.join('\n')}
</urlset>`;
}
