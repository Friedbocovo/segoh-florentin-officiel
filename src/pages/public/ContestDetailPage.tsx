import { useEffect } from 'react';
import { ArrowLeft, ArrowUpRight, Award, Calendar, CheckCircle2, ChevronRight, Crown, MapPin, Sparkles, Trophy, Users } from 'lucide-react';
import type { Contest, MediaItem } from '@/types';
import { images } from '@/lib/supabase';
import { canonicalUrl, updateSEO } from '@/lib/seo';

interface ContestDetailPageProps {
  slug: string;
  contests: Contest[];
  media: MediaItem[];
  onNavigate: (path: string) => void;
  onOpenMedia: (item: MediaItem) => void;
}

export default function ContestDetailPage({
  slug,
  contests,
  media,
  onNavigate,
  onOpenMedia,
}: ContestDetailPageProps) {
  const contest = contests.find((c) => c.slug === slug);

  useEffect(() => {
    if (contest) {
      updateSEO({
        title: contest.seo_title || `${contest.name} (${contest.edition}) — Couronne & Toque`,
        description: contest.seo_description || contest.short_description || contest.long_description.slice(0, 160),
        ogImage: contest.cover_image || images.stage,
        canonical: canonicalUrl(`/mes-concours/${contest.slug}`),
      });
    }
  }, [contest]);

  if (!contest) {
    return (
      <main className="subpage wrap not-found-page">
        <div className="empty-state">
          <Trophy size={48} />
          <h2>Concours introuvable</h2>
          <p>Le concours que vous recherchez n’existe pas ou a été déplacé.</p>
          <button className="button button-dark" onClick={() => onNavigate('/mes-concours')}>
            <ArrowLeft size={16} />
            <span>Retour au catalogue des concours</span>
          </button>
        </div>
      </main>
    );
  }

  // Autres éditions du même concours
  const otherEditions = contests.filter((c) => c.name.toLowerCase() === contest.name.toLowerCase() && c.id !== contest.id);

  // Médias liés à ce concours
  const contestMedia = media.filter((m) => m.contest_id === contest.id || m.category === 'concours').slice(0, 4);

  // Groupement des résultats par catégorie
  const results = contest.results || [];

  return (
    <main className="subpage wrap contest-detail-page">
      {/* RETOUR & EN-TÊTE */}
      <button className="back-button" onClick={() => onNavigate('/mes-concours')}>
        <ArrowLeft size={16} />
        <span>Retour à tous les concours</span>
      </button>

      <div className="contest-hero-block">
        <div className="contest-hero-poster">
          <img src={contest.cover_image || images.stage} alt={contest.name} />
          <span className="poster-edition">{contest.edition}</span>
        </div>

        <div className="contest-hero-details">
          <div className="hero-tags">
            <span className="tag-year">{contest.year}</span>
            {contest.location && (
              <span className="tag-loc">
                <MapPin size={13} /> {contest.location}
              </span>
            )}
            {contest.event_date && (
              <span className="tag-date">
                <Calendar size={13} /> {contest.event_date}
              </span>
            )}
          </div>

          <h1>{contest.name}</h1>
          {contest.organizer && (
            <p className="organizer-name">
              Organisé par : <strong>{contest.organizer}</strong>
            </p>
          )}

          <p className="contest-lead">
            {contest.short_description || contest.long_description.slice(0, 180)}
          </p>

          {/* RÔLE DU COACH */}
          <div className="coach-role-box">
            <div className="role-title">
              <Crown size={18} className="text-red" />
              <span>Mon rôle en tant que Coach</span>
            </div>
            <p>
              {contest.coach_role_description ||
                'Accompagnement scénique global, travail de la démarche, préparation aux questions orales du jury et gestion du trac en coulisses.'}
            </p>
          </div>

          <button
            className="button button-dark"
            onClick={() => onNavigate('/contact?motif=coaching')}
          >
            <span>Préparer une prochaine édition</span>
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>

      {/* RÉSULTATS & CANDIDATS ACCOMPAGNÉS */}
      <section className="contest-results-section">
        <div className="section-head">
          <div>
            <p className="kicker"><span /> Palmarès Officiel</p>
            <h2>Candidats accompagnés & Titres obtenus</h2>
          </div>
          <p className="section-note">
            Les distinctions ci-dessous honorent le travail et le talent des candidats accompagnés par Couronne & Toque lors de cette édition.
          </p>
        </div>

        {results.length === 0 ? (
          <div className="empty-results-box">
            <Sparkles size={28} />
            <p>Les résultats officiels de cette édition sont en cours de mise en page ou seront dévoilés prochainement.</p>
          </div>
        ) : (
          <div className="candidates-results-grid">
            {results.map((result) => (
              <div key={result.id} className="candidate-result-card">
                <div className="candidate-photo-wrap">
                  <img
                    src={result.candidate_photo || images.portrait}
                    alt={result.candidate_name}
                  />
                  <span className="category-pill">{result.category}</span>
                </div>
                <div className="candidate-info">
                  <div className="title-won-banner">
                    <Trophy size={16} className="trophy-icon" />
                    <strong>{result.title_won}</strong>
                  </div>
                  <h3>{result.candidate_name}</h3>
                  {result.coaching_mention && (
                    <span className="coaching-mention-badge">
                      <CheckCircle2 size={12} /> {result.coaching_mention}
                    </span>
                  )}
                  {result.description && (
                    <p className="candidate-desc">{result.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* DESCRIPTION COMPLÈTE DU CONCOURS */}
      {contest.long_description && (
        <section className="contest-narrative-section">
          <div className="section-head">
            <div>
              <p className="kicker"><span /> Récit de l’Édition</p>
              <h2>L’aventure en coulisses</h2>
            </div>
          </div>
          <div className="narrative-body">
            <p>{contest.long_description}</p>
          </div>
        </section>
      )}

      {/* MÉDIAS DU CONCOURS */}
      {contestMedia.length > 0 && (
        <section className="contest-media-gallery">
          <div className="section-head">
            <div>
              <p className="kicker"><span /> Photos & Souvenirs</p>
              <h2>Instants choisis</h2>
            </div>
          </div>
          <div className="gallery-preview-grid">
            {contestMedia.map((m) => (
              <div key={m.id} className="gallery-preview-item" onClick={() => onOpenMedia(m)}>
                <img src={m.thumbnail_url || m.url} alt={m.title} />
                <div className="preview-overlay">
                  <h4>{m.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* AUTRES ÉDITIONS DU MÊME CONCOURS */}
      {otherEditions.length > 0 && (
        <section className="other-editions-section">
          <div className="section-head">
            <div>
              <p className="kicker"><span /> Historique</p>
              <h2>Autres éditions de ce concours</h2>
            </div>
          </div>
          <div className="editions-links-list">
            {otherEditions.map((ed) => (
              <button
                key={ed.id}
                className="edition-pill-btn"
                onClick={() => onNavigate(`/mes-concours/${ed.slug}`)}
              >
                <span>{ed.name} — {ed.edition}</span>
                <ChevronRight size={14} />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* APPEL À CANDIDATURE */}
      <section className="contest-footer-cta">
        <div className="cta-content">
          <h2>Vous visez un titre lors d’une prochaine élection ?</h2>
          <p>
            Rejoignez l’accompagnement d’excellence Couronne & Toque pour vous démarquer dès les présélections.
          </p>
          <button className="button button-dark" onClick={() => onNavigate('/contact?motif=coaching')}>
            <span>Me contacter pour ce concours</span>
            <ArrowUpRight size={16} />
          </button>
        </div>
      </section>
    </main>
  );
}
