import { useMemo, useState } from 'react';
import { ArrowUpRight, Calendar, Search, Tag } from 'lucide-react';
import type { SiteSection, Article } from '@/types';
import Picture from '@/components/common/Picture';
import { PageHeading, SectionHead } from '@/components/common/SectionTitles';
import EditorialIntro from '@/components/common/EditorialIntro';
import { getSection } from '@/lib/pageSections';
import { rich } from '@/lib/richText';

interface NewsPageProps {
  sections: SiteSection[];
  articles: Article[];
  onNavigate: (path: string) => void;
}

export default function NewsPage({ sections, articles, onNavigate }: NewsPageProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Catégories uniques
  const categories = useMemo(() => {
    const cats = Array.from(new Set(articles.map((a) => a.category))).filter(Boolean);
    return cats;
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles
      .filter((a) => a.is_published)
      .filter((a) => {
        const matchesSearch =
          a.title.toLowerCase().includes(search.toLowerCase()) ||
          a.summary.toLowerCase().includes(search.toLowerCase());
        const matchesCat = categoryFilter === 'all' || a.category === categoryFilter;
        return matchesSearch && matchesCat;
      })
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  }, [articles, search, categoryFilter]);

  const heading = getSection(sections, 'news', 'heading');

  return (
    <main className="subpage wrap news-page">
      {heading.is_published && <PageHeading section={heading} />}

      {/* RECHERCHE ET FILTRES CATÉGORIES */}
      <div className="catalogue-toolbar">
        <div className="search-input-box">
          <Search size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un article, un conseil..."
          />
        </div>

        <div className="filter-select-wrap">
          <span>Catégorie :</span>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">Toutes les catégories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* LISTE D'ARTICLES */}
      {filteredArticles.length === 0 ? (
        <div className="empty-state">
          <Tag size={42} />
          <h2>Aucun article trouvé</h2>
          <p>Essayez de modifier votre mot-clé de recherche ou de réinitialiser le filtre.</p>
        </div>
      ) : (
        <div className="news-grid-page">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              className="news-card"
              onClick={() => onNavigate(`/actualites/${article.slug}`)}
            >
              <div className="news-thumb">
                <Picture src={article.cover_image} alt={article.title} />
                <span className="news-cat">{article.category}</span>
              </div>
              <div className="news-card-body">
                <span className="news-date">
                  <Calendar size={13} /> {new Date(article.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <h3>{article.title}</h3>
                <p>{article.summary}</p>
                <span className="news-read">
                  Lire l’article complet <ArrowUpRight size={14} />
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
