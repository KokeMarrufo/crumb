import {
  mockCheckinDishes,
  mockCheckinPhotos,
  mockCheckins,
  mockComments,
  mockFollows,
  mockLikes,
  mockRestaurants,
  mockUsers,
} from '../data/mockData';
import type { Checkin } from '../types/models';
import { applyCheckinPrivacy, delay } from './_internal';
import type { JournalFeedItem } from './types';

function buildFeedItem(checkin: Checkin, viewerId: string): JournalFeedItem {
  const restaurant = mockRestaurants.find((r) => r.id === checkin.restaurant_id)!;
  const photos = mockCheckinPhotos.filter((p) => p.checkin_id === checkin.id).sort((a, b) => a.order - b.order);
  const dishes = mockCheckinDishes.filter((d) => d.checkin_id === checkin.id);
  const likes = mockLikes.filter((l) => l.checkin_id === checkin.id);
  const comments = mockComments.filter((c) => c.checkin_id === checkin.id);
  const author = mockUsers.find((u) => u.id === checkin.user_id)!;
  return {
    checkin: applyCheckinPrivacy(checkin, viewerId),
    restaurant,
    photos,
    dishes,
    likes,
    comments,
    author,
  };
}

export async function getJournalFeed(userId: string): Promise<JournalFeedItem[]> {
  await delay();
  const mine = mockCheckins
    .filter((c) => c.user_id === userId)
    .sort((a, b) => new Date(b.visited_at).getTime() - new Date(a.visited_at).getTime());
  return mine.map((c) => buildFeedItem(c, userId));
}

/** Profile tab: someone else’s crumbs — `viewerId` controls private_note visibility */
export async function getCrumbsForProfile(profileUserId: string, viewerId: string): Promise<JournalFeedItem[]> {
  await delay();
  const rows = mockCheckins
    .filter((c) => c.user_id === profileUserId)
    .sort((a, b) => new Date(b.visited_at).getTime() - new Date(a.visited_at).getTime());
  return rows.map((c) => buildFeedItem(c, viewerId));
}

export async function getCheckinFeedItem(checkinId: string, viewerId: string): Promise<JournalFeedItem | null> {
  await delay();
  const c = mockCheckins.find((x) => x.id === checkinId);
  if (!c) return null;
  return buildFeedItem(c, viewerId);
}

/** Following ids (accepted) for a user */
export function getFollowingUserIds(userId: string): string[] {
  return mockFollows.filter((f) => f.follower_id === userId && f.status === 'accepted').map((f) => f.following_id);
}

export async function getCrumbsCountForUser(userId: string) {
  await delay();
  return mockCheckins.filter((c) => c.user_id === userId).length;
}

export async function getFriendsCrumbsAtRestaurant(
  restaurantId: string,
  viewerId: string,
): Promise<JournalFeedItem[]> {
  await delay();
  const following = new Set(getFollowingUserIds(viewerId));
  const crumbs = mockCheckins.filter(
    (c) => c.restaurant_id === restaurantId && c.user_id !== viewerId && following.has(c.user_id),
  );
  return crumbs
    .sort((a, b) => new Date(b.visited_at).getTime() - new Date(a.visited_at).getTime())
    .map((c) => buildFeedItem(c, viewerId));
}
