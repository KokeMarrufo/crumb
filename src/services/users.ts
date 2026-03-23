import { MOCK_CURRENT_USER_ID, mockUsers } from '../data/mockData';
import { delay } from './_internal';

export async function getCurrentUser() {
  await delay();
  const u = mockUsers.find((x) => x.id === MOCK_CURRENT_USER_ID);
  if (!u) throw new Error('Mock current user missing');
  return u;
}

export async function getUserById(userId: string) {
  await delay();
  const u = mockUsers.find((x) => x.id === userId);
  if (!u) throw new Error('User not found');
  return u;
}

export async function getUsersByIds(ids: string[]) {
  await delay();
  const set = new Set(ids);
  return mockUsers.filter((u) => set.has(u.id));
}
