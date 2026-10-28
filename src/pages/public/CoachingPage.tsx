import { useState } from 'react';
import { ArrowUpRight, Check, ChevronDown, ChevronRight, Crown, HelpCircle, MessageSquare, Sparkles, Trophy } from 'lucide-react';
import type { CoachingFAQ, CoachingMethodStep, CoachingService, Contest, MediaItem, Testimonial } from '@/types';
import { images } from '@/lib/supabase';

interface CoachingPageProps {
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
      <div className="page-heading">
        <div>
          <p className="kicker"><span /> Pôle Accompagnement Miss & Mister</p>
          <h1>Le Coaching Scénique</h1>
        </div>
        <p className="heading-note">
          Révéler la prestance, libérer la voix et forger un mental de vainqueur pour faire la différence le soir du sacre.
        </p>
      </div>

      <section className="editorial-layout">
        <div className="editorial-feature">
          <img src={images.stage} alt="Préparation scénique concours" />
          <div className="feature-caption">
            <p>De l’audition au sacre</p>
            <h2>La présence ne s’improvise pas</h2>
          </div>
        </div>

        <div className="editorial-details">
          <p className="dropcap">
            Participer à une élection de Miss ou de Mister est une aventure humaine intense qui exige bien plus qu’un physique avantageux. C’est une épreuve d’éloquence, d’équilibre émotionnel et de vérité scénique.
          </p>
          <div className="detail-rule" />
          <p className="detail-lead">
            Mon accompagnement s’adresse aux personnalités déterminées qui refusent les faux-semblants et souhaitent marquer les esprits par leur élégance, leur maintien et leur clarté de parole.
          </p>
          <div className="coaching-highlights">
            <div>
              <Check size={18} className="text-red" />
              <span>Diagnostic individuel sans complaisance</span>
            </div>
            <div>
              <Check size={18} className="text-red" />
              <span>Travail précis de la démarche & des pauses scéniques</span>
            </div>
            <div>
              <Check size={18} className="text-red" />
              <span>Entraînement intensif à l’interview du jury</span>
            </div>
            <div>
              <Check size={18} className="text-red" />
              <span>Gestion du stress et ancrage de la sérénité</span>
            </div>
          </div>
          <button
            className="button button-dark"
            onClick={() => onNavigate('/contact?motif=coaching')}
          >
            <span>Réserver un premier entretien</span>
            <ArrowUpRight size={16} />
          </button>
        </div>
      </section>

      {/* 5.2 SERVICES DE COACHING */}
      <section className="coaching-services-section">
        <div className="section-head">
          <div>
            <p className="kicker"><span /> Modules & Formules</p>
            <h2>Mes programmes d’accompagnement</h2>
          </div>
        </div>

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
          <div className="section-head">
            <div>
              <p className="kicker"><span /> Méthodologie éprouvée</p>
              <h2>Les 4 étapes clés vers le podium</h2>
            </div>
          </div>
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
        <div className="section-head">
          <div>
            <p className="kicker"><span /> Résultats concrets</p>
            <h2>Les concours accompagnés</h2>
          </div>
          <button className="text-link" onClick={() => onNavigate('/mes-concours')}>
            <span>Voir tout le catalogue</span>
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="contests-grid">
          {contests.slice(0, 3).map((contest) => (
            <article key={contest.id} className="contest-card" onClick={() => onNavigate(`/mes-concours/${contest.slug}`)}>
              <div className="contest-cover">
                <img src={contest.cover_image || images.stage} alt={contest.name} />
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
          <div className="section-head">
            <div>
              <p className="kicker"><span /> En immersion</p>
              <h2>Dans les coulisses de la préparation</h2>
            </div>
            <button className="text-link" onClick={() => onNavigate('/galerie?categorie=coaching')}>
              <span>Galerie photos</span>
              <ChevronRight size={16} />
            </button>
          </div>
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
          <div className="section-head">
            <div>
              <p className="kicker"><span /> Ils ont vécu l’aventure</p>
              <h2>Témoignages de candidats</h2>
            </div>
          </div>
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
          <div className="section-head">
            <div>
              <p className="kicker"><span /> Réponses claires</p>
              <h2>Foire aux questions</h2>
            </div>
          </div>
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
      <section className="coaching-cta-box">
        <div className="cta-inner">
          <Crown size={38} className="cta-icon" />
          <h2>Prêt à viser le titre ?</h2>
          <p>
            Chaque grande aventure commence par un premier contact. Échangeons sur vos ambitions et planifions votre séance d’évaluation.
          </p>
          <button
            className="button button-dark"
            onClick={() => onNavigate('/contact?motif=coaching')}
          >
            <span>Faire une demande de coaching</span>
            <ArrowUpRight size={16} />
          </button>
        </div>
      </section>
    </main>
  );
}
