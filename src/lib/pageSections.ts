import type { SiteSection } from '@/types';

/**
 * Registre de toutes les pages du site et de leurs sections modifiables.
 *
 * - Le site lit chaque texte via getSection() : la version enregistrée en base
 *   si elle existe, sinon la valeur par défaut ci-dessous.
 * - L'admin « Pages & Sections » affiche ces pages et construit le formulaire
 *   de chaque section à partir de `fields` et `meta`.
 */

export type SectionField = 'eyebrow' | 'title' | 'content' | 'image' | 'button';

export type ListItemField = { name: string; label: string; multiline?: boolean; short?: boolean; image?: boolean };

export type MetaFieldDef =
  | { key: string; type: 'text' | 'textarea'; label: string; placeholder?: string }
  | { key: string; type: 'lines'; label: string }
  | { key: string; type: 'list'; label: string; itemLabel: string; item: ListItemField[]; fixedCount?: boolean };

export interface SectionDef {
  key: string;
  label: string;
  fields: SectionField[];
  /** Libellés propres à la section (ex. « Auteur » pour le sur-titre de la citation) */
  labels?: Partial<Record<SectionField, string>>;
  meta?: MetaFieldDef[];
  defaults: {
    eyebrow?: string;
    title?: string;
    content?: string;
    button_label?: string;
    button_url?: string;
    meta?: Record<string, unknown>;
  };
}

export interface PageDef {
  page: string;
  label: string;
  path: string;
  sections: SectionDef[];
}

// Sections réutilisées
const heading = (eyebrow: string, title: string, content: string): SectionDef => ({
  key: 'heading',
  label: 'En-tête de page',
  fields: ['eyebrow', 'title', 'content'],
  labels: { content: 'Texte d’introduction (à droite du titre)' },
  defaults: { eyebrow, title, content },
});

const blockHead = (key: string, label: string, eyebrow: string, title: string): SectionDef => ({
  key,
  label,
  fields: ['eyebrow', 'title'],
  defaults: { eyebrow, title },
});

const detailsList: MetaFieldDef = {
  key: 'details',
  type: 'list',
  label: 'Points forts (avec icône)',
  itemLabel: 'point',
  item: [
    { name: 'title', label: 'Titre' },
    { name: 'desc', label: 'Texte', multiline: true },
  ],
};

const editorialIntro = (
  defaults: SectionDef['defaults'],
  extraMeta: MetaFieldDef[] = []
): SectionDef => ({
  key: 'intro',
  label: 'Introduction (photo + texte)',
  fields: ['eyebrow', 'title', 'content', 'image', 'button'],
  labels: {
    eyebrow: 'Légende de la photo — petite ligne',
    title: 'Légende de la photo — titre',
    content: 'Texte d’ouverture (grande lettrine)',
    image: 'Photo (sinon, première photo de la médiathèque dans la catégorie de la page)',
  },
  meta: [{ key: 'lead', type: 'textarea', label: 'Paragraphe sous le texte d’ouverture' }, ...extraMeta],
  defaults,
});

const ctaBlock = (title: string, content: string, button_label: string, button_url: string): SectionDef => ({
  key: 'cta',
  label: 'Encadré final (appel à l’action)',
  fields: ['title', 'content', 'button'],
  defaults: { title, content, button_label, button_url },
});

