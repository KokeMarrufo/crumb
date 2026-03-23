create table public.trail_items (
  id uuid primary key default gen_random_uuid (),
  trail_id uuid not null references public.trails (id) on delete cascade,
  restaurant_id uuid not null references public.restaurants (id) on delete restrict,
  checkin_id uuid references public.checkins (id) on delete set null,
  rank smallint not null,
  created_at timestamptz not null default now ()
);

comment on table public.trail_items is 'Trail entries; optional checkin_id links the experience that earned the spot.';
