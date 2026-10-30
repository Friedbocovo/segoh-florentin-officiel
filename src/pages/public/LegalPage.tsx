import type { SiteSection, SiteSettings } from '@/types';
import { PageHeading } from '@/components/common/SectionTitles';
import { getSection } from '@/lib/pageSections';

interface LegalPageProps {
  settings: SiteSettings;
  sections: SiteSection[];
}

type Block = { title?: string; desc?: string };

export default function LegalPage({ settings, sections }: LegalPageProps) {
  const heading = getSection(sections, 'legal', 'heading');
  const content = getSection(sections, 'legal', 'blocks');
  const blocks = ((content.meta.blocks as Block[] | undefined) ?? []).filter((b) => b?.title || b?.desc);

  // Remplace {site}, {email}, {telephone}, {adresse} par les coordonnées des réglages
  const fill = (text: string) =>
    text
      .replace(/\{site\}/g, settings.site_name)
      .replace(/\{email\}/g, settings.contact_email || '—')
      .replace(/\{telephone\}/g, settings.contact_phone || '—')
      .replace(/\{adresse\}/g, settings.contact_address || '—');

  return (
    <main className="subpage wrap legal-page">
      {heading.is_published && <PageHeading section={heading} />}

      {content.is_published && (
        <div className="legal-content-body">
          {blocks.map((block, index) => (
            <section key={index} className="legal-block">
              {block.title && <h2>{fill(block.title)}</h2>}
              {(block.desc || '')
                .split(/\n\s*\n/)
                .filter((para) => para.trim())
                .map((para, i) => (
                  <p key={i}>
                    {fill(para)
                      .split('\n')
                      .map((line, j, lines) => (
                        <span key={j}>
                          {line}
                          {j < lines.length - 1 && <br />}
                        </span>
                      ))}
                  </p>
                ))}
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
