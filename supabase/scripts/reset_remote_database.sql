-- =============================================================================
-- DESTRUCTIVE — wipes the remote Postgres `public` schema and migration log.
-- Run in Supabase Dashboard → SQL Editor (use the primary database role).
-- After this, from your machine: npm run db:push
-- =============================================================================

-- Clear CLI migration history so the next `db push` reapplies every file in
-- supabase/migrations/ from scratch.
truncate table supabase_migrations.schema_migrations;

-- Drop all app objects in public (tables, views, functions, etc.).
drop schema if exists public cascade;

-- Recreate public with the same grants a fresh Supabase project expects.
create schema public;

grant usage on schema public to postgres, anon, authenticated, service_role;
grant all on schema public to postgres, anon, authenticated, service_role;

alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant all on functions to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to postgres, anon, authenticated, service_role;
