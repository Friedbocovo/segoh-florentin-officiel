import { useState } from 'react';
import { ArrowUpRight, Check, ChevronDown, ChevronRight, Crown, HelpCircle, MessageSquare, Sparkles, Trophy } from 'lucide-react';
import type { SiteSection, CoachingFAQ, CoachingMethodStep, CoachingService, Contest, MediaItem, Testimonial } from '@/types';
import Picture from '@/components/common/Picture';
import { pickImage } from '@/lib/media';
import { PageHeading, SectionHead } from '@/components/common/SectionTitles';
import EditorialIntro from '@/components/common/EditorialIntro';
import { getSection } from '@/lib/pageSections';
import { rich } from '@/lib/richText';

interface CoachingPageProps {
  sections: SiteSection[];
  services: CoachingService[];
  methodSteps: CoachingMethodStep[];
  faqs: CoachingFAQ[];
  contests: Contest[];
  media: MediaItem[];
  testimonials: Testimonial[];
  onNavigate: (path: string) => void;
  onOpenMedia: (item: MediaItem) => void;
}

export default function CoachingPage({
  sections,
  services,
  methodSteps,
  faqs,
  contests,
  media,
  testimonials,
  onNavigate,
  onOpenMedia,
}: CoachingPageProps) {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const sec = (key: string) => getSection(sections, 'coaching', key);
  const heading = sec('heading');
  const intro = sec('intro');
  const servicesHead = sec('services_head');
  const methodHead = sec('method_head');
  const resultsHead = sec('results_head');
  const galleryHead = sec('gallery_head');
  const testimonialsHead = sec('testimonials_head');
  const faqHead = sec('faq_head');
  const cta = sec('cta');

  const activeServices = services.filter((s) => s.is_published);
  const activeSteps = methodSteps.filter((s) => s.is_published).sort((a, b) => a.step_number - b.step_number);
  const activeFaqs = faqs.filter((f) => f.is_published);
  const coachingMedia = media.filter((m) => m.category === 'coaching' || m.category === 'concours').slice(0, 4);
  const coachingTestimonials = testimonials.filter((t) => t.status === 'approved' && (t.domain === 'coaching' || t.domain === 'general')).slice(0, 3);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <main className="subpage wrap coaching-page">
      {/* 5.1 INTRODUCTION AU COACHING */}
      {heading.is_published && <PageHeading section={heading} />}

      {intro.is_published && (
        <EditorialIntro
          section={intro}
          fallbackImage={pickImage(media, ['coaching', 'concours'])}
          imageAlt="Préparation scénique concours"
          icons={[Sparkles, Crown, Trophy]}
          onNavigate={onNavigate}
        />
      )}

      {/* 5.2 SERVICES DE COACHING */}
      <section className="coaching-services-section">
        <SectionHead section={servicesHead} />

        <div className="services-grid">
          {activeServices.map((service) => (
            <article key={service.id} className="service-card">
              {service.image_url && (
                <div className="service-image">
                  <img src={service.image_url} alt={service.title} />
                </div>
              )}
              <div className="service-body">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <div className="service-meta">
                  {service.duration_info && <span className="meta-badge">{service.duration_info}</span>}
                  {service.price_info && <span className="meta-badge price">{service.price_info}</span>}
                </div>
                <button
                  className="button button-dark full-width"
                  onClick={() => onNavigate(service.button_url || '/contact?motif=coaching')}
                >
                  <span>{service.button_label || 'Choisir cette formule'}</span>
                  <ArrowUpRight size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 5.3 MÉTHODE D'ACCOMPAGNEMENT */}
      {activeSteps.length > 0 && (
        <section className="method-section">
          <SectionHead section={methodHead} />
          <div className="method-steps-grid">
            {activeSteps.map((step) => (
              <div key={step.id} className="method-step-card">
                <span className="step-number">Étape 0{step.step_number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5.4 EXPÉRIENCES ET RÉSULTATS */}
      <section className="coaching-results-section">
        <SectionHead section={resultsHead} linkLabel="Voir tout le catalogue" onLink={() => onNavigate('/mes-concours')} />

        <div className="contests-grid">
          {contests.slice(0, 3).map((contest) => (
            <article key={contest.id} className="contest-card" onClick={() => onNavigate(`/mes-concours/${contest.slug}`)}>
              <div className="contest-cover">
                <Picture src={contest.cover_image} alt={contest.name} />
                <span className="contest-edition">{contest.edition}</span>
              </div>
              <div className="contest-info">
                <div className="contest-meta">
                  <span>{contest.location}</span>
                  {contest.year && <span>· {contest.year}</span>}
                </div>
                <h3>{contest.name}</h3>
                <p>{contest.short_description}</p>
                <div className="contest-card-footer">
                  <span className="results-badge">
                    <Trophy size={13} /> {contest.results?.length || 0} titres obtenus
                  </span>
                  <span className="read-more">
                    Détails du concours <ArrowUpRight size={14} />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 5.5 GALERIE DU COACHING */}
      {coachingMedia.length > 0 && (
        <section className="coaching-gallery-section">
          <SectionHead section={galleryHead} linkLabel="Galerie photos" onLink={() => onNavigate('/galerie?categorie=coaching')} />
          <div className="gallery-preview-grid">
            {coachingMedia.map((item) => (
              <div key={item.id} className="gallery-preview-item" onClick={() => onOpenMedia(item)}>
                <img src={item.thumbnail_url || item.url} alt={item.title} />
                <div className="preview-overlay">
                  <h4>{item.title}</h4>
                  <p>{item.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5.6 TÉMOIGNAGES COACHING */}
      {coachingTestimonials.length > 0 && (
        <section className="coaching-testimonials-section">
          <SectionHead section={testimonialsHead} />
          <div className="testimonials-cards-grid">
            {coachingTestimonials.map((t) => (
              <div key={t.id} className="testimonial-box">
                <MessageSquare size={24} className="quote-icon" />
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

      {/* 5.7 QUESTIONS FRÉQUENTES */}
      {activeFaqs.length > 0 && (
        <section className="faq-section">
          <SectionHead section={faqHead} />
          <div className="faq-accordion">
            {activeFaqs.map((faq) => (
              <div key={faq.id} className={`faq-item ${openFaq === faq.id ? 'open' : ''}`}>
                <button className="faq-question" onClick={() => toggleFaq(faq.id)}>
                  <span>{faq.question}</span>
                  <ChevronDown size={18} className="faq-chevron" />
                </button>
                {openFaq === faq.id && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5.8 DEMANDE DE COACHING PRÉREMPLIE */}
      {cta.is_published && (
      <section className="coaching-cta-box">
        <div className="cta-inner">
          <Crown size={38} className="cta-icon" />
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
