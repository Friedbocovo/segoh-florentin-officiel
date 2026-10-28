import { FormEvent, useState } from 'react';
import { Check, Copy, Download, Eye, Globe, Sparkles } from 'lucide-react';
import type { Article, Contest, SiteSettings } from '@/types';
import { DataService } from '@/lib/supabase';
import { generateSitemapXML } from '@/lib/seo';
import CloudinaryUploader from '@/components/common/CloudinaryUploader';

interface AdminSEOProps {
  settings: SiteSettings;
  contests: Contest[];
  articles: Article[];
  onSaved: (s: SiteSettings) => void;
  onFlashNotice: (msg: string) => void;
}

export default function AdminSEO({
  settings,
  contests,
  articles,
  onSaved,
  onFlashNotice,
}: AdminSEOProps) {
  const [form, setForm] = useState({ ...settings });
  const [saving, setSaving] = useState(false);
  const [copiedSitemap, setCopiedSitemap] = useState(false);

  const contestSlugs = contests.filter((c) => c.is_published).map((c) => c.slug);
  const articleSlugs = articles.filter((a) => a.is_published).map((a) => a.slug);
  const sitemapXML = generateSitemapXML(window.location.origin, contestSlugs, articleSlugs);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    let updated;
    try {
      updated = await DataService.updateSettings(form);
    } finally {
      setSaving(false);
    }
    onSaved(updated);
    onFlashNotice('Réglages SEO enregistrés.');
  }

  function handleCopySitemap() {
    navigator.clipboard.writeText(sitemapXML);
    setCopiedSitemap(true);
    setTimeout(() => setCopiedSitemap(false), 2500);
  }

  function handleDownloadSitemap() {
    const blob = new Blob([sitemapXML], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="admin-module-view">
      <div className="admin-header-row">
        <div>
          <p className="kicker"><span /> Référencement Naturel</p>
          <h1>Paramètres SEO & Sitemap</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
        {/* FORMULAIRE SEO GLOBAL */}
        <form onSubmit={handleSave} className="styled-form seo-form-box">
          <h3>Balises SEO Globales</h3>
          <p className="text-muted text-xs mb-4">
            Ces informations sont utilisées par Google et les réseaux sociaux lorsque la page ne dispose pas de balises spécifiques.
          </p>

          <label>
            Titre du site par défaut (&lt;title&gt;) *
            <input
              required
              value={form.default_title}
              onChange={(e) => setForm({ ...form, default_title: e.target.value })}
            />
          </label>

          <label>
            Méta-description par défaut (&lt;meta name="description"&gt;) *
            <textarea
              required
              rows={3}
              value={form.default_description}
              onChange={(e) => setForm({ ...form, default_description: e.target.value })}
            />
          </label>

          <CloudinaryUploader
            label="Image de partage social OpenGraph (affichée sur WhatsApp, Facebook, LinkedIn)"
            currentUrl={form.default_og_image}
            mediaType="image"
            folder="couronne-toque/seo"
            accept="image/*"
            onChange={({ url }) => setForm({ ...form, default_og_image: url })}
            onRemove={() => setForm({ ...form, default_og_image: '' })}
            helpText="Format recommandé : 1200 × 630 px. Stockée sur votre CDN Cloudinary."
          />

          <button className="button button-dark mt-4" disabled={saving}>
            {saving ? 'Enregistrement...' : 'Enregistrer le SEO global'}
          </button>
        </form>

        {/* APERÇU GOOGLE EN DIRECT */}
        <div className="google-preview-box">
          <div className="flex items-center gap-2 mb-3">
            <Eye size={17} className="text-red" />
            <h3 className="font-semibold text-sm">Aperçu du résultat Google (SERP)</h3>
          </div>
          <div className="google-snippet-card">
            <div className="google-url-row">
              <span className="google-favicon">👑</span>
              <div className="google-site-name">
                <span>{form.site_name}</span>
                <span className="google-breadcrumbs">{window.location.origin}</span>
              </div>
            </div>
            <h4 className="google-title">{form.default_title || 'Titre de votre page...'}</h4>
            <p className="google-desc">
              {form.default_description || 'Votre description apparaîtra ici dans les résultats des moteurs de recherche.'}
            </p>
          </div>

          {/* SITEMAP XML */}
          <div className="sitemap-card mt-6 p-4 bg-white rounded border">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Globe size={16} />
                <strong>Sitemap XML dynamique</strong>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="button btn-sm button-light"
                  onClick={handleCopySitemap}
                >
                  <Copy size={13} />
                  <span>{copiedSitemap ? 'Copié !' : 'Copier'}</span>
                </button>
                <button
                  type="button"
                  className="button btn-sm button-dark"
                  onClick={handleDownloadSitemap}
                >
                  <Download size={13} />
                  <span>Télécharger</span>
                </button>
              </div>
            </div>
            <p className="text-xs text-muted mb-2">
              {11 + contestSlugs.length + articleSlugs.length} URLs indexables prêtes pour Google Search Console.
            </p>
            <textarea
              readOnly
              rows={4}
              value={sitemapXML}
              className="text-xs font-mono bg-paper p-2 w-full rounded border text-muted"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
