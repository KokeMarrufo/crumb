create table public.notifications (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references public.users (id) on delete cascade,
  actor_id uuid not null references public.users (id) on delete cascade,
  type text not null,
  entity_id uuid,
  entity_type text,
  is_read boolean not null default false,
  created_at timestamptz not null default now ()
);

comment on table public.notifications is 'In-app notifications; entity_id / entity_type are polymorphic pointers.';
