/**
 * Schema-aligned types (snake_case) — mirrors docs/Crumb_Data_Model.md
 */

export type FollowStatus = 'pending' | 'accepted';

export type NotificationType =
  | 'new_follower'
  | 'follow_request'
  | 'follow_approved'
  | 'friend_checkin_at_your_place'
  | 'new_like'
  | 'new_comment';

export type NotificationEntityType = 'checkin' | 'trail' | 'follow' | null;

export interface User {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  is_private: boolean;
  requires_follow_approval: boolean;
  created_at: string;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  status: FollowStatus;
  created_at: string;
}

export interface Block {
  id: string;
  blocker_id: string;
  blocked_id: string;
  created_at: string;
}

export interface Restaurant {
  id: string;
  place_id: string;
  name: string;
  address: string | null;
  city: string | null;
  country: string | null;
  lat: number | null;
  lng: number | null;
  google_data: Record<string, unknown> | null;
  created_at: string;
}

export interface Checkin {
  id: string;
  user_id: string;
  restaurant_id: string;
  visited_at: string;
  notes: string | null;
  user_rating: number | null;
  computed_rating: number | null;
  is_remote: boolean;
  private_note: string | null;
  created_at: string;
}

export interface CheckinPhoto {
  id: string;
  checkin_id: string;
  url: string;
  order: number;
  created_at: string;
}

export interface CheckinDish {
  id: string;
  checkin_id: string;
  name: string;
  notes: string | null;
  rating: number | null;
  created_at: string;
}

export interface Trail {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
}

export interface TrailItem {
  id: string;
  trail_id: string;
  restaurant_id: string;
  checkin_id: string | null;
  rank: number;
  created_at: string;
}

export interface Like {
  id: string;
  user_id: string;
  checkin_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  user_id: string;
  checkin_id: string;
  body: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  actor_id: string;
  type: NotificationType;
  entity_id: string | null;
  entity_type: NotificationEntityType;
  is_read: boolean;
  created_at: string;
}
