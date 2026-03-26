import { MOCK_CURRENT_USER_ID, mockRestaurants, mockTrailItems, mockTrails } from '../data/mockData';
import { hasSupabaseConfig, restaurantSearchUsesMockData } from '../lib/env';
import { mapGooglePlaceToRestaurant, searchTextPlaces } from '../lib/places';
import { supabase } from '../lib/supabase';
import type { Restaurant } from '../types/models';
import { delay } from './_internal';
import { getJournalFeed, getFriendsCrumbsAtRestaurant } from './checkins';
import type { RestaurantDetailResult } from './types';

function mapDbRowToRestaurant(row: {
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
}): Restaurant {
  return {
    id: row.id,
    place_id: row.place_id,
    name: row.name,
    address: row.address,
    city: row.city,
    country: row.country,
    lat: row.lat,
    lng: row.lng,
    google_data: row.google_data,
    created_at: row.created_at,
  };
}

export async function getRestaurantSearchResults(query: string): Promise<Restaurant[]> {
  if (restaurantSearchUsesMockData()) {
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

  const q = query.trim();
  if (!q) return [];

  const places = await searchTextPlaces(q);
  const out: Restaurant[] = [];
  for (const p of places) {
    const r = mapGooglePlaceToRestaurant(p) as Restaurant;
    if (r.place_id) out.push(r);
  }
  return out;
}

/** After user picks a search row: upsert into `restaurants`, return DB row (local uuid `id`). */
export async function upsertRestaurantForCheckin(candidate: Restaurant): Promise<Restaurant> {
  if (!hasSupabaseConfig()) {
    await delay();
    return candidate;
  }

  const row = {
    place_id: candidate.place_id,
    name: candidate.name,
    address: candidate.address,
    city: candidate.city,
    country: candidate.country,
    lat: candidate.lat,
    lng: candidate.lng,
    google_data: candidate.google_data,
  };

  const { data, error } = await supabase
    .from('restaurants')
    .upsert(row, { onConflict: 'place_id' })
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Upsert returned no row');
  return mapDbRowToRestaurant(data);
}

export async function getRestaurantById(restaurantId: string): Promise<Restaurant> {
  if (!hasSupabaseConfig()) {
    await delay();
    const r = mockRestaurants.find((x) => x.id === restaurantId);
    if (!r) throw new Error('Restaurant not found');
    return r;
  }

  const { data, error } = await supabase.from('restaurants').select('*').eq('id', restaurantId).maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('Restaurant not found');
  return mapDbRowToRestaurant(data);
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
