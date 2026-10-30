import { ArrowUpRight, Check, type LucideIcon } from 'lucide-react';
import type { SiteSection } from '@/types';
import Picture from '@/components/common/Picture';
import { rich } from '@/lib/richText';

interface EditorialIntroProps {
  section: SiteSection;
  /** Photo à afficher si la section n'en a pas (ex. photo de la médiathèque) */
  fallbackImage?: string | null;
  imageAlt: string;
  /** Icônes des points forts, dans l'ordre */
  icons?: LucideIcon[];
  onNavigate: (path: string) => void;
}

type Item = Record<string, string>;

/** Bloc éditorial : photo légendée à gauche, texte à lettrine et points forts à droite. */
export default function EditorialIntro({ section, fallbackImage, imageAlt, icons = [], onNavigate }: EditorialIntroProps) {
  const details = ((section.meta.details as Item[] | undefined) ?? []).filter((d) => d?.title || d?.desc);
  const highlights = ((section.meta.highlights as string[] | undefined) ?? []).filter(Boolean);
  const lead = String(section.meta.lead || '');
  const url = section.button_url || '/contact';

  return (
    <section className="editorial-layout">
      <div className="editorial-feature">
        <Picture src={section.image_url || fallbackImage} alt={imageAlt} />
        {(section.eyebrow || section.title) && (
          <div className="feature-caption">
            {section.eyebrow && <p>{section.eyebrow}</p>}
            {section.title && <h2>{rich(section.title)}</h2>}
          </div>
        )}
      </div>

      <div className="editorial-details">
        {section.content && <p className="dropcap">{section.content}</p>}
        <div className="detail-rule" />
        {lead && <p className="detail-lead">{lead}</p>}

        {highlights.length > 0 && (
          <div className="coaching-highlights">
            {highlights.map((item, i) => (
              <div key={i}>
                <Check size={18} className="text-red" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}

        {details.map((detail, i) => {
          const Icon = icons[i % Math.max(icons.length, 1)];
          return (
            <div key={i} className="detail">
              <span>{Icon ? <Icon size={20} /> : null}</span>
              <div>
                {detail.title && <h3>{detail.title}</h3>}
                {detail.desc && <p>{detail.desc}</p>}
              </div>
            </div>
          );
        })}

        {section.button_label &&
          (url.startsWith('#') ? (
            <a href={url} className="button button-dark">
              <span>{section.button_label}</span>
              <ArrowUpRight size={16} />
            </a>
          ) : (
            <button className="button button-dark" onClick={() => onNavigate(url)}>
              <span>{section.button_label}</span>
              <ArrowUpRight size={16} />
            </button>
          ))}
      </div>
    </section>
  );
}
