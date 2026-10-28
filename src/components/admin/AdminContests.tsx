import { FormEvent, useState } from 'react';
import {
  ArrowLeft, ArrowUpRight, Check, Edit3, Plus, Search, Trash2, Trophy, Users, X
} from 'lucide-react';
import type { Contest, ContestResult } from '@/types';
import { DataService, images } from '@/lib/supabase';
import CloudinaryUploader from '@/components/common/CloudinaryUploader';

interface AdminContestsProps {
  contests: Contest[];
  onRefresh: () => void;
  onFlashNotice: (msg: string) => void;
}

export default function AdminContests({ contests, onRefresh, onFlashNotice }: AdminContestsProps) {
  const [search, setSearch] = useState('');
  const [editingContest, setEditingContest] = useState<Contest | null>(null);
  const [managingResultsContest, setManagingResultsContest] = useState<Contest | null>(null);
  const [editingResult, setEditingResult] = useState<ContestResult | null>(null);

  const filtered = contests.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase()) ||
      c.edition.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDeleteContest(id: string, name: string) {
    if (!window.confirm(`Confirmer la suppression définitive du concours "${name}" et de tous ses résultats associés ?`)) {
      return;
    }
    await DataService.deleteContest(id);
    onFlashNotice('Concours supprimé avec succès.');
    onRefresh();
  }

  return (
    <div className="admin-module-view">
      <div className="admin-header-row">
        <div>
          <p className="kicker"><span /> Pôle Compétition</p>
          <h1>Catalogue des Concours & Palmarès</h1>
        </div>
        <button
          className="button button-dark"
          onClick={() =>
            setEditingContest({
              id: '',
              name: '',
              slug: '',
              edition: '2025',
              year: 2025,
              event_date: '',
              location: '',
              organizer: '',
              short_description: '',
              long_description: '',
              coach_role_description: '',
              cover_image: images.stage,
              is_featured: false,
              sort_order: contests.length + 1,
              is_published: true,
              seo_title: '',
              seo_description: '',
              results: [],
            })
          }
        >
          <Plus size={16} />
          <span>Ajouter un concours</span>
        </button>
      </div>

      {/* RECHERCHE */}
      <div className="admin-toolbar">
        <Search size={17} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom de concours, ville, édition..."
        />
      </div>

      {/* TABLEAU DES CONCOURS */}
      <div className="admin-table-wrapper">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Affiche</th>
              <th>Nom du concours</th>
              <th>Édition & Date</th>
              <th>Lieu</th>
              <th>Candidats & Résultats</th>
              <th>Statut</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8">
                  Aucun concours trouvé. Cliquez sur « Ajouter un concours » pour en créer un.
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id}>
                  <td className="table-thumb-col">
                    <img src={c.cover_image || images.stage} alt="" className="table-thumb" />
                  </td>
                  <td>
                    <strong>{c.name}</strong>
                    <span className="slug-preview">/mes-concours/{c.slug}</span>
                  </td>
                  <td>
                    <span>{c.edition}</span>
                    <small className="block text-muted">{c.event_date || `${c.year}`}</small>
                  </td>
                  <td>{c.location || '—'}</td>
                  <td>
                    <button
                      className="manage-sub-btn"
                      onClick={() => setManagingResultsContest(c)}
                      title="Gérer les candidats et titres de ce concours"
                    >
                      <Trophy size={14} />
                      <span>{c.results?.length || 0} résultat(s)</span>
                      <ArrowUpRight size={13} />
                    </button>
                  </td>
                  <td>
                    <span className={`status-pill ${c.is_published ? 'published' : 'draft'}`}>
                      {c.is_published ? 'Publié' : 'Brouillon'}
                    </span>
                  </td>
                  <td className="text-right table-actions">
                    <button
                      className="action-icon-btn"
                      onClick={() => setEditingContest(c)}
                      title="Modifier les informations du concours"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      className="action-icon-btn danger"
                      onClick={() => handleDeleteContest(c.id, c.name)}
                      title="Supprimer ce concours"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODALE D'ÉDITION DE CONCOURS */}
      {editingContest && (
        <ContestEditorModal
          contest={editingContest}
          onClose={() => setEditingContest(null)}
          onSaved={() => {
            setEditingContest(null);
            onFlashNotice('Concours enregistré avec succès.');
            onRefresh();
          }}
        />
      )}

      {/* MODALE DE GESTION DES RÉSULTATS / CANDIDATS D'UN CONCOURS */}
      {managingResultsContest && (
        <ResultsManagerModal
          contest={managingResultsContest}
          onClose={() => setManagingResultsContest(null)}
          onEditResult={(res) => setEditingResult(res)}
          onFlashNotice={onFlashNotice}
          onRefresh={async () => {
            onRefresh();
            const updatedContests = await DataService.getContests();
            const current = updatedContests.find((c) => c.id === managingResultsContest.id);
            if (current) setManagingResultsContest(current);
          }}
        />
      )}

      {/* SOUS-MODALE D'ÉDITION D'UN RÉSULTAT */}
      {editingResult && managingResultsContest && (
        <ResultEditorModal
          contestId={managingResultsContest.id}
          result={editingResult}
          onClose={() => setEditingResult(null)}
          onSaved={async () => {
            setEditingResult(null);
            onFlashNotice('Résultat du candidat enregistré.');
            onRefresh();
            const updatedContests = await DataService.getContests();
            const current = updatedContests.find((c) => c.id === managingResultsContest.id);
            if (current) setManagingResultsContest(current);
          }}
        />
      )}
    </div>
  );
}

