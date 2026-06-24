# Guide de déploiement — Plateforme SAHY TECHNOLOGIE (version finale)

Cette version remplace tout ce qui existait avant. Le plus simple et le plus
sûr : on supprime le contenu actuel du dépôt GitHub et on remet tout à neuf
avec GitHub Desktop, en une seule fois.

## Étape 1 — Vider le dossier cloné

1. Ouvre l'Explorateur Windows, va dans le dossier cloné par GitHub Desktop
   (celui qui contient `app`, `lib`, `components`, etc.)
2. **Sélectionne tout** (Ctrl+A)
3. **Supprime tout** (touche Suppr) — sauf le dossier `.git` s'il est visible
   (normalement caché ; si tu ne le vois pas, tout va bien, ne t'en soucie pas)

## Étape 2 — Copier les nouveaux fichiers

1. Dézippe le fichier `sahy-platform.zip` fourni
2. Ouvre le dossier dézippé `sahy-platform`
3. Sélectionne **tout le contenu** à l'intérieur (Ctrl+A) — pas le dossier
   `sahy-platform` lui-même, mais tout ce qu'il y a dedans (`app`, `lib`,
   `components`, `public`, `package.json`, etc.)
4. Copie (Ctrl+C)
5. Colle (Ctrl+V) dans le dossier cloné vidé à l'étape 1

## Étape 3 — Envoyer vers GitHub

1. Ouvre **GitHub Desktop**
2. L'onglet "Changes" doit afficher tous les fichiers (suppressions de
   l'ancien + ajouts du nouveau)
3. Dans "Summary", tape : `Nouvelle version avec identité SAHY TECHNOLOGIE`
4. Clique **"Commit to main"**
5. Clique **"Push origin"**

## Étape 4 — Vérifier les variables sur Vercel

Va dans Vercel → ton projet → Settings → Environment Variables. Vérifie que
ces 5 variables sont bien présentes :

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `ADMIN_CODE`

Si l'une manque, ajoute-la maintenant.

## Étape 5 — Mettre à jour Supabase

1. Va sur Supabase → ton projet → SQL Editor → New query
2. Colle le contenu de `supabase_setup.sql` (fourni)
3. Clique "Run" — ce script est sûr à rejouer même si la table existe déjà
   (il ajoute juste ce qui manque, comme la colonne email)

## Étape 6 — Redéployer

1. Sur Vercel, va dans "Deployments"
2. Le push GitHub a dû déclencher un nouveau déploiement automatique —
   attends qu'il passe au statut "Ready"
3. Sinon, clique sur les "..." du dernier déploiement → "Redeploy"

## Étape 7 — Tester

1. Visite ton site, inscris-toi avec ton adresse email (celle de ton compte
   Resend, pour que l'email de test fonctionne avec le domaine d'essai)
2. Vérifie la page "Inscription enregistrée"
3. Va dans `/admin`, confirme cette inscription test
4. Vérifie ta boîte mail (et les spams)
5. Va sur `/suivi`, vérifie l'affichage du reçu confirmé
6. Supprime l'inscription test depuis `/admin`

## Pour envoyer des emails à n'importe qui (pas seulement toi)

Tant que `sahytechnologie.com` n'est pas vérifié dans Resend, les emails ne
partent que vers l'adresse de ton compte Resend. Pour lever cette limite :

1. Resend → Domains → Add Domain → `sahytechnologie.com`
2. Ajoute les enregistrements DNS donnés chez ton fournisseur de domaine
3. Une fois "Verified", modifie dans `lib/config.js` :
   ```js
   export const EMAIL_FROM = "SAHY TECHNOLOGIE <inscription@sahytechnologie.com>";
   ```
4. Commit + Push comme à l'étape 3
