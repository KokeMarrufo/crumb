-- Helper functions for policies (SECURITY DEFINER; fixed search_path).
create or replace function public.is_blocked (a uuid, b uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.blocks
    where (blocker_id = a and blocked_id = b)
       or (blocker_id = b and blocked_id = a)
  );
$$;

create or replace function public.is_accepted_follower (viewer uuid, author uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.follows
    where follower_id = viewer
      and following_id = author
      and status = 'accepted'
  );
$$;

-- Public profiles: visible to any reader (including anon) when not private;
-- private profiles: owner or accepted followers; blocked users never see each other.
create or replace function public.can_view_profile (viewer uuid, profile_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select case
    when viewer is not distinct from profile_id then true
    when viewer is null then exists (
      select 1
      from public.users u
      where u.id = profile_id
        and not u.is_private
    )
    when public.is_blocked(viewer, profile_id) then false
    when not exists (select 1 from public.users u where u.id = profile_id) then false
    when not (select u.is_private from public.users u where u.id = profile_id) then true
    else public.is_accepted_follower(viewer, profile_id)
  end;
$$;

create or replace function public.can_view_checkin (viewer uuid, checkin_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.checkins c
    where c.id = checkin_id
      and public.can_view_profile(viewer, c.user_id)
  );
$$;

create or replace function public.can_view_trail (viewer uuid, p_trail_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.trails t
    join public.users u on u.id = t.user_id
    where t.id = p_trail_id
      and (
        viewer is not distinct from t.user_id
        or (
          not public.is_blocked(viewer, t.user_id)
          and (
            (
              not t.is_public
              and public.is_accepted_follower(viewer, t.user_id)
            )
            or (
              t.is_public
              and not u.is_private
              and public.can_view_profile(viewer, t.user_id)
            )
            or (
              t.is_public
              and u.is_private
              and public.is_accepted_follower(viewer, t.user_id)
            )
          )
        )
      )
  );
$$;

create or replace function public.owns_trail (viewer uuid, p_trail_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.trails t
    where t.id = p_trail_id
      and t.user_id = viewer
  );
$$;

-- RLS
alter table public.users enable row level security;

alter table public.follows enable row level security;

alter table public.blocks enable row level security;

alter table public.restaurants enable row level security;

alter table public.checkins enable row level security;

alter table public.checkin_photos enable row level security;

alter table public.checkin_dishes enable row level security;

alter table public.trails enable row level security;

alter table public.trail_items enable row level security;

alter table public.likes enable row level security;

alter table public.comments enable row level security;

alter table public.notifications enable row level security;

-- users
create policy "users_select_visible_profiles"
  on public.users for select
  to authenticated, anon
  using (public.can_view_profile(auth.uid(), id));

create policy "users_insert_own"
  on public.users for insert
  to authenticated
  with check (auth.uid() = id);

create policy "users_update_own"
  on public.users for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "users_delete_own"
  on public.users for delete
  to authenticated
  using (auth.uid() = id);

-- follows
create policy "follows_select_participant"
  on public.follows for select
  to authenticated
  using (follower_id = auth.uid() or following_id = auth.uid());

create policy "follows_insert_follower"
  on public.follows for insert
  to authenticated
  with check (follower_id = auth.uid());

create policy "follows_update_participant"
  on public.follows for update
  to authenticated
  using (follower_id = auth.uid() or following_id = auth.uid())
  with check (follower_id = auth.uid() or following_id = auth.uid());

create policy "follows_delete_participant"
  on public.follows for delete
  to authenticated
  using (follower_id = auth.uid() or following_id = auth.uid());

-- blocks
create policy "blocks_select_blocker"
  on public.blocks for select
  to authenticated
  using (blocker_id = auth.uid());

create policy "blocks_insert_blocker"
  on public.blocks for insert
  to authenticated
  with check (blocker_id = auth.uid());

create policy "blocks_delete_blocker"
  on public.blocks for delete
  to authenticated
  using (blocker_id = auth.uid());

-- restaurants
create policy "restaurants_select_authenticated"
  on public.restaurants for select
  to authenticated
  using (true);

create policy "restaurants_insert_authenticated"
  on public.restaurants for insert
  to authenticated
  with check (true);

create policy "restaurants_update_authenticated"
  on public.restaurants for update
  to authenticated
  using (true)
  with check (true);

-- checkins (row visibility; private_note column exposure handled via checkins_safe + grants below)
create policy "checkins_select_visible"
  on public.checkins for select
  to authenticated, anon
  using (public.can_view_checkin(auth.uid(), id));

create policy "checkins_insert_own"
  on public.checkins for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "checkins_update_own"
  on public.checkins for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "checkins_delete_own"
  on public.checkins for delete
  to authenticated
  using (auth.uid() = user_id);

-- checkin_photos (same visibility as parent check-in)
create policy "checkin_photos_select_visible"
  on public.checkin_photos for select
  to authenticated, anon
  using (
    exists (
      select 1
      from public.checkins c
      where c.id = checkin_id
        and public.can_view_checkin(auth.uid(), c.id)
    )
  );

create policy "checkin_photos_insert_owner"
  on public.checkin_photos for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.checkins c
      where c.id = checkin_id
        and c.user_id = auth.uid()
    )
  );