// MODALE D'ÉDITION DE CONCOURS
function ContestEditorModal({
  contest,
  onClose,
  onSaved,
}: {
  contest: Contest;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({ ...contest });
  const [saving, setSaving] = useState(false);

  // Auto-génération de slug si vide
  function handleNameChange(name: string) {
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    setForm((f) => ({
      ...f,
      name,
      slug: f.slug && f.id ? f.slug : `${slug}-${f.edition.toLowerCase()}`,
    }));
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await DataService.saveContest(form);
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
            <p className="kicker"><span /> Édition Concours</p>
            <h2>{form.id ? `Modifier « ${form.name} »` : 'Nouveau Concours'}</h2>
          </div>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSave} className="styled-modal-form">
          <div className="form-two">
            <label>
              Nom du concours *
              <input
                required
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ex: Miss Élégance France"
              />
            </label>
            <label>
              Slug URL (ex: /mes-concours/mon-concours-2025) *
              <input
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="miss-elegance-france-2025"
              />
            </label>
          </div>

          <div className="form-three">
            <label>
              Édition *
              <input
                required
                value={form.edition}
                onChange={(e) => setForm({ ...form, edition: e.target.value })}
                placeholder="Ex: 2025 ou Édition 12"
              />
            </label>
            <label>
              Année
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
              />
            </label>
            <label>
              Date de l’événement
              <input
                value={form.event_date}
                onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                placeholder="Ex: 14 Octobre 2025"
              />
            </label>
          </div>

          <div className="form-two">
            <label>
              Lieu / Ville
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Ex: Paris, Strasbourg..."
              />
            </label>
            <label>
              Comité / Organisateur
              <input
                value={form.organizer}
                onChange={(e) => setForm({ ...form, organizer: e.target.value })}
                placeholder="Ex: Comité Miss Élégance"
              />
            </label>
          </div>

          <CloudinaryUploader
            label="Affiche ou photographie de couverture du concours"
            currentUrl={form.cover_image}
            mediaType="image"
            folder="couronne-toque/concours"
            accept="image/*"
            onChange={({ url }) => setForm({ ...form, cover_image: url })}
            onRemove={() => setForm({ ...form, cover_image: null })}
            helpText="Photo de couverture du concours stockée sur Cloudinary."
          />

          <label>
            Description courte (affichée sur la carte du catalogue) *
            <textarea
              rows={2}
              required
              value={form.short_description}
              onChange={(e) => setForm({ ...form, short_description: e.target.value })}
              placeholder="Résumé percutant du concours et de l'accompagnement..."
            />
          </label>

          <label>
            Rôle précis de coach lors de cet événement
            <textarea
              rows={2}
              value={form.coach_role_description}
              onChange={(e) => setForm({ ...form, coach_role_description: e.target.value })}
              placeholder="Ex: Préparation scénique des 5 finalistes, travail d’éloquence et gestion du trac..."
            />
          </label>

          <label>
            Récit détaillé de l’édition (page complète)
            <textarea
              rows={4}
              value={form.long_description}
              onChange={(e) => setForm({ ...form, long_description: e.target.value })}
              placeholder="Détails des semaines de préparation, ambiance de l'élection..."
            />
          </label>

          <div className="form-two">
            <label>
              Statut de publication
              <select
                value={form.is_published ? 'published' : 'draft'}
                onChange={(e) => setForm({ ...form, is_published: e.target.value === 'published' })}
              >
                <option value="published">Publié (accessible publiquement)</option>
                <option value="draft">Brouillon (masqué du site public)</option>
              </select>
            </label>
            <label className="checkbox-wrap-label">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
              />
              <span>Mettre en avant sur la page d’accueil</span>
            </label>
          </div>

          <div className="seo-sub-box">
            <h4>Référencement naturel (SEO) de ce concours</h4>
            <label>
              Titre SEO personnalisé
              <input
                value={form.seo_title}
                onChange={(e) => setForm({ ...form, seo_title: e.target.value })}
                placeholder="Titre balise <title> (facultatif)"
              />
            </label>
            <label>
              Méta-description SEO
              <textarea
                rows={2}
                value={form.seo_description}
                onChange={(e) => setForm({ ...form, seo_description: e.target.value })}
                placeholder="Description pour les résultats Google (facultatif)"
              />
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="button button-light" onClick={onClose}>
              Annuler
            </button>
            <button className="button button-dark" disabled={saving}>
              {saving ? 'Enregistrement...' : 'Enregistrer le concours'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// MODALE DE GESTION DES RÉSULTATS / CANDIDATS
function ResultsManagerModal({
  contest,
  onClose,
  onEditResult,
  onFlashNotice,
  onRefresh,
}: {
  contest: Contest;
  onClose: () => void;
  onEditResult: (res: ContestResult) => void;
  onFlashNotice: (msg: string) => void;
  onRefresh: () => void;
}) {
  const results = contest.results || [];

  async function handleDeleteResult(resId: string, name: string) {
    if (!window.confirm(`Supprimer la distinction attribuée à ${name} ?`)) return;
    await DataService.deleteContestResult(contest.id, resId);
    onFlashNotice('Résultat supprimé.');
    onRefresh();
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="content-modal large-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <p className="kicker"><span /> Palmarès Candidats</p>
            <h2>Résultats pour « {contest.name} ({contest.edition}) »</h2>
          </div>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <div className="results-manager-body">
          <div className="mb-4 flex justify-between items-center">
            <p className="text-muted text-sm">
              Ajoutez les lauréats accompagnés, leurs photos officielles et les titres obtenus (Miss, Mister, Dauphin, Dauphine, Ambassadeur, etc.).
            </p>
            <button
              className="button button-dark"
              onClick={() =>
                onEditResult({
                  id: '',
                  contest_id: contest.id,
                  candidate_name: '',
                  candidate_photo: images.candidate1,
                  title_won: '',
                  category: 'Miss',
                  rank_position: 1,
                  coaching_mention: 'Accompagnement Couronne & Toque',
                  description: '',
                  sort_order: results.length + 1,
                })
              }
            >
              <Plus size={15} />
              <span>Nouveau candidat primé</span>
            </button>
          </div>

          {results.length === 0 ? (
            <div className="empty-results-box my-6">
              <Trophy size={32} />
              <p>Aucun résultat enregistré pour ce concours.</p>
            </div>
          ) : (
            <div className="results-list-table">
              {results.map((r) => (
                <div key={r.id} className="result-row-item">
                  <img src={r.candidate_photo || images.portrait} alt="" className="cand-thumb" />
                  <div className="cand-details">
                    <span className="cand-category">{r.category}</span>
                    <h4>{r.candidate_name}</h4>
                    <strong className="cand-title-won">🏆 {r.title_won}</strong>
                    {r.coaching_mention && <small className="cand-mention">{r.coaching_mention}</small>}
                  </div>
                  <div className="row-actions">
                    <button className="action-icon-btn" onClick={() => onEditResult(r)}>
                      <Edit3 size={15} />
                    </button>
                    <button
                      className="action-icon-btn danger"
                      onClick={() => handleDeleteResult(r.id, r.candidate_name)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="button button-dark" onClick={onClose}>
            Terminé
          </button>
        </div>
      </div>
    </div>
  );
}

// SOUS-MODALE FORMULAIRE D'UN RÉSULTAT CANDIDAT
function ResultEditorModal({
  contestId,
  result,
  onClose,
  onSaved,
}: {
  contestId: string;
  result: ContestResult;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({ ...result });
  const [saving, setSaving] = useState(false);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await DataService.saveContestResult(contestId, form);
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1100 }}>
      <div className="content-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <p className="kicker"><span /> Distinction Candidat</p>
            <h2>{form.id ? 'Modifier la distinction' : 'Ajouter un candidat lauréat'}</h2>
          </div>
          <button onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSave} className="styled-modal-form">
          <div className="form-two">
            <label>
              Nom complet du candidat / de la candidate *
              <input
                required
                value={form.candidate_name}
                onChange={(e) => setForm({ ...form, candidate_name: e.target.value })}
                placeholder="Ex: Camille Laurent"
              />
            </label>
            <label>
              Catégorie *
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as any })}
              >
                <option value="Miss">Miss</option>
                <option value="Mister">Mister</option>
                <option value="Dauphine">Dauphine</option>
                <option value="Dauphin">Dauphin</option>
                <option value="Ambassadrice">Ambassadrice</option>
                <option value="Ambassadeur">Ambassadeur</option>
                <option value="Spécial">Distinction spéciale / Prix du jury</option>
                <option value="Autre">Autre catégorie</option>
              </select>
            </label>
          </div>

          <label>
            Titre exact obtenu *
            <input
              required
              value={form.title_won}
              onChange={(e) => setForm({ ...form, title_won: e.target.value })}
              placeholder="Ex: Miss Élégance Grand Est 2024, 1ère Dauphine, Mister Régional..."
            />
          </label>

          <CloudinaryUploader
            label="Portrait / Photo officielle du candidat"
            currentUrl={form.candidate_photo}
            mediaType="image"
            folder="couronne-toque/candidats"
            accept="image/*"
            onChange={({ url }) => setForm({ ...form, candidate_photo: url })}
            onRemove={() => setForm({ ...form, candidate_photo: null })}
            helpText="Photo du lauréat téléversée sur Cloudinary."
          />

          <label>
            Mention de votre accompagnement
            <input
              value={form.coaching_mention}
              onChange={(e) => setForm({ ...form, coaching_mention: e.target.value })}
              placeholder="Ex: Accompagnement complet (scène & interview)"
            />
          </label>

          <label>
            Commentaire ou description du parcours (facultatif)
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Progrès remarquables sur scène, réaction du jury..."
            />
          </label>

          <div className="modal-actions">
            <button type="button" className="button button-light" onClick={onClose}>
              Annuler
            </button>
            <button className="button button-dark" disabled={saving}>
              {saving ? 'Enregistrement...' : 'Enregistrer le résultat'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
