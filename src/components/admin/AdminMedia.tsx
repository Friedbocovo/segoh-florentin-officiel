import { FormEvent, useState } from 'react';
import { Cloud, Edit3, Image as ImageIcon, Play, Plus, Search, Trash2, Video, X } from 'lucide-react';
import type { Contest, MediaItem, SiteSettings } from '@/types';
import { DataService } from '@/lib/supabase';
import CloudinaryUploader from '@/components/common/CloudinaryUploader';

interface AdminMediaProps {
  media: MediaItem[];
  contests: Contest[];
  settings?: SiteSettings;
  onRefresh: () => void;
  onFlashNotice: (msg: string) => void;
}

export default function AdminMedia({
  media,
  contests,
  settings,
  onRefresh,
  onFlashNotice,
}: AdminMediaProps) {
  const [filterCat, setFilterCat] = useState('all');
  const [search, setSearch] = useState('');
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);

  const filtered = media
    .filter((m) => (filterCat === 'all' ? true : m.category === filterCat))
    .filter(
      (m) =>
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.caption.toLowerCase().includes(search.toLowerCase())
    );

  async function handleDelete(id: string) {
    if (!window.confirm('Supprimer définitivement ce média ?')) return;
    await DataService.deleteMedia(id);
    onFlashNotice('Média supprimé de la bibliothèque.');
    onRefresh();
  }

  return (
    <div className="admin-module-view">
      <div className="admin-header-row">
        <div>
          <p className="kicker"><span /> Médiathèque Centrale</p>
          <h1>Galerie & Médias Multimédias</h1>
        </div>
        <button
          className="button button-dark"
          onClick={() =>
            setEditingMedia({
              id: '',
              title: '',
              media_type: 'image',
              url: '',
              thumbnail_url: null,
              alt_text: '',
              caption: '',
              category: 'galerie',
              contest_id: null,
              sort_order: media.length + 1,
              is_published: true,
            })
          }
        >
          <Plus size={16} />
          <span>Ajouter une photo ou vidéo</span>
        </button>
      </div>

      {/* RECHERCHE ET FILTRES */}
      <div className="catalogue-toolbar">
        <div className="search-input-box">
          <Search size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par titre ou légende..."
          />
        </div>

        <div className="filter-select-wrap">
          <span>Catégorie :</span>
          <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
            <option value="all">Toutes ({media.length})</option>
            <option value="coaching">Coaching Miss & Mister</option>
            <option value="jury">Jury de concours</option>
            <option value="gastronomie">Gastronomie</option>
            <option value="concours">Concours & Événements</option>
            <option value="galerie">Galerie générale</option>
          </select>
        </div>
      </div>

      {/* GRILLE DES MÉDIAS */}
      <div className="admin-media-grid">
        {filtered.map((item) => (
          <article key={item.id} className="admin-media-card">
            <div className="admin-media-thumb">
              <img src={item.thumbnail_url || item.url} alt={item.alt_text} />
              {item.media_type === 'video' && (
                <span className="media-type-badge"><Video size={13} /> Vidéo</span>
              )}
            </div>
            <div className="admin-media-body">
              <span className="media-cat-badge">{item.category}</span>
              <h4>{item.title}</h4>
              <p className="media-caption-text">{item.caption || 'Sans légende'}</p>
              <div className="media-card-actions">
                <button className="action-icon-btn" onClick={() => setEditingMedia(item)}>
                  <Edit3 size={15} />
                </button>
                <button className="action-icon-btn danger" onClick={() => handleDelete(item.id)}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* MODALE D'ÉDITION */}
      {editingMedia && (
        <MediaEditorModal
          mediaItem={editingMedia}
          contests={contests}
          settings={settings}
          onClose={() => setEditingMedia(null)}
          onSaved={() => {
            setEditingMedia(null);
            onFlashNotice('Média enregistré avec succès.');
            onRefresh();
          }}
        />
      )}
    </div>
  );
}

function MediaEditorModal({
  mediaItem,
  contests,
  settings,
  onClose,
  onSaved,
}: {
  mediaItem: MediaItem;
  contests: Contest[];
  settings?: SiteSettings;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({ ...mediaItem });
  const [saving, setSaving] = useState(false);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await DataService.saveMedia(form);
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
            <p className="kicker"><span /> Média Multimédia</p>
            <h2>{form.id ? 'Modifier le média' : 'Ajouter un média'}</h2>
          </div>
          <button onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSave} className="styled-modal-form">
          <label>
            Titre du média *
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ex: Défilé en robe de soirée"
            />
          </label>

          <div className="form-two">
            <label>
              Type de média
              <select
                value={form.media_type}
                onChange={(e) => setForm({ ...form, media_type: e.target.value as any })}
              >
                <option value="image">Photographie</option>
                <option value="video">Vidéo</option>
              </select>
            </label>
            <label>
              Catégorie principale
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as any })}
              >
                <option value="galerie">Galerie générale</option>
                <option value="coaching">Coaching Miss & Mister</option>
                <option value="jury">Jury de concours</option>
                <option value="gastronomie">Gastronomie</option>
                <option value="concours">Concours & Événements</option>
              </select>
            </label>
          </div>

          <CloudinaryUploader
            label="Fichier média (Photo ou Vidéo) *"
            currentUrl={form.url}
            thumbnailUrl={form.thumbnail_url}
            mediaType={form.media_type}
            folder={`couronne-toque/${form.category || 'galerie'}`}
            settings={settings}
            onChange={({ url, thumbnailUrl, mediaType, originalFilename }) => {
              setForm((prev) => ({
                ...prev,
                url,
                thumbnail_url: thumbnailUrl || url,
                media_type: mediaType,
                title: prev.title ? prev.title : (originalFilename ? originalFilename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') : ''),
              }));
            }}
            onRemove={() => setForm({ ...form, url: '', thumbnail_url: null })}
            helpText="Le média sera directement téléversé et stocké sur Cloudinary avec optimisation automatique."
          />

          {form.media_type === 'video' && (
            <CloudinaryUploader
              label="Miniature personnalisée de la vidéo (Image poster optionnelle)"
              currentUrl={form.thumbnail_url}
              mediaType="image"
              folder="couronne-toque/video-posters"
              settings={settings}
              accept="image/*"
              onChange={({ url }) => setForm({ ...form, thumbnail_url: url })}
              onRemove={() => setForm({ ...form, thumbnail_url: null })}
              helpText="Si non spécifié, Cloudinary générera automatiquement une capture de la vidéo."
            />
          )}

          <label>
            Lier à un concours spécifique (facultatif)
            <select
              value={form.contest_id || ''}
              onChange={(e) => setForm({ ...form, contest_id: e.target.value || null })}
            >
              <option value="">(Aucun concours lié)</option>
              {contests.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.edition})
                </option>
              ))}
            </select>
          </label>

          <label>
            Texte alternatif (Accessibilité & SEO)
            <input
              value={form.alt_text}
              onChange={(e) => setForm({ ...form, alt_text: e.target.value })}
              placeholder="Description concise de l'image"
            />
          </label>

          <label>
            Légende affichée sous l’image
            <textarea
              rows={2}
              value={form.caption}
              onChange={(e) => setForm({ ...form, caption: e.target.value })}
              placeholder="Ex: La lauréate félicitée par le président du jury..."
            />
          </label>

          <label className="checkbox-wrap-label">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
            />
            <span>Publier dans la galerie publique</span>
          </label>

          <div className="modal-actions">
            <button type="button" className="button button-light" onClick={onClose}>Annuler</button>
            <button className="button button-dark" disabled={saving}>
              {saving ? 'Enregistrement...' : 'Enregistrer le média'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
