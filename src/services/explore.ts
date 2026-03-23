import {
  FOOD_IMAGE_URLS,
  MOCK_CURRENT_USER_ID,
  mockCheckins,
  mockRestaurants,
  mockTrailItems,
  mockTrails,
  mockUsers,
} from '../data/mockData';
import { delay } from './_internal';
import { getFollowingUserIds } from './checkins';
import type { ExploreData } from './types';

export async function getExploreData(viewerId: string = MOCK_CURRENT_USER_ID): Promise<ExploreData> {
  await delay();
  const trending_trails = mockTrails.slice(0, 3).map((trail, i) => {
    const owner = mockUsers.find((u) => u.id === trail.user_id)!;
    const firstItem = mockTrailItems.find((ti) => ti.trail_id === trail.id);
    let preview_image_url: string | null = null;
    if (firstItem?.checkin_id) {
      const ci = mockCheckins.find((c) => c.id === firstItem.checkin_id);
      if (ci) {
        preview_image_url = FOOD_IMAGE_URLS[i % FOOD_IMAGE_URLS.length];
      }
    }
    return { trail, owner, preview_image_url };
  });

  const suggested_users = mockUsers.filter((u) => u.id !== viewerId).slice(0, 5);

  const following = getFollowingUserIds(viewerId);
  const local_spots = mockRestaurants.slice(0, 4).map((restaurant) => {
    const crumbsHere = mockCheckins.filter(
      (c) => c.restaurant_id === restaurant.id && following.includes(c.user_id),
    );
    const friends_loving = crumbsHere.slice(0, 3).map((c) => {
      const user = mockUsers.find((u) => u.id === c.user_id)!;
      const snippet = c.notes ? c.notes.slice(0, 72) + (c.notes.length > 72 ? '…' : '') : '';
      return { user, snippet };
    });
    return { restaurant, friends_loving };
  });

  return { trending_trails, suggested_users, local_spots };
}
