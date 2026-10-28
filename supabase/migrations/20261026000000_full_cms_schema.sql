/*
# Migration complète pour Couronne & Toque CMS
Tables créées :
1. site_settings (singleton pour config globale, SEO, réseaux, couleur d'accent)
2. site_sections (blocs configurables d'accueil et à propos)
3. coaching_services (services de coaching)
4. coaching_method_steps (étapes de la méthode)
5. coaching_faqs (questions fréquentes)
6. jury_experiences (participations jury)
7. jury_criteria (critères d'évaluation)
8. culinary_items (spécialités, créations, prestations)
9. contests (catalogue des concours coachés)
10. contest_results (candidats et titres obtenus par concours)
11. articles (actualités et articles de fond)
12. testimonials (témoignages avec modération)
13. media_library (médiathèque centralisée)
14. contact_messages (messages et demandes reçus)
*/

-- 1. SITE SETTINGS
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name text NOT NULL DEFAULT 'Couronne & Toque',
  tagline text NOT NULL DEFAULT 'Coach Miss & Mister · Jury de Concours · Chef Cuisinier',
  contact_email text NOT NULL DEFAULT 'bonjour@couronne-toque.fr',
  contact_phone text NOT NULL DEFAULT '+33 6 00 00 00 00',
  contact_address text NOT NULL DEFAULT 'Paris & Déplacements France / International',
  instagram_url text NOT NULL DEFAULT 'https://instagram.com/couronne_et_toque',
  facebook_url text NOT NULL DEFAULT 'https://facebook.com/couronne.toque',
  youtube_url text NOT NULL DEFAULT 'https://youtube.com/@couronnetoque',
  default_title text NOT NULL DEFAULT 'Couronne & Toque — Révéler l’élégance, sur scène comme à table',
  default_description text NOT NULL DEFAULT 'Coaching de Miss & Mister, arbitrage lors de jurys de concours d’élégance et cuisine gastronomique d’auteur.',
  default_og_image text NOT NULL DEFAULT 'https://images.pexels.com/photos/32683223/pexels-photo-32683223.jpeg?auto=compress&cs=tinysrgb&h=1200&w=900',
  accent_color text NOT NULL DEFAULT '#9e293d',
  logo_url text NOT NULL DEFAULT '/logo.png',
  legal_notice text NOT NULL DEFAULT 'Couronne & Toque - Tous droits réservés.',
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. SITE SECTIONS
CREATE TABLE IF NOT EXISTS public.site_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL, -- 'home', 'about', etc.
  section_key text NOT NULL, -- 'hero', 'presentation', 'stats', 'cta', 'bio', 'values', 'philosophy'
  title text NOT NULL DEFAULT '',
  eyebrow text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  image_url text,
  button_label text NOT NULL DEFAULT '',
  button_url text NOT NULL DEFAULT '',
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. COACHING SERVICES
CREATE TABLE IF NOT EXISTS public.coaching_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text,
  price_info text NOT NULL DEFAULT '',
  duration_info text NOT NULL DEFAULT '',
  button_label text NOT NULL DEFAULT 'Réserver ce parcours',
  button_url text NOT NULL DEFAULT '/contact?motif=coaching',
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 4. COACHING METHOD STEPS
CREATE TABLE IF NOT EXISTS public.coaching_method_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  step_number integer NOT NULL DEFAULT 1,
  title text NOT NULL,
  description text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 5. COACHING FAQS
