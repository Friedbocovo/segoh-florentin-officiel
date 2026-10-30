import type { MediaItem } from '@/types';

/** Photo d'illustration fictive (banque d'images utilisée par l'ancien contenu de démonstration). */
export function isStockPhoto(url?: string | null): boolean {
  return Boolean(url && url.includes('pexels.com'));
}

/**
 * Première photo publiée de la médiathèque dans l'une des catégories données
 * (ex. ['coaching', 'concours']). Renvoie null s'il n'y en a pas encore.
 */
export function pickImage(media: MediaItem[], categories: MediaItem['category'][], skip = 0): string | null {
  const matches = media.filter(
    (m) =>
      m.is_published && m.media_type === 'image' && m.url && !isStockPhoto(m.url) && categories.includes(m.category)
  );
  const item = matches[skip] ?? matches[0];
  return item ? item.thumbnail_url || item.url : null;
}
