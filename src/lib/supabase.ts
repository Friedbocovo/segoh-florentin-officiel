import { createClient } from '@supabase/supabase-js';
import type {
  Article,
  CoachingFAQ,
  CoachingMethodStep,
  CoachingService,
  ContactMessage,
  Contest,
  ContestResult,
  CulinaryItem,
  JuryCriterion,
  JuryExperience,
  MediaItem,
  SiteSection,
  SiteSettings,
  Testimonial,
} from '@/types';
import { DEFAULT_CLOUDINARY_CLOUD_NAME, DEFAULT_CLOUDINARY_UPLOAD_PRESET } from '@/lib/cloudinary';
import { DEFAULT_WHATSAPP_NUMBER } from '@/lib/whatsapp';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

/**
 * Vrai si un projet Supabase réel est configuré. Sinon le site tourne en
 * « mode démo » : données d'exemple + sauvegarde dans le navigateur uniquement.
 */
export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('votre-projet')
);

// createClient refuse une URL vide : URL factice en mode démo (jamais appelée)
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'http://localhost',
  isSupabaseConfigured ? supabaseAnonKey : 'demo'
);

export const images = {
  portrait: 'https://images.pexels.com/photos/32683223/pexels-photo-32683223.jpeg?auto=compress&cs=tinysrgb&h=1200&w=900',
  stage: 'https://images.pexels.com/photos/20238956/pexels-photo-20238956.jpeg?auto=compress&cs=tinysrgb&h=900&w=1400',
  dessert: 'https://images.pexels.com/photos/28561582/pexels-photo-28561582.jpeg?auto=compress&cs=tinysrgb&h=900&w=1400',
  chef: 'https://images.pexels.com/photos/36430088/pexels-photo-36430088.jpeg?auto=compress&cs=tinysrgb&h=900&w=1400',
  table: 'https://images.pexels.com/photos/34817106/pexels-photo-34817106.jpeg?auto=compress&cs=tinysrgb&h=900&w=1400',
  candidate1: 'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&h=800&w=600',
  candidate2: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&h=800&w=600',
  candidate3: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&h=800&w=600',
};

// Initial Seed Data (réaliste, soigné et entièrement personnalisable depuis l'admin)
export const initialSettings: SiteSettings = {
  site_name: 'Couronne & Toque',
  tagline: 'Coach Miss & Mister · Jury de Concours · Chef Cuisinier',
  contact_email: 'bonjour@couronne-toque.fr',
  contact_phone: '+33 6 12 34 56 78',
  whatsapp_number: DEFAULT_WHATSAPP_NUMBER,
  contact_address: 'Paris & Déplacements France / International',
  instagram_url: 'https://instagram.com/couronne_et_toque',
  facebook_url: 'https://facebook.com/couronne.toque',
  youtube_url: 'https://youtube.com/@couronnetoque',
  default_title: 'Couronne & Toque — Révéler l’élégance, sur scène comme à table',
  default_description: 'Coaching d’exception pour candidats aux concours de Miss & Mister, membre de jurys prestigieux et cuisine d’auteur.',
  default_og_image: images.portrait,
  accent_color: '#8A6630',
  logo_url: '/logo.png',
  legal_notice: 'Couronne & Toque © 2025. Tous droits réservés.',
  cloudinary_cloud_name: DEFAULT_CLOUDINARY_CLOUD_NAME,
  cloudinary_upload_preset: DEFAULT_CLOUDINARY_UPLOAD_PRESET,
};

export const initialSections: SiteSection[] = [
  {
    id: 'sec-hero',
    page: 'home',
    section_key: 'hero',
    title: 'Révéler l’élégance, sur scène comme à table',
    eyebrow: 'Coach Miss & Mister · Jury · Chef Cuisinier',
    content: 'J’accompagne celles et ceux qui veulent entrer dans la lumière avec justesse, prestance et vérité. Une même exigence, du premier regard à la dernière assiette.',
    image_url: images.portrait,
    button_label: 'Découvrir mon parcours',
    button_url: '/a-propos',
    meta: { secondary_button_label: 'Me contacter', secondary_button_url: '/contact' },
    sort_order: 1,
    is_published: true,
  },
  {
    id: 'sec-presentation',
    page: 'home',
    section_key: 'presentation',
    title: 'Une présence qui s’affirme, une histoire qui se raconte',
    eyebrow: 'Présentation rapide',
    content: 'Depuis plusieurs années, j’unis la rigueur de la gastronomie d’auteur et l’art subtil de la scène. Mon rôle est de faire émerger la singularité de chaque personnalité, sans artifice inutile.',
    image_url: null,
    button_label: 'En savoir plus sur mon histoire',
    button_url: '/a-propos',
    meta: {},
    sort_order: 2,
    is_published: true,
  },
  {
    id: 'sec-stats',
    page: 'home',
    section_key: 'stats',
    title: 'Indicateurs vérifiés',
    eyebrow: 'Chiffres clés',
    content: '',
    image_url: null,
    button_label: '',
    button_url: '',
    meta: {
      stats: [
        { label: 'Concours coachés', value: '18+' },
        { label: 'Candidats accompagnés', value: '45+' },
        { label: 'Titres & écharpes remportés', value: '26' },
        { label: 'Jurys arbitrés', value: '32' },
        { label: 'Années d’expérience', value: '8 ans' },
      ],
    },
    sort_order: 3,
    is_published: true,
  },
  {
    id: 'sec-cta',
    page: 'home',
    section_key: 'cta',
    title: 'Prêt à écrire votre prochain moment d’exception ?',
    eyebrow: 'Collaborations & Accompagnement',
    content: 'Que vous prépariez un concours national, organisiez une élection de prestige ou souhaitiez une prestation culinaire mémorable, échangeons en toute bienveillance.',
    image_url: null,
    button_label: 'Prendre contact',
    button_url: '/contact',
    meta: {},
    sort_order: 4,
    is_published: true,
  },
  {
    id: 'sec-about-bio',
    page: 'about',
    section_key: 'bio',
    title: 'De la discipline du tablier à la précision du podium',
    eyebrow: 'Histoire & Évolution',
    content: 'Mon cheminement professionnel s’est construit autour d’une quête constante de perfection et d’humanité. Formé aux exigences de la grande cuisine, j’ai très vite compris que la maîtrise du geste et le contrôle du trac procèdent de la même vérité intérieure que l’entrée sur scène d’un candidat à un concours de beauté.',
    image_url: images.stage,
    button_label: '',
    button_url: '',
    meta: {},
    sort_order: 1,
    is_published: true,
  },
  {
    id: 'sec-about-values',
    page: 'about',
    section_key: 'values',
    title: 'Mes principes fondamentaux',
    eyebrow: 'Valeurs professionnelles',
    content: 'L’authenticité avant le stéréotype. L’écoute avant le jugement. La rigueur bienveillante dans chaque détail.',
    image_url: null,
    button_label: '',
    button_url: '',
    meta: {
      values_list: [
        { title: 'Authenticité', desc: 'Préserver l’identité profonde de chaque candidat, loin des stéréotypes impersonnels.' },
        { title: 'Exigence & Précision', desc: 'Chaque pas, chaque intonation et chaque dressage méritent un soin d’horloger.' },
        { title: 'Bienveillance & Écoute', desc: 'Un climat de confiance mutuelle indispensable pour libérer le potentiel.' },
      ],
    },
    sort_order: 2,
    is_published: true,
  },
  {
    id: 'sec-about-distinctions',
    page: 'about',
    section_key: 'distinctions',
    title: 'Engagements & Références',
    eyebrow: 'Formations & Reconnaissances',
    content: 'Certifié en préparation mentale et techniques d’expression orale. Diplômé en arts culinaires français.',
    image_url: null,
    button_label: '',
    button_url: '',
    meta: {
      items: [
        'Diplôme d’État des Métiers de Bouche & Gastronomie Française',
        'Formation certifiante aux techniques de prise de parole et posture scénique',
        'Présidence d’honneur de jurys régionaux Miss & Mister depuis 2019',
      ],
    },
    sort_order: 3,
    is_published: true,
  },
];

