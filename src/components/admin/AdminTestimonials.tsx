import { FormEvent, useState } from 'react';
import { Check, Edit3, MessageSquare, Plus, Star, ThumbsDown, ThumbsUp, Trash2, X } from 'lucide-react';
import type { Testimonial } from '@/types';
import { DataService, images } from '@/lib/supabase';
import CloudinaryUploader from '@/components/common/CloudinaryUploader';

interface AdminTestimonialsProps {
  testimonials: Testimonial[];
  onRefresh: () => void;
  onFlashNotice: (msg: string) => void;
}

export default function AdminTestimonials({
  testimonials,
  onRefresh,
  onFlashNotice,
}: AdminTestimonialsProps) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);

  const filtered = testimonials.filter((t) => (filterStatus === 'all' ? true : t.status === filterStatus));
  const pendingCount = testimonials.filter((t) => t.status === 'pending').length;

  async function handleQuickStatus(t: Testimonial, newStatus: 'approved' | 'rejected') {
    await DataService.saveTestimonial({ ...t, status: newStatus });
    onFlashNotice(newStatus === 'approved' ? 'Témoignage validé et publié.' : 'Témoignage rejeté.');
    onRefresh();
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Supprimer définitivement ce témoignage ?')) return;
    await DataService.deleteTestimonial(id);
    onFlashNotice('Témoignage supprimé.');
    onRefresh();
  }

  return (
    <div className="admin-module-view">
      <div className="admin-header-row">
        <div>
          <p className="kicker"><span /> Modération & Avis</p>
          <h1>Gestion des Témoignages</h1>
        </div>
        <button
          className="button button-dark"
          onClick={() =>
            setEditingItem({
              id: '',
              author_name: '',
              author_role: '',
              avatar_url: images.candidate1,
              message: '',
              domain: 'coaching',
              contest_id: null,
              rating: 5,
              status: 'approved',
              sort_order: testimonials.length + 1,
            })
          }
        >
          <Plus size={16} />
          <span>Ajouter un témoignage</span>
        </button>
      </div>

      {/* FILTRES PAR STATUT */}
      <div className="subtabs-bar">
        {[
          { id: 'all', label: `Tous (${testimonials.length})` },
          { id: 'pending', label: `En attente de validation (${pendingCount})`, highlight: pendingCount > 0 },
          { id: 'approved', label: 'Approuvés & Publiés' },
          { id: 'rejected', label: 'Rejetés / Masqués' },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`subtab-btn ${filterStatus === tab.id ? 'active' : ''} ${tab.highlight ? 'text-red font-bold' : ''}`}
            onClick={() => setFilterStatus(tab.id as any)}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* LISTE DES TÉMOIGNAGES */}
      <div className="testimonials-admin-list">
        {filtered.map((t) => (
          <article key={t.id} className={`testimonial-admin-card ${t.status === 'pending' ? 'is-pending' : ''}`}>
            <div className="t-card-head">
              <div className="t-author-wrap">
                {t.avatar_url && <img src={t.avatar_url} alt="" className="t-avatar" />}
                <div>
                  <strong>{t.author_name}</strong>
                  <span>{t.author_role}</span>
                  <span className="t-domain-chip">{t.domain}</span>
                </div>
              </div>
              <div className="t-status-row">
                <span className={`status-pill ${t.status === 'approved' ? 'published' : t.status === 'pending' ? 'draft' : 'danger'}`}>
                  {t.status === 'approved' ? 'Approuvé' : t.status === 'pending' ? 'En attente' : 'Rejeté'}
                </span>
              </div>
            </div>

            <p className="t-body-msg">« {t.message} »</p>

            <div className="t-card-foot">
              <div className="t-rating-stars">
                {[...Array(t.rating || 5)].map((_, i) => (
                  <Star key={i} size={13} className="star-filled" />
                ))}
              </div>

              <div className="t-quick-actions">
                {t.status === 'pending' && (
                  <>
                    <button
                      className="button button-dark btn-sm"
                      onClick={() => handleQuickStatus(t, 'approved')}
                      title="Valider et publier"
                    >
                      <ThumbsUp size={14} />
                      <span>Approuver</span>
                    </button>
                    <button
                      className="button button-light btn-sm text-red"
                      onClick={() => handleQuickStatus(t, 'rejected')}
                      title="Rejeter"
                    >
                      <ThumbsDown size={14} />
                      <span>Rejeter</span>
                    </button>
                  </>
                )}
                {t.status === 'approved' && (
                  <button
                    className="button button-light btn-sm"
                    onClick={() => handleQuickStatus(t, 'rejected')}
                    title="Masquer"
                  >
                    Masquer
                  </button>
                )}
                {t.status === 'rejected' && (
                  <button
                    className="button button-light btn-sm"
                    onClick={() => handleQuickStatus(t, 'approved')}
                    title="Réactiver"
                  >
                    Réactiver
                  </button>
                )}
                <button className="action-icon-btn" onClick={() => setEditingItem(t)}>
                  <Edit3 size={15} />
                </button>
                <button className="action-icon-btn danger" onClick={() => handleDelete(t.id)}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* MODALE ÉDITION */}
      {editingItem && (
        <TestimonialEditorModal
          testimonial={editingItem}
          onClose={() => setEditingItem(null)}
          onSaved={() => {
            setEditingItem(null);
            onFlashNotice('Témoignage enregistré.');
            onRefresh();
          }}
        />
      )}
    </div>
  );
}

function TestimonialEditorModal({
  testimonial,
  onClose,
  onSaved,
}: {
  testimonial: Testimonial;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({ ...testimonial });
  const [saving, setSaving] = useState(false);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await DataService.saveTestimonial(form);
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
            <p className="kicker"><span /> Avis & Retour</p>
            <h2>{form.id ? 'Modifier le témoignage' : 'Nouveau témoignage'}</h2>
          </div>
          <button onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSave} className="styled-modal-form">
          <div className="form-two">
            <label>
              Nom de l’auteur *
              <input
                required
                value={form.author_name}
                onChange={(e) => setForm({ ...form, author_name: e.target.value })}
                placeholder="Ex: Camille L."
              />
            </label>
            <label>
              Domaine concerné
              <select
                value={form.domain}
                onChange={(e) => setForm({ ...form, domain: e.target.value as any })}
              >
                <option value="coaching">Coaching Miss & Mister</option>
                <option value="jury">Jury de Concours</option>
                <option value="gastronomie">Gastronomie</option>
                <option value="general">Général</option>
              </select>
            </label>
          </div>

          <label>
            Rôle / Contexte de collaboration *
            <input
              required
              value={form.author_role}
              onChange={(e) => setForm({ ...form, author_role: e.target.value })}
              placeholder="Ex: Miss Élégance Grand Est 2024"
            />
          </label>

          <CloudinaryUploader
            label="Photo de l’auteur (Avatar / Portrait)"
            currentUrl={form.avatar_url}
            mediaType="image"
            folder="couronne-toque/temoignages"
            accept="image/*"
            onChange={({ url }) => setForm({ ...form, avatar_url: url })}
            onRemove={() => setForm({ ...form, avatar_url: null })}
            helpText="Photo de profil hébergée sur Cloudinary et affichée à côté du témoignage."
          />

          <label>
            Texte du témoignage *
            <textarea
              required
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Rédigez le texte du témoignage..."
            />
          </label>

          <div className="form-two">
            <label>
              Statut de modération
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as any })}
              >
                <option value="approved">Approuvé & Publié</option>
                <option value="pending">En attente de modération</option>
                <option value="rejected">Rejeté / Masqué</option>
              </select>
            </label>
            <label>
              Note attribuée (1 à 5 étoiles)
              <select
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                <option value={3}>⭐⭐⭐ (3/5)</option>
              </select>
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="button button-light" onClick={onClose}>Annuler</button>
            <button className="button button-dark" disabled={saving}>
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
