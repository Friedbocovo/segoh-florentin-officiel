# MC Florentin — Portfolio Professionnel & CMS Administrateur

> **Coach Miss & Mister · Jury de Concours · Chef Cuisinier**  
> *« Révéler l’élégance, sur scène comme à table »*

Plateforme web haut de gamme conçue sur mesure pour un profil d’exception combinant l'art scénique des concours d’élégance et la gastronomie d’auteur.

---

## 🌟 Fonctionnalités Principales

### 1. Site Public Multi-Pages
* **Page Accueil** : Hero section administrable, présentation rapide, 3 cartes d’expertise (Coaching, Jury, Gastronomie), chiffres clés vérifiés, concours à la une, extraits de la galerie, témoignages approuvés, dernières actualités et appel à l'action.
* **Page À propos** : Portrait éditorial, biographie complète, parcours, valeurs professionnelles, vision et philosophie, formations & distinctions.
* **Page Le coaching** : Vision de l'accompagnement Miss & Mister, catalogue des prestations, méthode en 4 étapes, résultats & liens vers les concours, galerie d'entraînement, témoignages et FAQ.
* **Page Le jury** : Déontologie, principes et critères d'évaluation publics, historique complet des concours arbitrés (distincts des concours coachés), témoignages de comités et appel à participation.
* **Page La gastronomie** : Carte des créations et spécialités (avec ingrédients et critères alimentaires), prestations de chef (dîners privés, réceptions) et formulaire de devis culinaire sur mesure.
* **Page Mes concours (Catalogue central)** : Catalogue complet des concours coachés avec recherche, filtre par année et tri chronologique.
* **Pages détaillées des concours (`/mes-concours/:slug`)** : Affiche officielle, rôle du coach, liste des candidats accompagnés avec leurs photos et titres obtenus par catégorie (Miss, Mister, 1ère Dauphine, 1er Dauphin, Ambassadeur, Prix spécial...), éditions multiples liées.
* **Page Galerie** : Galerie photos et vidéos filtrable par domaine avec visionneuse plein écran (Lightbox) et navigation clavier.
* **Page Témoignages** : Avis clients approuvés et formulaire public de dépôt (les nouveaux avis sont automatiquement placés en attente de modération dans le CMS).
* **Page Actualités & Articles (`/actualites/:slug`)** : Blog et réflexions avec mise en page riche, temps de lecture, partage et métadonnées SEO propres.
* **Page Contact** : Formulaire multi-motifs (Coaching, Jury, Gastronomie, Partenariat, Info), validation temps réel et enregistrement sécurisé en base de données.
* **Mentions Légales & RGPD** : Page d'information et de conformité réglementaire.

---

### 2. Espace Administrateur CMS (`/admin`)
* **Accès sécurisé** : Authentification via Supabase Auth avec protection des routes privées.
* **Tableau de bord** : Statistiques en temps réel (concours, distinctions, médias, articles, messages non lus, avis en attente) et raccourcis rapides.
* **Pages & Sections** : Modification des blocs de texte, boutons et images d'Accueil et À Propos.
* **Module Coaching** : CRUD complet des services, des étapes de méthode et de la FAQ.
* **Module Jury** : CRUD des participations officielles et des critères d'évaluation.
* **Module Gastronomie** : CRUD des plats, spécialités et prestations de chef.
* **Module Concours & Palmarès** : Gestion des concours coachés, des éditions multiples et sous-module d'attribution des distinctions par candidat.
* **Médiathèque** : Gestion centralisée des photos et vidéos Cloudinary avec légendes et alt-text.
* **Modération Témoignages** : Validation ou rejet en 1 clic des avis soumis par les visiteurs.
* **Gestion des Articles** : Rédaction avec slugs automatiques, catégories et statuts Brouillon/Publié.
* **Boîte de Réception** : Suivi des messages et devis reçus avec statuts (*Non lu, Lu, En cours, Traité, Archivé*).
* **Référencement (SEO)** : Aperçu Google SERP en direct et générateur de `sitemap.xml`.
* **Apparence & Réglages** : Coordonnées, réseaux sociaux, logo et sélecteur interactif de la couleur d'accent (`--red`).

---

## 🛠️ Stack Technique

