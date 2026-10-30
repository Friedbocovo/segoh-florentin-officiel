import { ArrowUpRight, Award, Calendar, CheckCircle2, ChevronRight, MapPin, Quote, Shield, Star, Users } from 'lucide-react';
import type { SiteSection, JuryCriterion, JuryExperience, MediaItem, Testimonial } from '@/types';
import Picture from '@/components/common/Picture';
import { pickImage } from '@/lib/media';
import { PageHeading, SectionHead } from '@/components/common/SectionTitles';
import EditorialIntro from '@/components/common/EditorialIntro';
import { getSection } from '@/lib/pageSections';
import { rich } from '@/lib/richText';

interface JuryPageProps {
  sections: SiteSection[];
  experiences: JuryExperience[];
  criteria: JuryCriterion[];
  testimonials: Testimonial[];
  media: MediaItem[];
  onNavigate: (path: string) => void;
  onOpenMedia: (item: MediaItem) => void;
}

export default function JuryPage({
  sections,
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

  const sec = (key: string) => getSection(sections, 'jury', key);
  const heading = sec('heading');
  const intro = sec('intro');
  const criteriaHead = sec('criteria_head');
  const experiencesHead = sec('experiences_head');
  const testimonialsHead = sec('testimonials_head');
  const cta = sec('cta');

  return (
    <main className="subpage wrap jury-page">
      {/* EN-TÊTE DE PAGE */}
      {heading.is_published && <PageHeading section={heading} />}

      {/* RÔLE ET APPROCHE */}
      {intro.is_published && (
        <EditorialIntro
          section={intro}
          fallbackImage={pickImage(media, ['jury'])}
          imageAlt="Table du jury officiel"
          icons={[Shield, Award]}
          onNavigate={onNavigate}
        />
      )}

      {/* CRITÈRES D'ÉVALUATION PUBLICS */}
      {activeCriteria.length > 0 && (
        <section className="jury-criteria-section">
          <SectionHead section={criteriaHead} />
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
        <SectionHead section={experiencesHead} />

        <div className="jury-table-list">
          {activeExperiences.map((exp) => (
            <article key={exp.id} className="jury-exp-row">
              <div className="exp-visual">
                <Picture src={exp.image_url} alt={exp.event_name} />
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
          <SectionHead section={testimonialsHead} />
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
      {cta.is_published && (
      <section className="jury-cta-banner">
        <div className="cta-box-content">
          <Award size={40} className="cta-icon" />
          <h2>{rich(cta.title)}</h2>
          {cta.content && <p>{cta.content}</p>}
          <button
            className="button button-dark"
            onClick={() => onNavigate(cta.button_url || '/contact')}
          >
            <span>{cta.button_label}</span>
            <ArrowUpRight size={16} />
          </button>
        </div>
      </section>
      )}
    </main>
  );
}
