import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { MediaItem } from '@/types';

interface LightboxProps {
  media: MediaItem | null;
  allMedia?: MediaItem[];
  onClose: () => void;
  onNavigate?: (item: MediaItem) => void;
}

export default function Lightbox({ media, allMedia = [], onClose, onNavigate }: LightboxProps) {
  useEffect(() => {
    if (!media) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNavigate && allMedia.length > 1) {
        const currentIndex = allMedia.findIndex((m) => m.id === media.id);
        const nextItem = allMedia[(currentIndex + 1) % allMedia.length];
        onNavigate(nextItem);
      }
      if (e.key === 'ArrowLeft' && onNavigate && allMedia.length > 1) {
        const currentIndex = allMedia.findIndex((m) => m.id === media.id);
        const prevItem = allMedia[(currentIndex - 1 + allMedia.length) % allMedia.length];
        onNavigate(prevItem);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [media, allMedia, onClose, onNavigate]);

  if (!media) return null;

  const currentIndex = allMedia.findIndex((m) => m.id === media.id);
  const hasPrev = allMedia.length > 1 && currentIndex > 0;
  const hasNext = allMedia.length > 1 && currentIndex < allMedia.length - 1;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onNavigate && allMedia.length > 1) {
      const prevItem = allMedia[(currentIndex - 1 + allMedia.length) % allMedia.length];
      onNavigate(prevItem);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onNavigate && allMedia.length > 1) {
      const nextItem = allMedia[(currentIndex + 1) % allMedia.length];
      onNavigate(nextItem);
    }
  };

  return (
    <div className="lightbox-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <button className="lightbox-close" onClick={onClose} aria-label="Fermer la visionneuse">
        <X size={26} />
      </button>

      {allMedia.length > 1 && (
        <>
          <button
            className={`lightbox-nav lightbox-prev ${!hasPrev && currentIndex === 0 ? 'disabled' : ''}`}
            onClick={handlePrev}
            aria-label="Média précédent"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            className={`lightbox-nav lightbox-next ${!hasNext && currentIndex === allMedia.length - 1 ? 'disabled' : ''}`}
            onClick={handleNext}
            aria-label="Média suivant"
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}

      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        {media.media_type === 'video' ? (
          <video
            src={media.url}
            controls
            autoPlay
            playsInline
            className="lightbox-media"
          />
        ) : (
          <img
            src={media.url}
            alt={media.alt_text || media.title}
            className="lightbox-media"
          />
        )}

        {(media.title || media.caption) && (
          <div className="lightbox-caption">
            {media.title && <h3>{media.title}</h3>}
            {media.caption && <p>{media.caption}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
