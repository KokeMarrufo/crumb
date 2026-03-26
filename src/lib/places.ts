import { googlePlacesApiKey } from './env';

const SEARCH_TEXT_URL = 'https://places.googleapis.com/v1/places:searchText';

/** `places.name` is required — resource id `places/ChIJ…` used as stable `place_id` when `id` is absent. */
const FIELD_MASK =
  'places.name,places.id,places.displayName,places.formattedAddress,places.location,places.addressComponents';

type PlacesAddressComponent = {
  longText?: string;
  shortText?: string;
  types?: string[];
};

export type GooglePlaceResource = {
  id?: string;
  name?: string;
  displayName?: { text?: string; languageCode?: string };
  formattedAddress?: string;
  location?: { latitude?: number; longitude?: number };
  addressComponents?: PlacesAddressComponent[];
};

type SearchTextResponse = {
  places?: GooglePlaceResource[];
};

/** Google returns the canonical id in `name` (`places/…`) and/or `id` depending on field mask. */
function extractPlaceId(place: GooglePlaceResource): string {
  const resourceName = place.name?.trim();
  if (resourceName?.startsWith('places/')) {
    return resourceName.slice('places/'.length);
  }
  const shortId = place.id?.trim();
  if (shortId) return shortId;
  if (resourceName) return resourceName;
  return '';
}

function extractCityCountry(components: PlacesAddressComponent[] | undefined): {
  city: string | null;
  country: string | null;
} {
  let city: string | null = null;
  let country: string | null = null;
  for (const c of components ?? []) {
    const types = c.types ?? [];
    if (types.includes('country')) {
      country = c.longText ?? c.shortText ?? null;
    }
    if (types.includes('locality')) {
      city = c.longText ?? c.shortText ?? null;
    }
  }
  if (!city) {
    for (const c of components ?? []) {
      const types = c.types ?? [];
      if (types.includes('administrative_area_level_1')) {
        city = c.longText ?? c.shortText ?? null;
        break;
      }
    }
  }
  return { city, country };
}

/** Stable client-side id for list keys before DB upsert. */
function randomClientId(): string {
  const c = globalThis.crypto;
  if (c?.randomUUID) return c.randomUUID();
  return `tmp-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Maps a Places API (New) place object to fields matching `public.restaurants`
 * (plus temporary `id` / `created_at` for UI until upsert).
 */
export function mapGooglePlaceToRestaurant(place: GooglePlaceResource): {
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
} {
  const placeId = extractPlaceId(place);
  const name = place.displayName?.text?.trim() || 'Unknown place';
  const { city, country } = extractCityCountry(place.addressComponents);
  const lat =
    place.location?.latitude != null && !Number.isNaN(place.location.latitude)
      ? place.location.latitude
      : null;
  const lng =
    place.location?.longitude != null && !Number.isNaN(place.location.longitude)
      ? place.location.longitude
      : null;

  return {
    id: randomClientId(),
    place_id: placeId,
    name,
    address: place.formattedAddress?.trim() ?? null,
    city,
    country,
    lat,
    lng,
    google_data: place as unknown as Record<string, unknown>,
    created_at: new Date().toISOString(),
  };
}

export async function searchTextPlaces(textQuery: string): Promise<GooglePlaceResource[]> {
  const key = googlePlacesApiKey;
  if (!key) {
    throw new Error('Google Places API key is not configured');
  }
  const q = textQuery.trim();
  if (!q) return [];

  const res = await fetch(SEARCH_TEXT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': key,
      'X-Goog-FieldMask': FIELD_MASK,
    },
    body: JSON.stringify({ textQuery: q }),
  });

  const json = (await res.json()) as SearchTextResponse & { error?: { message?: string } };

  if (!res.ok) {
    const msg = json.error?.message ?? res.statusText ?? 'Places search failed';
    throw new Error(msg);
  }

  return json.places ?? [];
}