* **Frontend** : React 18, TypeScript, Tailwind CSS, Lucide React
* **Build Tool** : Vite 7 (Performances ultra-rapides, zéro configuration superflue)
* **Backend & BDD** : Supabase (PostgreSQL, Row Level Security, Authentification)
* **SEO** : Balises dynamiques, OpenGraph, Canonical, Robots.txt, Sitemap.xml

---

## 🚀 Installation & Lancement Local

### 1. Prérequis
* Node.js (v18 ou supérieur)
* npm ou pnpm

### 2. Cloner le projet et installer les dépendances
```bash
git clone <votre-repo>
cd coach
npm install
```

### 3. Variables d'environnement
Copiez le fichier `.env.example` vers `.env` et renseignez vos valeurs :
```bash
cp .env.example .env
```

| Variable | Rôle |
|---|---|
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | Projet Supabase. Sans eux, le site tourne en **mode démo** (données d'exemple, sauvegarde dans le navigateur uniquement). |
| `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET` | Envoi des médias (preset **non signé**). Modifiables aussi dans Admin › Réglages. |
| `VITE_WHATSAPP_NUMBER` | Numéro WhatsApp par défaut (remplacé par celui d'Admin › Réglages). |
| `VITE_WHATSAPP_COUNTRY_CODE` | Indicatif ajouté aux numéros saisis sans « + » (`229` Bénin par défaut). |
| `VITE_SITE_URL` | URL publique du site : balises canonical, `sitemap.xml` et `robots.txt` générés au build. |

### 4. Lancer le serveur de développement
```bash
npm run dev
```
Ouvrez [http://localhost:5173](http://localhost:5173) dans votre navigateur.

---

## 🗄️ Schéma de Base de Données (Supabase)

Dans le **SQL Editor** de Supabase, exécutez **dans cet ordre** :
1. `supabase/migrations/20261026000000_full_cms_schema.sql` — crée les 14 tables du CMS ;
2. `supabase/migrations/20261028000000_security_and_schema_repair.sql` — ajoute les colonnes manquantes, la table `admin_users` et des règles de sécurité réservant l'écriture aux administrateurs.
3. `supabase/migrations/20261030000000_remove_stock_images.sql` — retire les photos d'illustration fictives (Pexels) de l'ancien contenu de démonstration.

Ces scripts peuvent être relancés sans risque, y compris sur une base qui a reçu les anciennes migrations du 25/10/2026.

> **Contenu de démonstration :** quand Supabase est branché, le site affiche uniquement le contenu de la base. Sur une base vide, le tableau de bord admin propose un bouton **« Importer »** qui copie le contenu d'exemple dans la base pour le modifier ensuite.

---

## 🔐 Création du Compte Administrateur

L'inscription publique est désactivée : un compte connecté n'a **aucun droit** tant qu'il n'est pas déclaré administrateur.

1. Dans Supabase › **Authentication › Users**, cliquez sur **Add user** et créez votre compte (e-mail + mot de passe).
2. Dans Supabase › **Authentication › Providers › Email**, désactivez **« Allow new users to sign up »** pour empêcher toute inscription depuis l'extérieur.
3. Dans le **SQL Editor**, déclarez ce compte comme administrateur :
   ```sql
   INSERT INTO public.admin_users (user_id)
   SELECT id FROM auth.users WHERE email = 'votre-email@exemple.com';
   ```
4. Connectez-vous sur `/admin`.

Pour retirer un administrateur : `DELETE FROM public.admin_users WHERE user_id = '…';`

---

## 📦 Build & Déploiement

### Vérification des types TypeScript
```bash
npm run typecheck
```

### Génération du bundle de production
```bash
npm run build
```
Les fichiers prêts pour le déploiement sont générés dans le dossier `dist/`. Après la compilation, `scripts/prerender.mjs` crée un `index.html` par page publique (et par concours / article publié) avec ses propres balises titre, description et OpenGraph : les aperçus de liens WhatsApp/Facebook et les moteurs de recherche voient ainsi le bon contenu. Relancez le build après avoir publié un nouveau concours ou article pour mettre à jour ces pages et le `sitemap.xml`. Vous pouvez déployer ce dossier statique sur Vercel, Netlify, Cloudflare Pages ou tout serveur Nginx / Apache avec redirection SPA vers `index.html`.
