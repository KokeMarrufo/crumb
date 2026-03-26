/** Expo injects EXPO_PUBLIC_* from .env at build time. */
export const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
export const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

/** Google Places API (New); use EXPO_PUBLIC_ so Metro bundles it for the client. */
export const googlePlacesApiKey =
  process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY ?? process.env.GOOGLE_PLACES_API_KEY ?? '';

export function hasSupabaseConfig(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function hasGooglePlacesConfig(): boolean {
  return Boolean(googlePlacesApiKey.trim());
}

/** Text search: mock only when Places API key is missing (search does not require Supabase). */
export function restaurantSearchUsesMockData(): boolean {
  return !hasGooglePlacesConfig();
}
