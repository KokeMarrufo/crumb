import { MOCK_CURRENT_USER_ID, mockUsers } from '../data/mockData';
import { hasSupabaseConfig } from '../lib/env';
import { supabase } from '../lib/supabase';
import type { User } from '../types/models';
import { delay } from './_internal';

function mapUserRow(row: {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  is_private: boolean;
  requires_follow_approval: boolean;
  created_at: string;
}): User {
  return {
    id: row.id,
    username: row.username,
    full_name: row.full_name,
    avatar_url: row.avatar_url,
    bio: row.bio,
    is_private: row.is_private,
    requires_follow_approval: row.requires_follow_approval,
    created_at: row.created_at,
  };
}

async function getCurrentUserMock(): Promise<User> {
  await delay();
  const u = mockUsers.find((x) => x.id === MOCK_CURRENT_USER_ID);
  if (!u) throw new Error('Mock current user missing');
  return u;
}

async function getUserProfileMock(userId: string): Promise<User> {
  await delay();
  const u = mockUsers.find((x) => x.id === userId);
  if (!u) throw new Error('User not found');
  return u;
}

/** Logged-in user: Supabase session + row in `public.users`. */
export async function getCurrentUser(): Promise<User> {
  if (!hasSupabaseConfig()) {
    return getCurrentUserMock();
  }
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!authData.user) throw new Error('Not authenticated');
  return getUserProfile(authData.user.id);
}

/** Single profile row (respects RLS / `can_view_profile`). */
export async function getUserProfile(userId: string): Promise<User> {
  if (!hasSupabaseConfig()) {
    return getUserProfileMock(userId);
  }
  const { data, error } = await supabase.from('users').select('*').eq('id', userId).maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('User not found');
  return mapUserRow(data);
}

export async function getUserById(userId: string): Promise<User> {
  return getUserProfile(userId);
}

export async function getUsersByIds(ids: string[]): Promise<User[]> {
  if (!hasSupabaseConfig()) {
    await delay();
    const set = new Set(ids);
    return mockUsers.filter((u) => set.has(u.id));
  }
  if (ids.length === 0) return [];
  const { data, error } = await supabase.from('users').select('*').in('id', ids);
  if (error) throw error;
  const byId = new Map((data ?? []).map((row) => [row.id, mapUserRow(row)]));
  return ids.map((id) => {
    const u = byId.get(id);
    if (!u) throw new Error(`User not found: ${id}`);
    return u;
  });
}

export type UserProfileUpdate = Partial<
  Pick<User, 'username' | 'full_name' | 'avatar_url' | 'bio' | 'is_private' | 'requires_follow_approval'>
>;

/** Updates the signed-in user’s row in `public.users` (RLS: own row only). */
export async function updateUserProfile(updates: UserProfileUpdate): Promise<User> {
  if (!hasSupabaseConfig()) {
    await delay();
    const u = await getCurrentUserMock();
    return { ...u, ...updates };
  }
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!authData.user) throw new Error('Not authenticated');
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', authData.user.id)
    .select()
    .single();
  if (error) throw error;
  return mapUserRow(data);
}