export const initialServices: CoachingService[] = [
  {
    id: 'srv-1',
    title: 'Préparation Globale Concours Miss & Mister',
    description: 'Un accompagnement complet et intensif couvrant la démarche, la posture scénique, le charisme et la gestion des émotions pour aborder la compétition avec sérénité.',
    image_url: images.stage,
    price_info: 'Sur devis personnalisé',
    duration_info: 'Formule intensive 6 séances ou suivi longue durée',
    button_label: 'Demander un entretien',
    button_url: '/contact?motif=coaching',
    sort_order: 1,
    is_published: true,
  },
  {
    id: 'srv-2',
    title: 'Éloquence & Prise de Parole en Public',
    description: 'Maîtrise de la voix, gestion du stress face au micro, clarté du discours et impact des réponses lors de l’interview officielle du jury.',
    image_url: images.portrait,
    price_info: 'À partir de 160 € / séance',
    duration_info: 'Séances individuelles de 2 heures',
    button_label: 'Réserver ce module',
    button_url: '/contact?motif=coaching',
    sort_order: 2,
    is_published: true,
  },
  {
    id: 'srv-3',
    title: 'Posture, Démarche & Présence Scénique',
    description: 'Travail du pas, maintien du corps, port de tête, aisance en robe de soirée ou costume officiel, et gestion du regard face à la caméra et au public.',
    image_url: images.stage,
    price_info: 'À partir de 180 € / séance',
    duration_info: 'Séances pratiques en studio',
    button_label: 'Découvrir la méthode',
    button_url: '/contact?motif=coaching',
    sort_order: 3,
    is_published: true,
  },
  {
    id: 'srv-4',
    title: 'Simulation & Questions Pièges du Jury',
    description: 'Mises en situation réelles calquées sur les entretiens des comités officiels, analyse critique constructive et perfectionnement de la répartie.',
    image_url: images.table,
    price_info: 'Sur mesure',
    duration_info: 'Module intensif 1/2 journée',
    button_label: 'Me préparer',
    button_url: '/contact?motif=coaching',
    sort_order: 4,
    is_published: true,
  },
];

export const initialMethodSteps: CoachingMethodStep[] = [
  {
    id: 'step-1',
    step_number: 1,
    title: 'Diagnostic initial & Audit de potentiel',
    description: 'Bilan approfondi de votre personnalité, identification de vos points forts, analyse de vos axes de progrès et fixation d’objectifs précis.',
    sort_order: 1,
    is_published: true,
  },
  {
    id: 'step-2',
    step_number: 2,
    title: 'Ancrage corporel & Démarche scénique',
    description: 'Apprentissage du maintien, équilibre, élégance du pas, fluidité des transitions et occupation harmonieuse de l’espace.',
    sort_order: 2,
    is_published: true,
  },
  {
    id: 'step-3',
    step_number: 3,
    title: 'Voix, Éloquence & Répartie',
    description: 'Travail du timbre, du débit et de la diction. Préparation mentale aux questions complexes des membres du jury.',
    sort_order: 3,
    is_published: true,
  },
  {
    id: 'step-4',
    step_number: 4,
    title: 'Répétition générale & Conditionnement le jour J',
    description: 'Passages à blanc en tenue officielle dans les conditions directes du concours, ancrage de la sérénité et gestion du trac.',
    sort_order: 4,
    is_published: true,
  },
];

export const initialFAQs: CoachingFAQ[] = [
  {
    id: 'faq-1',
    question: 'À qui s’adresse le coaching Miss & Mister ?',
    answer: 'Aux candidates et candidats de tous niveaux préparant une élection locale, départementale, régionale ou nationale, ainsi qu’aux profils débutants souhaitant gagner en prestance et en confiance.',
    sort_order: 1,
    is_published: true,
  },
  {
    id: 'faq-2',
    question: 'Combien de temps avant mon élection dois-je commencer ?',
    answer: 'L’idéal est d’entamer la préparation 2 à 3 mois avant l’événement pour intégrer durablement les réflexes corporels et oratoires. Des formules intensives en accéléré sont également possibles.',
    sort_order: 2,
    is_published: true,
  },
  {
    id: 'faq-3',
    question: 'Les séances se déroulent-elles en présentiel ou en visio ?',
    answer: 'Les séances de posture, démarche et mise en situation scénique sont privilégiées en présentiel (studio ou déplacement). Les modules d’éloquence et de préparation aux questions peuvent s’effectuer en visioconférence.',
    sort_order: 3,
    is_published: true,
  },
  {
    id: 'faq-4',
    question: 'Puis-je être accompagné jusqu’au soir même du concours ?',
    answer: 'Oui, une formule d’accompagnement sur place en coulisses le jour du concours est proposée pour vous rassurer, veiller aux derniers détails et vous placer dans les meilleures dispositions mentales.',
    sort_order: 4,
    is_published: true,
  },
];

