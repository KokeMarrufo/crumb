import type {
  Checkin,
  CheckinDish,
  CheckinPhoto,
  Comment,
  Follow,
  Like,
  Notification,
  Restaurant,
  Trail,
  User,
} from '../types/models';

export type JournalFeedItem = {
  checkin: Checkin;
  restaurant: Restaurant;
  photos: CheckinPhoto[];
  dishes: CheckinDish[];
  likes: Like[];
  comments: Comment[];
  author: User;
};

export type TrailDetailResult = {
  trail: Trail;
  owner: User;
  items: {
    trail_item_id: string;
    rank: number;
    restaurant: Restaurant;
    checkin: Checkin | null;
    photos: CheckinPhoto[];
    dishes: CheckinDish[];
  }[];
};

export type RestaurantDetailResult = {
  restaurant: Restaurant;
  my_crumbs: JournalFeedItem[];
  friends_crumbs: JournalFeedItem[];
  appears_in_trails: { trail: Trail; rank: number }[];
};

export type ExploreData = {
  trending_trails: { trail: Trail; owner: User; preview_image_url: string | null }[];
  suggested_users: User[];
  local_spots: {
    restaurant: Restaurant;
    friends_loving: { user: User; snippet: string }[];
  }[];
};
