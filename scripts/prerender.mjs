/**
 * Pré-rendu SEO exécuté après `vite build`.
 *
 * Le site est une application React rendue dans le navigateur : sans ce script,
 * toutes les URL renvoient le même index.html, donc les mêmes balises <title>,
 * description et OpenGraph (problème pour Google et surtout pour les aperçus
 * WhatsApp / Facebook qui n'exécutent pas le JavaScript).
 *
 * Ce script génère dist/<page>/index.html pour chaque page publique (y compris
 * chaque concours et article publiés dans Supabase) avec ses propres balises,
 * ainsi que dist/sitemap.xml et dist/robots.txt.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const env = loadEnv(process.env.NODE_ENV === 'development' ? 'development' : 'production', root, 'VITE_');

const siteUrl = (env.VITE_SITE_URL || '').replace(/\/+$/, '');
const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseKey = env.VITE_SUPABASE_ANON_KEY || '';
const supabaseReady = Boolean(supabaseUrl && supabaseKey && !supabaseUrl.includes('votre-projet'));

const pageMeta = JSON.parse(await readFile(join(root, 'src/lib/pageMeta.json'), 'utf8'));

async function fetchTable(table, query) {
  if (!supabaseReady) return [];
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/${table}?${query}`, {
      headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.warn(`[prerender] Lecture de ${table} impossible (${e.message}) — pages ignorées.`);
    return [];
  }
}

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const absolute = (url) => (!url || /^https?:\/\//.test(url) || !siteUrl ? url : `${siteUrl}${url.startsWith('/') ? '' : '/'}${url}`);

function setTag(html, pattern, replacement) {
  return pattern.test(html) ? html.replace(pattern, replacement) : html.replace('</head>', `    ${replacement}\n  </head>`);
}

function renderPage(template, { path, title, description, image, type = 'website' }) {
  let html = template;
  const t = escapeHtml(title);
  const d = escapeHtml(description);
  const img = escapeHtml(absolute(image));
  const canonical = siteUrl ? escapeHtml(`${siteUrl}${path === '/' ? '' : path}`) : '';

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`);
  html = setTag(html, /<meta name="description"[^>]*>/, `<meta name="description" content="${d}" />`);
  html = setTag(html, /<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${t}" />`);
  html = setTag(html, /<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${d}" />`);
  html = setTag(html, /<meta property="og:type"[^>]*>/, `<meta property="og:type" content="${type}" />`);
  if (img) html = setTag(html, /<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${img}" />`);
  if (canonical) {
    html = setTag(html, /<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${canonical}" />`);
    html = setTag(html, /<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${canonical}" />`);
  }
  return html;
}

async function writePage(path, html) {
  const file = path === '/' ? join(dist, 'index.html') : join(dist, path, 'index.html');
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
}

const template = await readFile(join(dist, 'index.html'), 'utf8');

const [settingsRows, contests, articles] = await Promise.all([
  fetchTable('site_settings', 'select=default_title,default_description,default_og_image&limit=1'),
  fetchTable('contests', 'select=slug,name,edition,short_description,seo_title,seo_description,cover_image,updated_at&is_published=eq.true'),
  fetchTable('articles', 'select=slug,title,summary,seo_title,seo_description,cover_image,updated_at&is_published=eq.true'),
]);
const settings = settingsRows[0] || {};
const defaultImage = settings.default_og_image || '/logo.png';

const pages = [
  {
    path: '/',
    title: settings.default_title || 'Couronne & Toque — Révéler l’élégance, sur scène comme à table',
    description:
      settings.default_description ||
      'Coaching Miss & Mister, jury de concours d’élégance et cuisine gastronomique d’auteur.',
    image: defaultImage,
    priority: '1.0',
  },
  ...Object.entries(pageMeta).map(([path, meta]) => ({ path, ...meta, image: defaultImage, priority: '0.8' })),
  ...contests.map((c) => ({
    path: `/mes-concours/${c.slug}`,
    title: c.seo_title || `${c.name} (${c.edition}) — Couronne & Toque`,
    description: c.seo_description || c.short_description,
    image: c.cover_image || defaultImage,
    lastmod: c.updated_at,
    priority: '0.9',
  })),
  ...articles.map((a) => ({
    path: `/actualites/${a.slug}`,
    title: a.seo_title || `${a.title} — Couronne & Toque`,
    description: a.seo_description || a.summary,
    image: a.cover_image || defaultImage,
    type: 'article',
    lastmod: a.updated_at,
    priority: '0.7',
  })),
];

for (const page of pages) {
  await writePage(page.path, renderPage(template, page));
}

if (siteUrl) {
  const today = new Date().toISOString().split('T')[0];
  const urls = pages
    .map(
      (p) => `  <url>
    <loc>${escapeHtml(`${siteUrl}${p.path === '/' ? '' : p.path}`)}</loc>
    <lastmod>${(p.lastmod || today).split('T')[0]}</lastmod>
    <priority>${p.priority}</priority>
  </url>`
    )
    .join('\n');
  await writeFile(
    join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
  );
  await writeFile(
    join(dist, 'robots.txt'),
    `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${siteUrl}/sitemap.xml\n`
  );
} else {
  console.warn('[prerender] VITE_SITE_URL absent : sitemap.xml et balises canonical non générés.');
}

console.log(
  `[prerender] ${pages.length} pages générées (${contests.length} concours, ${articles.length} articles).`
);