export const PAGE_REGISTRY: PageDef[] = [
  {
    page: 'home',
    label: 'Accueil',
    path: '/',
    sections: [
      {
        key: 'hero',
        label: 'Haut de page (héros)',
        fields: ['eyebrow', 'title', 'content', 'image', 'button'],
        meta: [
          { key: 'secondary_button_label', type: 'text', label: 'Texte du second bouton' },
          { key: 'secondary_button_url', type: 'text', label: 'Lien du second bouton' },
          {
            key: 'pillars',
            type: 'list',
            label: 'Bandeau des trois métiers (bas du héros)',
            itemLabel: 'métier',
            fixedCount: true,
            item: [
              { name: 'title', label: 'Métier' },
              { name: 'desc', label: 'Sous-titre' },
            ],
          },
        ],
        defaults: {
          eyebrow: 'Coach Miss & Mister · Jury · Chef Cuisinier',
          title: 'Révéler *l’élégance,* | sur scène comme à table',
          content:
            'J’accompagne celles et ceux qui veulent entrer dans la lumière avec justesse, prestance et vérité. Une même exigence, du premier regard à la dernière assiette.',
          button_label: 'Découvrir mon parcours',
          button_url: '/a-propos',
          meta: {
            secondary_button_label: 'Me contacter',
            secondary_button_url: '/contact',
            pillars: [
              { title: 'Coaching Miss & Mister', desc: 'Scène, posture, éloquence' },
              { title: 'Jury de concours', desc: 'Regard, rigueur, déontologie' },
              { title: 'Chef cuisinier', desc: 'Dîners privés & réceptions' },
            ],
          },
        },
      },
      {
        key: 'presentation',
        label: 'Présentation',
        fields: ['title', 'content', 'button'],
        labels: { title: 'Phrase d’accroche' },
        defaults: {
          title: 'Une présence qui s’affirme. | *Une assiette qui se raconte.*',
          content:
            'Depuis plusieurs années, j’unis la rigueur de la gastronomie d’auteur et l’art subtil de la scène. Mon rôle est de faire émerger la singularité de chaque personnalité, sans artifice inutile.',
          button_label: 'En savoir plus sur mon histoire',
          button_url: '/a-propos',
        },
      },
      {
        key: 'features',
        label: 'Les trois pôles (cartes photo)',
        fields: [],
        meta: [
          {
            key: 'cards',
            type: 'list',
            label: 'Cartes (Coaching, Jury, Gastronomie)',
            itemLabel: 'carte',
            fixedCount: true,
            item: [
              { name: 'kicker', label: 'Petite ligne' },
              { name: 'title', label: 'Titre' },
              { name: 'desc', label: 'Texte', multiline: true },
              { name: 'image', label: 'Photo de la carte', image: true },
            ],
          },
        ],
        defaults: {
          meta: {
            cards: [
              { kicker: 'Pôle Coaching', title: 'L’art de la scène', desc: 'Accompagnement d’exception : démarche, posture, éloquence et préparation mentale.' },
              { kicker: 'Pôle Jury', title: 'L’exigence du regard', desc: 'Arbitrage impartial, évaluation attentive de la personnalité et déontologie rigoureuse.' },
              { kicker: 'Pôle Gastronomie', title: 'La précision culinaire', desc: 'Créations gastronomiques sensibles, dîners privés d’exception et événements sur mesure.' },
            ],
          },
        },
      },
      {
        key: 'stats',
        label: 'Chiffres clés',
        fields: ['eyebrow', 'title'],
        meta: [
          {
            key: 'stats',
            type: 'list',
            label: 'Chiffres affichés',
            itemLabel: 'chiffre',
            item: [
              { name: 'value', label: 'Valeur', short: true },
              { name: 'label', label: 'Libellé' },
            ],
          },
        ],
        defaults: {
          eyebrow: 'Indicateurs professionnels vérifiés',
          title: 'L’expérience *en chiffres*',
          meta: {
            stats: [
              { label: 'Concours coachés', value: '18+' },
              { label: 'Candidats accompagnés', value: '45+' },
              { label: 'Titres & écharpes remportés', value: '26' },
              { label: 'Jurys arbitrés', value: '32' },
              { label: 'Années d’expérience', value: '8 ans' },
            ],
          },
        },
      },
      blockHead('contests_head', 'Titre — Concours à la une', 'Palmarès & Réalisations', 'Concours coachés à la une'),
      blockHead('gallery_head', 'Titre — Extraits de la galerie', 'Captures & Coulisses', 'Extraits de la galerie'),
      blockHead('testimonials_head', 'Titre — Témoignages', 'Retours d’expérience', 'Témoignages'),
      blockHead('news_head', 'Titre — Dernières actualités', 'Journal & Réflexions', 'Dernières actualités'),
      {
        key: 'cta',
        label: 'Appel final',
        fields: ['eyebrow', 'title', 'content', 'button'],
        defaults: {
          eyebrow: 'Collaborations & Accompagnement',
          title: 'Prêt à écrire votre *prochain moment d’exception* ?',
          content:
            'Que vous prépariez un concours national, organisiez une élection de prestige ou souhaitiez une prestation culinaire mémorable, échangeons en toute bienveillance.',
          button_label: 'Prendre contact',
          button_url: '/contact',
        },
      },
      {
        key: 'quote',
        label: 'Citation (bandeau sombre)',
        fields: ['title', 'eyebrow'],
        labels: { title: 'Citation', eyebrow: 'Auteur' },
        defaults: {
          title: '« L’élégance, c’est lorsque l’intérieur est aussi beau que l’extérieur. »',
          eyebrow: 'Gabrielle Chanel',
        },
      },
    ],
  },
  {
    page: 'about',
    label: 'À propos',
    path: '/a-propos',
    sections: [
      heading(
        'Parcours & Philosophie',
        'À propos *& parcours*',
        'Un parcours, deux univers : l’art scénique des concours d’élégance et l’exigence de la gastronomie d’auteur.'
      ),
      {
        key: 'bio',
        label: 'Biographie & portrait',
        fields: ['eyebrow', 'title', 'content', 'image'],
        labels: {
          eyebrow: 'Légende du portrait — petite ligne',
          title: 'Légende du portrait — titre',
          content: 'Biographie (grande lettrine)',
          image: 'Portrait',
        },
        meta: [detailsList],
        defaults: {
          eyebrow: 'Une signature, deux univers',
          title: 'L’art de la présence',
          content:
            'Mon cheminement professionnel s’est construit autour d’une quête constante de perfection et d’humanité. Formé aux exigences de la grande cuisine, j’ai très vite compris que la maîtrise du geste et le contrôle du trac procèdent de la même vérité intérieure que l’entrée sur scène d’un candidat à un concours de beauté.',
          meta: {
            details: [
              { title: 'Une méthode forgée sur le terrain', desc: 'Ni formule magique, ni posture imposée : mon travail repose sur un diagnostic franc de votre potentiel et un entraînement progressif qui libère votre charisme naturel.' },
              { title: 'Sur scène : révéler et sécuriser', desc: 'Aider les candidats Miss & Mister à habiter leur corps, à apprivoiser la scène et à captiver un jury avec des mots justes et sincères.' },
              { title: 'À table : émouvoir et partager', desc: 'Composer une cuisine d’auteur lisible, élégante et gourmande, qui transforme chaque repas en un moment d’exception inoubliable.' },
            ],
          },
        },
      },
      {
        key: 'values',
        label: 'Valeurs',
        fields: ['eyebrow', 'title'],
        meta: [
          {
            key: 'values_list',
            type: 'list',
            label: 'Valeurs affichées',
            itemLabel: 'valeur',
            item: [
              { name: 'title', label: 'Valeur' },
              { name: 'desc', label: 'Description', multiline: true },
            ],
          },
        ],
        defaults: {
          eyebrow: 'Éthique & Déontologie',
          title: 'Mes principes fondamentaux',
          meta: {
            values_list: [
              { title: 'Authenticité', desc: 'Préserver l’identité profonde de chaque candidat, loin des stéréotypes impersonnels.' },
              { title: 'Exigence & Précision', desc: 'Chaque pas, chaque intonation et chaque dressage méritent un soin d’horloger.' },
              { title: 'Bienveillance & Écoute', desc: 'Un climat de confiance mutuelle indispensable pour libérer le potentiel.' },
            ],
          },
        },
      },
      {
        key: 'distinctions',
        label: 'Formations & distinctions',
        fields: ['title', 'content'],
        meta: [{ key: 'items', type: 'lines', label: 'Formations et distinctions (une par ligne)' }],
        defaults: {
          title: 'Engagements & Références',
          content: 'Certifié en préparation mentale et techniques d’expression orale. Diplômé en arts culinaires français.',
          meta: {
            items: [
              'Diplôme d’État des Métiers de Bouche & Gastronomie Française',
              'Formation certifiante aux techniques de prise de parole et posture scénique',
              'Présidence d’honneur de jurys régionaux Miss & Mister depuis 2019',
            ],
          },
        },
      },
      {
        key: 'cta',
        label: 'Appel final',
        fields: ['eyebrow', 'title', 'content', 'button'],
        defaults: {
          eyebrow: 'Travaillons ensemble',
          title: 'Donnons vie à votre projet',
          content:
            'Que vous soyez candidat préparant un titre, organisateur d’un concours d’élégance en quête d’un jury rigoureux ou particulier souhaitant un dîner d’exception, je serai ravi d’échanger avec vous.',
          button_label: 'Initier un échange',
          button_url: '/contact',
        },
      },
    ],
  },
  {
    page: 'coaching',
    label: 'Le coaching',
    path: '/coaching',
    sections: [
      heading(
        'Pôle Accompagnement Miss & Mister',
        'Le Coaching Scénique',
        'Révéler la prestance, libérer la voix et forger un mental de vainqueur pour faire la différence le soir du sacre.'
      ),
      editorialIntro(
        {
          eyebrow: 'De l’audition au sacre',
          title: 'La présence ne s’improvise pas',
          content:
            'Participer à une élection de Miss ou de Mister est une aventure humaine intense qui exige bien plus qu’un physique avantageux. C’est une épreuve d’éloquence, d’équilibre émotionnel et de vérité scénique.',
          button_label: 'Réserver un premier entretien',
          button_url: '/contact?motif=coaching',
          meta: {
            lead: 'Mon accompagnement s’adresse aux personnalités déterminées qui refusent les faux-semblants et souhaitent marquer les esprits par leur élégance, leur maintien et leur clarté de parole.',
            highlights: [
              'Diagnostic individuel sans complaisance',
              'Travail précis de la démarche & des pauses scéniques',
              'Entraînement intensif à l’interview du jury',
              'Gestion du stress et ancrage de la sérénité',
            ],
          },
        },
        [{ key: 'highlights', type: 'lines', label: 'Points clés cochés (un par ligne)' }]
      ),
      blockHead('services_head', 'Titre — Programmes', 'Modules & Formules', 'Mes programmes d’accompagnement'),
      blockHead('method_head', 'Titre — Méthode', 'Méthodologie éprouvée', 'Les 4 étapes clés vers le podium'),
      blockHead('results_head', 'Titre — Concours accompagnés', 'Résultats concrets', 'Les concours accompagnés'),
      blockHead('gallery_head', 'Titre — Galerie', 'En immersion', 'Dans les coulisses de la préparation'),
      blockHead('testimonials_head', 'Titre — Témoignages', 'Ils ont vécu l’aventure', 'Témoignages de candidats'),
      blockHead('faq_head', 'Titre — Questions fréquentes', 'Réponses claires', 'Foire aux questions'),
      ctaBlock(
        'Prêt à viser le titre ?',
        'Chaque grande aventure commence par un premier contact. Échangeons sur vos ambitions et planifions votre séance d’évaluation.',
        'Faire une demande de coaching',
        '/contact?motif=coaching'
      ),
    ],
  },
  {
    page: 'jury',
    label: 'Le jury',
    path: '/jury',
    sections: [
      heading(
        'Arbitrage & Évaluation Officielle',
        'Membre de Jury de Concours',
        'Une lecture attentive, humaine et intransigeante de l’élégance, au service de sélections équitables et prestigieuses.'
      ),
      editorialIntro(
        {
          eyebrow: 'Déontologie & Intégrité',
          title: 'Regarder au-delà de l’apparence',
          content:
            'Participer à un jury de concours Miss ou Mister n’est pas un simple exercice d’observation esthétique. C’est une responsabilité morale envers des jeunes femmes et des jeunes hommes qui investissent leurs espoirs et leur travail.',
          button_label: 'Inviter comme membre de jury',
          button_url: '/contact?motif=jury',
          meta: {
            lead: 'Mon engagement repose sur une grille d’analyse rigoureuse : l’écoute active lors de l’interview, la perception de la bienveillance collective en coulisses et l’adéquation de l’allure avec les responsabilités d’un titre officiel.',
            details: [
              { title: 'Impartialité absolue', desc: 'Aucune complaisance, aucune influence extérieure. Chaque candidat est jugé uniquement sur sa prestation scénique et humaine le jour J.' },
              { title: '32 jurys régionaux et nationaux', desc: 'Une expérience confirmée des coulisses des comités Miss Élégance, Mister France et sélections régionales majeures.' },
            ],
          },
        },
        [detailsList]
      ),
      blockHead('criteria_head', 'Titre — Critères', 'Principes & Barèmes', 'Mes critères d’évaluation'),
      blockHead('experiences_head', 'Titre — Concours arbitrés', 'Historique officiel', 'Concours arbitrés en tant que jury'),
      blockHead('testimonials_head', 'Titre — Témoignages', 'Confiance des comités', 'Mots d’organisateurs'),
      ctaBlock(
        'Organisateurs de concours & comités',
        'Vous préparez une prochaine élection régionale ou nationale et recherchez un jury d’expérience, garant d’un arbitrage juste et respectueux des candidats ?',
        'Proposer une participation au jury',
        '/contact?motif=jury'
      ),
    ],
  },
  {
    page: 'gastronomie',
    label: 'La gastronomie',
    path: '/gastronomie',
    sections: [
      heading(
        'Cuisine d’Auteur & Événements Privés',
        'La Gastronomie Émotionnelle',
        'Des assiettes pensées comme des compositions, un respect absolu du produit et l’élégance du goût au cœur de chaque tablée.'
      ),
      editorialIntro(
        {
          eyebrow: 'La précision comme signature',
          title: 'L’accord parfait du goût et de l’allure',
          content:
            'La cuisine est le lieu suprême de la sincérité. Derrière chaque assiette, il y a la maîtrise du geste, la justesse des cuissons et la sensibilité d’une histoire que l’on offre en partage.',
          button_label: 'Demander un menu personnalisé',
          button_url: '#devis-gastronomie',
          meta: {
            lead: 'Inspiré par le terroir français et les touches contemporaines, je conçois des menus intimistes pour vos dîners privés, banquets de comités d’élégance et célébrations d’exception.',
            details: [
              { title: 'Produits nobles & de saison', desc: 'Sélection directe auprès de maraîchers raisonnés, pêcheurs côtiers et éleveurs passionnés.' },
              { title: 'Expérience immersive sur mesure', desc: 'Du dressage au service à table, une prise en charge complète pour sublimer votre moment.' },
            ],
          },
        },
        [detailsList]
      ),
      blockHead('dishes_head', 'Titre — Créations', 'Carte & Savoir-Faire', 'Créations & Spécialités d’Auteur'),
      blockHead('services_head', 'Titre — Prestations', 'Prestations Réelles', 'Formules d’événements gastronomiques'),
      blockHead('gallery_head', 'Titre — Galerie', 'En images', 'Le visuel au service de la gourmandise'),
      blockHead('testimonials_head', 'Titre — Témoignages', 'Éloges des convives', 'Témoignages à table'),
      {
        key: 'quote_form',
        label: 'Formulaire de devis (texte d’introduction)',
        fields: ['eyebrow', 'title', 'content'],
        meta: [{ key: 'benefits', type: 'lines', label: 'Avantages listés (un par ligne)' }],
        defaults: {
          eyebrow: 'Devis Personnalisé',
          title: 'Concevons votre menu sur mesure',
          content:
            'Renseignez les détails de votre événement culinaire. Je reviendrai vers vous sous 48h avec une proposition adaptée à vos goûts et à vos contraintes.',
          meta: {
            benefits: [
              'Menu adapté aux intolérances et régimes alimentaires',
              'Service de table complet et vaisselle d’exception',
              'Déplacements possibles en France et en Europe',
            ],
          },
        },
      },
    ],
  },
  {
    page: 'contests',
    label: 'Mes concours',
    path: '/mes-concours',
    sections: [
      heading(
        'Catalogue & Historique des Élections',
        'Mes Concours Coachés',
        'Découvrez l’ensemble des concours de Miss & Mister préparés avec passion, les parcours des candidats accompagnés et les titres remportés.'
      ),
      {
        ...ctaBlock(
          'Vous visez un titre lors d’une prochaine élection ?',
          'Rejoignez l’accompagnement d’excellence MC Florentin pour vous démarquer dès les présélections.',
          'Me contacter pour ce concours',
          '/contact?motif=coaching'
        ),
        key: 'detail_cta',
        label: 'Encadré final des pages de chaque concours',
      },
    ],
  },
  {
    page: 'gallery',
    label: 'Galerie',
    path: '/galerie',
    sections: [
      heading(
        'Portfolio Visuel & Coulisses',
        'Galerie Photographique & Vidéo',
        'De la concentration en loges au dressage minutieux en cuisine, revivez les moments d’exception en images.'
      ),
    ],
  },
  {
    page: 'testimonials',
    label: 'Témoignages',
    path: '/temoignages',
    sections: [
      heading(
        'Confiance & Reconnaissance',
        'Témoignages & Avis',
        'Les retours authentiques des candidates, candidats, comités d’élégance et hôtes de dîners d’exception.'
      ),
    ],
  },
  {
    page: 'news',
    label: 'Actualités',
    path: '/actualites',
    sections: [
      heading(
        'Journal & Réflexions',
        'Actualités & Articles',
        'Conseils de préparation aux concours, réflexions sur l’élégance scénique et récits culinaires.'
      ),
    ],
  },
  {
    page: 'contact',
    label: 'Contact',
    path: '/contact',
    sections: [
      {
        key: 'intro',
        label: 'Introduction',
        fields: ['eyebrow', 'title', 'content'],
        defaults: {
          eyebrow: 'Le premier pas',
          title: 'Faisons de votre projet un moment d’exception',
          content:
            'Une candidature à un concours, une élection à arbitrer ou un dîner gastronomique privé à concevoir ? Écrivez-moi, je vous répondrai personnellement sous 48 heures.',
        },
      },
    ],
  },
  {
    page: 'legal',
    label: 'Mentions légales',
    path: '/mentions-legales',
    sections: [
      heading(
        'Informations Légales',
        'Mentions Légales & Confidentialité',
        'Conformité avec les réglementations en vigueur et protection des données personnelles (RGPD).'
      ),
      {
        key: 'blocks',
        label: 'Contenu des mentions légales',
        fields: [],
        meta: [
          {
            key: 'blocks',
            type: 'list',
            label: 'Rubriques — dans le texte, {site}, {email}, {telephone} et {adresse} sont remplacés par vos coordonnées',
            itemLabel: 'rubrique',
            item: [
              { name: 'title', label: 'Titre' },
              { name: 'desc', label: 'Texte (ligne vide = nouveau paragraphe)', multiline: true },
            ],
          },
        ],
        defaults: {
          meta: {
            blocks: [
              {
                title: '1. Éditeur de la plateforme',
                desc: 'Le site {site} est édité par son représentant.\nCourriel de contact : {email}\nTéléphone : {telephone}\nAdresse professionnelle : {adresse}',
              },
              {
                title: '2. Hébergement & Infrastructure',
                desc: 'Le site web et ses fonctionnalités applicatives sont hébergés sur des serveurs sécurisés conformes aux normes européennes de protection des données, avec persistance assurée par Supabase Inc.',
              },
              {
                title: '3. Propriété intellectuelle',
                desc: 'L’intégralité des éléments figurant sur le site {site} (textes, photographies, logos, créations culinaires, chartes graphiques) est protégée par les dispositions du Code de la propriété intellectuelle. Toute reproduction, même partielle, sans autorisation préalable écrite est formellement interdite.',
              },
              {
                title: '4. Protection des données personnelles (RGPD)',
                desc: 'Les données personnelles transmises via les formulaires de contact ou de dépôt de témoignage (nom, adresse e-mail, numéro de téléphone, messages) sont exclusivement utilisées pour répondre à vos demandes et organiser les prestations sollicitées.\n\nConformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d’un droit d’accès, de rectification et de suppression de vos données personnelles. Pour exercer ce droit, adressez simplement votre demande par courrier électronique à l’adresse {email}.',
              },
              {
                title: '5. Cookies & Traçabilité',
                desc: 'Ce site ne dépose aucun cookie publicitaire ou traceur tiers intrusif. Seuls les témoins de session nécessaires au fonctionnement technique de l’espace privé et à la mémorisation de vos préférences de navigation peuvent être utilisés.',
              },
            ],
          },
        },
      },
    ],
  },
];

