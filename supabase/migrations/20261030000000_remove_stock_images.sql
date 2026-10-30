/*
# Suppression des photos d'illustration fictives (banque d'images Pexels)

Le contenu de démonstration utilisait des photos Pexels. Cette migration les retire :
- les champs image pointant vers images.pexels.com sont vidés (le site affiche alors
  un emplacement sobre au monogramme, ou une photo de la médiathèque) ;
- les médias de la médiathèque hébergés sur Pexels sont supprimés.

Les images téléversées sur Cloudinary ne sont pas concernées. Migration rejouable sans risque.
*/

UPDATE public.site_settings SET default_og_image = '' WHERE default_og_image ILIKE '%pexels.com%';
ALTER TABLE public.site_settings ALTER COLUMN default_og_image SET DEFAULT '';

UPDATE public.site_sections     SET image_url = NULL       WHERE image_url ILIKE '%pexels.com%';
UPDATE public.coaching_services SET image_url = NULL       WHERE image_url ILIKE '%pexels.com%';
UPDATE public.jury_experiences  SET image_url = NULL       WHERE image_url ILIKE '%pexels.com%';
UPDATE public.culinary_items    SET image_url = NULL       WHERE image_url ILIKE '%pexels.com%';
UPDATE public.contests          SET cover_image = NULL     WHERE cover_image ILIKE '%pexels.com%';
UPDATE public.contest_results   SET candidate_photo = NULL WHERE candidate_photo ILIKE '%pexels.com%';
UPDATE public.articles          SET cover_image = NULL     WHERE cover_image ILIKE '%pexels.com%';
UPDATE public.testimonials      SET avatar_url = NULL      WHERE avatar_url ILIKE '%pexels.com%';

DELETE FROM public.media_library WHERE url ILIKE '%pexels.com%' OR thumbnail_url ILIKE '%pexels.com%';
