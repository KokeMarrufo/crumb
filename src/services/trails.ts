import {
  mockCheckinDishes,
  mockCheckinPhotos,
  mockCheckins,
  mockRestaurants,
  mockTrailItems,
  mockTrails,
  mockUsers,
} from '../data/mockData';
import { applyCheckinPrivacy, delay } from './_internal';
import type { TrailDetailResult } from './types';

export async function getTrailsForUser(userId: string) {
  await delay();
  return mockTrails.filter((t) => t.user_id === userId).sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function getTrailById(trailId: string, viewerUserId: string): Promise<TrailDetailResult> {
  await delay();
  const trail = mockTrails.find((t) => t.id === trailId);
  if (!trail) throw new Error('Trail not found');
  const owner = mockUsers.find((u) => u.id === trail.user_id)!;
  const items = mockTrailItems
    .filter((ti) => ti.trail_id === trailId)
    .sort((a, b) => a.rank - b.rank)
    .map((ti) => {
      const restaurant = mockRestaurants.find((r) => r.id === ti.restaurant_id)!;
      const checkin = ti.checkin_id ? mockCheckins.find((c) => c.id === ti.checkin_id) ?? null : null;
      const safeCheckin = checkin ? applyCheckinPrivacy(checkin, viewerUserId) : null;
      const photos = safeCheckin
        ? mockCheckinPhotos.filter((p) => p.checkin_id === safeCheckin.id).sort((a, b) => a.order - b.order)
        : [];
      const dishes = safeCheckin ? mockCheckinDishes.filter((d) => d.checkin_id === safeCheckin.id) : [];
      return {
        trail_item_id: ti.id,
        rank: ti.rank,
        restaurant,
        checkin: safeCheckin,
        photos,
        dishes,
      };
    });
  return { trail, owner, items };
}
