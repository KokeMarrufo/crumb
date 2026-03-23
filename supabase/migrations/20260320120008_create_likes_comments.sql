create table public.likes (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references public.users (id) on delete cascade,
  checkin_id uuid not null references public.checkins (id) on delete cascade,
  created_at timestamptz not null default now (),
  constraint likes_user_checkin_unique unique (user_id, checkin_id)
);

comment on table public.likes is 'One row per like on a check-in.';

create table public.comments (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references public.users (id) on delete cascade,
  checkin_id uuid not null references public.checkins (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now ()
);

comment on table public.comments is 'Comments on check-ins.';
