import { ArrowUpRight, Award, Calendar, ChevronRight, Crown, Quote, Sparkles, Utensils } from 'lucide-react';
import type { Article, Contest, MediaItem, SiteSection, SiteSettings, Testimonial } from '@/types';
import Picture from '@/components/common/Picture';
import { SectionHead } from '@/components/common/SectionTitles';
import { pickImage } from '@/lib/media';
import { getSection } from '@/lib/pageSections';
import { rich } from '@/lib/richText';

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

type Item = Record<string, string>;

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
  const sec = (key: string) => getSection(sections, 'home', key);
  const hero = sec('hero');
  const presentation = sec('presentation');
  const features = sec('features');
  const stats = sec('stats');
  const contestsHead = sec('contests_head');
  const galleryHead = sec('gallery_head');
  const testimonialsHead = sec('testimonials_head');
  const newsHead = sec('news_head');
  const cta = sec('cta');
  const quote = sec('quote');

  const pillars = (hero.meta.pillars as Item[] | undefined) ?? [];
  const cards = (features.meta.cards as Item[] | undefined) ?? [];
  const statsList = stats.is_published
    ? ((stats.meta.stats as Item[] | undefined) ?? []).filter((st) => st?.label && st?.value)
    : [];

  // Liens fixes des trois métiers ; textes et photos viennent de l'admin
  // (à défaut de photo, une image de la médiathèque de la bonne catégorie)
  const poles = [
    { path: '/coaching', icon: Crown, image: pickImage(media, ['coaching', 'concours']) },
    { path: '/jury', icon: Award, image: pickImage(media, ['jury']) },
    { path: '/gastronomie', icon: Utensils, image: pickImage(media, ['gastronomie']) },
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
      {/* 3.1 HERO SECTION — couverture éditoriale */}
      <section className="hero">
        <div className="hero-media" aria-hidden="true">
          <Picture src={hero.image_url} alt="" tone="dark" />
        </div>

        <div className="hero-inner wrap">
          <div className="hero-copy">
            {hero.eyebrow && (
              <p className="kicker">
                <span /> {hero.eyebrow}
              </p>
            )}
            <h1>{rich(hero.title, true)}</h1>
            {hero.content && <p className="hero-description">{hero.content}</p>}

            <div className="hero-actions">
              {hero.button_label && (
                <button className="button button-ivory" onClick={() => onNavigate(hero.button_url || '/a-propos')}>
                  <span>{hero.button_label}</span>
                  <ArrowUpRight size={16} />
                </button>
              )}
              {String(hero.meta.secondary_button_label || '') && (
                <button
                  className="button button-ghost"
                  onClick={() => onNavigate(String(hero.meta.secondary_button_url || '/contact'))}
                >
                  <span>{String(hero.meta.secondary_button_label)}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <nav className="hero-pillars wrap" aria-label="Les trois métiers">
          {poles.map((pole, index) => {
            const Icon = pole.icon;
            const text = pillars[index] ?? {};
            return (
              <button key={pole.path} className="pillar-badge" onClick={() => onNavigate(pole.path)}>
                <span className="pillar-index">0{index + 1}</span>
                <span className="pillar-icon"><Icon size={18} /></span>
                <span className="pillar-text">
                  <strong>{text.title}</strong>
                  {text.desc && <small>{text.desc}</small>}
                </span>
                <ArrowUpRight className="pillar-arrow" size={16} />
              </button>
            );
          })}
        </nav>
      </section>

      {/* 3.2 PRÉSENTATION RAPIDE */}
      {presentation.is_published && (
        <section className="intro-strip wrap">
          <div className="line" />
          <div className="intro-text">
            <p className="intro-quote">{rich(presentation.title)}</p>
            {presentation.content && <p className="intro-body">{presentation.content}</p>}
            {presentation.button_label && (
              <button className="text-link" onClick={() => onNavigate(presentation.button_url || '/a-propos')}>
                <span>{presentation.button_label}</span>
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </section>
      )}

      {/* 3.3 MES DOMAINES D'EXPERTISE */}
      {features.is_published && (
        <section className="feature-grid wrap">
          {poles.map((pole, index) => {
            const Icon = pole.icon;
            const card = cards[index] ?? {};
            return (
              <div
                key={pole.path}
                className={`feature-card card-${index + 1}`}
                onClick={() => onNavigate(pole.path)}
                role="button"
                tabIndex={0}
              >
                <Picture src={card.image || pole.image} alt={card.title || ''} tone="dark" />
                <span className="shade" />
                <div className="feature-card-content">
                  {card.kicker && <span className="card-kicker"><Icon size={14} /> {card.kicker}</span>}
                  <h3>{card.title}</h3>
                  {card.desc && <p>{card.desc}</p>}
                </div>
                <ArrowUpRight className="card-arrow" size={22} />
              </div>
            );
          })}
        </section>
      )}

      {/* 3.4 CHIFFRES CLÉS VÉRIFIÉS */}
      {statsList.length > 0 && (
        <section className="stats-section">
          <div className="wrap">
            <div className="stats-header">
              {stats.eyebrow && <p className="kicker"><span /> {stats.eyebrow}<span /></p>}
              <h2>{rich(stats.title)}</h2>
            </div>
            <div className="stats-grid" style={{ ['--stats-count' as string]: statsList.length }}>
              {statsList.map((st, i) => {
                // « 18+ » → 18 + suffixe doré ; « 8 ans » → 8 + « ans »
                const match = st.value.trim().match(/^([\d\s.,]+)(.*)$/);
                return (
                  <div key={i} className="stat-card">
                    <strong>
                      {match ? match[1].trim() : st.value}
                      {match && match[2] && <em>{match[2].trim()}</em>}
                    </strong>
                    <span>{st.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 3.5 CONCOURS À LA UNE */}
      {featuredContests.length > 0 && contestsHead.is_published && (
        <section className="featured-contests wrap">
          <SectionHead section={contestsHead} linkLabel="Tous les concours" onLink={() => onNavigate('/mes-concours')} />

          <div className="contests-grid">
            {featuredContests.map((c) => (
              <article key={c.id} className="contest-card" onClick={() => onNavigate(`/mes-concours/${c.slug}`)}>
                <div className="contest-cover">
                  <Picture src={c.cover_image} alt={c.name} />
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
      {featuredMedia.length > 0 && galleryHead.is_published && (
        <section className="featured-gallery wrap">
          <SectionHead section={galleryHead} linkLabel="Explorer la galerie complète" onLink={() => onNavigate('/galerie')} />

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
      {approvedTestimonials.length > 0 && testimonialsHead.is_published && (
        <section className="home-testimonials wrap">
          <SectionHead section={testimonialsHead} linkLabel="Voir tous les avis" onLink={() => onNavigate('/temoignages')} />

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
      {recentArticles.length > 0 && newsHead.is_published && (
        <section className="featured-news wrap">
          <SectionHead section={newsHead} linkLabel="Toutes les actualités" onLink={() => onNavigate('/actualites')} />

          <div className="news-grid">
            {recentArticles.map((art) => (
              <article
                key={art.id}
                className="news-card"
                onClick={() => onNavigate(`/actualites/${art.slug}`)}
              >
                <div className="news-thumb">
                  <Picture src={art.cover_image} alt={art.title} />
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
      {cta.is_published && (
        <section className="statement wrap">
          <div>
            {cta.eyebrow && <p className="kicker"><span /> {cta.eyebrow}</p>}
            <h2>{rich(cta.title)}</h2>
          </div>
          <div>
            {cta.content && <p>{cta.content}</p>}
            {cta.button_label && (
              <button className="button button-dark" onClick={() => onNavigate(cta.button_url || '/contact')}>
                <span>{cta.button_label}</span>
                <ArrowUpRight size={16} />
              </button>
            )}
          </div>
        </section>
      )}

      {/* CITATION EMBLÉMATIQUE */}
      {quote.is_published && quote.title && (
        <section className="quote-section">
          <div className="wrap quote-inner">
            <Quote size={32} />
            <blockquote>{rich(quote.title)}</blockquote>
            {quote.eyebrow && <p>— {quote.eyebrow}</p>}
          </div>
        </section>
      )}
    </main>
  );
}