export const initialJuryExperiences: JuryExperience[] = [
  {
    id: 'jury-1',
    event_name: 'Élection Miss Élégance Grand Est',
    edition: 'Édition 2024',
    event_year: 2024,
    event_date: '14 Octobre 2024',
    location: 'Strasbourg',
    organizer: 'Comité Miss Élégance France',
    role_title: 'Président du Jury',
    description: 'Évaluation des 14 candidates régionales sur l’expression orale, le défilé en tenue d’apparat et l’adéquation aux valeurs de l’élégance contemporaine.',
    image_url: images.table,
    sort_order: 1,
    is_published: true,
  },
  {
    id: 'jury-2',
    event_name: 'Sélection Mister France Île-de-France',
    edition: 'Édition 2024',
    event_year: 2024,
    event_date: '28 Septembre 2024',
    location: 'Paris',
    organizer: 'Comité Officiel Mister France',
    role_title: 'Membre du Jury Officiel',
    description: 'Observation attentive du charisme, de l’aisance relationnelle, du projet personnel et de la tenue générale des finalistes masculins.',
    image_url: images.stage,
    sort_order: 2,
    is_published: true,
  },
  {
    id: 'jury-3',
    event_name: 'Concours Beauté & Distinction Hauts-de-France',
    edition: 'Édition 2023',
    event_year: 2023,
    event_date: '18 Novembre 2023',
    location: 'Lille',
    organizer: 'Association Régionale pour la Promotion des Talents',
    role_title: 'Jury Scénique & Éloquence',
    description: 'Attribution du prix spécial du charisme et notation des discours de présentation.',
    image_url: images.portrait,
    sort_order: 3,
    is_published: true,
  },
];

export const initialJuryCriteria: JuryCriterion[] = [
  {
    id: 'crit-1',
    title: 'Justesse & Vérité de l’Allure',
    description: 'Privilégier la personnalité réelle et l’éclat naturel plutôt que des attitudes convenues ou rigides.',
    sort_order: 1,
    is_published: true,
  },
  {
    id: 'crit-2',
    title: 'Éloquence & Répartie Constructive',
    description: 'Capacité à exprimer une pensée structurée avec sensibilité, clarté et authenticité sous la pression de l’oral.',
    sort_order: 2,
    is_published: true,
  },
  {
    id: 'crit-3',
    title: 'Présence Scénique & Port Altier',
    description: 'Harmonie de la silhouette, assurance du pas, distinction du geste et maintien du regard.',
    sort_order: 3,
    is_published: true,
  },
  {
    id: 'crit-4',
    title: 'Engagement & Esprit de Promotion',
    description: 'Sens du collectif, humilité, courtoisie en coulisses et aptitude à devenir un véritable ambassadeur ou une ambassadrice.',
    sort_order: 4,
    is_published: true,
  },
];

export const initialCulinaryItems: CulinaryItem[] = [
  {
    id: 'cul-1',
    item_type: 'specialite',
    title: 'Noix de Saint-Jacques rôties au beurre noisette & émulsion topinambour',
    category: 'Entrée',
    description: 'Saint-Jacques snackées à la minute, mousseline douce de topinambours fumés et tuile craquante au sarrasin.',
    ingredients: 'Saint-Jacques de plongée, topinambour, beurre d’Isigny, sarrasin breton.',
    dietary_info: 'Sans gluten',
    price_info: 'Menu dégustation',
    image_url: images.dessert,
    sort_order: 1,
    is_published: true,
  },
  {
    id: 'cul-2',
    item_type: 'creation',
    title: 'Filet de canette fermière aux épices douces & déclinaison de betteraves',
    category: 'Plat',
    description: 'Cuisson à basse température, laquage miel et poivre de Sichuan, jus corsé infusé aux baies de cassis.',
    ingredients: 'Canette du Sud-Ouest, betteraves chioggia, miel d’acacia, poivre de Sichuan.',
    dietary_info: 'Produits locaux et raisonnés',
    price_info: 'Menu Prestige',
    image_url: images.chef,
    sort_order: 2,
    is_published: true,
  },
  {
    id: 'cul-3',
    item_type: 'creation',
    title: 'Dôme croustillant au chocolat grand cru & cœur coulant kalamansi',
    category: 'Dessert',
    description: 'Sablé cacao fleur de sel, ganache montée Manjari 64% et vivacité acidulée du kalamansi.',
    ingredients: 'Chocolat Valrhona Manjari, kalamansi, beurre AOP, fleur de sel de Guérande.',
    dietary_info: 'Création signature',
    price_info: 'Inclus au menu',
    image_url: images.dessert,
    sort_order: 3,
    is_published: true,
  },
  {
    id: 'cul-4',
    item_type: 'prestation',
    title: 'Dîner Gastronomique Privé à Domicile',
    category: 'Prestation',
    description: 'Une expérience de restaurant étoilé chez vous. Élaboration du menu selon vos envies, service raffiné à table et remise en état parfaite de votre cuisine.',
    ingredients: '',
    dietary_info: 'De 4 à 16 convives',
    price_info: 'À partir de 120 € / convive',
    image_url: images.table,
    sort_order: 4,
    is_published: true,
  },
  {
    id: 'cul-5',
    item_type: 'prestation',
    title: 'Cocktails d’Exception & Événements Partenaires',
    category: 'Prestation',
    description: 'Bouchées de haute volée pour cocktails officiels de concours, vernissages ou soirées de gala privées.',
    ingredients: '',
    dietary_info: 'De 20 à 150 convives',
    price_info: 'Sur devis personnalisé',
    image_url: images.chef,
    sort_order: 5,
    is_published: true,
  },
];

