# Crumb — Claude Context

## What this app is
A social food journal built in React Native. Users check in to restaurants, 
log what they ate, build curated restaurant lists called Trails, and discover 
places through people they follow. A single check-in is called a Crumb. 
The act of checking in is called "Dropping a Crumb."

## Tech Stack
- React Native (New Architecture — Fabric + JSI)
- Supabase (PostgreSQL, Auth, RLS, Edge Functions) — client: `@supabase/supabase-js`, env: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` in `.env` (see `.env.example`)
- Cloudflare R2 for media storage
- Google Places API (New) for restaurant search — `EXPO_PUBLIC_GOOGLE_PLACES_API_KEY` in `.env` (mock search only when unset; **Supabase is not required** for search, only for persisting `restaurants` rows)

## Key conventions
- All database IDs are UUIDs
- Timestamps use timestamptz
- private_note on checkins is NEVER returned in public queries
- RLS enforces all privacy rules at the database level — not just in the UI
- No 1px borders anywhere — design uses tonal layering only

## Database
12 tables: users, follows, blocks, restaurants, checkins, 
checkin_photos, checkin_dishes, trails, trail_items, 
likes, comments, notifications
Authoritative SQL: `supabase/migrations/` (see `docs/Crumb_Data_Model.md`).
`public.users.id` is the Supabase Auth user id (`auth.users`). For client reads that include the private reflection field safely, query the **`checkins_safe`** view (masks `private_note` for non-owners); avoid selecting `private_note` from `checkins` in public clients.

## Design System
Warm Minimalism. Newsreader serif + Manrope sans.
Base color #fbf9f4. Primary red #9e2016.
Full design system in docs/Crumb_DESIGN.md

## Reference docs
- docs/Crumb_MVP_User_Stories.docx
- docs/Crumb_Data_Model.docx  
- docs/Crumb_DESIGN.md

**My suggestion for your project structure before you start:**

```
crumb/
├── CLAUDE.md          ← Claude reads this automatically
├── docs/
│   ├── Crumb_MVP_User_Stories.docx
│   ├── Crumb_Data_Model.docx
│   └── Crumb_DESIGN.md
├── src/
└── ...
```
