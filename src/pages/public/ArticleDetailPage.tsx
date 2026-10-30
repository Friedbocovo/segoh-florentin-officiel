import { useEffect } from 'react';
import { ArrowLeft, ArrowUpRight, Calendar, Share2, Tag } from 'lucide-react';
import type { Article } from '@/types';
import Picture from '@/components/common/Picture';
import { canonicalUrl, updateSEO } from '@/lib/seo';

interface ArticleDetailPageProps {
  slug: string;
  articles: Article[];
  onNavigate: (path: string) => void;
}

export default function ArticleDetailPage({ slug, articles, onNavigate }: ArticleDetailPageProps) {
  const article = articles.find((a) => a.slug === slug);

  useEffect(() => {
    if (article) {
      updateSEO({
        title: article.seo_title || `${article.title} — MC Florentin`,
        description: article.seo_description || article.summary,
        ogImage: article.cover_image || undefined,
        ogType: 'article',
        canonical: canonicalUrl(`/actualites/${article.slug}`),
      });
    }
  }, [article]);

  if (!article || (!article.is_published && !window.location.pathname.startsWith('/admin'))) {
    return (
      <main className="subpage wrap not-found-page">
        <div className="empty-state">
          <h2>Article introuvable ou non publié</h2>
          <p>Le contenu que vous recherchez n’est pas accessible publiquement.</p>
          <button className="button button-dark" onClick={() => onNavigate('/actualites')}>
            <ArrowLeft size={16} />
            <span>Retour aux actualités</span>
          </button>
        </div>
      </main>
    );
  }

  // Articles suggérés
  const relatedArticles = articles
    .filter((a) => a.is_published && a.id !== article.id)
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien de l’article copié dans votre presse-papier !');
    }
  };

  return (
    <main className="subpage wrap article-detail-page">
      <button className="back-button" onClick={() => onNavigate('/actualites')}>
        <ArrowLeft size={16} />
        <span>Retour à toutes les actualités</span>
      </button>

      <article className="article-main-container">
        <header className="article-header">
          <div className="article-meta-row">
            <span className="category-pill">{article.category}</span>
            <span className="date-item">
              <Calendar size={14} />
              {new Date(article.published_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>

          <h1>{article.title}</h1>
          <p className="article-lead">{article.summary}</p>
        </header>

        {article.cover_image && (
          <div className="article-cover-wrap">
            <img src={article.cover_image} alt={article.title} />
          </div>
        )}

        <div className="article-body-content">
          {article.content.split('\n\n').map((paragraph, index) => {
            const trimmed = paragraph.trim();
            if (trimmed.startsWith('### ')) {
              return <h2 key={index}>{trimmed.replace('### ', '')}</h2>;
            }
            if (trimmed.startsWith('#### ')) {
              return <h3 key={index}>{trimmed.replace('#### ', '')}</h3>;
            }
            if (trimmed.startsWith('> ')) {
              return (
                <blockquote key={index}>
                  {trimmed.replace('> ', '')}
                </blockquote>
              );
            }
            return <p key={index}>{trimmed}</p>;
          })}
        </div>

        <footer className="article-footer-tools">
          <button className="share-btn" onClick={handleShare}>
            <Share2 size={16} />
            <span>Partager cet article</span>
          </button>
        </footer>
      </article>

      {/* ARTICLES ASSOCIÉS */}
      {relatedArticles.length > 0 && (
        <section className="related-articles-section">
          <div className="section-head">
            <div>
              <p className="kicker"><span /> Poursuivre la lecture</p>
              <h2>Articles similaires</h2>
            </div>
          </div>
          <div className="news-grid">
            {relatedArticles.map((rel) => (
              <article
                key={rel.id}
                className="news-card"
                onClick={() => onNavigate(`/actualites/${rel.slug}`)}
              >
                <div className="news-thumb">
                  <Picture src={rel.cover_image} alt={rel.title} />
                  <span className="news-cat">{rel.category}</span>
                </div>
                <div className="news-card-body">
                  <h3>{rel.title}</h3>
                  <p>{rel.summary}</p>
                  <span className="news-read">
                    Lire l’article <ArrowUpRight size={14} />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