export const initialContests: Contest[] = [
  {
    id: 'cnt-1',
    name: 'Miss Élégance Régionale',
    slug: 'miss-elegance-regionale-2024',
    edition: '2024',
    year: 2024,
    event_date: 'Novembre 2024',
    location: 'Strasbourg, Grand Est',
    organizer: 'Comité Régional Élégance',
    short_description: 'Préparation complète des 5 candidates sélectionnées pour la finale régionale.',
    long_description: 'Un programme intensif de 6 semaines axé sur la diction, le maintien corporel en robe de gala et la présence scénique sous les projecteurs. Les résultats ont confirmé l’efficacité d’une approche sur mesure respectueuse de chaque personnalité.',
    coach_role_description: 'Coach officiel en charge de la préparation scénique et des simulations orales devant jury.',
    cover_image: images.stage,
    is_featured: true,
    sort_order: 1,
    is_published: true,
    seo_title: 'Miss Élégance Régionale 2024 — Concours coaché par Couronne & Toque',
    seo_description: 'Découvrez l’accompagnement et les distinctions remportées par les candidates lors de l’édition 2024.',
    results: [
      {
        id: 'res-1',
        contest_id: 'cnt-1',
        candidate_name: 'Camille L.',
        candidate_photo: images.candidate1,
        title_won: 'Miss Élégance Régionale 2024',
        category: 'Miss',
        rank_position: 1,
        coaching_mention: 'Accompagnement intégral (scène & interview)',
        description: 'Élue avec les félicitations unanimes du jury pour sa prise de parole émouvante et son maintien impeccable.',
        sort_order: 1,
      },
      {
        id: 'res-2',
        contest_id: 'cnt-1',
        candidate_name: 'Inès D.',
        candidate_photo: images.candidate3,
        title_won: '1ère Dauphine Régionale',
        category: 'Dauphine',
        rank_position: 2,
        coaching_mention: 'Coaching posture & confiance en soi',
        description: 'Une progression spectaculaire sur scène saluée par le public.',
        sort_order: 2,
      },
    ],
  },
  {
    id: 'cnt-2',
    name: 'Mister France Sélection Régionale',
    slug: 'mister-france-selection-regionale-2024',
    edition: '2024',
    year: 2024,
    event_date: 'Octobre 2024',
    location: 'Metz',
    organizer: 'Délégation Mister France',
    short_description: 'Accompagnement sur le charisme masculin, le maintien en costume et l’aisance médiatique.',
    long_description: 'Ce programme a permis aux candidats d’affirmer leur singularité avec courtoisie et prestance. Un travail ciblé sur la posture et la clarté du discours.',
    coach_role_description: 'Conseiller en image scénique et entraîneur oratoire.',
    cover_image: images.portrait,
    is_featured: true,
    sort_order: 2,
    is_published: true,
    seo_title: 'Mister France Régional 2024 — Préparation officielle Couronne & Toque',
    seo_description: 'Résultats et distinctions des candidats masculins accompagnés en 2024.',
    results: [
      {
        id: 'res-3',
        contest_id: 'cnt-2',
        candidate_name: 'Julien B.',
        candidate_photo: images.candidate2,
        title_won: 'Mister Régional 2024',
        category: 'Mister',
        rank_position: 1,
        coaching_mention: 'Coaching complet de 8 semaines',
        description: 'Qualifié pour la finale nationale après une prestation scénique remarquable de naturel.',
        sort_order: 1,
      },
      {
        id: 'res-4',
        contest_id: 'cnt-2',
        candidate_name: 'Alexandre M.',
        candidate_photo: null,
        title_won: 'Prix de la Sympathie & de la Camaraderie',
        category: 'Spécial',
        rank_position: null,
        coaching_mention: 'Module prise de parole en public',
        description: 'Distinction décernée par les autres candidats et les organisateurs.',
        sort_order: 2,
      },
    ],
  },
  {
    id: 'cnt-3',
    name: 'Trophée National de l’Élégance',
    slug: 'trophee-national-elegance-2023',
    edition: '2023',
    year: 2023,
    event_date: 'Décembre 2023',
    location: 'Paris, Salle Gaveau',
    organizer: 'Comité Prestige France',
    short_description: 'Préparation finale de 3 finalistes pour l’étape nationale.',
    long_description: 'Séances de perfectionnement avancées axées sur la gestion du regard face aux caméras de télévision et la maîtrise des temps de réponse impartis.',
    coach_role_description: 'Coach particulier des finalistes.',
    cover_image: images.stage,
    is_featured: false,
    sort_order: 3,
    is_published: true,
    seo_title: 'Trophée National de l’Élégance 2023 — Résultats et coaching',
    seo_description: 'Les temps forts de la participation au Trophée National.',
    results: [
      {
        id: 'res-5',
        contest_id: 'cnt-3',
        candidate_name: 'Chloé V.',
        candidate_photo: images.candidate1,
        title_won: '2ème Dauphine Nationale',
        category: 'Dauphine',
        rank_position: 3,
        coaching_mention: 'Préparation intensive 4 séances',
        description: 'Une présence remarquée sur la scène parisienne.',
        sort_order: 1,
      },
    ],
  },
];

