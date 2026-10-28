import { ShieldCheck } from 'lucide-react';
import type { SiteSettings } from '@/types';

interface LegalPageProps {
  settings: SiteSettings;
}

export default function LegalPage({ settings }: LegalPageProps) {
  return (
    <main className="subpage wrap legal-page">
      <div className="page-heading">
        <div>
          <p className="kicker"><span /> Informations Légales</p>
          <h1>Mentions Légales & Confidentialité</h1>
        </div>
        <p className="heading-note">
          Conformité avec les réglementations en vigueur et protection des données personnelles (RGPD).
        </p>
      </div>

      <div className="legal-content-body">
        <section className="legal-block">
          <h2>1. Éditeur de la plateforme</h2>
          <p>
            Le site <strong>{settings.site_name}</strong> est édité par le représentant de l’activité Couronne & Toque.<br />
            Courriel de contact : <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a><br />
            {settings.contact_phone && <>Téléphone : {settings.contact_phone}<br /></>}
            Adresse professionnelle : {settings.contact_address}
          </p>
        </section>

        <section className="legal-block">
          <h2>2. Hébergement & Infrastructure</h2>
          <p>
            Le site web et ses fonctionnalités applicatives sont hébergés sur des serveurs sécurisés conformes aux normes européennes de protection des données, avec persistance assurée par Supabase Inc.
          </p>
        </section>

        <section className="legal-block">
          <h2>3. Propriété intellectuelle</h2>
          <p>
            L’intégralité des éléments figurant sur le site {settings.site_name} (textes, photographies, logos, créations culinaires, chartes graphiques) est protégée par les dispositions du Code de la propriété intellectuelle. Toute reproduction, même partielle, sans autorisation préalable écrite est formellement interdite.
          </p>
        </section>

        <section className="legal-block">
          <h2>4. Protection des données personnelles (RGPD)</h2>
          <p>
            Les données personnelles transmises via les formulaires de contact ou de dépôt de témoignage (nom, adresse e-mail, numéro de téléphone, messages) sont exclusivement utilisées pour répondre à vos demandes et organiser les prestations sollicitées.
          </p>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d’un droit d’accès, de rectification et de suppression de vos données personnelles. Pour exercer ce droit, adressez simplement votre demande par courrier électronique à l’adresse <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>.
          </p>
        </section>

        <section className="legal-block">
          <h2>5. Cookies & Traçabilité</h2>
          <p>
            Ce site ne dépose aucun cookie publicitaire ou traceur tiers intrusif. Seuls les témoins de session nécessaires au fonctionnement technique de l’espace privé et à la mémorisation de vos préférences de navigation peuvent être utilisés.
          </p>
        </section>
      </div>
    </main>
  );
}
