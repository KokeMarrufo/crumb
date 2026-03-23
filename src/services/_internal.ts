import type { Checkin } from '../types/models';

export const delay = (ms = 16) => new Promise<void>((r) => setTimeout(r, ms));

/** Never expose private_note except to the check-in author. */
export function applyCheckinPrivacy(checkin: Checkin, viewerUserId: string): Checkin {
  if (checkin.user_id === viewerUserId) return { ...checkin };
  const { private_note: _, ...rest } = checkin;
  return { ...rest, private_note: null };
}