create policy "checkin_photos_update_owner"
  on public.checkin_photos for update
  to authenticated
  using (
    exists (
      select 1
      from public.checkins c
      where c.id = checkin_id
        and c.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.checkins c
      where c.id = checkin_id
        and c.user_id = auth.uid()
    )
  );

create policy "checkin_photos_delete_owner"
  on public.checkin_photos for delete
  to authenticated
  using (
    exists (
      select 1
      from public.checkins c
      where c.id = checkin_id
        and c.user_id = auth.uid()
    )
  );

-- checkin_dishes
create policy "checkin_dishes_select_visible"
  on public.checkin_dishes for select
  to authenticated, anon
  using (
    exists (
      select 1
      from public.checkins c
      where c.id = checkin_id
        and public.can_view_checkin(auth.uid(), c.id)
    )
  );

create policy "checkin_dishes_insert_owner"
  on public.checkin_dishes for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.checkins c
      where c.id = checkin_id
        and c.user_id = auth.uid()
    )
  );

create policy "checkin_dishes_update_owner"
  on public.checkin_dishes for update
  to authenticated
  using (
    exists (
      select 1
      from public.checkins c
      where c.id = checkin_id
        and c.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.checkins c
      where c.id = checkin_id
        and c.user_id = auth.uid()
    )
  );

create policy "checkin_dishes_delete_owner"
  on public.checkin_dishes for delete
  to authenticated
  using (
    exists (
      select 1
      from public.checkins c
      where c.id = checkin_id
        and c.user_id = auth.uid()
    )
  );

-- trails
create policy "trails_select_visible"
  on public.trails for select
  to authenticated, anon
  using (public.can_view_trail(auth.uid(), id));

create policy "trails_insert_owner"
  on public.trails for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "trails_update_owner"
  on public.trails for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "trails_delete_owner"
  on public.trails for delete
  to authenticated
  using (auth.uid() = user_id);

-- trail_items
create policy "trail_items_select_visible"
  on public.trail_items for select
  to authenticated, anon
  using (public.can_view_trail(auth.uid(), trail_id));

create policy "trail_items_insert_owner"
  on public.trail_items for insert
  to authenticated
  with check (
    public.owns_trail(auth.uid(), trail_id)
    and (
      checkin_id is null
      or exists (
        select 1
        from public.checkins c
        where c.id = checkin_id
          and c.user_id = auth.uid()
      )
    )
  );

create policy "trail_items_update_owner"
  on public.trail_items for update
  to authenticated
  using (public.owns_trail(auth.uid(), trail_id))
  with check (
    public.owns_trail(auth.uid(), trail_id)
    and (
      checkin_id is null
      or exists (
        select 1
        from public.checkins c
        where c.id = checkin_id
          and c.user_id = auth.uid()
      )
    )
  );

create policy "trail_items_delete_owner"
  on public.trail_items for delete
  to authenticated
  using (public.owns_trail(auth.uid(), trail_id));

-- likes (readable when parent check-in is visible)
create policy "likes_select_visible_checkin"
  on public.likes for select
  to authenticated, anon
  using (public.can_view_checkin(auth.uid(), checkin_id));

create policy "likes_insert_self"
  on public.likes for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and public.can_view_checkin(auth.uid(), checkin_id)
  );

create policy "likes_delete_own"
  on public.likes for delete
  to authenticated
  using (auth.uid() = user_id);

-- comments
create policy "comments_select_visible_checkin"
  on public.comments for select
  to authenticated, anon
  using (public.can_view_checkin(auth.uid(), checkin_id));

create policy "comments_insert_visible"
  on public.comments for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and public.can_view_checkin(auth.uid(), checkin_id)
  );

create policy "comments_update_own"
  on public.comments for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "comments_delete_own"
  on public.comments for delete
  to authenticated
  using (auth.uid() = user_id);

-- notifications
create policy "notifications_select_recipient"
  on public.notifications for select
  to authenticated
  using (auth.uid() = user_id);

create policy "notifications_insert_actor"
  on public.notifications for insert
  to authenticated
  with check (actor_id = auth.uid());

create policy "notifications_update_recipient"
  on public.notifications for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "notifications_delete_recipient"
  on public.notifications for delete
  to authenticated
  using (auth.uid() = user_id);

-- Safe read view: private_note only when the row author is the current user.
create view public.checkins_safe
with (security_invoker = true) as
select
  c.id,
  c.user_id,
  c.restaurant_id,
  c.visited_at,
  c.notes,
  c.user_rating,
  c.computed_rating,
  c.is_remote,
  case
    when c.user_id = auth.uid() then c.private_note
    else null
  end as private_note,
  c.created_at
from public.checkins c;

comment on view public.checkins_safe is 'Use for client reads; masks private_note for non-owners.';

-- Prefer checkins_safe for broad reads; base table SELECT on non-sensitive columns only
-- so INSERT ... RETURNING (without private_note) still works for clients.
revoke select on table public.checkins from PUBLIC;
revoke select on table public.checkins from anon;
revoke select on table public.checkins from authenticated;

grant select (
  id,
  user_id,
  restaurant_id,
  visited_at,
  notes,
  user_rating,
  computed_rating,
  is_remote,
  created_at
) on table public.checkins to authenticated;

grant select on table public.checkins_safe to anon;
grant select on table public.checkins_safe to authenticated;

grant insert, update, delete on table public.checkins to authenticated;
