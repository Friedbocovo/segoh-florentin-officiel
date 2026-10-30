import { FormEvent, useState } from 'react';
import { ArrowUpRight, Edit3, Plus, Trash2, X } from 'lucide-react';
import type { SiteSection } from '@/types';
import { DataService, isSupabaseConfigured, isUuid } from '@/lib/supabase';
import { PAGE_REGISTRY, getSection, type MetaFieldDef, type SectionDef, type SectionField } from '@/lib/pageSections';
import { plain } from '@/lib/richText';
import CloudinaryUploader from '@/components/common/CloudinaryUploader';

interface AdminSectionsProps {
  sections: SiteSection[];
  onRefresh: () => void;
  onFlashNotice: (msg: string) => void;
}

const FIELD_LABELS: Record<SectionField, string> = {
  eyebrow: 'Sur-titre (petite ligne au-dessus du titre)',
  title: 'Titre',
  content: 'Texte',
  image: 'Image',
  button: 'Bouton',
};

export default function AdminSections({ sections, onRefresh, onFlashNotice }: AdminSectionsProps) {
  const [activePage, setActivePage] = useState(PAGE_REGISTRY[0].page);
  const [editing, setEditing] = useState<{ section: SiteSection; def: SectionDef } | null>(null);

  const page = PAGE_REGISTRY.find((p) => p.page === activePage) ?? PAGE_REGISTRY[0];

  return (
    <div className="admin-module-view">
      <div className="admin-header-row">
        <div>
          <p className="kicker"><span /> Contenus des pages</p>
          <h1>Pages & Sections</h1>
        </div>
        <a className="button button-light" href={page.path} target="_blank" rel="noopener noreferrer">
          <span>Voir la page « {page.label} »</span>
          <ArrowUpRight size={15} />
        </a>
      </div>

      <div className="subtabs-bar">
        {PAGE_REGISTRY.map((p) => (
          <button
            key={p.page}
            className={`subtab-btn ${p.page === activePage ? 'active' : ''}`}
            onClick={() => setActivePage(p.page)}
          >
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      <div className="sections-cards-list">
        {page.sections.map((def) => {
          const sec = getSection(sections, page.page, def.key);
          // Section jamais enregistrée : le site affiche son texte par défaut
          const isDefault = isSupabaseConfigured && !isUuid(sec.id);
          const preview = plain(sec.title) || plain(String((def.meta?.[0] && def.meta[0].label) || ''));
          return (
            <div key={def.key} className="section-row-card">
              <div className="sec-info">
                <span className="sec-tag">{def.label}</span>
                {sec.eyebrow && def.fields.includes('eyebrow') && <small className="sec-btn-preview">{sec.eyebrow}</small>}
                <h3>{preview || '(Sans titre)'}</h3>
                {sec.content && def.fields.includes('content') && (
                  <p>{sec.content.slice(0, 130)}{sec.content.length > 130 ? '…' : ''}</p>
                )}
                {sec.button_label && def.fields.includes('button') && (
                  <small className="sec-btn-preview">Bouton : « {sec.button_label} » → {sec.button_url}</small>
                )}
              </div>
              <div className="sec-actions">
                {isDefault ? (
                  <span className="status-pill" title="Pas encore personnalisée : le texte par défaut est affiché">
                    Texte par défaut
                  </span>
                ) : (
                  <span className={`status-pill ${sec.is_published ? 'published' : 'draft'}`}>
                    {sec.is_published ? 'Visible' : 'Masqué'}
                  </span>
                )}
                <button className="button button-dark" onClick={() => setEditing({ section: sec, def })}>
                  <Edit3 size={15} />
                  <span>{isDefault ? 'Personnaliser' : 'Modifier'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {editing && (
        <SectionEditorModal
          section={editing.section}
          def={editing.def}
          pageLabel={page.label}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            onFlashNotice('Section enregistrée.');
            onRefresh();
          }}
        />
      )}
    </div>
  );
}

function SectionEditorModal({
  section,
  def,
  pageLabel,
  onClose,
  onSaved,
}: {
  section: SiteSection;
  def: SectionDef;
  pageLabel: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({ ...section, meta: { ...(section.meta || {}) } });
  const [saving, setSaving] = useState(false);
  const label = (field: SectionField) => def.labels?.[field] || FIELD_LABELS[field];
  const has = (field: SectionField) => def.fields.includes(field);

  function setMeta(key: string, value: unknown) {
    setForm((f) => ({ ...f, meta: { ...f.meta, [key]: value } }));
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      // Listes à une ligne par élément : on retire les lignes vides
      const meta = { ...form.meta };
      for (const m of def.meta ?? []) {
        if (m.type === 'lines' && Array.isArray(meta[m.key])) {
          meta[m.key] = (meta[m.key] as string[]).map((x) => x.trim()).filter(Boolean);
        }
      }
      await DataService.saveSection({ ...form, meta });
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="content-modal large-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <p className="kicker"><span /> Page « {pageLabel} »</p>
            <h2>{def.label}</h2>
          </div>
          <button onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSave} className="styled-modal-form">
          {has('eyebrow') && (
            <label>
              {label('eyebrow')}
              <input value={form.eyebrow} onChange={(e) => setForm({ ...form, eyebrow: e.target.value })} />
            </label>
          )}

          {has('title') && (
            <label>
              {label('title')}
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <small className="cloudinary-help-text">
                Astuces : *mot* s’affiche en italique doré ; une barre verticale ( | ) force un retour à la ligne.
              </small>
            </label>
          )}

          {has('content') && (
            <label>
              {label('content')}
              <textarea rows={5} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
            </label>
          )}

          {(def.meta ?? []).map((m) => (
            <MetaEditor key={m.key} def={m} value={form.meta[m.key]} onChange={(v) => setMeta(m.key, v)} />
          ))}

          {has('image') && (
            <CloudinaryUploader
              label={label('image')}
              currentUrl={form.image_url}
              mediaType="image"
              folder="mc-florentin/sections"
              accept="image/*"
              onChange={({ url }) => setForm({ ...form, image_url: url })}
              onRemove={() => setForm({ ...form, image_url: null })}
            />
          )}

          {has('button') && (
            <div className="form-two">
              <label>
                Texte du bouton
                <input value={form.button_label} onChange={(e) => setForm({ ...form, button_label: e.target.value })} />
              </label>
              <label>
                Lien du bouton
                <input
                  value={form.button_url}
                  onChange={(e) => setForm({ ...form, button_url: e.target.value })}
                  placeholder="/contact"
                />
              </label>
            </div>
          )}

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

/** Champ complémentaire d'une section : texte, liste de lignes ou liste d'éléments. */
function MetaEditor({ def, value, onChange }: { def: MetaFieldDef; value: unknown; onChange: (v: unknown) => void }) {
  if (def.type === 'text' || def.type === 'textarea') {
    const text = typeof value === 'string' ? value : '';
    return (
      <label>
        {def.label}
        {def.type === 'text' ? (
          <input value={text} onChange={(e) => onChange(e.target.value)} placeholder={def.placeholder} />
        ) : (
          <textarea rows={4} value={text} onChange={(e) => onChange(e.target.value)} placeholder={def.placeholder} />
        )}
      </label>
    );
  }

  if (def.type === 'lines') {
    const lines = Array.isArray(value) ? (value as string[]) : [];
    return (
      <label>
        {def.label}
        <textarea rows={Math.max(4, lines.length + 1)} value={lines.join('\n')} onChange={(e) => onChange(e.target.value.split('\n'))} />
      </label>
    );
  }

  if (def.type !== 'list') return null;

  const items = Array.isArray(value) ? (value as Record<string, string>[]) : [];
  const update = (index: number, name: string, v: string) =>
    onChange(items.map((item, i) => (i === index ? { ...item, [name]: v } : item)));
  const empty = Object.fromEntries(def.item.map((f) => [f.name, '']));

  return (
    <div className="meta-list-editor">
      <span className="meta-list-title">{def.label}</span>
      {items.map((item, index) => (
        <div key={index} className="meta-item-card">
          <div className="meta-item-fields">
            <span className="meta-item-index">{def.itemLabel} {index + 1}</span>
            {def.item.map((field) => (
              <label key={field.name} className="meta-field">
                {field.label}
                {field.multiline ? (
                  <textarea rows={3} value={item[field.name] || ''} onChange={(e) => update(index, field.name, e.target.value)} />
                ) : (
                  <input value={item[field.name] || ''} onChange={(e) => update(index, field.name, e.target.value)} />
                )}
              </label>
            ))}
          </div>
          {!def.fixedCount && (
            <button
              type="button"
              className="action-icon-btn danger"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              title={`Retirer ce ${def.itemLabel}`}
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      ))}
      {!def.fixedCount && (
        <button type="button" className="button button-light btn-sm" onClick={() => onChange([...items, empty])}>
          <Plus size={14} /> <span>Ajouter un {def.itemLabel}</span>
        </button>
      )}
    </div>
  );
}
