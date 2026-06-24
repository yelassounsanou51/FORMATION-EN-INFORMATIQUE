# SAHY TECHNOLOGIE — Plateforme d'inscription Informatique Bureautique

Site web complet permettant aux participants de s'inscrire à la formation,
déclarer leur paiement Mobile Money, suivre leur statut, et recevoir
automatiquement par email leur reçu + le lien WhatsApp dès confirmation par
l'organisateur.

## Démarrer en local

```bash
npm install
cp .env.local.example .env.local
# remplis .env.local avec tes clés Supabase et Resend
npm run dev
```

## Variables d'environnement nécessaires (sur Vercel)

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `ADMIN_CODE`

## Structure

```
app/
  page.js                    → page d'accueil + formulaire d'inscription
  en-attente/                → accusé de réception après inscription
  suivi/                     → vérifier le statut avec son numéro
  admin/                     → espace organisateur (confirmer les paiements)
  api/inscriptions/          → créer / lister les inscriptions
  api/inscriptions/[id]/     → consulter / confirmer / supprimer une inscription
  api/admin-login/           → vérifier le code organisateur
lib/
  config.js                  → infos formation, prix, lien WhatsApp, numéros
  email.js                   → envoi de l'email de confirmation (Resend)
  pdfReceipt.js               → génération du reçu PDF côté serveur
  supabaseAdmin.js            → client base de données (serveur uniquement)
components/
  TopBar.jsx, Footer.jsx, ArcMark.jsx
public/
  logo.png                   → logo SAHY TECHNOLOGIE
```

## Personnaliser

Toutes les informations de la formation se trouvent dans `lib/config.js`.
