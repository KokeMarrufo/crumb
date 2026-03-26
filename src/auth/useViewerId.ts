import { MOCK_CURRENT_USER_ID } from '../data/mockData';
import { useAuth } from './AuthContext';

/** Logged-in user id for mock services; falls back to mock UUID only if session is missing. */
export function useViewerId(): string {
  const { session } = useAuth();
  return session?.user?.id ?? MOCK_CURRENT_USER_ID;
}
