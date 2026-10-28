import { ArrowUpRight, Award, Calendar, CheckCircle2, ChevronRight, MapPin, Quote, Shield, Star, Users } from 'lucide-react';
import type { JuryCriterion, JuryExperience, MediaItem, Testimonial } from '@/types';
import { images } from '@/lib/supabase';

interface JuryPageProps {
  experiences: JuryExperience[];
  criteria: JuryCriterion[];
  testimonials: Testimonial[];
  media: MediaItem[];
  onNavigate: (path: string) => void;
  onOpenMedia: (item: MediaItem) => void;
}

export default function JuryPage({
  experiences,
  criteria,
  testimonials,
  media,
  onNavigate,
  onOpenMedia,
}: JuryPageProps) {
  const activeExperiences = experiences.filter((e) => e.is_published).sort((a, b) => b.event_year - a.event_year);
  const activeCriteria = criteria.filter((c) => c.is_published);
  const organizerTestimonials = testimonials.filter((t) => t.status === 'approved' && t.domain === 'jury');
  const juryMedia = media.filter((m) => m.category === 'jury');

  return (
    <main className="subpage wrap jury-page">
      {/* EN-TÊTE DE PAGE */}
      <div className="page-heading">
        <div>
          <p className="kicker"><span /> Arbitrage & Évaluation Officielle</p>
          <h1>Membre de Jury de Concours</h1>
        </div>
        <p className="heading-note">
          Une lecture attentive, humaine et intransigeante de l’élégance, au service de sélections équitables et prestigieuses.
        </p>
      </div>

      {/* RÔLE ET APPROCHE */}
      <section className="editorial-layout">
        <div className="editorial-feature">
          <img src={images.table} alt="Table du jury officiel" />
          <div className="feature-caption">
            <p>Déontologie & Intégrité</p>
            <h2>Regarder au-delà de l’apparence</h2>
          </div>
        </div>

        <div className="editorial-details">
          <p className="dropcap">
            Participer à un jury de concours Miss ou Mister n’est pas un simple exercice d’observation esthétique. C’est une responsabilité morale envers des jeunes femmes et des jeunes hommes qui investissent leurs espoirs et leur travail.
          </p>
          <div className="detail-rule" />
          <p className="detail-lead">
            Mon engagement repose sur une grille d’analyse rigoureuse : l’écoute active lors de l’interview, la perception de la bienveillance collective en coulisses et l’adéquation de l’allure avec les responsabilités d’un titre officiel.
          </p>

          <div className="detail">
            <span><Shield size={20} /></span>
            <div>
              <h3>Impartialité absolue</h3>
              <p>Aucune complaisance, aucune influence extérieure. Chaque candidat est jugé uniquement sur sa prestation scénique et humaine le jour J.</p>
            </div>
          </div>

          <div className="detail">
            <span><Award size={20} /></span>
            <div>
              <h3>32 jurys régionaux et nationaux</h3>
              <p>Une expérience confirmée des coulisses des comités Miss Élégance, Mister France et sélections régionales majeures.</p>
            </div>
          </div>

          <button
            className="button button-dark"
            onClick={() => onNavigate('/contact?motif=jury')}
          >
            <span>Inviter comme membre de jury</span>
            <ArrowUpRight size={16} />
          </button>
        </div>
      </section>

      {/* CRITÈRES D'ÉVALUATION PUBLICS */}
      {activeCriteria.length > 0 && (
        <section className="jury-criteria-section">
          <div className="section-head">
            <div>
              <p className="kicker"><span /> Principes & Barèmes</p>
              <h2>Mes critères d’évaluation</h2>
            </div>
          </div>
          <div className="criteria-grid">
            {activeCriteria.map((crit, index) => (
              <div key={crit.id} className="criteria-card">
                <span className="crit-badge">Critère 0{index + 1}</span>
                <h3>{crit.title}</h3>
                <p>{crit.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CONCOURS ARBITRÉS COMME JURY */}
      <section className="jury-experiences-section">
        <div className="section-head">
          <div>
            <p className="kicker"><span /> Historique officiel</p>
            <h2>Concours arbitrés en tant que jury</h2>
          </div>
        </div>

        <div className="jury-table-list">
          {activeExperiences.map((exp) => (
            <article key={exp.id} className="jury-exp-row">
              <div className="exp-visual">
                <img src={exp.image_url || images.table} alt={exp.event_name} />
              </div>
              <div className="exp-content">
                <div className="exp-tags">
                  <span className="exp-role">{exp.role_title}</span>
                  <span className="exp-year">{exp.event_year} · {exp.edition}</span>
                </div>
                <h3>{exp.event_name}</h3>
                <p className="exp-desc">{exp.description}</p>
                <div className="exp-footer">
                  {exp.organizer && (
                    <span className="organizer-badge">
                      <Users size={13} /> {exp.organizer}
                    </span>
                  )}
                  {exp.location && (
                    <span className="location-badge">
                      <MapPin size={13} /> {exp.location}
                    </span>
                  )}
                  {exp.event_date && (
                    <span className="date-badge">
                      <Calendar size={13} /> {exp.event_date}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* TÉMOIGNAGES ORGANISATEURS */}
      {organizerTestimonials.length > 0 && (
        <section className="jury-testimonials-section">
          <div className="section-head">
            <div>
              <p className="kicker"><span /> Confiance des comités</p>
              <h2>Mots d’organisateurs</h2>
            </div>
          </div>
          <div className="testimonials-cards-grid">
            {organizerTestimonials.map((t) => (
              <div key={t.id} className="testimonial-box">
                <Quote size={24} className="quote-icon" />
                <p className="testimonial-text">« {t.message} »</p>
                <div className="testimonial-author-box">
                  {t.avatar_url && <img src={t.avatar_url} alt={t.author_name} className="author-thumb" />}
                  <div>
                    <strong>{t.author_name}</strong>
                    <span>{t.author_role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* APPEL À COLLABORATION ORGANISATEURS */}
      <section className="jury-cta-banner">
        <div className="cta-box-content">
          <Award size={40} className="cta-icon" />
          <h2>Organisateurs de concours & comités</h2>
          <p>
            Vous préparez une prochaine élection régionale ou nationale et recherchez un jury d’expérience, garant d’un arbitrage juste et respectueux des candidats ?
          </p>
          <button
            className="button button-dark"
            onClick={() => onNavigate('/contact?motif=jury')}
          >
            <span>Proposer une participation au jury</span>
            <ArrowUpRight size={16} />
          </button>
        </div>
      </section>
    </main>
  );
}
