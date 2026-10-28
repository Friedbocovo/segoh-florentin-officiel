import { FormEvent, useMemo, useState } from 'react';
import { CheckCircle2, LoaderCircle, MessageSquare, Plus, Quote, Send, Star } from 'lucide-react';
import type { Testimonial } from '@/types';
import { DataService } from '@/lib/supabase';

interface TestimonialsPageProps {
  testimonials: Testimonial[];
}

const domainConfig: Record<string, { label: string; badgeClass: string }> = {
  coaching: { label: 'Coaching Miss & Mister', badgeClass: 'badge-coaching' },
  jury: { label: 'Jury de Concours', badgeClass: 'badge-jury' },
  gastronomie: { label: 'Gastronomie & Dîners', badgeClass: 'badge-gastronomie' },
  general: { label: 'Collaboration', badgeClass: 'badge-general' },
};

function getInitials(name: string): string {
  if (!name) return 'C';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function TestimonialsPage({ testimonials }: TestimonialsPageProps) {
  const [filterDomain, setFilterDomain] = useState<string>('all');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Uniquement les témoignages approuvés
  const approvedTestimonials = useMemo(() => {
    return testimonials
      .filter((t) => t.status === 'approved')
      .filter((t) => (filterDomain === 'all' ? true : t.domain === filterDomain))
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [testimonials, filterDomain]);

  async function handleTestimonialSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    const formEl = e.currentTarget;
    const form = new FormData(formEl);

    const result = await DataService.submitTestimonial({
      author_name: String(form.get('author_name') || ''),
      author_role: String(form.get('author_role') || ''),
      avatar_url: String(form.get('avatar_url') || '') || null,
      message: String(form.get('message') || ''),
      domain: (form.get('domain') as any) || 'coaching',
      rating: 5,
      sort_order: 99,
      created_at: new Date().toISOString(),
    }); // Reste en attente de modération admin

    setSubmitting(false);
    if (!result.success) {
      setSubmitError('Votre témoignage n’a pas pu être envoyé. Veuillez réessayer dans quelques instants.');
      return;
    }
    setSubmitted(true);
    formEl.reset();
  }

  return (
    <main className="subpage wrap testimonials-page">
      <div className="page-heading">
        <div>
          <p className="kicker"><span /> Confiance & Reconnaissance</p>
          <h1>Témoignages & Avis</h1>
        </div>
        <p className="heading-note">
          Les retours authentiques des candidates, candidats, comités d’élégance et hôtes de dîners d’exception.
        </p>
      </div>

      <div className="testimonials-action-bar">
        <div className="filter-pills-list">
          {[
            { id: 'all', label: 'Tous les domaines' },
            { id: 'coaching', label: 'Coaching Miss & Mister' },
            { id: 'jury', label: 'Jurys & Comités' },
            { id: 'gastronomie', label: 'Gastronomie & Dîners' },
          ].map((d) => (
            <button
              key={d.id}
              className={`filter-pill ${filterDomain === d.id ? 'active' : ''}`}
              onClick={() => setFilterDomain(d.id)}
            >
              {d.label}
            </button>
          ))}
        </div>

        <button
          className="button button-dark"
          onClick={() => { setShowSubmitModal(true); setSubmitted(false); }}
        >
          <Plus size={16} />
          <span>Déposer un témoignage</span>
        </button>
      </div>

      {/* GRILLE DES AVIS APPROUVÉS */}
      {approvedTestimonials.length === 0 ? (
        <div className="empty-state">
          <MessageSquare size={42} />
          <h2>Aucun avis dans ce domaine pour le moment</h2>
          <p>Sélectionnez un autre domaine pour afficher les retours de nos clients.</p>
        </div>
      ) : (
        <div className="testimonials-cards-grid">
          {approvedTestimonials.map((item) => (
            <article key={item.id} className="testimonial-box">
              <div className="testimonial-header">
                <span className={`testimonial-domain-badge ${domainConfig[item.domain]?.badgeClass || 'badge-general'}`}>
                  {domainConfig[item.domain]?.label || 'Témoignage'}
                </span>
                <div className="stars-row" aria-label={`${item.rating || 5} étoiles sur 5`}>
                  {[...Array(item.rating || 5)].map((_, i) => (
                    <Star key={i} size={14} className="star-gold" />
                  ))}
                </div>
              </div>

              <div className="testimonial-body">
                <Quote size={20} className="testimonial-quote-icon" />
                <p className="testimonial-text">« {item.message} »</p>
              </div>

              <div className="testimonial-author-box">
                {item.avatar_url ? (
                  <img src={item.avatar_url} alt={item.author_name} className="author-thumb" />
                ) : (
                  <div className="author-initials">
                    {getInitials(item.author_name)}
                  </div>
                )}
                <div className="author-info">
                  <strong className="author-name">{item.author_name}</strong>
                  <span className="author-role">{item.author_role}</span>
                </div>
                <div className="verified-badge" title="Témoignage authentique certifié">
                  <CheckCircle2 size={13} />
                  <span>Vérifié</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* MODALE DE SOUMISSION D'AVIS */}
      {showSubmitModal && (
        <div className="modal-backdrop" onClick={() => setShowSubmitModal(false)}>
          <div className="content-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <p className="kicker"><span /> Partage d’expérience</p>
                <h2>Déposer votre témoignage</h2>
              </div>
              <button onClick={() => setShowSubmitModal(false)}>✕</button>
            </div>

            {submitted ? (
              <div className="form-success-box">
                <div className="success-icon-badge">
                  <CheckCircle2 size={38} />
                </div>
                <span className="success-pill-tag">Témoignage envoyé</span>
                <h3>Merci pour votre témoignage !</h3>
                <p>
                  Votre message a bien été enregistré. Il sera vérifié et validé par l’administrateur avant sa publication officielle sur le site.
                </p>
                <div className="success-actions">
                  <button
                    className="button button-dark"
                    onClick={() => setShowSubmitModal(false)}
                  >
                    Fermer la fenêtre
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleTestimonialSubmit} className="styled-modal-form">
                <div className="form-two">
                  <label>
                    Votre nom complet *
                    <input name="author_name" required placeholder="Léa Martin" />
                  </label>
                  <label>
                    Domaine concerné *
                    <select name="domain" required defaultValue="coaching">
                      <option value="coaching">Coaching Miss & Mister</option>
                      <option value="jury">Jury de Concours</option>
                      <option value="gastronomie">Prestation Gastronomique</option>
                      <option value="general">Autre collaboration</option>
                    </select>
                  </label>
                </div>

                <label>
                  Votre titre, rôle ou contexte de collaboration *
                  <input
                    name="author_role"
                    required
                    placeholder="Ex: Miss Régionale 2024, Organisatrice élection, Hôte d’un dîner..."
                  />
                </label>

                <label>
                  URL de votre photo ou avatar (facultatif)
                  <input name="avatar_url" placeholder="https://..." />
                </label>

                <label>
                  Votre message ou témoignage *
                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="Racontez votre expérience et ce que l’accompagnement vous a apporté..."
                  ></textarea>
                </label>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="button button-light"
                    onClick={() => setShowSubmitModal(false)}
                  >
                    Annuler
                  </button>
                  {submitError && <p className="form-error">{submitError}</p>}
                  <button className="button button-dark" disabled={submitting}>
                    {submitting ? <LoaderCircle className="spin" size={16} /> : <Send size={15} />}
                    <span>{submitting ? 'Envoi...' : 'Envoyer mon témoignage'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
