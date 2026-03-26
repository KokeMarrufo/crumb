# Crumb — Plan

## Done

- Expo / React Native app scaffold with TypeScript (`App.tsx`, `index.ts`, `app.json`)
- Expo SDK aligned to **54** for compatibility with App Store **Expo Go** (dependency alignment via `expo install`; `expo-doctor` clean)
- App config: `expo-font` + `expo-localization` plugins; `expo-image` used as a library only (not listed as a config plugin)
- Root navigation: bottom tabs + native stack (`src/navigation/RootNavigator.tsx`, `MainTabs` with glass-style bar and center check-in CTA)
- Design tokens and typography (Newsreader + Manrope, warm palette, no 1px borders per design intent)
- Reusable UI pieces (e.g. `ScreenHeader`) and shared layout patterns
- **Mock data layer** (`src/data/mockData.ts`) and **service modules** (`src/services/*`) — all reads/writes go through services, ready to swap implementations
- Screens wired end-to-end on mocks: Journal, Explore, check-in flow, Trails, Activity, detail flows, Profile, and related navigation targets
- **i18n**: English + Spanish, `expo-localization` + device locale, language persisted (AsyncStorage), Profile language selection
- Toasts (`react-native-toast-message`), splash / fonts loading path
- Mock imagery for crumbs and explore previews (remote placeholder URLs, e.g. food photos)
- `docs/CLAUDE.md` context for AI assistants
- **Supabase SQL migrations** (`supabase/migrations/`): all **12 tables**, indexes, **RLS** + helper functions + `checkins_safe` view. Filenames use Supabase’s **`YYYYMMDDHHMMSS_description.sql`** pattern (version = leading timestamp). `public.users.id` references `auth.users(id)`. Apply with `npx supabase link` then `npm run db:push` (or `npx supabase db reset` locally when Docker is available).
- **If `db push` says remote migration versions aren’t in this repo:** run `npx supabase migration list` to compare. If the cloud DB has an old/extra version (e.g. from the SQL editor) with no matching file here, either align with `npx supabase db pull` or, **only if you accept resetting that history** on an empty/dev DB, `npx supabase migration repair --status reverted <version>` for each remote-only version, then `npm run db:push` again.
- **To wipe the remote DB and replace it entirely with this repo’s migrations:** follow [`docs/supabase-reset-remote.md`](supabase-reset-remote.md) (SQL script + `npm run db:push`).
- **Supabase Auth in the app:** `@supabase/supabase-js` + `AuthProvider`, email/password **sign up** / **sign in** / **sign out**, `AsyncStorage` session, **`ensureUserProfile`** on sign-in to insert `public.users`, **Login** / **SignUp** screens when logged out, **config missing** screen if `EXPO_PUBLIC_*` env vars are unset (copy `.env.example` → `.env`). Mock feeds use **`useViewerId()`** (real session id when logged in).
- **Users / Profile service (Supabase):** `getCurrentUser()` uses auth session + `public.users`; `getUserProfile()` / `getUserById()` query `users`; `getUsersByIds()` batch query; `updateUserProfile()` updates own row (RLS). **Mock fallback** when `EXPO_PUBLIC_SUPABASE_*` is unset. **Profile** screen shows real `full_name`, `@username`, `avatar_url`, `bio` for the viewed user.
- **Restaurants + Google Places API (New):** `getRestaurantSearchResults()` → `places:searchText` with field mask; `upsertRestaurantForCheckin()` upserts `public.restaurants` on `place_id`; `getRestaurantById()` / `getRestaurantDetail()` read from DB when Supabase is configured. **Search** uses mock restaurants only when `EXPO_PUBLIC_GOOGLE_PLACES_API_KEY` is unset. **Upsert** needs Supabase; without it, selection keeps the client-side `Restaurant` (no DB row). Check-in flow runs search + upsert on pick so `picked` uses the local `restaurants.id` (uuid) when Supabase is configured.

## Next

- Replace remaining mock services with real Supabase (and external APIs) — order below
- Cloudflare R2 photo uploads
- TestFlight / dev build

### Mock → Supabase / APIs (roadmap)

1. ~~Users / Profile~~ — done
2. ~~Restaurants + Google Places API (New)~~ — done
3. Check-ins: create/list/journal feed; `private_note` only for owner (verify RLS + `checkins_safe`)
4. Trails: list, detail with items, create / add
5. Social: likes, comments, follow/unfollow, block/unblock
6. Notifications: list, mark read
