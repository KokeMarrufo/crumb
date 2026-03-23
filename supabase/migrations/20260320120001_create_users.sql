-- Core user profile. id matches auth.users (Supabase Auth).
create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  full_name text not null,
  avatar_url text,
  bio text,
  is_private boolean not null default false,
  requires_follow_approval boolean not null default false,
  created_at timestamptz not null default now()
);

comment on table public.users is 'Core user profile; is_private and requires_follow_approval drive the privacy model.';
comment on column public.users.id is 'FK to auth.users; set on signup to match auth user id.';
