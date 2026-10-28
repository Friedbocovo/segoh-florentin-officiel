import { FormEvent, useState } from 'react';
import { Check, Cloud, Palette, Settings2 } from 'lucide-react';
import type { SiteSettings } from '@/types';
import { DataService } from '@/lib/supabase';
import CloudinaryUploader from '@/components/common/CloudinaryUploader';

interface AdminSettingsProps {
  settings: SiteSettings;
  onSaved: (s: SiteSettings) => void;
  onFlashNotice: (msg: string) => void;
}

export default function AdminSettings({
  settings,
  onSaved,
  onFlashNotice,
}: AdminSettingsProps) {
  const [form, setForm] = useState({ ...settings });
  const [saving, setSaving] = useState(false);

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
    // Applique immédiatement la couleur d'accent au document
    document.documentElement.style.setProperty('--red', updated.accent_color);
    onFlashNotice('Paramètres enregistrés avec succès.');
  }

  return (
    <div className="admin-module-view">
      <div className="admin-header-row">
        <div>
          <p className="kicker"><span /> Configuration Générale</p>
          <h1>Apparence & Paramètres du Site</h1>
        </div>
      </div>

      <form onSubmit={handleSave} className="styled-form max-w-3xl mt-6">
        {/* IDENTITÉ */}
        <div className="settings-section">
          <h3>Identité de la marque</h3>
          <div className="form-two">
            <label>
              Nom du site / Marque *
              <input
                required
                value={form.site_name}
                onChange={(e) => setForm({ ...form, site_name: e.target.value })}
              />
            </label>
            <label>
              Sous-titre / Baseline *
              <input
                required
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              />
            </label>
          </div>

          <div className="mt-4">
            <CloudinaryUploader
              label="Logo officiel du site (PNG transparent ou SVG recommandé)"
              currentUrl={form.logo_url}
              mediaType="image"
              folder="couronne-toque/branding"
              settings={form}
              onChange={({ url }) => setForm({ ...form, logo_url: url })}
              onRemove={() => setForm({ ...form, logo_url: '/logo.png' })}
              helpText="Ce logo s'affiche dans l'en-tête, le pied de page et l'administration."
            />
          </div>
        </div>

        {/* INTÉGRATION CLOUDINARY */}
        <div className="settings-section">
          <div className="flex items-center justify-between">
            <div>
              <h3>Stockage des Médias (Cloudinary)</h3>
              <p className="text-sm text-muted">
                Toutes les images et vidéos téléversées sont envoyées directement sur votre compte Cloudinary.
              </p>
            </div>
            {form.cloudinary_cloud_name && form.cloudinary_upload_preset && (
              <span className="cloudinary-badge">
                <Cloud size={13} />
                <span>Actif : {form.cloudinary_cloud_name}</span>
              </span>
            )}
          </div>

          <div className="form-two mt-3">
            <label>
              Cloud Name *
              <input
                required
                value={form.cloudinary_cloud_name || ''}
                onChange={(e) => setForm({ ...form, cloudinary_cloud_name: e.target.value })}
                placeholder="mon-cloud-name"
              />
            </label>
            <label>
              Upload Preset (Mode Unsigned) *
              <input
                required
                value={form.cloudinary_upload_preset || ''}
                onChange={(e) => setForm({ ...form, cloudinary_upload_preset: e.target.value })}
                placeholder="mon_upload_preset"
              />
            </label>
          </div>
        </div>

        {/* COORDONNÉES */}
        <div className="settings-section">
          <h3>Coordonnées professionnelles</h3>
          <div className="form-two">
            <label>
              Adresse e-mail publique de contact *
              <input
                type="email"
                required
                value={form.contact_email}
                onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
              />
            </label>
            <label>
              Numéro de téléphone d’appel
              <input
                value={form.contact_phone}
                onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
              />
            </label>
          </div>

          <div className="form-two mt-3">
            <label>
              Numéro WhatsApp de réception directe
              <input
                value={form.whatsapp_number || ''}
                onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
                placeholder="01 52 35 34 84 ou +229 01 52 35 34 84"
              />
            </label>
            <label>
              Zone géographique d’activité / Adresse
              <input
                value={form.contact_address}
                onChange={(e) => setForm({ ...form, contact_address: e.target.value })}
              />
            </label>
          </div>
        </div>

        {/* RÉSEAUX SOCIAUX */}
        <div className="settings-section">
          <h3>Réseaux sociaux officiels</h3>
          <div className="form-three">
            <label>
              Lien Instagram
              <input
                value={form.instagram_url}
                onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
                placeholder="https://instagram.com/..."
              />
            </label>
            <label>
              Lien Facebook
              <input
                value={form.facebook_url}
                onChange={(e) => setForm({ ...form, facebook_url: e.target.value })}
                placeholder="https://facebook.com/..."
              />
            </label>
            <label>
              Lien YouTube
              <input
                value={form.youtube_url}
                onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
                placeholder="https://youtube.com/..."
              />
            </label>
          </div>
        </div>

        {/* COULEUR D'ACCENT & PALETTE OFFICIELLE */}
        <div className="settings-section">
          <h3>Palette de couleurs officielle & Accent</h3>
          <p className="text-sm text-muted">
            Choisissez l’une des 6 nuances de la charte ou définissez votre propre couleur sur-mesure.
          </p>

          <div className="palette-swatches-grid mt-3">
            {[
              { name: 'Or Champagne', hex: '#8A6630', role: 'Signature recommandée' },
              { name: 'Bordeaux Velours', hex: '#6E1F2A', role: 'Profond & Classique' },
              { name: 'Émeraude', hex: '#1F4D3F', role: 'Raffiné & Naturel' },
              { name: 'Bleu Nuit', hex: '#22304F', role: 'Sobre & Institutionnel' },
              { name: 'Bronze Cuivré', hex: '#8B4A2B', role: 'Chaleur & Terroir' },
              { name: 'Encre', hex: '#17130F', role: 'Monochrome absolu' },
            ].map((swatch) => {
              const isSelected = form.accent_color.toLowerCase() === swatch.hex.toLowerCase();
              return (
                <button
                  key={swatch.hex}
                  type="button"
                  className={`palette-swatch-card ${isSelected ? 'active' : ''}`}
                  onClick={() => {
                    setForm({ ...form, accent_color: swatch.hex });
                    document.documentElement.style.setProperty('--red', swatch.hex);
                  }}
                >
                  <div
                    className="palette-swatch-color"
                    style={{ backgroundColor: swatch.hex }}
                  >
                    {isSelected && <Check size={16} className="text-white drop-shadow" />}
                  </div>
                  <div className="palette-swatch-info">
                    <span className="swatch-name">{swatch.name}</span>
                    <span className="swatch-hex font-mono">{swatch.hex}</span>
                    <span className="swatch-role">{swatch.role}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <label className="mt-4 block">
            <span className="text-sm font-semibold text-ink">Couleur personnalisée (pipette libre) :</span>
            <div className="flex items-center gap-4 mt-2">
              <input
                type="color"
                value={form.accent_color}
                onChange={(e) => {
                  setForm({ ...form, accent_color: e.target.value });
                  document.documentElement.style.setProperty('--red', e.target.value);
                }}
                className="w-12 h-10 p-1 rounded border cursor-pointer"
              />
              <span className="font-mono text-sm font-bold">{form.accent_color}</span>
              <span className="text-xs text-muted">(Appliquée instantanément aux titres, boutons et badges)</span>
            </div>
          </label>
        </div>

        {/* MENTIONS LÉGALES */}
        <div className="settings-section">
          <h3>Mentions légales courtes (Pied de page)</h3>
          <input
            value={form.legal_notice}
            onChange={(e) => setForm({ ...form, legal_notice: e.target.value })}
          />
        </div>

        <button className="button button-dark mt-6" disabled={saving}>
          <Check size={16} />
          <span>{saving ? 'Enregistrement...' : 'Enregistrer tous les réglages'}</span>
        </button>
      </form>
    </div>
  );
}
