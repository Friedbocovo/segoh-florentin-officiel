import { useMemo, useState } from 'react';
import { ArrowUpRight, Calendar, MapPin, Search, Sparkles, Trophy } from 'lucide-react';
import type { SiteSection, Contest } from '@/types';
import Picture from '@/components/common/Picture';
import { PageHeading, SectionHead } from '@/components/common/SectionTitles';
import EditorialIntro from '@/components/common/EditorialIntro';
import { getSection } from '@/lib/pageSections';
import { rich } from '@/lib/richText';

interface ContestsPageProps {
  sections: SiteSection[];
  contests: Contest[];
  onNavigate: (path: string) => void;
}

export default function ContestsPage({ sections, contests, onNavigate }: ContestsPageProps) {
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Années uniques pour filtre
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(contests.map((c) => c.year))).filter(Boolean);
    return years.sort((a, b) => b - a);
  }, [contests]);

  // Filtrage et tri des concours
  const filteredContests = useMemo(() => {
    return contests
      .filter((c) => c.is_published)
      .filter((c) => {
        const matchesSearch =
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.short_description.toLowerCase().includes(search.toLowerCase()) ||
          c.location.toLowerCase().includes(search.toLowerCase());
        const matchesYear = yearFilter === 'all' || String(c.year) === yearFilter;
        return matchesSearch && matchesYear;
      })
      .sort((a, b) => {
        return sortOrder === 'desc' ? b.year - a.year : a.year - b.year;
      });
  }, [contests, search, yearFilter, sortOrder]);

  const heading = getSection(sections, 'contests', 'heading');

  return (
    <main className="subpage wrap contests-page">
      {heading.is_published && <PageHeading section={heading} />}

      {/* BARRE DE RECHERCHE ET FILTRES */}
      <div className="catalogue-toolbar">
        <div className="search-input-box">
          <Search size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom de concours, ville..."
          />
        </div>

        <div className="filters-group">
          <div className="filter-select-wrap">
            <span>Année :</span>
            <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
              <option value="all">Toutes les années</option>
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-select-wrap">
            <span>Tri :</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'desc' | 'asc')}
            >
              <option value="desc">Plus récents d’abord</option>
              <option value="asc">Plus anciens d’abord</option>
            </select>
          </div>
        </div>
      </div>

      {/* RÉSULTATS DU CATALOGUE */}
      {filteredContests.length === 0 ? (
        <div className="empty-state">
          <Trophy size={42} />
          <h2>Aucun concours ne correspond à votre recherche</h2>
          <p>Essayez de modifier vos filtres ou de réinitialiser la recherche.</p>
          <button className="button button-dark" onClick={() => { setSearch(''); setYearFilter('all'); }}>
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="contests-grid">
          {filteredContests.map((contest) => {
            const resultsCount = contest.results?.length || 0;
            return (
              <article
                key={contest.id}
                className="contest-card"
                onClick={() => onNavigate(`/mes-concours/${contest.slug}`)}
              >
                <div className="contest-cover">
                  <Picture src={contest.cover_image} alt={contest.name} />
                  <span className="contest-edition">{contest.edition}</span>
                </div>
                <div className="contest-info">
                  <div className="contest-meta">
                    {contest.location && (
                      <span className="meta-item">
                        <MapPin size={13} /> {contest.location}
                      </span>
                    )}
                    {contest.event_date && (
                      <span className="meta-item">
                        <Calendar size={13} /> {contest.event_date}
                      </span>
                    )}
                  </div>
                  <h3>{contest.name}</h3>
                  <p className="contest-short-desc">
                    {contest.short_description || contest.long_description.slice(0, 110) + '...'}
                  </p>
                  <div className="contest-card-footer">
                    <span className="results-badge">
                      <Trophy size={13} /> {resultsCount} {resultsCount > 1 ? 'distinctions' : 'résultat'}
                    </span>
                    <span className="read-more">
                      Découvrir le concours <ArrowUpRight size={14} />
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
