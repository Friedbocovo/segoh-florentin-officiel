/*
# Sécurisation de l'administration & réparation du schéma

Cette migration est idempotente : elle peut être exécutée sur une base neuve
(après 20261026000000_full_cms_schema.sql) ou sur une base qui a déjà reçu
les anciennes migrations du 25/10/2026.

1. Administrateurs
   - Table `admin_users` : seuls les comptes listés ici ont accès au CMS.
   - Fonction `is_admin()` utilisée par toutes les politiques RLS.
   - Être simplement « connecté » ne donne plus aucun droit.

2. Colonnes manquantes
   - `site_settings` : whatsapp_number, cloudinary_cloud_name, cloudinary_upload_preset, tagline, logo_url, legal_notice.
   - `contact_messages` / `media_library` : colonnes du schéma complet absentes des anciennes migrations.

3. Politiques RLS
   - Toutes les anciennes politiques des tables du CMS sont supprimées puis recréées.

APRÈS EXÉCUTION : ajoutez votre compte administrateur (voir README) :
   INSERT INTO public.admin_users (user_id)
   SELECT id FROM auth.users WHERE email = 'votre-email@exemple.com';
*/

-- 1. ADMINISTRATEURS
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid());
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM public;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- 2. COLONNES MANQUANTES
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS tagline text NOT NULL DEFAULT 'Coach Miss & Mister · Jury de Concours · Chef Cuisinier',
  ADD COLUMN IF NOT EXISTS logo_url text NOT NULL DEFAULT '/logo.png',
  ADD COLUMN IF NOT EXISTS legal_notice text NOT NULL DEFAULT 'Couronne & Toque - Tous droits réservés.',
  ADD COLUMN IF NOT EXISTS whatsapp_number text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS cloudinary_cloud_name text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS cloudinary_upload_preset text NOT NULL DEFAULT '';

-- Nouvelle charte « luxe éditorial » : or champagne. Les anciennes couleurs par défaut sont remplacées,
-- une couleur personnalisée par l'administrateur est conservée.
ALTER TABLE public.site_settings ALTER COLUMN accent_color SET DEFAULT '#8A6630';
UPDATE public.site_settings SET accent_color = '#8A6630'
WHERE lower(accent_color) IN ('#8d2732', '#9e293d');
ALTER TABLE public.site_settings ALTER COLUMN logo_url SET DEFAULT '';

ALTER TABLE public.contact_messages
  ADD COLUMN IF NOT EXISTS purpose text NOT NULL DEFAULT 'coaching',
  ADD COLUMN IF NOT EXISTS desired_date text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS location text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS guest_count text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS budget text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.contact_messages ALTER COLUMN status SET DEFAULT 'unread';
UPDATE public.contact_messages SET status = 'unread' WHERE status = 'new';

ALTER TABLE public.media_library
  ADD COLUMN IF NOT EXISTS url text,
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'galerie',
  ADD COLUMN IF NOT EXISTS contest_id uuid REFERENCES public.contests(id) ON DELETE SET NULL;

-- Ancienne structure de media_library (cloudinary_url / section) : migration des données
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_schema = 'public' AND table_name = 'media_library' AND column_name = 'cloudinary_url') THEN
    EXECUTE 'UPDATE public.media_library SET url = cloudinary_url WHERE url IS NULL';
    EXECUTE 'ALTER TABLE public.media_library ALTER COLUMN cloudinary_url DROP NOT NULL';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_schema = 'public' AND table_name = 'media_library' AND column_name = 'section') THEN
    EXECUTE 'UPDATE public.media_library SET category = section WHERE category = ''galerie'' AND section <> ''galerie''';
    EXECUTE 'ALTER TABLE public.media_library ALTER COLUMN section DROP NOT NULL';
  END IF;
END $$;

UPDATE public.media_library SET url = '' WHERE url IS NULL;
ALTER TABLE public.media_library ALTER COLUMN url SET NOT NULL;

-- 3. POLITIQUES RLS
-- Suppression de toutes les politiques existantes (y compris celles des anciennes migrations)
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname, tablename FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN (
        'site_settings', 'site_sections', 'coaching_services', 'coaching_method_steps',
        'coaching_faqs', 'jury_experiences', 'jury_criteria', 'culinary_items', 'contests',
        'contest_results', 'articles', 'testimonials', 'media_library', 'contact_messages',
        'site_content', 'admin_users'
      )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
  END LOOP;
END $$;

-- admin_users : un administrateur ne voit que la liste (gestion via SQL uniquement)
CREATE POLICY "Admins read admin_users" ON public.admin_users FOR SELECT TO authenticated USING (public.is_admin());

-- Lecture publique du contenu publié
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public read site_sections" ON public.site_sections FOR SELECT USING (is_published = true OR public.is_admin());
CREATE POLICY "Public read coaching_services" ON public.coaching_services FOR SELECT USING (is_published = true OR public.is_admin());
CREATE POLICY "Public read coaching_method_steps" ON public.coaching_method_steps FOR SELECT USING (is_published = true OR public.is_admin());
CREATE POLICY "Public read coaching_faqs" ON public.coaching_faqs FOR SELECT USING (is_published = true OR public.is_admin());
CREATE POLICY "Public read jury_experiences" ON public.jury_experiences FOR SELECT USING (is_published = true OR public.is_admin());
CREATE POLICY "Public read jury_criteria" ON public.jury_criteria FOR SELECT USING (is_published = true OR public.is_admin());
CREATE POLICY "Public read culinary_items" ON public.culinary_items FOR SELECT USING (is_published = true OR public.is_admin());
CREATE POLICY "Public read contests" ON public.contests FOR SELECT USING (is_published = true OR public.is_admin());
CREATE POLICY "Public read contest_results" ON public.contest_results FOR SELECT USING (
  public.is_admin()
  OR EXISTS (SELECT 1 FROM public.contests c WHERE c.id = contest_id AND c.is_published = true)
);
CREATE POLICY "Public read articles" ON public.articles FOR SELECT USING (is_published = true OR public.is_admin());
CREATE POLICY "Public read testimonials" ON public.testimonials FOR SELECT USING (status = 'approved' OR public.is_admin());
CREATE POLICY "Public read media_library" ON public.media_library FOR SELECT USING (is_published = true OR public.is_admin());
CREATE POLICY "Admins read contact_messages" ON public.contact_messages FOR SELECT USING (public.is_admin());

-- Soumissions publiques (formulaires du site)
CREATE POLICY "Anon can submit contact_messages" ON public.contact_messages FOR INSERT
  WITH CHECK (status = 'unread');
CREATE POLICY "Anon can submit testimonials pending" ON public.testimonials FOR INSERT
  WITH CHECK (status = 'pending' OR public.is_admin());

-- Accès complet réservé aux administrateurs
CREATE POLICY "Admin full site_settings" ON public.site_settings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full site_sections" ON public.site_sections FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full coaching_services" ON public.coaching_services FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full coaching_method_steps" ON public.coaching_method_steps FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full coaching_faqs" ON public.coaching_faqs FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full jury_experiences" ON public.jury_experiences FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full jury_criteria" ON public.jury_criteria FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full culinary_items" ON public.culinary_items FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full contests" ON public.contests FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full contest_results" ON public.contest_results FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full articles" ON public.articles FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full testimonials" ON public.testimonials FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full media_library" ON public.media_library FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full contact_messages" ON public.contact_messages FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Droits de base (les politiques ci-dessus filtrent ensuite ligne par ligne)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT INSERT ON public.contact_messages, public.testimonials TO anon;
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
