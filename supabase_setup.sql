-- Script complet Supabase (safe a rejouer meme si la table existe deja)

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
  option_label text,
  statut text not null default 'a verifier',
  date_inscription timestamptz not null default now()
);

alter table inscriptions add column if not exists email text;
alter table inscriptions add column if not exists option_label text;

create index if not exists idx_inscriptions_telephone on inscriptions (telephone);
create index if not exists idx_inscriptions_statut on inscriptions (statut);

alter table inscriptions enable row level security;

drop policy if exists "Tout le monde peut s inscrire" on inscriptions;
create policy "Tout le monde peut s inscrire"
  on inscriptions for insert
  to anon
  with check (true);
