-- ============================================================
-- À copier-coller dans Supabase > SQL Editor > New query > Run
-- Si tu avais déjà créé la table sans la colonne email, ce script
-- l'ajoute automatiquement grâce à "if not exists".
-- ============================================================

create table if not exists inscriptions (
  id text primary key,
  nom text not null,
  prenom text not null,
  telephone text not null,
  email text,
  sexe text not null,
  profession text,
  operateur text not null,
  transaction_ref text,
  montant integer not null,
  statut text not null default 'à vérifier',
  date_inscription timestamptz not null default now()
);

alter table inscriptions add column if not exists email text;

create index if not exists idx_inscriptions_telephone on inscriptions (telephone);
create index if not exists idx_inscriptions_statut on inscriptions (statut);

alter table inscriptions enable row level security;

drop policy if exists "Tout le monde peut s'inscrire" on inscriptions;
create policy "Tout le monde peut s'inscrire"
  on inscriptions for insert
  to anon
  with check (true);

-- Aucune policy SELECT/UPDATE/DELETE pour "anon" = accès en lecture/modification
-- refusé par défaut au navigateur. Seule la clé "service role" (utilisée
-- uniquement côté serveur) peut lire, confirmer ou supprimer des inscriptions.
