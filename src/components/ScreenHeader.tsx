import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MOCK_CURRENT_USER_ID } from '../data/mockData';
import { navigateProfile } from '../navigation/navigationHelpers';
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
  const [me, setMe] = useState<User | null>(null);

  useEffect(() => {
    let mounted = true;
    getCurrentUser().then((u) => {
      if (mounted) setMe(u);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const uid = profileUserId ?? MOCK_CURRENT_USER_ID;

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
