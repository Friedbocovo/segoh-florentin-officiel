-- Trois actualités de départ pour la rubrique « Actualités ».
-- À exécuter une fois dans Supabase › SQL Editor (le script peut être relancé sans créer de doublons).
-- Les images de couverture s'ajoutent ensuite depuis l'admin › Actualités.

INSERT INTO public.articles
  (title, slug, summary, content, cover_image, category, published_at, is_published, is_featured, seo_title, seo_description)
VALUES
(
  'Cinq clés pour une présence scénique maîtrisée',
  'cinq-cles-presence-scenique',
  'Posture, regard, démarche, respiration et sourire : les fondamentaux que je travaille avec chaque candidate avant de monter sur scène.',
  $txt$La présence scénique ne relève pas du hasard. Elle se construit, séance après séance, jusqu’à devenir naturelle. Voici les cinq piliers sur lesquels repose ma méthode de coaching.

### 1. La posture, avant tout

Tout part de l’alignement : épaules relâchées, nuque longue, bassin stable. Une posture juste donne immédiatement de l’assurance, avant même le premier pas. Nous la travaillons debout, en marche et en position assise, car le jury vous observe à chaque instant.

### 2. Le regard qui embrasse la salle

Un regard fuyant trahit le trac. J’apprends aux candidates à poser leur regard sur trois points de la salle, puis à le faire circuler avec calme. Le public se sent alors concerné, et le jury perçoit une personnalité affirmée.

### 3. Une démarche qui raconte quelque chose

La démarche n’est pas qu’une technique de défilé : elle exprime une intention. Rythme, longueur du pas, arrêts et demi-tours se répètent jusqu’à ce que chaque mouvement paraisse évident.

### 4. La respiration comme alliée

Le stress se loge dans le souffle. Quelques exercices simples, pratiqués en coulisses, permettent de ralentir le rythme cardiaque et de garder une voix posée lors des questions du jury.

### 5. Un sourire sincère

Le sourire figé se repère au premier coup d’œil. L’objectif est un sourire qui vient du regard, en accord avec ce que l’on ressent. C’est souvent ce détail qui crée le lien avec le public.

> L’élégance, c’est lorsque le travail ne se voit plus.

Ces cinq clés se travaillent ensemble, dans la durée. Vous préparez un concours ? Parlons-en ensemble.$txt$,
  NULL,
  'Conseils Coaching',
  '2026-10-20 09:00:00+00',
  true,
  true,
  'Cinq clés pour une présence scénique maîtrisée',
  'Posture, regard, démarche, respiration et sourire : les cinq fondamentaux du coaching scénique pour réussir son passage en concours.'
),
(
  'Ce que le jury observe vraiment lors d’un concours',
  'ce-que-le-jury-observe',
  'Au-delà de la beauté, le jury évalue une cohérence d’ensemble. Regard de l’intérieur sur les critères qui font la différence.',
  $txt$On imagine souvent que le jury s’arrête à l’apparence. En réalité, une grille d’évaluation sérieuse porte sur bien d’autres aspects. Voici ce qui retient l’attention, de l’autre côté de la table.

### La cohérence de la personne

Le jury cherche une candidate ou un candidat cohérent : une allure, un discours et des valeurs qui se répondent. Une tenue spectaculaire ne compense pas un propos hésitant, et inversement.

### L’aisance à l’oral

Les questions du jury servent à découvrir une personnalité. On n’attend pas une réponse parfaite, mais une réponse sincère, structurée et assumée. Prendre une seconde pour réfléchir est toujours préférable à une réponse récitée.

### Le comportement hors scène

Ponctualité, respect des autres candidates, attitude en répétition : tout cela se remarque. Un titre engage à représenter un événement pendant toute une année, et le jury en tient compte.

### La progression au fil des épreuves

Un jury attentif mesure aussi la capacité à se reprendre après une erreur. Une hésitation lors du premier passage peut être largement rattrapée par un second passage maîtrisé.

> Un bon jury ne cherche pas la perfection, il cherche une évidence.

Évaluer avec exigence et bienveillance, c’est reconnaître le travail accompli tout en restant juste envers chaque candidate. C’est l’esprit dans lequel j’aborde chaque concours.$txt$,
  NULL,
  'Jury & Concours',
  '2026-10-25 09:00:00+00',
  true,
  false,
  'Ce que le jury observe vraiment lors d’un concours',
  'Cohérence, aisance à l’oral, attitude hors scène : les critères qui comptent réellement aux yeux d’un jury de concours de beauté.'
),
(
  'Composer un menu de réception élégant',
  'composer-un-menu-de-reception',
  'Équilibre des saveurs, rythme du service et produits de saison : mes principes pour un menu qui marque vos invités.',
  $txt$Un dîner réussi se joue bien avant le premier plat. La composition du menu donne le ton de toute la réception. Voici les principes qui guident chacune de mes propositions.

### Partir de l’occasion

Un gala, un mariage et un dîner d’affaires n’appellent pas la même cuisine. Le nombre d’invités, le lieu et le déroulé de la soirée orientent le choix entre service à l’assiette, buffet ou cocktail dînatoire.

### Construire une progression

Un menu se pense comme un récit : une entrée légère qui ouvre l’appétit, un plat qui affirme le caractère du repas, un dessert qui laisse un souvenir. Chaque étape doit préparer la suivante, sans lourdeur.

### Privilégier la saison et le local

Les produits de saison offrent le meilleur goût et la plus belle fraîcheur. Je les associe volontiers aux saveurs locales, revisitées avec une présentation soignée, pour une cuisine à la fois raffinée et ancrée.

### Penser à chacun

Allergies, régimes particuliers, préférences : il est essentiel de les anticiper. Une alternative élégante doit toujours être prévue, sans que l’invité concerné ne se sente mis à part.

### Soigner le dressage

On mange d’abord avec les yeux. Le dressage, la vaisselle et le rythme du service participent pleinement à l’expérience.

> Une belle table, c’est l’art de faire simple avec exigence.

Vous préparez un événement ? Décrivez-moi votre projet : je vous proposerai un menu sur mesure.$txt$,
  NULL,
  'Gastronomie',
  '2026-10-30 09:00:00+00',
  true,
  false,
  'Composer un menu de réception élégant',
  'Les principes d’un chef pour composer un menu de réception raffiné : occasion, progression, produits de saison et dressage.'
)
ON CONFLICT (slug) DO NOTHING;