export const initialArticles: Article[] = [
  {
    id: 'art-1',
    title: 'Comment aborder l’interview officielle du jury avec sérénité',
    slug: 'comment-aborder-interview-officielle-jury',
    summary: 'L’épreuve orale est souvent la plus redoutée des concours de Miss et Mister. Voici les clés pour transformer votre trac en présence magnétique.',
    content: `
### Le trac n'est pas un ennemi, c'est une énergie disponible

Lorsqu'un candidat ou une candidate s'avance devant la table du jury, le rythme cardiaque s'accélère. C'est une réaction physiologique normale. Le but du coaching n'est pas d'éliminer cette émotion, mais de la canaliser.

#### 1. Respirez avant de parler
Prendre deux secondes complètes de silence avant de commencer votre réponse n'est pas une faiblesse : c'est la marque d'un esprit posé qui écoute réellement avant de s'exprimer.

#### 2. Regardez tous les membres du jury
Ne vous focalisez pas uniquement sur la personne qui a posé la question. Distribuez votre regard calmement, en balayant l'assemblée avec bienveillance.

#### 3. Soyez vous-même, sans posture artificielle
Un jury expérimenté décèle instantanément les réponses apprises par cœur. Privilégiez toujours une anecdote vécue ou une conviction sincère à une formule creuse.
    `,
    cover_image: images.portrait,
    category: 'Conseils Coaching',
    published_at: '2025-01-15T10:00:00Z',
    is_published: true,
    is_featured: true,
    seo_title: 'Comment réussir l’interview du jury de Miss & Mister — Couronne & Toque',
    seo_description: 'Les précieux conseils d’un coach et membre de jury pour briller lors de l’entretien officiel.',
  },
  {
    id: 'art-2',
    title: 'De la rigueur de la cuisine à l’exigence de la scène : un même engagement',
    slug: 'de-la-rigueur-de-la-cuisine-a-la-scene',
    summary: 'Pourquoi la gastronomie et le coaching de concours partagent-ils une même philosophie ? Réflexion sur l’élégance du geste et le sens du détail.',
    content: `
### Une même quête de vérité et de précision

En cuisine, quelques secondes de trop sur une cuisson ou un grain de sel en excès altèrent l'harmonie d'un plat. Sur un podium de concours, un pas trop rapide ou une épaule tombante rompent la fluidité de la silhouette.

> « L'élégance n'est pas une question d'artifice : c'est l'art d'éliminer le superflu pour laisser respirer l'essentiel. »

Dans mes deux métiers, j'applique la même exigence : respecter la matière première. Qu'il s'agisse d'un produit brut d'exception ou de la personnalité singulière d'un candidat, mon rôle est de sublimer sans dénaturer.
    `,
    cover_image: images.chef,
    category: 'Philosophie & Vision',
    published_at: '2025-02-02T14:30:00Z',
    is_published: true,
    is_featured: false,
    seo_title: 'Cuisine et Coaching : la signature Couronne & Toque',
    seo_description: 'Découvrez la philosophie commune unissant gastronomie d’auteur et présence scénique.',
  },
  {
    id: 'art-3',
    title: 'La posture corporelle : votre première carte de visite',
    slug: 'posture-corporelle-premiere-carte-de-visite',
    summary: 'Avant même d’avoir prononcé le premier mot, votre démarche a déjà délivré un message. Comment corriger les mauvaises habitudes posturales.',
    content: `
### Ce que votre corps dit avant votre voix

Le port de tête, l'alignement du bassin et le relâchement des trapèzes constituent le socle de toute prestance. Au cours de nos séances de coaching, nous déconstruisons les réflexes de protection inconscients pour vous redonner une verticalité naturelle et souveraine.
    `,
    cover_image: images.stage,
    category: 'Pratique Scénique',
    published_at: '2025-02-18T09:00:00Z',
    is_published: true,
    is_featured: false,
    seo_title: 'Améliorer sa posture pour les concours d’élégance',
    seo_description: 'Techniques indispensables pour développer une allure affirmée.',
  },
];

export const initialTestimonials: Testimonial[] = [
  {
    id: 'tst-1',
    author_name: 'Camille L.',
    author_role: 'Miss Élégance Régionale 2024',
    avatar_url: images.candidate1,
    message: 'Ce coaching a complètement transformé ma perception de moi-même. Grâce à sa bienveillance et à son exigence chirurgicale, je suis montée sur scène avec une paix intérieure que je n’avais jamais connue.',
    domain: 'coaching',
    rating: 5,
    status: 'approved',
    sort_order: 1,
    created_at: '2024-11-20T12:00:00Z',
  },
  {
    id: 'tst-2',
    author_name: 'Hélène De Saint-Ange',
    author_role: 'Déléguée régionale de concours',
    avatar_url: null,
    message: 'Avoir un tel professionnel dans notre jury a été une chance immense. Son regard est toujours d’une impartialité totale, profondément respectueux des candidats et capable de déceler le talent brut.',
    domain: 'jury',
    rating: 5,
    status: 'approved',
    sort_order: 2,
    created_at: '2024-10-30T15:00:00Z',
  },
  {
    id: 'tst-3',
    author_name: 'Marc & Sophie T.',
    author_role: 'Dîner privé d’anniversaire (12 convives)',
    avatar_url: null,
    message: 'Une prestation culinaire digne d’une table triplement étoilée. Des accords subtils, une présentation d’une finesse inouïe et une discrétion absolue. Nos invités en parlent encore.',
    domain: 'gastronomie',
    rating: 5,
    status: 'approved',
    sort_order: 3,
    created_at: '2024-12-05T20:00:00Z',
  },
  {
    id: 'tst-4',
    author_name: 'Julien B.',
    author_role: 'Mister Régional 2024',
    avatar_url: images.candidate2,
    message: 'Le travail sur la prise de parole a été le tournant décisif de ma préparation. Il a su corriger mes tics de langage et m’apprendre à poser ma voix avec autorité et douceur.',
    domain: 'coaching',
    rating: 5,
    status: 'approved',
    sort_order: 4,
    created_at: '2024-10-18T18:00:00Z',
  },
];

export const initialMedia: MediaItem[] = [
  {
    id: 'med-1',
    title: 'Portrait officiel studio',
    media_type: 'image',
    url: images.portrait,
    thumbnail_url: images.portrait,
    alt_text: 'Portrait éditorial du coach et chef',
    caption: 'L’exigence et la précision réunies.',
    category: 'coaching',
    sort_order: 1,
    is_published: true,
  },
  {
    id: 'med-2',
    title: 'Défilé final sous les projecteurs',
    media_type: 'image',
    url: images.stage,
    thumbnail_url: images.stage,
    alt_text: 'Scène de concours avec candidats',
    caption: 'La consécration de semaines de travail minutieux.',
    category: 'concours',
    sort_order: 2,
    is_published: true,
  },
  {
    id: 'med-3',
    title: 'Dressage d’assiette gastronomique',
    media_type: 'image',
    url: images.dessert,
    thumbnail_url: images.dessert,
    alt_text: 'Dressage d’un dessert haute couture',
    caption: 'La gourmandise comme expression artistique.',
    category: 'gastronomie',
    sort_order: 3,
    is_published: true,
  },
  {
    id: 'med-4',
    title: 'Le geste culinaire en cuisine',
    media_type: 'image',
    url: images.chef,
    thumbnail_url: images.chef,
    alt_text: 'Chef au travail dans sa cuisine',
    caption: 'Rigueur et concentration avant le coup de feu.',
    category: 'gastronomie',
    sort_order: 4,
    is_published: true,
  },
  {
    id: 'med-5',
    title: 'Table d’honneur du jury',
    media_type: 'image',
    url: images.table,
    thumbnail_url: images.table,
    alt_text: 'Table d’arbitrage d’un concours de beauté',
    caption: 'Un regard bienveillant et impartial.',
    category: 'jury',
    sort_order: 5,
    is_published: true,
  },
  {
    id: 'med-6',
    title: 'Lauréate régionale et écharpe',
    media_type: 'image',
    url: images.candidate1,
    thumbnail_url: images.candidate1,
    alt_text: 'Candidate récompensée après le sacre',
    caption: 'L’émotion d’une victoire méritée.',
    category: 'concours',
    sort_order: 6,
    is_published: true,
  },
];

