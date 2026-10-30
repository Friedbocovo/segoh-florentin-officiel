import BrandMark from '@/components/common/BrandMark';
import { isStockPhoto } from '@/lib/media';

interface PictureProps {
  src?: string | null;
  alt: string;
  className?: string;
  /** Petit texte affiché sous le monogramme quand il n'y a pas encore d'image */
  label?: string;
  /** Emplacement clair (fond sable) ou sombre (fond nuit) */
  tone?: 'light' | 'dark';
  loading?: 'lazy' | 'eager';
}

/**
 * Image du site. Sans image téléversée, affiche un emplacement sobre
 * (monogramme) au lieu d'une photo d'illustration fictive.
 */
export default function Picture({ src, alt, className = '', label, tone = 'light', loading }: PictureProps) {
  // Les anciennes photos d'illustration (banque d'images) ne sont plus affichées
  if (src && src.trim() && !isStockPhoto(src)) {
    return <img src={src} alt={alt} className={className} loading={loading} />;
  }

  return (
    <div className={`img-placeholder is-${tone} ${className}`} role="img" aria-label={alt}>
      <BrandMark size={56} />
      {label && <span>{label}</span>}
    </div>
  );
}
