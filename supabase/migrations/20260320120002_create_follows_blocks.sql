-- Follow relationships (pending | accepted).
create table public.follows (
  id uuid primary key default gen_random_uuid (),
  follower_id uuid not null references public.users (id) on delete cascade,
  following_id uuid not null references public.users (id) on delete cascade,
  status text not null default 'accepted',
  created_at timestamptz not null default now (),
  constraint follows_no_self check (follower_id <> following_id),
  constraint follows_status_check check (status in ('pending', 'accepted')),
  constraint follows_follower_following_unique unique (follower_id, following_id)
);

comment on table public.follows is 'Follow relationships; status supports open follows and approval-required flows.';

-- Block list (safety).
create table public.blocks (
  id uuid primary key default gen_random_uuid (),
  blocker_id uuid not null references public.users (id) on delete cascade,
  blocked_id uuid not null references public.users (id) on delete cascade,
  created_at timestamptz not null default now (),
  constraint blocks_no_self check (blocker_id <> blocked_id),
  constraint blocks_blocker_blocked_unique unique (blocker_id, blocked_id)
);

comment on table public.blocks is 'Blocks; enforced via RLS.';
