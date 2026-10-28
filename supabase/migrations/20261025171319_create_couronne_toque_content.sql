/*
# Create Couronne & Toque portfolio content

1. New tables
- `site_content`: editable public portfolio entries for pages, services, awards, gallery items, testimonials, articles, and agenda.
- `contact_messages`: visitor contact requests submitted through the public site.

2. Content fields
- `site_content.id`: UUID primary key.
- `site_content.section`: public area identifier.
- `site_content.title`: display title.
- `site_content.eyebrow`: small editorial label.
- `site_content.description`: body copy.
- `site_content.image_url`: optional Cloudinary-hosted media URL.
- `site_content.meta`: flexible JSON for prices, dates, tags, and links.
- `site_content.sort_order`: editorial ordering.
- `site_content.is_published`: public visibility switch.
- timestamps: creation and last update dates.

3. Contact fields
- `contact_messages.id`: UUID primary key.
- `contact_messages.name`, `email`, `phone`, `subject`, `message`: request details.
- `contact_messages.status`: inbox workflow status.
- `contact_messages.created_at`: submission time.

4. Security
- RLS is enabled on both tables.
- Public visitors can read published content and submit contact requests.
- Authenticated users can manage all content and contact requests in the admin area.
- Grants are limited to the verbs required by each public or authenticated workflow.
*/

CREATE TABLE IF NOT EXISTS public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  title text NOT NULL,
  eyebrow text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  image_url text,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS site_content_section_order_idx
  ON public.site_content (section, sort_order, created_at DESC);

CREATE INDEX IF NOT EXISTS contact_messages_status_created_idx
  ON public.contact_messages (status, created_at DESC);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.site_content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;

DROP POLICY IF EXISTS "Published content is public" ON public.site_content;
CREATE POLICY "Published content is public"
  ON public.site_content FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users create content" ON public.site_content;
CREATE POLICY "Authenticated users create content"
  ON public.site_content FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users update content" ON public.site_content;
CREATE POLICY "Authenticated users update content"
  ON public.site_content FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users delete content" ON public.site_content;
CREATE POLICY "Authenticated users delete content"
  ON public.site_content FOR DELETE
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Visitors submit contact requests" ON public.contact_messages;
CREATE POLICY "Visitors submit contact requests"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users view contact requests" ON public.contact_messages;
CREATE POLICY "Authenticated users view contact requests"
  ON public.contact_messages FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users update contact requests" ON public.contact_messages;
CREATE POLICY "Authenticated users update contact requests"
  ON public.contact_messages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users delete contact requests" ON public.contact_messages;
CREATE POLICY "Authenticated users delete contact requests"
  ON public.contact_messages FOR DELETE
  TO authenticated
  USING (true);
