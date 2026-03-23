# Reset remote Supabase DB and replace with this repo’s migrations

This **permanently deletes** all data and all objects in the **`public`** schema on your **hosted** project, clears the **migration history** so the CLI can re-apply your local files, then you push the migrations in `supabase/migrations/`.

It does **not** delete Supabase **Auth** users (`auth.users`) or **Storage** objects; it only resets **`public`** (your app tables/views/functions there) and the migration log.

## Prerequisites

- [Supabase CLI](https://supabase.com/docs/guides/cli) installed (`npm` dev dependency in this repo).
- Project linked: `npx supabase link` (if you haven’t already).

## Steps

1. **Back up** anything you need from the dashboard (exports, backups). This cannot be undone from the client.

2. **Run the reset SQL** in the Supabase Dashboard → **SQL Editor** → paste the contents of  
   [`supabase/scripts/reset_remote_database.sql`](../supabase/scripts/reset_remote_database.sql) → **Run**.

   If `truncate` fails (rare schema differences), open a ticket or use  
   `npx supabase migration list` and `npx supabase migration repair --status reverted <version>` for each remote-only version until `migration list` matches your expectations, then run the `DROP SCHEMA` / `CREATE SCHEMA` part of the script manually.

3. **From your machine** (repo root):

   ```bash
   npm run db:push
   ```

   That applies `20260320120001_…` through `20260320120011_…` in order.

4. **Verify** in the dashboard: **Database → Tables** — all 12 tables, **RLS enabled** on each, and policies as expected.

## Optional: dashboard “Reset database”

Some projects have **Project Settings → Database → Reset database**. If that is available and you prefer it, use it **instead** of the SQL script, then still run `npm run db:push` so this repo’s migrations match the remote history.
