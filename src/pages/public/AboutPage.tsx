import { ArrowUpRight, Award, CheckCircle2, Crown, Sparkles, Utensils } from 'lucide-react';
import type { MediaItem, SiteSection, SiteSettings } from '@/types';
import EditorialIntro from '@/components/common/EditorialIntro';
import { PageHeading, SectionHead } from '@/components/common/SectionTitles';
import { getSection } from '@/lib/pageSections';
import { rich } from '@/lib/richText';
import { pickImage } from '@/lib/media';

interface AboutPageProps {
  settings: SiteSettings;
  sections: SiteSection[];
  media: MediaItem[];
  onNavigate: (path: string) => void;
}

type Item = Record<string, string>;

export default function AboutPage({ settings, sections, media, onNavigate }: AboutPageProps) {
  const sec = (key: string) => getSection(sections, 'about', key);
  const heading = sec('heading');
  const bio = sec('bio');
  const values = sec('values');
  const distinctions = sec('distinctions');
  const cta = sec('cta');

  const valuesList = ((values.meta.values_list as Item[] | undefined) ?? []).filter((v) => v?.title || v?.desc);
  const certificationsList = ((distinctions.meta.items as string[] | undefined) ?? []).filter(Boolean);

  return (
    <main className="subpage wrap about-page">
      {heading.is_published && <PageHeading section={heading} />}

      {/* PORTRAIT & BIO DÉTAILLÉE */}
      {bio.is_published && (
        <EditorialIntro
          section={bio}
          fallbackImage={pickImage(media, ['coaching', 'evenements', 'galerie'])}
          imageAlt={settings.site_name}
          icons={[Sparkles, Crown, Utensils]}
          onNavigate={onNavigate}
        />
      )}

      {/* VALEURS PROFESSIONNELLES */}
      {values.is_published && valuesList.length > 0 && (
        <section className="about-values-section">
          <SectionHead section={values} />
          <div className="values-grid">
            {valuesList.map((val, idx) => (
              <div key={idx} className="value-card">
                <span className="value-num">{String(idx + 1).padStart(2, '0')}</span>
                <h3>{val.title}</h3>
                <p>{val.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FORMATIONS & DISTINCTIONS */}
      {distinctions.is_published && (
        <section className="about-certifications-section">
          <div className="certifications-box">
            <div className="cert-intro">
              <Award size={36} className="cert-icon" />
              <h2>{rich(distinctions.title)}</h2>
              {distinctions.content && <p>{distinctions.content}</p>}
            </div>
            {certificationsList.length > 0 && (
              <ul className="cert-list">
                {certificationsList.map((item, index) => (
                  <li key={index}>
                    <CheckCircle2 size={18} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {/* APPEL À LA COLLABORATION */}
      {cta.is_published && (
        <section className="about-cta-banner">
          <div className="about-cta-grid">
            <div className="about-cta-heading">
              {cta.eyebrow && <p className="kicker"><span /> {cta.eyebrow}</p>}
              <h2>{rich(cta.title)}</h2>
            </div>
            <div className="about-cta-action">
              {cta.content && <p>{cta.content}</p>}
              {cta.button_label && (
                <button className="button button-dark" onClick={() => onNavigate(cta.button_url || '/contact')}>
                  <span>{cta.button_label}</span>
                  <ArrowUpRight size={16} />
                </button>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
