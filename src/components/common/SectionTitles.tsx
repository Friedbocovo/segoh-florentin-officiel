import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import type { SiteSection } from '@/types';
import { rich } from '@/lib/richText';

/** Grand en-tête de page : sur-titre, titre et texte d'introduction à droite. */
export function PageHeading({ section }: { section: SiteSection }) {
  return (
    <div className="page-heading">
      <div>
        {section.eyebrow && <p className="kicker"><span /> {section.eyebrow}</p>}
        <h1>{rich(section.title)}</h1>
      </div>
      {section.content && <p className="heading-note">{section.content}</p>}
    </div>
  );
}

/** Titre d'un bloc de contenu, avec un lien optionnel à droite. */
export function SectionHead({
  section,
  linkLabel,
  onLink,
  aside,
}: {
  section: SiteSection;
  linkLabel?: string;
  onLink?: () => void;
  aside?: ReactNode;
}) {
  return (
    <div className="section-head">
      <div>
        {section.eyebrow && <p className="kicker"><span /> {section.eyebrow}</p>}
        <h2>{rich(section.title)}</h2>
      </div>
      {linkLabel && onLink && (
        <button className="text-link" onClick={onLink}>
          <span>{linkLabel}</span>
          <ChevronRight size={16} />
        </button>
      )}
      {aside}
    </div>
  );
}
