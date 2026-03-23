-- Local cache of Google Places data; place_id is the identity key.
create table public.restaurants (
  id uuid primary key default gen_random_uuid (),
  place_id text not null unique,
  name text not null,
  address text,
  city text,
  country text,
  lat double precision,
  lng double precision,
  google_data jsonb,
  created_at timestamptz not null default now ()
);

comment on table public.restaurants is 'Cached Places data; unique place_id per location.';
