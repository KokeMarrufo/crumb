import { mockNotifications, mockUsers } from '../data/mockData';
import { delay } from './_internal';

export async function getNotifications(userId: string) {
  await delay();
  const rows = mockNotifications
    .filter((n) => n.user_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return Promise.all(
    rows.map(async (n) => ({
      notification: n,
      actor: mockUsers.find((u) => u.id === n.actor_id)!,
    })),
  );
}