CREATE TABLE IF NOT EXISTS public.coaching_faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 6. JURY EXPERIENCES
CREATE TABLE IF NOT EXISTS public.jury_experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text NOT NULL,
  edition text NOT NULL DEFAULT '',
  event_year integer NOT NULL DEFAULT 2025,
  event_date text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  organizer text NOT NULL DEFAULT '',
  role_title text NOT NULL DEFAULT 'Membre du Jury',
  description text NOT NULL DEFAULT '',
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 7. JURY CRITERIA
CREATE TABLE IF NOT EXISTS public.jury_criteria (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 8. CULINARY ITEMS
CREATE TABLE IF NOT EXISTS public.culinary_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type text NOT NULL DEFAULT 'creation', -- 'specialite', 'creation', 'menu', 'prestation'
  title text NOT NULL,
  category text NOT NULL DEFAULT 'Entrée',
  description text NOT NULL DEFAULT '',
  ingredients text NOT NULL DEFAULT '',
  dietary_info text NOT NULL DEFAULT '',
  price_info text NOT NULL DEFAULT '',
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 9. CONTESTS (Concours Coachés)
CREATE TABLE IF NOT EXISTS public.contests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  edition text NOT NULL DEFAULT '2025',
  year integer NOT NULL DEFAULT 2025,
  event_date text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  organizer text NOT NULL DEFAULT '',
  short_description text NOT NULL DEFAULT '',
  long_description text NOT NULL DEFAULT '',
  coach_role_description text NOT NULL DEFAULT '',
  cover_image text,
  is_featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  seo_title text NOT NULL DEFAULT '',
  seo_description text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 10. CONTEST RESULTS
CREATE TABLE IF NOT EXISTS public.contest_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id uuid REFERENCES public.contests(id) ON DELETE CASCADE,
  candidate_name text NOT NULL,
  candidate_photo text,
  title_won text NOT NULL,
  category text NOT NULL DEFAULT 'Miss',
  rank_position integer,
  coaching_mention text NOT NULL DEFAULT 'Accompagnement Couronne & Toque',
  description text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 11. ARTICLES
CREATE TABLE IF NOT EXISTS public.articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  summary text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  cover_image text,
  category text NOT NULL DEFAULT 'Conseils Coaching',
  published_at timestamptz NOT NULL DEFAULT now(),
  is_published boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  seo_title text NOT NULL DEFAULT '',
  seo_description text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 12. TESTIMONIALS
CREATE TABLE IF NOT EXISTS public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  author_role text NOT NULL DEFAULT '',
  avatar_url text,
  message text NOT NULL,
  domain text NOT NULL DEFAULT 'coaching',
  contest_id uuid REFERENCES public.contests(id) ON DELETE SET NULL,
  rating integer NOT NULL DEFAULT 5,
  status text NOT NULL DEFAULT 'approved',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 13. MEDIA LIBRARY
CREATE TABLE IF NOT EXISTS public.media_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  media_type text NOT NULL DEFAULT 'image',
  url text NOT NULL,
  thumbnail_url text,
  alt_text text NOT NULL DEFAULT '',
  caption text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'galerie',
  contest_id uuid REFERENCES public.contests(id) ON DELETE SET NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 14. CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  purpose text NOT NULL DEFAULT 'coaching',
  subject text NOT NULL,
  message text NOT NULL,
  desired_date text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  guest_count text NOT NULL DEFAULT '',
  budget text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'unread',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS & SECURITY
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_method_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaching_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jury_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jury_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.culinary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Grants
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT INSERT ON public.testimonials TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

-- Public read policies
DROP POLICY IF EXISTS "Public read site_settings" ON public.site_settings;
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read site_sections" ON public.site_sections;
CREATE POLICY "Public read site_sections" ON public.site_sections FOR SELECT USING (is_published = true OR auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Public read coaching_services" ON public.coaching_services;
CREATE POLICY "Public read coaching_services" ON public.coaching_services FOR SELECT USING (is_published = true OR auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Public read coaching_method_steps" ON public.coaching_method_steps;
CREATE POLICY "Public read coaching_method_steps" ON public.coaching_method_steps FOR SELECT USING (is_published = true OR auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Public read coaching_faqs" ON public.coaching_faqs;
CREATE POLICY "Public read coaching_faqs" ON public.coaching_faqs FOR SELECT USING (is_published = true OR auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Public read jury_experiences" ON public.jury_experiences;
CREATE POLICY "Public read jury_experiences" ON public.jury_experiences FOR SELECT USING (is_published = true OR auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Public read jury_criteria" ON public.jury_criteria;
CREATE POLICY "Public read jury_criteria" ON public.jury_criteria FOR SELECT USING (is_published = true OR auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Public read culinary_items" ON public.culinary_items;
CREATE POLICY "Public read culinary_items" ON public.culinary_items FOR SELECT USING (is_published = true OR auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Public read contests" ON public.contests;
CREATE POLICY "Public read contests" ON public.contests FOR SELECT USING (is_published = true OR auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Public read contest_results" ON public.contest_results;
CREATE POLICY "Public read contest_results" ON public.contest_results FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read articles" ON public.articles;
CREATE POLICY "Public read articles" ON public.articles FOR SELECT USING (is_published = true OR auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Public read testimonials" ON public.testimonials;
CREATE POLICY "Public read testimonials" ON public.testimonials FOR SELECT USING (status = 'approved' OR auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Public read media_library" ON public.media_library;
CREATE POLICY "Public read media_library" ON public.media_library FOR SELECT USING (is_published = true OR auth.role() = 'authenticated');

-- Public submission policies
DROP POLICY IF EXISTS "Anon can submit contact_messages" ON public.contact_messages;
CREATE POLICY "Anon can submit contact_messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Anon can submit testimonials pending" ON public.testimonials;
CREATE POLICY "Anon can submit testimonials pending" ON public.testimonials FOR INSERT WITH CHECK (status = 'pending');

-- Authenticated full access policies
DROP POLICY IF EXISTS "Auth full site_settings" ON public.site_settings;
CREATE POLICY "Auth full site_settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Auth full site_sections" ON public.site_sections;
CREATE POLICY "Auth full site_sections" ON public.site_sections FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Auth full coaching_services" ON public.coaching_services;
CREATE POLICY "Auth full coaching_services" ON public.coaching_services FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Auth full coaching_method_steps" ON public.coaching_method_steps;
CREATE POLICY "Auth full coaching_method_steps" ON public.coaching_method_steps FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Auth full coaching_faqs" ON public.coaching_faqs;
CREATE POLICY "Auth full coaching_faqs" ON public.coaching_faqs FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Auth full jury_experiences" ON public.jury_experiences;
CREATE POLICY "Auth full jury_experiences" ON public.jury_experiences FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Auth full jury_criteria" ON public.jury_criteria;
CREATE POLICY "Auth full jury_criteria" ON public.jury_criteria FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Auth full culinary_items" ON public.culinary_items;
CREATE POLICY "Auth full culinary_items" ON public.culinary_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Auth full contests" ON public.contests;
CREATE POLICY "Auth full contests" ON public.contests FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Auth full contest_results" ON public.contest_results;
CREATE POLICY "Auth full contest_results" ON public.contest_results FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Auth full articles" ON public.articles;
CREATE POLICY "Auth full articles" ON public.articles FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Auth full testimonials" ON public.testimonials;
CREATE POLICY "Auth full testimonials" ON public.testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Auth full media_library" ON public.media_library;
CREATE POLICY "Auth full media_library" ON public.media_library FOR ALL TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Auth full contact_messages" ON public.contact_messages;
CREATE POLICY "Auth full contact_messages" ON public.contact_messages FOR ALL TO authenticated USING (true) WITH CHECK (true);
