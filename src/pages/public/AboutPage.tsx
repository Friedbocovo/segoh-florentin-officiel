import { ArrowUpRight, Award, CheckCircle2, ChevronRight, Crown, Heart, Shield, Sparkles, Utensils } from 'lucide-react';
import type { SiteSection, SiteSettings } from '@/types';
import { images } from '@/lib/supabase';

interface AboutPageProps {
  settings: SiteSettings;
  sections: SiteSection[];
  onNavigate: (path: string) => void;
}

export default function AboutPage({ settings, sections, onNavigate }: AboutPageProps) {
  const bioSection = sections.find((s) => s.section_key === 'bio');
  const valuesSection = sections.find((s) => s.section_key === 'values');
  const distinctionsSection = sections.find((s) => s.section_key === 'distinctions');

  const valuesList: Array<{ title: string; desc: string }> = valuesSection?.meta?.values_list || [
    { title: 'Authenticité', desc: 'Faire émerger la véritable personnalité du candidat sans artifice ni faux-semblant.' },
    { title: 'Exigence bienveillante', desc: 'Pousser vers l’excellence avec respect, écoute et rigueur technique.' },
    { title: 'Précision du détail', desc: 'Du placement des mains sur scène à la justesse d’un assaisonnement à table.' },
  ];

  const certificationsList: string[] = distinctionsSection?.meta?.items || [
    'Diplômé d’État en Arts Culinaires & Gastronomie Française',
    'Formation certifiante aux techniques d’expression scénique et prise de parole en public',
    'Membre et président de jurys d’élections régionales depuis plus de 6 ans',
    'Accompagnateur et coach officiel de lauréats de titres régionaux et nationaux',
  ];

  return (
    <main className="subpage wrap about-page">
      <div className="page-heading">
        <div>
          <p className="kicker"><span /> {settings.site_name}</p>
          <h1 className='text-4xl md:w-[900px] '>À propos & Parcours</h1>
        </div>
  
      </div>

      {/* PORTRAIT & BIO DÉTAILLÉE */}
      <section className="editorial-layout">
        <div className="editorial-feature">
          <img src={bioSection?.image_url || images.portrait} alt={settings.site_name} />
          <div className="feature-caption">
            <p>Une signature, deux univers</p>
            <h2>L’art de la présence</h2>
          </div>
        </div>

        <div className="editorial-details">
          <p className="dropcap">
            {bioSection?.content ||
              'Mon cheminement professionnel s’est construit autour d’une quête constante de perfection et d’humanité. Formé aux exigences de la grande cuisine, j’ai très vite compris que la maîtrise du geste et le contrôle du trac procèdent de la même vérité intérieure que l’entrée sur scène d’un candidat à un concours de beauté.'}
          </p>

          <div className="detail-rule" />

          <div className="detail">
            <span><Sparkles size={20} /></span>
            <div>
              <h3>Une méthode forgée sur le terrain</h3>
              <p>
                Ni formule magique, ni posture imposée : mon travail repose sur un diagnostic franc de votre potentiel et un entraînement progressif qui libère votre charisme naturel.
              </p>
            </div>
          </div>

          <div className="detail">
            <span><Crown size={20} /></span>
            <div>
              <h3>Sur scène : révéler et sécuriser</h3>
              <p>
                Aider les candidats Miss & Mister à habiter leur corps, à apprivoiser la scène et à captiver un jury avec des mots justes et sincères.
              </p>
            </div>
          </div>

          <div className="detail">
            <span><Utensils size={20} /></span>
            <div>
              <h3>À table : émouvoir et partager</h3>
              <p>
                Composer une cuisine d’auteur lisible, élégante et gourmande, qui transforme chaque repas en un moment d’exception inoubliable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALEURS PROFESSIONNELLES */}
      {valuesSection && valuesSection.is_published && (
        <section className="about-values-section">
          <div className="section-head">
            <div>
              <p className="kicker"><span /> Éthique & Déontologie</p>
              <h2>{valuesSection.title || 'Mes valeurs professionnelles'}</h2>
            </div>
          </div>
          <div className="values-grid">
            {valuesList.map((val, idx) => (
              <div key={idx} className="value-card">
                <span className="value-num">0{idx + 1}</span>
                <h3>{val.title}</h3>
                <p>{val.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FORMATIONS & DISTINCTIONS */}
      {distinctionsSection && distinctionsSection.is_published && (
        <section className="about-certifications-section">
          <div className="certifications-box">
            <div className="cert-intro">
              <Award size={36} className="cert-icon" />
              <h2>{distinctionsSection.title || 'Formations, Certifications & Distinctions'}</h2>
              <p>{distinctionsSection.content || 'Un parcours jalonné d’apprentissages continus au service de l’excellence.'}</p>
            </div>
            <ul className="cert-list">
              {certificationsList.map((item, index) => (
                <li key={index}>
                  <CheckCircle2 size={18} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* APPEL À LA COLLABORATION */}
      <section className="about-cta-banner">
        <div className="about-cta-grid">
          <div className="about-cta-heading">
            <p className="kicker"><span /> Travaillons ensemble</p>
            <h2>Donnons vie à votre projet</h2>
          </div>
          <div className="about-cta-action">
            <p>
              Que vous soyez candidat préparant un titre, organisateur d’un concours d’élégance en quête d’un jury rigoureux ou particulier souhaitant un dîner d’exception, je serai ravi d’échanger avec vous.
            </p>
            <button className="button button-dark" onClick={() => onNavigate('/contact')}>
              <span>Initier un échange</span>
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
