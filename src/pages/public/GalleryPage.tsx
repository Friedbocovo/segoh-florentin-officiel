import { useMemo, useState } from 'react';
import { Image as ImageIcon, Play, Sparkles, Video } from 'lucide-react';
import type { MediaItem } from '@/types';

interface GalleryPageProps {
  media: MediaItem[];
  onOpenMedia: (item: MediaItem, all: MediaItem[]) => void;
}

const categories = [
  { id: 'all', label: 'Toutes les captures' },
  { id: 'coaching', label: 'Coaching Miss & Mister' },
  { id: 'jury', label: 'Jury de Concours' },
  { id: 'gastronomie', label: 'Gastronomie & Plats' },
  { id: 'concours', label: 'Événements & Podiums' },
];

export default function GalleryPage({ media, onOpenMedia }: GalleryPageProps) {
  const [selectedCat, setSelectedCat] = useState('all');

  const filteredMedia = useMemo(() => {
    return media
      .filter((m) => m.is_published)
      .filter((m) => (selectedCat === 'all' ? true : m.category === selectedCat))
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [media, selectedCat]);

  return (
    <main className="subpage wrap gallery-page">
      <div className="page-heading">
        <div>
          <p className="kicker"><span /> Portfolio Visuel & Coulisses</p>
          <h1>Galerie Photographique & Vidéo</h1>
        </div>
        <p className="heading-note">
          De la concentration en loges au dressage minutieux en cuisine, revivez les moments d’exception en images.
        </p>
      </div>

      {/* FILTRES CATÉGORIES */}
      <div className="gallery-filters-bar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`filter-pill ${selectedCat === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCat(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* GRILLE D'IMAGES & VIDÉOS */}
      {filteredMedia.length === 0 ? (
        <div className="empty-state">
          <ImageIcon size={42} />
          <h2>Aucun média dans cette catégorie</h2>
          <p>Choisissez un autre filtre pour explorer la médiathèque.</p>
        </div>
      ) : (
        <div className="gallery-masonry-grid">
          {filteredMedia.map((item) => (
            <article
              key={item.id}
              className="gallery-card"
              onClick={() => onOpenMedia(item, filteredMedia)}
              role="button"
              tabIndex={0}
            >
              <img
                src={item.thumbnail_url || item.url}
                alt={item.alt_text || item.title}
                loading="lazy"
              />
              {item.media_type === 'video' && (
                <div className="video-badge-indicator">
                  <Play size={20} />
                </div>
              )}
              <div className="gallery-card-overlay">
                <span className="media-category-tag">{item.category}</span>
                <h3>{item.title}</h3>
                {item.caption && <p>{item.caption}</p>}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
