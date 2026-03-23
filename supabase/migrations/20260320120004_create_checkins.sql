-- Check-ins (Crumbs). private_note is author-only at query layer (see view + grants in RLS migration).
create table public.checkins (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references public.users (id) on delete cascade,
  restaurant_id uuid not null references public.restaurants (id) on delete restrict,
  visited_at timestamptz not null,
  notes text,
  user_rating smallint,
  computed_rating real,
  is_remote boolean not null default false,
  private_note text,
  created_at timestamptz not null default now ()
);

comment on table public.checkins is 'Check-ins; private_note never exposed in public queries — use checkins_safe view for reads.';
comment on column public.checkins.private_note is 'Private reflection; only the author should read via checkins_safe or direct service_role.';
