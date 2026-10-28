/*
# Extend Couronne & Toque content management

1. Modified table
- `site_content`: adds optional CTA label, CTA link, and media type so editors can manage buttons and image/video presentation without losing existing content.

2. New tables
- `media_library`: Cloudinary media records with title, type, URL, alt text, caption, related section, and editorial order. This keeps media independently replaceable, sortable, and removable.
- `site_settings`: one shared settings record for SEO defaults, contact details, social links, and visual preferences.

3. Security
- RLS is enabled on both new tables.
- Public visitors can read published media and the public settings record.
- Authenticated editors can create, read, update, and delete all CMS records.
- Grants are limited to the roles and operations used by the public site and admin area.
*/

ALTER TABLE public.site_content
  ADD COLUMN IF NOT EXISTS button_label text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS button_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS media_type text NOT NULL DEFAULT 'image';

CREATE TABLE IF NOT EXISTS public.media_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  media_type text NOT NULL DEFAULT 'image',
  cloudinary_url text NOT NULL,
  thumbnail_url text,
  alt_text text NOT NULL DEFAULT '',
  caption text NOT NULL DEFAULT '',
  section text NOT NULL DEFAULT 'galerie',
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name text NOT NULL DEFAULT 'Couronne & Toque',
  contact_email text NOT NULL DEFAULT 'bonjour@couronne-toque.fr',
  contact_phone text NOT NULL DEFAULT '',
  contact_address text NOT NULL DEFAULT '',
  instagram_url text NOT NULL DEFAULT '',
  facebook_url text NOT NULL DEFAULT '',
  youtube_url text NOT NULL DEFAULT '',
  default_title text NOT NULL DEFAULT 'Couronne & Toque — Révéler l’élégance',
  default_description text NOT NULL DEFAULT 'Coaching, jurys de concours et cuisine d’auteur.',
  default_og_image text NOT NULL DEFAULT '',
  accent_color text NOT NULL DEFAULT '#9e293d',
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS site_settings_singleton_idx ON public.site_settings ((true));
CREATE INDEX IF NOT EXISTS media_library_section_order_idx ON public.media_library (section, sort_order, created_at DESC);

ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.media_library TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.media_library TO authenticated;
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;

DROP POLICY IF EXISTS "Published media is public" ON public.media_library;
CREATE POLICY "Published media is public" ON public.media_library FOR SELECT TO anon, authenticated USING (is_published = true OR auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Authenticated users create media" ON public.media_library;
CREATE POLICY "Authenticated users create media" ON public.media_library FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated users update media" ON public.media_library;
CREATE POLICY "Authenticated users update media" ON public.media_library FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated users delete media" ON public.media_library;
CREATE POLICY "Authenticated users delete media" ON public.media_library FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "Public settings are readable" ON public.site_settings;
CREATE POLICY "Public settings are readable" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Authenticated users create settings" ON public.site_settings;
CREATE POLICY "Authenticated users create settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated users update settings" ON public.site_settings;
CREATE POLICY "Authenticated users update settings" ON public.site_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated users delete settings" ON public.site_settings;
CREATE POLICY "Authenticated users delete settings" ON public.site_settings FOR DELETE TO authenticated USING (true);

INSERT INTO public.site_settings (site_name)
SELECT 'Couronne & Toque'
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings);