export const initialMessages: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Élodie Fontaine',
    email: 'elodie.fontaine@exemple.fr',
    phone: '06 98 76 54 32',
    purpose: 'coaching',
    subject: 'Préparation pour Miss Île-de-France 2025',
    message: 'Bonjour, je suis sélectionnée pour la demi-finale régionale. Je souhaiterais un accompagnement personnalisé sur ma démarche et la prise de parole face au jury.',
    desired_date: 'Mai 2025',
    location: 'Paris',
    guest_count: '',
    budget: 'Formule intensive',
    status: 'unread',
    created_at: '2025-02-20T10:14:00Z',
  },
  {
    id: 'msg-2',
    name: 'Guillaume Morand',
    email: 'g.morand@evenements-prestige.com',
    phone: '01 42 00 00 00',
    purpose: 'jury',
    subject: 'Invitation comme jury officiel Gala Beauté 2025',
    message: 'Cher Monsieur, nous serions très honorés de vous compter parmi les membres de notre jury d’honneur pour la soirée du 22 juin prochain.',
    desired_date: '22 Juin 2025',
    location: 'Château de Chantilly',
    guest_count: '',
    budget: 'Prise en charge complète',
    status: 'read',
    created_at: '2025-02-18T16:45:00Z',
  },
];

// Stockage navigateur : utilisé UNIQUEMENT en mode démo (Supabase non configuré)
function getLocal<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(`ct_${key}`);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, data: T) {
  try {
    localStorage.setItem(`ct_${key}`, JSON.stringify(data));
  } catch {}
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value?: string | null): boolean {
  return Boolean(value && UUID_RE.test(value));
}

export function newId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/** Erreur d'écriture en base, avec un message lisible pour l'administrateur. */
export class DataServiceError extends Error {
  constructor(action: string, detail: string) {
    super(`${action} : ${detail}`);
    this.name = 'DataServiceError';
  }
}

type Row = { id: string; sort_order?: number };

/**
 * Prépare un objet pour Supabase : supprime les champs calculés côté client
 * et remplace les clés étrangères invalides (« » ou ids de démo) par null.
 */
function toRow<T extends object>(item: T): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(item)) {
    if (key === 'results' || value === undefined) continue;
    if (key !== 'id' && key.endsWith('_id')) {
      row[key] = isUuid(value as string) ? value : null;
    } else {
      row[key] = value;
    }
  }
  return row;
}

function sortRows<T extends Row>(rows: T[]): T[] {
  return [...rows].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

/**
 * Lecture : Supabase si configuré (même si la table est vide), sinon données de démo.
 * En cas d'erreur réseau / table absente, on garde le site affichable avec les données de démo.
 */
async function readTable<T>(
  localKey: string,
  fallback: T[],
  query: () => PromiseLike<{ data: unknown; error: { message: string } | null }>
): Promise<T[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await query();
      if (!error && Array.isArray(data)) return data as T[];
      console.warn(`[Supabase] Lecture ${localKey} impossible :`, error?.message);
    } catch (e) {
      console.warn(`[Supabase] Lecture ${localKey} impossible :`, e);
    }
    return fallback;
  }
  return getLocal<T[]>(localKey, fallback);
}

/** Création / mise à jour d'une ligne. Lève une DataServiceError si Supabase refuse. */
async function saveRow<T extends Row>(
  table: string,
  localKey: string,
  item: T,
  getAll: () => Promise<T[]>
): Promise<T[]> {
  const isNew = !isUuid(item.id);
  const full = { ...item, id: isNew ? newId() : item.id } as T;

  if (isSupabaseConfigured) {
    const row = toRow(full);
    const { error } = isNew
      ? await supabase.from(table).insert(row)
      : await supabase.from(table).upsert(row);
    if (error) throw new DataServiceError('Enregistrement impossible', error.message);
    return getAll();
  }

  const all = await getAll();
  const updated = sortRows([...all.filter((x) => x.id !== item.id && x.id !== full.id), full]);
  setLocal(localKey, updated);
  return updated;
}

/** Suppression d'une ligne. Lève une DataServiceError si Supabase refuse. */
async function deleteRow<T extends Row>(
  table: string,
  localKey: string,
  id: string,
  getAll: () => Promise<T[]>
): Promise<T[]> {
  if (isSupabaseConfigured) {
    if (!isUuid(id)) {
      throw new DataServiceError('Suppression impossible', 'cet élément de démonstration n’existe pas en base.');
    }
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw new DataServiceError('Suppression impossible', error.message);
    return getAll();
  }

  const updated = (await getAll()).filter((x) => x.id !== id);
  setLocal(localKey, updated);
  return updated;
}

