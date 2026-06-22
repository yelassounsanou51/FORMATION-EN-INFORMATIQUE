-- ============================================================
-- À copier-coller dans Supabase > SQL Editor > New query > Run
-- ============================================================

create table if not exists inscriptions (
  id text primary key,
  nom text not null,
  prenom text not null,
  telephone text not null,
  sexe text not null,
  profession text,
  operateur text not null,
  transaction_ref text,
  montant integer not null,
  statut text not null default 'à vérifier',
  date_inscription timestamptz not null default now()
);

-- Index pour accélérer les recherches par téléphone et par statut
create index if not exists idx_inscriptions_telephone on inscriptions (telephone);
create index if not exists idx_inscriptions_statut on inscriptions (statut);

-- Active la sécurité au niveau des lignes (RLS)
alter table inscriptions enable row level security;

-- Autorise l'insertion publique (formulaire d'inscription ouvert à tous)
create policy "Tout le monde peut s'inscrire"
  on inscriptions for insert
  to anon
  with check (true);

-- Bloque la lecture/modification publique : seule la clé "service role"
-- (utilisée uniquement côté serveur, jamais exposée au navigateur) peut lire/modifier.
-- Aucune policy SELECT/UPDATE/DELETE pour "anon" = accès refusé par défaut.
