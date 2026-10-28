import { FormEvent, useState } from 'react';
import { Edit3, Eye, EyeOff, Layers, Save, X } from 'lucide-react';
import type { SiteSection } from '@/types';
import { DataService } from '@/lib/supabase';
import CloudinaryUploader from '@/components/common/CloudinaryUploader';

interface AdminSectionsProps {
  sections: SiteSection[];
  onRefresh: () => void;
  onFlashNotice: (msg: string) => void;
}

export default function AdminSections({ sections, onRefresh, onFlashNotice }: AdminSectionsProps) {
  const [editingSection, setEditingSection] = useState<SiteSection | null>(null);

  const homeSections = sections.filter((s) => s.page === 'home');
  const aboutSections = sections.filter((s) => s.page === 'about');

  return (
    <div className="admin-module-view">
      <div className="admin-header-row">
        <div>
          <p className="kicker"><span /> Contenus Fixes</p>
          <h1>Pages & Sections Administrables</h1>
        </div>
      </div>

      {/* SECTIONS PAGE ACCUEIL */}
      <div className="section-group-box">
        <h2>Page d’Accueil</h2>
        <div className="sections-cards-list">
          {homeSections.map((sec) => (
            <div key={sec.id} className="section-row-card">
              <div className="sec-info">
                <span className="sec-tag">{sec.section_key}</span>
                <h3>{sec.title || '(Sans titre)'}</h3>
                <p>{sec.content.slice(0, 110) || '(Contenu vide)'}...</p>
                {sec.button_label && (
                  <small className="sec-btn-preview">Bouton : « {sec.button_label} » → {sec.button_url}</small>
                )}
              </div>
              <div className="sec-actions">
                <span className={`status-pill ${sec.is_published ? 'published' : 'draft'}`}>
                  {sec.is_published ? 'Visible' : 'Masqué'}
                </span>
                <button
                  className="button button-dark"
                  onClick={() => setEditingSection(sec)}
                >
                  <Edit3 size={15} />
                  <span>Modifier</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTIONS PAGE À PROPOS */}
      <div className="section-group-box mt-8">
        <h2>Page « À propos »</h2>
        <div className="sections-cards-list">
          {aboutSections.map((sec) => (
            <div key={sec.id} className="section-row-card">
              <div className="sec-info">
                <span className="sec-tag">{sec.section_key}</span>
                <h3>{sec.title || '(Sans titre)'}</h3>
                <p>{sec.content.slice(0, 110) || '(Contenu vide)'}...</p>
              </div>
              <div className="sec-actions">
                <span className={`status-pill ${sec.is_published ? 'published' : 'draft'}`}>
                  {sec.is_published ? 'Visible' : 'Masqué'}
                </span>
                <button
                  className="button button-dark"
                  onClick={() => setEditingSection(sec)}
                >
                  <Edit3 size={15} />
                  <span>Modifier</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODALE D'ÉDITION DE SECTION */}
      {editingSection && (
        <SectionEditorModal
          section={editingSection}
          onClose={() => setEditingSection(null)}
          onSaved={() => {
            setEditingSection(null);
            onFlashNotice('Section mise à jour avec succès.');
            onRefresh();
          }}
        />
      )}
    </div>
  );
}

function SectionEditorModal({
  section,
  onClose,
  onSaved,
}: {
  section: SiteSection;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({ ...section });
  const [saving, setSaving] = useState(false);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await DataService.saveSection(form);
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="content-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <p className="kicker"><span /> Édition de Bloc</p>
            <h2>Modifier la section « {form.section_key} »</h2>
          </div>
          <button onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSave} className="styled-modal-form">
          <label>
            Sur-titre (Kicker)
            <input
              value={form.eyebrow}
              onChange={(e) => setForm({ ...form, eyebrow: e.target.value })}
              placeholder="Ex: Coach Miss & Mister · Jury"
            />
          </label>

          <label>
            Titre principal
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ex: Révéler l’élégance, sur scène comme à table"
            />
          </label>

          <label>
            Texte / Description de la section
            <textarea
              rows={5}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Rédigez le texte de cette section..."
            />
          </label>

          <CloudinaryUploader
            label="Image d'illustration de la section"
            currentUrl={form.image_url}
            mediaType="image"
            folder="couronne-toque/sections"
            accept="image/*"
            onChange={({ url }) => setForm({ ...form, image_url: url })}
            onRemove={() => setForm({ ...form, image_url: null })}
            helpText="Image d'ambiance ou portrait de section stocké sur Cloudinary."
          />

          <div className="form-two">
            <label>
              Texte du bouton
              <input
                value={form.button_label}
                onChange={(e) => setForm({ ...form, button_label: e.target.value })}
                placeholder="Découvrir"
              />
            </label>
            <label>
              Lien du bouton
              <input
                value={form.button_url}
                onChange={(e) => setForm({ ...form, button_url: e.target.value })}
                placeholder="/a-propos ou /contact"
              />
            </label>
          </div>

          <label className="checkbox-wrap-label">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
            />
            <span>Afficher cette section sur le site public</span>
          </label>

          <div className="modal-actions">
            <button type="button" className="button button-light" onClick={onClose}>
              Annuler
            </button>
            <button className="button button-dark" disabled={saving}>
              {saving ? 'Enregistrement...' : 'Enregistrer la section'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