// Service Data Layer unifié
export const DataService = {
  // SETTINGS
  async getSettings(): Promise<SiteSettings> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('site_settings').select('*').limit(1).maybeSingle();
        if (!error && data) {
          return {
            ...initialSettings,
            ...data,
            whatsapp_number: data.whatsapp_number || initialSettings.whatsapp_number,
            cloudinary_cloud_name: data.cloudinary_cloud_name || initialSettings.cloudinary_cloud_name,
            cloudinary_upload_preset: data.cloudinary_upload_preset || initialSettings.cloudinary_upload_preset,
          } as SiteSettings;
        }
        if (error) console.warn('[Supabase] Lecture des réglages impossible :', error.message);
      } catch (e) {
        console.warn('[Supabase] Lecture des réglages impossible :', e);
      }
      return initialSettings;
    }
    return { ...initialSettings, ...getLocal<Partial<SiteSettings>>('settings', {}) };
  },
  async updateSettings(settings: SiteSettings): Promise<SiteSettings> {
    if (isSupabaseConfigured) {
      const row = toRow({ ...settings, updated_at: new Date().toISOString() });
      if (!isUuid(settings.id)) delete row.id;
      const { data, error } = await supabase.from('site_settings').upsert(row).select().single();
      if (error) throw new DataServiceError('Enregistrement des réglages impossible', error.message);
      return { ...settings, ...data } as SiteSettings;
    }
    setLocal('settings', settings);
    return settings;
  },

  // SECTIONS
  async getSections(): Promise<SiteSection[]> {
    return readTable('sections', initialSections, () =>
      supabase.from('site_sections').select('*').order('sort_order')
    );
  },
  async saveSection(sec: SiteSection): Promise<SiteSection[]> {
    return saveRow('site_sections', 'sections', sec, () => this.getSections());
  },

  // COACHING SERVICES
  async getServices(): Promise<CoachingService[]> {
    return readTable('services', initialServices, () =>
      supabase.from('coaching_services').select('*').order('sort_order')
    );
  },
  async saveService(service: CoachingService): Promise<CoachingService[]> {
    return saveRow('coaching_services', 'services', service, () => this.getServices());
  },
  async deleteService(id: string): Promise<CoachingService[]> {
    return deleteRow('coaching_services', 'services', id, () => this.getServices());
  },

  // METHOD STEPS
  async getMethodSteps(): Promise<CoachingMethodStep[]> {
    return readTable('method_steps', initialMethodSteps, () =>
      supabase.from('coaching_method_steps').select('*').order('sort_order')
    );
  },
  async saveMethodStep(step: CoachingMethodStep): Promise<CoachingMethodStep[]> {
    return saveRow('coaching_method_steps', 'method_steps', step, () => this.getMethodSteps());
  },
  async deleteMethodStep(id: string): Promise<CoachingMethodStep[]> {
    return deleteRow('coaching_method_steps', 'method_steps', id, () => this.getMethodSteps());
  },

  // FAQS
  async getFAQs(): Promise<CoachingFAQ[]> {
    return readTable('faqs', initialFAQs, () =>
      supabase.from('coaching_faqs').select('*').order('sort_order')
    );
  },
  async saveFAQ(faq: CoachingFAQ): Promise<CoachingFAQ[]> {
    return saveRow('coaching_faqs', 'faqs', faq, () => this.getFAQs());
  },
  async deleteFAQ(id: string): Promise<CoachingFAQ[]> {
    return deleteRow('coaching_faqs', 'faqs', id, () => this.getFAQs());
  },

  // JURY EXPERIENCES
  async getJuryExperiences(): Promise<JuryExperience[]> {
    return readTable('jury_exp', initialJuryExperiences, () =>
      supabase.from('jury_experiences').select('*').order('sort_order')
    );
  },
  async saveJuryExperience(exp: JuryExperience): Promise<JuryExperience[]> {
    return saveRow('jury_experiences', 'jury_exp', exp, () => this.getJuryExperiences());
  },
  async deleteJuryExperience(id: string): Promise<JuryExperience[]> {
    return deleteRow('jury_experiences', 'jury_exp', id, () => this.getJuryExperiences());
  },

  // JURY CRITERIA
  async getJuryCriteria(): Promise<JuryCriterion[]> {
    return readTable('jury_criteria', initialJuryCriteria, () =>
      supabase.from('jury_criteria').select('*').order('sort_order')
    );
  },
  async saveJuryCriterion(crit: JuryCriterion): Promise<JuryCriterion[]> {
    return saveRow('jury_criteria', 'jury_criteria', crit, () => this.getJuryCriteria());
  },
  async deleteJuryCriterion(id: string): Promise<JuryCriterion[]> {
    return deleteRow('jury_criteria', 'jury_criteria', id, () => this.getJuryCriteria());
  },

  // CULINARY
  async getCulinaryItems(): Promise<CulinaryItem[]> {
    return readTable('culinary', initialCulinaryItems, () =>
      supabase.from('culinary_items').select('*').order('sort_order')
    );
  },
  async saveCulinaryItem(item: CulinaryItem): Promise<CulinaryItem[]> {
    return saveRow('culinary_items', 'culinary', item, () => this.getCulinaryItems());
  },
  async deleteCulinaryItem(id: string): Promise<CulinaryItem[]> {
    return deleteRow('culinary_items', 'culinary', id, () => this.getCulinaryItems());
  },

  // CONTESTS & RESULTS
  async getContests(): Promise<Contest[]> {
    const contests = await readTable<Contest>('contests', initialContests, () =>
      supabase.from('contests').select('*, results:contest_results(*)').order('sort_order')
    );
    return contests.map((c) => ({ ...c, results: sortRows(c.results ?? []) }));
  },
  async getContestBySlug(slug: string): Promise<Contest | null> {
    const all = await this.getContests();
    return all.find((c) => c.slug === slug) ?? null;
  },
  async saveContest(contest: Contest): Promise<Contest[]> {
    // Les résultats sont gérés séparément (saveContestResult) ; toRow les ignore côté Supabase.
    return saveRow('contests', 'contests', { ...contest, results: contest.results ?? [] }, () => this.getContests());
  },
  async deleteContest(id: string): Promise<Contest[]> {
    return deleteRow('contests', 'contests', id, () => this.getContests());
  },
  async saveContestResult(contestId: string, result: ContestResult): Promise<Contest[]> {
    const isNew = !isUuid(result.id);
    const fullResult = { ...result, id: isNew ? newId() : result.id, contest_id: contestId };

    if (isSupabaseConfigured) {
      if (!isUuid(contestId)) {
        throw new DataServiceError('Enregistrement impossible', 'enregistrez d’abord ce concours en base.');
      }
      const row = toRow(fullResult);
      const { error } = isNew
        ? await supabase.from('contest_results').insert(row)
        : await supabase.from('contest_results').upsert(row);
      if (error) throw new DataServiceError('Enregistrement du résultat impossible', error.message);
      return this.getContests();
    }

    const all = await this.getContests();
    const updated = all.map((c) =>
      c.id === contestId
        ? { ...c, results: sortRows([...(c.results ?? []).filter((r) => r.id !== result.id), fullResult]) }
        : c
    );
    setLocal('contests', updated);
    return updated;
  },
  async deleteContestResult(contestId: string, resultId: string): Promise<Contest[]> {
    if (isSupabaseConfigured) {
      if (!isUuid(resultId)) {
        throw new DataServiceError('Suppression impossible', 'cet élément de démonstration n’existe pas en base.');
      }
      const { error } = await supabase.from('contest_results').delete().eq('id', resultId);
      if (error) throw new DataServiceError('Suppression du résultat impossible', error.message);
      return this.getContests();
    }

    const all = await this.getContests();
    const updated = all.map((c) =>
      c.id === contestId ? { ...c, results: (c.results ?? []).filter((r) => r.id !== resultId) } : c
    );
    setLocal('contests', updated);
    return updated;
  },

  // ARTICLES
  async getArticles(): Promise<Article[]> {
    const articles = await readTable<Article>('articles', initialArticles, () =>
      supabase.from('articles').select('*').order('published_at', { ascending: false })
    );
    return [...articles].sort((a, b) => b.published_at.localeCompare(a.published_at));
  },
  async getArticleBySlug(slug: string): Promise<Article | null> {
    const all = await this.getArticles();
    return all.find((a) => a.slug === slug) ?? null;
  },
  async saveArticle(article: Article): Promise<Article[]> {
    return saveRow('articles', 'articles', article, () => this.getArticles());
  },
  async deleteArticle(id: string): Promise<Article[]> {
    return deleteRow('articles', 'articles', id, () => this.getArticles());
  },

  // TESTIMONIALS
  async getTestimonials(): Promise<Testimonial[]> {
    return readTable('testimonials', initialTestimonials, () =>
      supabase.from('testimonials').select('*').order('sort_order')
    );
  },
  async saveTestimonial(testimonial: Testimonial): Promise<Testimonial[]> {
    return saveRow('testimonials', 'testimonials', testimonial, () => this.getTestimonials());
  },
  /**
   * Dépôt public d'un témoignage (visiteur non connecté) : simple INSERT,
   * sans relire la table (les témoignages en attente ne sont pas lisibles publiquement).
   */
  async submitTestimonial(testimonial: Omit<Testimonial, 'id' | 'status'>): Promise<{ success: boolean; error?: string }> {
    const full: Testimonial = { ...testimonial, id: newId(), status: 'pending' };
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('testimonials').insert(toRow(full));
      if (error) {
        console.error('[Supabase] Envoi du témoignage impossible :', error.message);
        return { success: false, error: error.message };
      }
      return { success: true };
    }
    setLocal('testimonials', [...(await this.getTestimonials()), full]);
    return { success: true };
  },
  async deleteTestimonial(id: string): Promise<Testimonial[]> {
    return deleteRow('testimonials', 'testimonials', id, () => this.getTestimonials());
  },

  // MEDIA LIBRARY
  async getMedia(): Promise<MediaItem[]> {
    return readTable('media', initialMedia, () =>
      supabase.from('media_library').select('*').order('sort_order')
    );
  },
  async saveMedia(item: MediaItem): Promise<MediaItem[]> {
    return saveRow('media_library', 'media', item, () => this.getMedia());
  },
  async deleteMedia(id: string): Promise<MediaItem[]> {
    return deleteRow('media_library', 'media', id, () => this.getMedia());
  },

  // CONTACT MESSAGES
  async getMessages(): Promise<ContactMessage[]> {
    // Jamais de faux messages quand une vraie base est branchée
    return readTable('messages', isSupabaseConfigured ? [] : initialMessages, () =>
      supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
    );
  },
  async submitMessage(msg: Omit<ContactMessage, 'id' | 'created_at' | 'status'>): Promise<{ success: boolean; error?: string }> {
    const newMsg: ContactMessage = {
      ...msg,
      guest_count: msg.guest_count == null ? '' : String(msg.guest_count),
      id: newId(),
      status: 'unread',
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('contact_messages').insert(toRow(newMsg));
        if (error) {
          console.error('[Supabase] Envoi du message impossible :', error.message);
          return { success: false, error: error.message };
        }
        return { success: true };
      } catch (e) {
        console.error('[Supabase] Envoi du message impossible :', e);
        return { success: false, error: 'Erreur réseau' };
      }
    }

    setLocal('messages', [newMsg, ...(await this.getMessages())]);
    return { success: true };
  },
  async updateMessageStatus(id: string, status: ContactMessage['status']): Promise<ContactMessage[]> {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw new DataServiceError('Mise à jour du message impossible', error.message);
      return this.getMessages();
    }
    const updated = (await this.getMessages()).map((m) =>
      m.id === id ? { ...m, status, updated_at: new Date().toISOString() } : m
    );
    setLocal('messages', updated);
    return updated;
  },
  async deleteMessage(id: string): Promise<ContactMessage[]> {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('contact_messages').delete().eq('id', id);
      if (error) throw new DataServiceError('Suppression du message impossible', error.message);
      return this.getMessages();
    }
    const updated = (await this.getMessages()).filter((m) => m.id !== id);
    setLocal('messages', updated);
    return updated;
  },

  // ADMINISTRATION
  /** Vérifie que l'utilisateur connecté figure dans la table admin_users. */
  async isCurrentUserAdmin(): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    const { data, error } = await supabase.rpc('is_admin');
    if (error) {
      console.error('[Supabase] Vérification administrateur impossible :', error.message);
      return false;
    }
    return data === true;
  },

  /**
   * Copie le contenu de démonstration dans Supabase (nouveaux identifiants UUID,
   * liens concours ↔ résultats/médias/témoignages conservés). À utiliser sur une base vide.
   */
  async importDemoContent(): Promise<void> {
    if (!isSupabaseConfigured) return;

    const withNewIds = <T extends Row>(rows: T[]) => rows.map((r) => ({ ...r, id: newId() }));
    const contestIds = new Map(initialContests.map((c) => [c.id, newId()]));
    const remapContest = (id?: string | null) => (id ? contestIds.get(id) ?? null : null);

    const contests = initialContests.map((c) => ({ ...c, id: contestIds.get(c.id)! }));
    const results = initialContests.flatMap((c) =>
      (c.results ?? []).map((r) => ({ ...r, id: newId(), contest_id: contestIds.get(c.id)! }))
    );

    const batches: [string, object[]][] = [
      ['site_sections', withNewIds(initialSections)],
      ['coaching_services', withNewIds(initialServices)],
      ['coaching_method_steps', withNewIds(initialMethodSteps)],
      ['coaching_faqs', withNewIds(initialFAQs)],
      ['jury_experiences', withNewIds(initialJuryExperiences)],
      ['jury_criteria', withNewIds(initialJuryCriteria)],
      ['culinary_items', withNewIds(initialCulinaryItems)],
      ['contests', contests],
      ['contest_results', results],
      ['articles', withNewIds(initialArticles)],
      ['testimonials', withNewIds(initialTestimonials).map((t) => ({ ...t, contest_id: remapContest(t.contest_id) }))],
      ['media_library', withNewIds(initialMedia).map((m) => ({ ...m, contest_id: remapContest(m.contest_id) }))],
    ];

    for (const [table, rows] of batches) {
      if (rows.length === 0) continue;
      const { error } = await supabase.from(table).insert(rows.map((r) => toRow(r)));
      if (error) throw new DataServiceError(`Import de « ${table} » impossible`, error.message);
    }
  },
};
