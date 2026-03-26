import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

/**
 * Ensures a row exists in public.users for this auth user (RLS: insert when auth.uid() = id).
 * Uses sign-up metadata (username, full_name) when present.
 */
export async function ensureUserProfile(user: User): Promise<void> {
  const { data: existing } = await supabase.from('users').select('id').eq('id', user.id).maybeSingle();
  if (existing) return;

  const meta = (user.user_metadata ?? {}) as { username?: string; full_name?: string };
  const rawBase =
    meta.username?.trim() ||
    user.email?.split('@')[0]?.replace(/[^a-zA-Z0-9_]/g, '_') ||
    'user';
  const base = rawBase.slice(0, 24) || 'user';
  const fullName = (meta.full_name?.trim() || meta.username?.trim() || base).slice(0, 200);

  for (let attempt = 0; attempt < 12; attempt++) {
    const username = attempt === 0 ? base : `${base}_${attempt}`;
    const { error } = await supabase.from('users').insert({
      id: user.id,
      username,
      full_name: fullName,
    });
    if (!error) return;
    if (error.code !== '23505') {
      throw error;
    }
  }

  throw new Error('Could not allocate a unique username');
}
