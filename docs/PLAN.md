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

## Next

- Supabase Auth (sign up, login, logout)
- Replace mock services with real Supabase calls one by one
- Google Places API integration
- Cloudflare R2 photo uploads
- TestFlight / dev build
