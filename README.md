# Plateforme d'inscription — Formation Informatique Bureautique

Site web permettant aux participants de s'inscrire à la formation
"Informatique Bureautique" (Bobo-Dioulasso), de déclarer leur paiement Mobile
Money, de recevoir un reçu automatique, et de rejoindre le groupe WhatsApp.
Un espace organisateur protégé par code permet de suivre et confirmer les
inscriptions.

## Démarrer en local

```bash
npm install
cp .env.local.example .env.local
# puis remplis .env.local avec tes clés Supabase (voir GUIDE_DEPLOIEMENT.md)
npm run dev
```

Ouvre http://localhost:3000

## Déployer en ligne

Suis le fichier **GUIDE_DEPLOIEMENT.md** — il explique pas à pas comment
créer la base de données (Supabase) et mettre le site en ligne (Vercel),
gratuitement, avec ton compte GitHub.

## Structure du projet

```
app/
  page.js                  → page d'accueil + formulaire d'inscription
  merci/                   → page de reçu après inscription
  admin/                   → espace organisateur (liste des inscrits)
  api/inscriptions/        → API : créer / lister les inscriptions
  api/inscriptions/[id]/   → API : récupérer / confirmer / supprimer une inscription
  api/admin-login/         → API : vérifier le code organisateur
lib/
  config.js                → infos formation, prix, lien WhatsApp, numéros
  supabaseAdmin.js          → client base de données (usage serveur uniquement)
  supabasePublic.js         → client base de données (usage navigateur)
components/
  TopBar.jsx, Footer.jsx    → éléments d'interface partagés
supabase_setup.sql          → script à exécuter dans Supabase pour créer la table
```

## Personnaliser

Toutes les informations de la formation (dates, prix, modules, numéros de
paiement, lien WhatsApp) se trouvent dans **`lib/config.js`** — modifie ce
fichier pour une autre session de formation.
