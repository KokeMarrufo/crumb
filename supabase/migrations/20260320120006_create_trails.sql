create table public.trails (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references public.users (id) on delete cascade,
  name text not null,
  description text,
  is_public boolean not null default true,
  created_at timestamptz not null default now ()
);

comment on table public.trails is 'Curated restaurant lists; visibility combines is_public and owner profile privacy.';
