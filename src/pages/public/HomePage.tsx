import { ArrowUpRight, Award, Calendar, ChevronRight, Crown, Quote, Sparkles, Utensils } from 'lucide-react';
import type { Article, Contest, MediaItem, SiteSection, SiteSettings, Testimonial } from '@/types';
import { images } from '@/lib/supabase';

interface HomePageProps {
  settings: SiteSettings;
  sections: SiteSection[];
  contests: Contest[];
  media: MediaItem[];
  testimonials: Testimonial[];
  articles: Article[];
  onNavigate: (path: string) => void;
  onOpenMedia: (item: MediaItem) => void;
}

export default function HomePage({
  settings,
  sections,
  contests,
  media,
  testimonials,
  articles,
  onNavigate,
  onOpenMedia,
}: HomePageProps) {
  const heroSection = sections.find((s) => s.section_key === 'hero');
  const presentationSection = sections.find((s) => s.section_key === 'presentation');
  const statsSection = sections.find((s) => s.section_key === 'stats');
  const ctaSection = sections.find((s) => s.section_key === 'cta');

  // Chiffres clés configurables
  const statsList: Array<{ label: string; value: string }> =
    statsSection?.meta?.stats?.filter((st: any) => st?.label && st?.value) || [
      { label: 'Concours coachés', value: `${contests.length}+` },
      { label: 'Titres & écharpes remportés', value: '26' },
      { label: 'Jurys arbitrés', value: '32' },
      { label: 'Années d’expérience', value: '8 ans' },
    ];

  // Concours mis en avant
  const featuredContests = contests.filter((c) => c.is_published && (c.is_featured || true)).slice(0, 3);

  // Médias récents galerie
  const featuredMedia = media.filter((m) => m.is_published).slice(0, 4);

  // Témoignages approuvés
  const approvedTestimonials = testimonials.filter((t) => t.status === 'approved').slice(0, 3);

  // Derniers articles publiés
  const recentArticles = articles.filter((a) => a.is_published).slice(0, 3);

  return (
    <main className="home-page">
      {/* 3.1 HERO SECTION */}
      <section className="hero wrap">
        <div className="hero-copy">
          <p className="kicker">
            <span /> {heroSection?.eyebrow || settings.tagline}
          </p>
          <h1>
            {heroSection?.title ? (
              heroSection.title
            ) : (
              <>
                Révéler<br />
                <em>l’élégance,</em><br />
                sur scène<br className="desktop-only" /> comme à table
              </>
            )}
          </h1>
          <p className="hero-description">
            {heroSection?.content ||
              'J’accompagne celles et ceux qui veulent entrer dans la lumière avec justesse, prestance et vérité. Une même exigence, du premier regard à la dernière assiette.'}
          </p>

          <div className="hero-pillars">
            <span className="pillar-badge">
              <Crown size={14} /> Coaching Miss & Mister
            </span>
            <span className="pillar-badge">
              <Award size={14} /> Jury de Concours
            </span>
            <span className="pillar-badge">
              <Utensils size={14} /> Chef Cuisinier
            </span>
          </div>

          <div className="hero-actions">
            <button
              className="button button-dark"
              onClick={() => onNavigate(heroSection?.button_url || '/a-propos')}
            >
              <span>{heroSection?.button_label || 'Découvrir mon parcours'}</span>
              <ArrowUpRight size={16} />
            </button>
            <button
              className="button button-light"
              onClick={() => onNavigate(heroSection?.meta?.secondary_button_url || '/contact')}
            >
              <span>{heroSection?.meta?.secondary_button_label || 'Me contacter'}</span>
            </button>
          </div>
        </div>

        <div className="hero-image">
          <img
            src={heroSection?.image_url || images.portrait}
            alt={settings.site_name}
          />
          <div className="vertical-note">COACH · JURY · CHEF</div>
        </div>
      </section>

      {/* 3.2 PRÉSENTATION RAPIDE */}
      {presentationSection && presentationSection.is_published && (
        <section className="intro-strip wrap">
          <div className="line" />
          <div className="intro-text">
            <p className="intro-quote">
              Une présence qui s’affirme.<br />
              <span>Une assiette qui se raconte.</span>
            </p>
            <p className="intro-body">{presentationSection.content}</p>
            <button
              className="text-link"
              onClick={() => onNavigate(presentationSection.button_url || '/a-propos')}
            >
              <span>{presentationSection.button_label || 'En savoir plus sur mon parcours'}</span>
              <ChevronRight size={16} />
            </button>
          </div>
          <span className="intro-index">01 — 04</span>
        </section>
      )}

      {/* 3.3 MES DOMAINES D'EXPERTISE */}
      <section className="feature-grid wrap">
        <div
          className="feature-card card-1"
          onClick={() => onNavigate('/coaching')}
          role="button"
          tabIndex={0}
        >
          <img src={images.stage} alt="Coaching Miss & Mister" />
          <span className="shade" />
          <div className="feature-card-content">
            <span className="card-kicker"><Crown size={14} /> Pôle Coaching</span>
            <h3>L’art de la scène</h3>
            <p>Accompagnement d’exception : démarche, posture, éloquence et préparation mentale.</p>
          </div>
          <ArrowUpRight className="card-arrow" size={22} />
        </div>

        <div
          className="feature-card card-2"
          onClick={() => onNavigate('/jury')}
          role="button"
          tabIndex={0}
        >
          <img src={images.table} alt="Jury de concours" />
          <span className="shade" />
          <div className="feature-card-content">
            <span className="card-kicker"><Award size={14} /> Pôle Jury</span>
            <h3>L’exigence du regard</h3>
            <p>Arbitrage impartial, évaluation attentive de la personnalité et déontologie rigoureuse.</p>
          </div>
          <ArrowUpRight className="card-arrow" size={22} />
        </div>

        <div
          className="feature-card card-3"
          onClick={() => onNavigate('/gastronomie')}
          role="button"
          tabIndex={0}
        >
          <img src={images.dessert} alt="Gastronomie d'auteur" />
          <span className="shade" />
          <div className="feature-card-content">
            <span className="card-kicker"><Utensils size={14} /> Pôle Gastronomie</span>
            <h3>La précision culinaire</h3>
            <p>Créations gastronomiques sensibles, dîners privés d’exception et événements sur mesure.</p>
          </div>
          <ArrowUpRight className="card-arrow" size={22} />
        </div>
      </section>

      {/* 3.4 CHIFFRES CLÉS VÉRIFIÉS */}
      {statsList.length > 0 && (
        <section className="stats-section wrap">
          <div className="stats-header">
            <p className="kicker"><span /> Indicateurs professionnels vérifiés</p>
            <h2>L’expérience en chiffres</h2>
          </div>
          <div className="stats-grid">
            {statsList.map((st, i) => (
              <div key={i} className="stat-card">
                <strong>{st.value}</strong>
                <span>{st.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3.5 CONCOURS À LA UNE */}
      {featuredContests.length > 0 && (
        <section className="featured-contests wrap">
          <div className="section-head">
            <div>
              <p className="kicker"><span /> Palmarès & Réalisations</p>
              <h2>Concours coachés à la une</h2>
            </div>
            <button className="text-link" onClick={() => onNavigate('/mes-concours')}>
              <span>Tous les concours</span>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="contests-grid">
            {featuredContests.map((c) => (
              <article key={c.id} className="contest-card" onClick={() => onNavigate(`/mes-concours/${c.slug}`)}>
                <div className="contest-cover">
                  <img src={c.cover_image || images.stage} alt={c.name} />
                  <span className="contest-edition">{c.edition || c.year}</span>
                </div>
                <div className="contest-info">
                  <div className="contest-meta">
                    {c.location && <span>{c.location}</span>}
                    {c.event_date && <span>· {c.event_date}</span>}
                  </div>
                  <h3>{c.name}</h3>
                  <p>{c.short_description || c.long_description.slice(0, 110) + '...'}</p>
                  <div className="contest-card-footer">
                    <span className="results-badge">
                      <Sparkles size={13} /> {c.results?.length ? `${c.results.length} distinctions` : 'Accompagnement complet'}
                    </span>
                    <span className="read-more">
                      Découvrir <ArrowUpRight size={14} />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 3.6 RÉALISATIONS & GALERIE */}
      {featuredMedia.length > 0 && (
        <section className="featured-gallery wrap">
          <div className="section-head">
            <div>
              <p className="kicker"><span /> Captures & Coulisses</p>
              <h2>Extraits de la galerie</h2>
            </div>
            <button className="text-link" onClick={() => onNavigate('/galerie')}>
              <span>Explorer la galerie complète</span>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="gallery-preview-grid">
            {featuredMedia.map((item) => (
              <div
                key={item.id}
                className="gallery-preview-item"
                onClick={() => onOpenMedia(item)}
              >
                <img src={item.thumbnail_url || item.url} alt={item.alt_text || item.title} />
                <div className="preview-overlay">
                  <span className="media-cat">{item.category}</span>
                  <h4>{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3.7 TÉMOIGNAGES APPROUVÉS */}
      {approvedTestimonials.length > 0 && (
        <section className="home-testimonials wrap">
          <div className="section-head">
            <div>
              <p className="kicker"><span /> Retours d’expérience</p>
              <h2>Témoignages</h2>
            </div>
            <button className="text-link" onClick={() => onNavigate('/temoignages')}>
              <span>Voir tous les avis</span>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="testimonials-cards-grid">
            {approvedTestimonials.map((t) => (
              <div key={t.id} className="testimonial-box">
                <Quote size={28} className="quote-icon" />
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

      {/* 3.8 ACTUALITÉS RÉCENTES */}
      {recentArticles.length > 0 && (
        <section className="featured-news wrap">
          <div className="section-head">
            <div>
              <p className="kicker"><span /> Journal & Réflexions</p>
              <h2>Dernières actualités</h2>
            </div>
            <button className="text-link" onClick={() => onNavigate('/actualites')}>
              <span>Toutes les actualités</span>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="news-grid">
            {recentArticles.map((art) => (
              <article
                key={art.id}
                className="news-card"
                onClick={() => onNavigate(`/actualites/${art.slug}`)}
              >
                <div className="news-thumb">
                  <img src={art.cover_image || images.portrait} alt={art.title} />
                  <span className="news-cat">{art.category}</span>
                </div>
                <div className="news-card-body">
                  <span className="news-date">
                    <Calendar size={13} /> {new Date(art.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <h3>{art.title}</h3>
                  <p>{art.summary}</p>
                  <span className="news-read">
                    Lire l’article <ArrowUpRight size={14} />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 3.9 APPEL À L'ACTION */}
      <section className="statement wrap">
        <div>
          <p className="kicker"><span /> {ctaSection?.eyebrow || 'La signature'}</p>
          <h2>{ctaSection?.title || <>La distinction<br /><em>ne se joue pas.</em></>}</h2>
        </div>
        <div>
          <p>
            {ctaSection?.content ||
              'Elle se prépare, se cultive et se partage. Couronne & Toque compose des accompagnements singuliers pour les personnalités qui veulent laisser une impression juste.'}
          </p>
          <button className="button button-dark" onClick={() => onNavigate(ctaSection?.button_url || '/contact')}>
            <span>{ctaSection?.button_label || 'Parlons de votre projet'}</span>
            <ArrowUpRight size={16} />
          </button>
        </div>
      </section>

      {/* CITATION EMBLÉMATIQUE */}
      <section className="quote-section">
        <div className="wrap quote-inner">
          <Quote size={32} />
          <blockquote>« L’élégance, c’est lorsque l’intérieur est aussi beau que l’extérieur. »</blockquote>
          <p>— Gabrielle Chanel</p>
        </div>
      </section>
    </main>
  );
}
