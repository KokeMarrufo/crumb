create table public.checkin_photos (
  id uuid primary key default gen_random_uuid (),
  checkin_id uuid not null references public.checkins (id) on delete cascade,
  url text not null,
  "order" smallint not null,
  created_at timestamptz not null default now ()
);

comment on table public.checkin_photos is 'Photos for a check-in; order is 0-based display sequence.';

create table public.checkin_dishes (
  id uuid primary key default gen_random_uuid (),
  checkin_id uuid not null references public.checkins (id) on delete cascade,
  name text not null,
  notes text,
  rating smallint,
  created_at timestamptz not null default now ()
);

comment on table public.checkin_dishes is 'Per-dish ratings; average feeds computed_rating on checkins.';
