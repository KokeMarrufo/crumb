import { mockFollows, mockUsers } from '../data/mockData';
import { delay } from './_internal';

export async function getFollowerCount(userId: string) {
  await delay();
  return mockFollows.filter((f) => f.following_id === userId && f.status === 'accepted').length;
}

export async function getFollowingCount(userId: string) {
  await delay();
  return mockFollows.filter((f) => f.follower_id === userId && f.status === 'accepted').length;
}

/** Incoming pending: others want to follow this user */
export async function getPendingFollowRequestsForUser(userId: string) {
  await delay();
  const pending = mockFollows.filter((f) => f.following_id === userId && f.status === 'pending');
  const users = await Promise.all(
    pending.map(async (f) => {
      const u = mockUsers.find((x) => x.id === f.follower_id)!;
      return { follow: f, user: u };
    }),
  );
  return users;
}

/** Mock approve/deny — mutates in-memory for session (UI feedback only) */
export async function approveFollowRequest(followId: string) {
  await delay();
  const f = mockFollows.find((x) => x.id === followId);
  if (f) f.status = 'accepted';
}

export async function denyFollowRequest(followId: string) {
  await delay();
  const idx = mockFollows.findIndex((x) => x.id === followId);
  if (idx >= 0) mockFollows.splice(idx, 1);
}
