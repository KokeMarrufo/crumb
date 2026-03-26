import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../auth/AuthContext';
import { useViewerId } from '../auth/useViewerId';
import { navigateProfile } from '../navigation/navigationHelpers';
import { hasSupabaseConfig } from '../lib/env';
import { getCurrentUser } from '../services/users';
import { tokens } from '../theme/tokens';
import { AppText } from '../theme/typography';
import { Avatar } from './Avatar';
import { useEffect, useState } from 'react';
import type { User } from '../types/models';

type Props = {
  title: string;
  /** Override profile target (default: current user) */
  profileUserId?: string;
};

export function ScreenHeader({ title, profileUserId }: Props) {
  const insets = useSafeAreaInsets();
  const viewerId = useViewerId();
  const { session } = useAuth();
  const [me, setMe] = useState<User | null>(null);

  useEffect(() => {
    if (hasSupabaseConfig() && !session?.user) {
      setMe(null);
      return;
    }
    let mounted = true;
    getCurrentUser()
      .then((u) => {
        if (mounted) setMe(u);
      })
      .catch(() => {
        if (mounted) setMe(null);
      });
    return () => {
      mounted = false;
    };
  }, [session?.user?.id]);

  const uid = profileUserId ?? viewerId;

  return (
    <View style={[styles.bar, { paddingTop: insets.top + 8 }]}>
      <AppText variant="headline" style={styles.title}>
        {title}
      </AppText>
      <Avatar
        uri={me?.avatar_url ?? null}
        size={44}
        onPress={() => navigateProfile(uid)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: tokens.space[4],
    paddingBottom: tokens.space[3],
    backgroundColor: tokens.surface,
  },
  title: { flex: 1, marginRight: 12 },
});
