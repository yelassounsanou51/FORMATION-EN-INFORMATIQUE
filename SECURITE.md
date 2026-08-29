# Corrections de sécurité — Résumé

Ce document explique ce qui a changé par rapport à la version précédente
et ce qu'il faut faire pour redéployer correctement.

## Ce qui a été corrigé

| Faille | Avant | Maintenant |
| --- | --- | --- |
| Fuite de données (critique) | `/api/inscriptions/[id]` publique, renvoyait tout | Route publique `/api/suivi` exige ID **et** téléphone, limitée à 10 tentatives / 15 min par IP |
| Brute-force sur l'admin | Aucune limite de tentatives | 5 tentatives / 15 min par IP sur `/api/admin-login` |
| Code admin exposé côté navigateur | Stocké en clair dans `sessionStorage`, renvoyé en header à chaque requête | Session par cookie `httpOnly` + `secure`, signée (HMAC), invisible en JavaScript |
| Comparaison du code admin | `===` (sensible aux attaques temporelles) | `crypto.timingSafeEqual` (temps constant) |
| Spam du formulaire d'inscription | Aucune limite | 5 inscriptions / 30 min par IP |
| Identifiant de reçu prévisible | `Math.random()`, 4 chiffres (9 000 combinaisons) | `crypto.randomInt`, 6 chiffres (900 000 combinaisons), cryptographique |
| Dépendances vulnérables | Next.js 14.2.5 (10 vulnérabilités dont 2 critiques) | Next.js 14.2.35 (correctifs appliqués) |
| En-têtes de sécurité HTTP | Aucun | CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy |

## Vulnérabilité résiduelle (mineure, risque réel faible)

`npm audit` signale encore des failles dans `postcss` (dépendance interne
de Next.js 14, verrouillée à la version 8.4.31). Elles concernent la
divulgation de fichiers `.map` via des commentaires CSS contrôlés par un
attaquant — un scénario qui ne s'applique pas ici (le site n'accepte
aucun CSS venant des utilisateurs). La corriger complètement nécessite un
passage à Next.js 15 ou 16, une migration majeure hors du périmètre de
cette correction rapide. À prévoir dans un second temps.

## Étapes pour déployer cette version

1. **Ajouter une nouvelle variable d'environnement sur Vercel** :
   `ADMIN_SESSION_SECRET` — une valeur aléatoire longue, générée par exemple avec :
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Ne jamais réutiliser cette valeur ailleurs, ne jamais la partager.

2. **Rejouer le script SQL** `supabase_setup.sql` dans l'éditeur SQL de Supabase.
   Il est conçu pour être rejoué sans danger même si les tables existent déjà
   (il ajoute simplement la nouvelle table `rate_limits` utilisée par la
   limitation de débit).

3. **Redéployer** normalement (`git push`, ou upload sur Vercel).

4. **Informer les inscrits déjà enregistrés** : le suivi public demande
   maintenant le téléphone en plus du numéro de suivi. Si des personnes
   ont déjà leur numéro de suivi sans avoir ce changement en tête, ce n'est
   pas un problème : elles utilisent simplement le même téléphone que celui
   fourni à l'inscription, qu'elles connaissent déjà.

## Nouvelles routes API

| Route | Rôle | Authentification |
| --- | --- | --- |
| `POST /api/suivi` | Suivi public d'une inscription (ID + téléphone) | Aucune (rate-limitée) |
| `POST /api/admin-login` | Connexion admin | Rate-limitée, crée le cookie de session |
| `GET /api/admin-login` | Vérifie si une session admin valide existe | Lit le cookie |
| `POST /api/admin-logout` | Déconnexion admin | Supprime le cookie |
| `GET /api/inscriptions` | Liste complète (tableau de bord) | Cookie de session admin requis |
| `GET/PATCH/DELETE /api/inscriptions/[id]` | Gestion d'une inscription | Cookie de session admin requis |
