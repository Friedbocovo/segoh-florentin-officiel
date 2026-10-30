import { FormEvent, useEffect, useRef, useState } from 'react';
import { AlertCircle, Check, Edit3, Loader2, Plus, RotateCcw, Search, Trash2, UploadCloud, Video, X } from 'lucide-react';
import type { Contest, MediaItem, SiteSettings } from '@/types';
import { DataService } from '@/lib/supabase';
import { getCloudinaryConfig, uploadToCloudinary } from '@/lib/cloudinary';
import CloudinaryUploader from '@/components/common/CloudinaryUploader';

type MediaCategory = MediaItem['category'];

const CATEGORY_OPTIONS: { value: MediaCategory; label: string }[] = [
  { value: 'galerie', label: 'Galerie générale' },
  { value: 'coaching', label: 'Coaching Miss & Mister' },
  { value: 'jury', label: 'Jury de concours' },
  { value: 'gastronomie', label: 'Gastronomie' },
  { value: 'concours', label: 'Concours & Événements' },
];

/** « defile-robe_soiree.jpg » → « defile robe soiree » */
const titleFromFilename = (name: string) => name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').trim();

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
  const [bulkOpen, setBulkOpen] = useState(false);
  const nextSortOrder = Math.max(0, ...media.map((m) => m.sort_order || 0)) + 1;

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
        <div className="admin-header-actions">
          <button
            className="button button-light"
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
                sort_order: nextSortOrder,
                is_published: true,
              })
            }
          >
            <Plus size={16} />
            <span>Ajouter un média</span>
          </button>
          <button className="button button-dark" onClick={() => setBulkOpen(true)}>
            <UploadCloud size={16} />
            <span>Importer plusieurs fichiers</span>
          </button>
        </div>
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

      {/* MODALE D'IMPORT GROUPÉ */}
      {bulkOpen && (
        <BulkUploadModal
          startOrder={nextSortOrder}
          contests={contests}
          settings={settings}
          onClose={() => setBulkOpen(false)}
          onUploaded={(count) => {
            if (count > 0) onFlashNotice(`${count} média${count > 1 ? 's' : ''} ajouté${count > 1 ? 's' : ''} à la bibliothèque.`);
            onRefresh();
          }}
        />
      )}

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
                onChange={(e) => setForm({ ...form, category: e.target.value as MediaCategory })}
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </label>
          </div>

          <CloudinaryUploader
            label="Fichier média (Photo ou Vidéo) *"
            currentUrl={form.url}
            thumbnailUrl={form.thumbnail_url}
            mediaType={form.media_type}
            folder={`mc-florentin/${form.category || 'galerie'}`}
            settings={settings}
            onChange={({ url, thumbnailUrl, mediaType, originalFilename }) => {
              setForm((prev) => ({
                ...prev,
                url,
                thumbnail_url: thumbnailUrl || url,
                media_type: mediaType,
                title: prev.title || (originalFilename ? titleFromFilename(originalFilename) : ''),
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
              folder="mc-florentin/video-posters"
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

/* --------------------------------------------------------------------------
   IMPORT GROUPÉ : plusieurs photos / vidéos en une fois
   -------------------------------------------------------------------------- */
const MAX_IMAGE_MB = 25;
const MAX_VIDEO_MB = 100;
const PARALLEL_UPLOADS = 3;

type BulkFile = {
  key: string;
  file: File;
  kind: 'image' | 'video';
  preview: string | null;
  status: 'pending' | 'uploading' | 'done' | 'error';
  progress: number;
  error?: string;
  /** Faux pour un fichier refusé d'office (format, poids) : inutile de réessayer */
  retryable: boolean;
};

function BulkUploadModal({
  startOrder,
  contests,
  settings,
  onClose,
  onUploaded,
}: {
  startOrder: number;
  contests: Contest[];
  settings?: SiteSettings;
  onClose: () => void;
  onUploaded: (count: number) => void;
}) {
  const [category, setCategory] = useState<MediaCategory>('galerie');
  const [contestId, setContestId] = useState('');
  const [publish, setPublish] = useState(true);
  const [files, setFiles] = useState<BulkFile[]>([]);
  const [running, setRunning] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const config = getCloudinaryConfig(settings);

  // Libère les aperçus locaux à la fermeture
  const filesRef = useRef(files);
  filesRef.current = files;
  useEffect(() => () => filesRef.current.forEach((f) => f.preview && URL.revokeObjectURL(f.preview)), []);

  function addFiles(list: FileList | null) {
    if (!list?.length) return;
    const added: BulkFile[] = Array.from(list).map((file, i) => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const kind = isVideo ? 'video' : 'image';
      const maxMb = isVideo ? MAX_VIDEO_MB : MAX_IMAGE_MB;
      const error = !isImage && !isVideo
        ? 'Format non pris en charge'
        : file.size > maxMb * 1024 * 1024
          ? `Trop lourd : ${maxMb} Mo maximum`
          : undefined;
      return {
        key: `${Date.now()}-${i}-${file.name}`,
        file,
        kind,
        preview: isImage && !error ? URL.createObjectURL(file) : null,
        status: error ? 'error' : 'pending',
        progress: 0,
        error,
        retryable: false,
      };
    });
    setFiles((prev) => [...prev, ...added]);
  }

  function patch(key: string, changes: Partial<BulkFile>) {
    setFiles((prev) => prev.map((f) => (f.key === key ? { ...f, ...changes } : f)));
  }

  function removeFile(key: string) {
    setFiles((prev) => {
      const target = prev.find((f) => f.key === key);
      if (target?.preview) URL.revokeObjectURL(target.preview);
      return prev.filter((f) => f.key !== key);
    });
  }

  async function startUpload() {
    const queue = files.filter((f) => f.status === 'pending');
    if (!queue.length || !config.isConfigured) return;
    setRunning(true);

    let next = 0;
    let order = startOrder;
    let uploaded = 0;
    // Enregistrements l'un après l'autre (les envois, eux, partent en parallèle)
    let saveChain: Promise<unknown> = Promise.resolve();

    async function worker() {
      while (next < queue.length) {
        const item = queue[next++];
        const sortOrder = order++;
        patch(item.key, { status: 'uploading', progress: 0, error: undefined });
        try {
          const res = await uploadToCloudinary(item.file, {
            cloudName: config.cloudName,
            uploadPreset: config.uploadPreset,
            folder: `mc-florentin/${category}`,
            onProgress: (progress) => patch(item.key, { progress }),
          });
          const url = res.secure_url || res.url;
          const title = titleFromFilename(res.original_filename || item.file.name);
          const save = saveChain.then(() =>
            DataService.saveMedia({
              id: '',
              title,
              media_type: res.resource_type === 'video' ? 'video' : 'image',
              url,
              thumbnail_url: res.thumbnail_url || url,
              alt_text: title,
              caption: '',
              category,
              contest_id: contestId || null,
              sort_order: sortOrder,
              is_published: publish,
            })
          );
          saveChain = save.catch(() => undefined);
          await save;
          uploaded += 1;
          patch(item.key, { status: 'done', progress: 100 });
        } catch (err) {
          const message = err instanceof Error ? err.message : '';
          patch(item.key, { status: 'error', error: message || 'Échec de l’envoi', retryable: true });
        }
      }
    }

    await Promise.all(Array.from({ length: Math.min(PARALLEL_UPLOADS, queue.length) }, worker));
    setRunning(false);
    onUploaded(uploaded);
  }

  function retryFailed() {
    setFiles((prev) =>
      prev.map((f) => (f.status === 'error' && f.retryable ? { ...f, status: 'pending', progress: 0, error: undefined } : f))
    );
  }

  const count = (status: BulkFile['status']) => files.filter((f) => f.status === status).length;
  const pending = count('pending');
  const done = count('done');
  const retryable = files.filter((f) => f.status === 'error' && f.retryable).length;
  const active = files.filter((f) => f.status !== 'error' || f.retryable).length;
  const close = () => !running && onClose();

  return (
    <div className="modal-backdrop" onClick={close}>
      <div className="content-modal large-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <p className="kicker"><span /> Médiathèque</p>
            <h2>Importer plusieurs fichiers</h2>
          </div>
          <button onClick={close} disabled={running} aria-label="Fermer"><X size={18} /></button>
        </div>

        <div className="styled-modal-form">
          <div className="form-two">
            <label>
              Catégorie de tous les fichiers
              <select value={category} onChange={(e) => setCategory(e.target.value as MediaCategory)} disabled={running}>
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </label>
            <label>
              Lier à un concours (facultatif)
              <select value={contestId} onChange={(e) => setContestId(e.target.value)} disabled={running}>
                <option value="">(Aucun concours lié)</option>
                {contests.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.edition})</option>
                ))}
              </select>
            </label>
          </div>

          <label className="checkbox-wrap-label">
            <input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} disabled={running} />
            <span>Publier directement dans la galerie publique</span>
          </label>

          {!config.isConfigured && (
            <div className="cloudinary-error-box">
              <AlertCircle size={16} />
              <span>Cloudinary n’est pas configuré : renseignez-le dans les Réglages avant d’importer des fichiers.</span>
            </div>
          )}

          <div
            className={`cloudinary-dropzone ${dragging ? 'is-dragging' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              addFiles(e.dataTransfer.files);
            }}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
            role="button"
            tabIndex={0}
          >
            <div className="dropzone-icon-circle">
              <UploadCloud size={28} />
            </div>
            <div className="dropzone-text">
              <p className="dropzone-primary">
                <strong>Choisissez plusieurs photos ou vidéos</strong> ou glissez-les ici
              </p>
              <p className="dropzone-secondary">
                Sélection multiple avec Ctrl / Maj · Images {MAX_IMAGE_MB} Mo, vidéos {MAX_VIDEO_MB} Mo maximum
              </p>
            </div>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = '';
            }}
          />

          {files.length > 0 && (
            <>
              <div className="bulk-summary">
                <span>{files.length} fichier{files.length > 1 ? 's' : ''}</span>
                <span>{done} / {active} envoyé{done > 1 ? 's' : ''}</span>
              </div>
              <ul className="bulk-file-list">
                {files.map((f) => (
                  <li key={f.key} className={`bulk-file is-${f.status}`}>
                    <span className="bulk-thumb">
                      {f.preview ? <img src={f.preview} alt="" /> : <Video size={18} />}
                    </span>
                    <span className="bulk-info">
                      <strong title={f.file.name}>{f.file.name}</strong>
                      {f.status === 'uploading' ? (
                        <span className="cloudinary-progress-bar-wrap">
                          <span className="cloudinary-progress-bar-fill" style={{ width: `${f.progress}%` }} />
                        </span>
                      ) : (
                        <small>
                          {f.status === 'error'
                            ? f.error
                            : f.status === 'done'
                              ? 'Ajouté à la bibliothèque'
                              : `${(f.file.size / 1024 / 1024).toFixed(1)} Mo · en attente`}
                        </small>
                      )}
                    </span>
                    <span className="bulk-state">
                      {f.status === 'uploading' && <><Loader2 size={16} className="spin-animate" /> {f.progress}%</>}
                      {f.status === 'done' && <Check size={17} />}
                      {f.status === 'error' && <AlertCircle size={17} />}
                      {(f.status === 'pending' || (f.status === 'error' && !running)) && (
                        <button type="button" className="action-icon-btn" onClick={() => removeFile(f.key)} aria-label="Retirer">
                          <X size={14} />
                        </button>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="modal-actions">
            {retryable > 0 && !running && (
              <button type="button" className="button button-light" onClick={retryFailed}>
                <RotateCcw size={15} />
                <span>Réessayer les échecs ({retryable})</span>
              </button>
            )}
            <button type="button" className="button button-light" onClick={close} disabled={running}>
              {done > 0 && pending === 0 ? 'Terminer' : 'Fermer'}
            </button>
            <button
              type="button"
              className="button button-dark"
              onClick={startUpload}
              disabled={running || pending === 0 || !config.isConfigured}
            >
              {running ? (
                <>
                  <Loader2 size={15} className="spin-animate" />
                  <span>Envoi en cours…</span>
                </>
              ) : (
                <>
                  <UploadCloud size={15} />
                  <span>Envoyer {pending > 0 ? `${pending} fichier${pending > 1 ? 's' : ''}` : ''}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
