-- Performance indexes (FK lookups and feed-style queries).
create index if not exists checkins_user_id_idx on public.checkins (user_id);

create index if not exists checkins_restaurant_id_idx on public.checkins (restaurant_id);

create index if not exists follows_follower_id_idx on public.follows (follower_id);

create index if not exists follows_following_id_idx on public.follows (following_id);

create index if not exists trail_items_trail_id_idx on public.trail_items (trail_id);

create index if not exists trail_items_restaurant_id_idx on public.trail_items (restaurant_id);

create index if not exists notifications_user_id_idx on public.notifications (user_id);

create index if not exists notifications_is_read_idx on public.notifications (is_read);

create index if not exists likes_checkin_id_idx on public.likes (checkin_id);

create index if not exists likes_user_id_idx on public.likes (user_id);

create index if not exists comments_checkin_id_idx on public.comments (checkin_id);