/** Sections par défaut (une ligne par section du registre), au format de la table site_sections. */
export function buildDefaultSections(): SiteSection[] {
  return PAGE_REGISTRY.flatMap((page) =>
    page.sections.map((def, index) => ({
      id: `sec-${page.page}-${def.key}`,
      page: page.page,
      section_key: def.key,
      eyebrow: def.defaults.eyebrow ?? '',
      title: def.defaults.title ?? '',
      content: def.defaults.content ?? '',
      image_url: null,
      button_label: def.defaults.button_label ?? '',
      button_url: def.defaults.button_url ?? '',
      meta: { ...(def.defaults.meta ?? {}) },
      sort_order: index + 1,
      is_published: true,
    }))
  );
}

export function findSectionDef(page: string, key: string): SectionDef | undefined {
  return PAGE_REGISTRY.find((p) => p.page === page)?.sections.find((s) => s.key === key);
}

/**
 * Section prête à afficher : la version enregistrée (base ou navigateur) si elle existe,
 * sinon la valeur par défaut. Les listes absentes d'une ancienne version enregistrée
 * sont complétées par défaut.
 */
export function getSection(sections: SiteSection[], page: string, key: string): SiteSection {
  const def = findSectionDef(page, key);
  const stored = sections.find((s) => s.page === page && s.section_key === key);
  const fallback = buildDefaultSections().find((s) => s.page === page && s.section_key === key);
  const base = stored ?? fallback;
  if (!base) {
    return {
      id: `sec-${page}-${key}`, page, section_key: key, eyebrow: '', title: '', content: '',
      image_url: null, button_label: '', button_url: '', meta: {}, sort_order: 0, is_published: true,
    };
  }
  return { ...base, meta: { ...(def?.defaults.meta ?? {}), ...(base.meta ?? {}) } };
}
