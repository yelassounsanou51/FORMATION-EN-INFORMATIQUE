# Guide de mise en ligne — Formation Informatique Bureautique

Ce guide t'emmène de zéro jusqu'à un site en ligne, accessible par un lien, avec
une vraie base de données. Tu as déjà un compte GitHub : c'est le seul
prérequis. Tout le reste (Supabase, Vercel) se crée avec ce compte GitHub en
quelques clics, gratuitement.

Temps estimé : 20-30 minutes la première fois.

---

## Étape 1 — Créer la base de données (Supabase)

1. Va sur https://supabase.com et clique sur **"Start your project"**.
2. Connecte-toi avec ton compte **GitHub**.
3. Clique sur **"New project"**.
   - Nom : `formation-bureautique` (ou ce que tu veux)
   - Mot de passe de base de données : génère-en un et **note-le quelque part**
     (tu n'en auras pas besoin pour ce guide, mais autant le garder)
   - Région : choisis la plus proche (Europe de l'Ouest si disponible)
4. Attends 1-2 minutes que le projet se crée.
5. Une fois dans le projet, va dans le menu de gauche : **SQL Editor**.
6. Clique sur **"New query"**.
7. Ouvre le fichier `supabase_setup.sql` (fourni avec ce projet), copie tout
   son contenu, colle-le dans l'éditeur SQL de Supabase.
8. Clique sur **"Run"** (ou Ctrl+Entrée). Tu dois voir "Success" en bas.
   → Ta table `inscriptions` est créée, avec les bonnes règles de sécurité.

### Récupérer tes clés Supabase

1. Dans le menu de gauche, va dans **Project Settings** (icône d'engrenage) →
   **API**.
2. Tu vas avoir besoin de 3 valeurs, garde cette page ouverte :
   - **Project URL** → ressemble à `https://xxxxx.supabase.co`
   - **anon public** (sous "Project API keys") → une longue chaîne de caractères
   - **service_role** (cliquer sur "Reveal" pour la voir) → une autre longue
     chaîne, **à garder secrète, ne jamais la partager publiquement**

---

## Étape 2 — Mettre le code sur GitHub

1. Va sur https://github.com et connecte-toi.
2. Clique sur **"New repository"** (bouton vert, en haut à droite).
3. Nom du dépôt : `formation-bureautique` (ou ce que tu veux).
4. Laisse-le en **Public** ou **Private**, peu importe.
5. Ne coche aucune case (pas de README, pas de .gitignore — on en a déjà un).
6. Clique sur **"Create repository"**.
7. GitHub t'affiche des commandes. Sur ton ordinateur, ouvre un terminal dans
   le dossier du projet (`formation-web`) et tape, dans l'ordre :

```bash
git init
git add .
git commit -m "Premier envoi : plateforme d'inscription"
git branch -M main
git remote add origin https://github.com/TON_NOM_UTILISATEUR/formation-bureautique.git
git push -u origin main
```

   (Remplace `TON_NOM_UTILISATEUR` par ton vrai nom d'utilisateur GitHub —
   l'adresse exacte est affichée sur la page GitHub après la création du dépôt.)

Si Git te demande de te connecter, suis les instructions à l'écran (GitHub te
proposera normalement d'ouvrir une fenêtre de connexion).

---

## Étape 3 — Déployer sur Vercel

1. Va sur https://vercel.com et clique sur **"Sign Up"**.
2. Choisis **"Continue with GitHub"** et autorise l'accès.
3. Une fois connecté, clique sur **"Add New..."** → **"Project"**.
4. Trouve ton dépôt `formation-bureautique` dans la liste et clique sur
   **"Import"**.
5. Vercel détecte automatiquement que c'est un projet Next.js — ne change rien
   aux réglages de build.
6. Avant de cliquer sur "Deploy", déroule la section **"Environment
   Variables"** et ajoute ces 4 variables (une par une, "Add" après chaque) :

   | Nom de la variable              | Valeur                                              |
   |----------------------------------|------------------------------------------------------|
   | `NEXT_PUBLIC_SUPABASE_URL`       | Ton "Project URL" Supabase                          |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | Ta clé "anon public" Supabase                       |
   | `SUPABASE_SERVICE_ROLE_KEY`      | Ta clé "service_role" Supabase                      |
   | `ADMIN_CODE`                     | Un code secret que TOI SEUL connais (ex: `Bobo2026!`) |

7. Clique sur **"Deploy"**.
8. Attends 1-2 minutes. Une fois terminé, Vercel t'affiche un lien du type
   `https://formation-bureautique.vercel.app` — **c'est ton site en ligne !**

---

## Étape 4 — Tester

1. Ouvre le lien Vercel sur ton téléphone ou ordinateur.
2. Remplis le formulaire d'inscription avec un faux essai pour vérifier que
   tout fonctionne.
3. Tu dois arriver sur une page de reçu avec ton numéro de reçu, le bouton de
   téléchargement PDF, et le lien WhatsApp.
4. Va sur `https://TON-SITE.vercel.app/admin`, entre le code que tu as choisi
   dans `ADMIN_CODE`, et vérifie que ton inscription test apparaît.
5. Supprime ton inscription test depuis l'espace organisateur (icône
   poubelle) avant de partager le lien à de vraies personnes.

---

## Comment ça marche au quotidien, une fois en ligne

- Tu partages le lien `https://TON-SITE.vercel.app` (WhatsApp, Facebook, etc.)
- Chaque personne s'inscrit, paie sur ton Mobile Money, déclare son paiement,
  reçoit son reçu et le lien du groupe WhatsApp.
- Toi, tu surveilles les notifications de paiement sur ton téléphone Orange
  Money / Moov Money.
- Tu vas sur `/admin`, tu retrouves la personne (recherche par nom ou
  numéro), tu cliques **"Confirmer"** une fois le paiement vérifié.
- Le tableau de bord te montre en direct : nombre total d'inscrits, nombre
  confirmé, nombre en attente, et le revenu total confirmé.

---

## Pour mettre à jour le site plus tard

Si tu modifies des informations (dates, prix, modules, numéros) dans le code,
il suffit de refaire :

```bash
git add .
git commit -m "Mise à jour des informations"
git push
```

Vercel redéploie automatiquement le site en 1-2 minutes après chaque `push`.

---

## Sécurité — à retenir

- **Ne partage jamais** ta clé `SUPABASE_SERVICE_ROLE_KEY` publiquement (pas
  sur WhatsApp, pas dans un message, nulle part en dehors des variables
  d'environnement Vercel).
- Change `ADMIN_CODE` régulièrement si tu donnes l'accès admin à quelqu'un
  d'autre et que cette personne ne doit plus y avoir accès.
- Le formulaire public ne peut **que créer** des inscriptions — il ne peut
  jamais lire ou modifier les inscriptions des autres, grâce aux règles de
  sécurité (RLS) mises en place dans Supabase.

---

## En cas de problème

- **Le site affiche une erreur après inscription** : vérifie que les 4
  variables d'environnement sont bien renseignées dans Vercel (Project →
  Settings → Environment Variables), puis redéploie (Deployments → "..." →
  Redeploy).
- **"Non autorisé" dans l'espace admin** : vérifie que tu tapes exactement le
  même code que celui mis dans `ADMIN_CODE` sur Vercel (sensible à la casse).
- **Le `git push` échoue** : vérifie l'URL du `remote add` — elle doit
  correspondre exactement à celle de ton dépôt GitHub.
