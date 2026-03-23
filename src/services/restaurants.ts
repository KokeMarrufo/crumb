import {
  MOCK_CURRENT_USER_ID,
  mockCheckins,
  mockRestaurants,
  mockTrailItems,
  mockTrails,
} from '../data/mockData';
import { delay } from './_internal';
import { getJournalFeed, getFriendsCrumbsAtRestaurant } from './checkins';
import type { RestaurantDetailResult } from './types';

export async function getRestaurantSearchResults(query: string) {
  await delay();
  const q = query.trim().toLowerCase();
  if (!q) return mockRestaurants.slice(0, 8);
  return mockRestaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(q) ||
      (r.city && r.city.toLowerCase().includes(q)) ||
      (r.address && r.address.toLowerCase().includes(q)),
  );
}

export async function getRestaurantById(restaurantId: string) {
  await delay();
  const r = mockRestaurants.find((x) => x.id === restaurantId);
  if (!r) throw new Error('Restaurant not found');
  return r;
}

export async function getRestaurantDetail(
  restaurantId: string,
  viewerUserId: string = MOCK_CURRENT_USER_ID,
): Promise<RestaurantDetailResult> {
  await delay();
  const restaurant = await getRestaurantById(restaurantId);
  const myFeed = await getJournalFeed(viewerUserId);
  const my_crumbs = myFeed.filter((j) => j.checkin.restaurant_id === restaurantId);
  const friends_crumbs = await getFriendsCrumbsAtRestaurant(restaurantId, viewerUserId);

  const appears_in_trails = mockTrailItems
    .filter((ti) => ti.restaurant_id === restaurantId)
    .map((ti) => {
      const trail = mockTrails.find((t) => t.id === ti.trail_id)!;
      return { trail, rank: ti.rank };
    })
    .filter((x, i, arr) => arr.findIndex((y) => y.trail.id === x.trail.id) === i);

  return {
    restaurant,
    my_crumbs,
    friends_crumbs,
    appears_in_trails,
  };
}
