import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenHeader } from '../../components/ScreenHeader';
import { useViewerId } from '../../auth/useViewerId';
import { navigateTrail } from '../../navigation/navigationHelpers';
import { getTrailsForUser } from '../../services/trails';
import type { Trail } from '../../types/models';
import { tokens } from '../../theme/tokens';
import { AppText } from '../../theme/typography';
import { useFocusEffect } from '@react-navigation/native';

export function TrailsScreen() {
  const { t } = useTranslation();
  const viewerId = useViewerId();
  const [trails, setTrails] = useState<Trail[]>([]);

  useFocusEffect(
    useCallback(() => {
      getTrailsForUser(viewerId).then(setTrails);
    }, [viewerId]),
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t('trails.title')} />
      <FlatList
        data={trails}
        keyExtractor={(tr) => tr.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.card, pressed && { opacity: 0.95 }]}
            onPress={() => navigateTrail(item.id)}
          >
            <AppText variant="headline">{item.name}</AppText>
            {item.description ? (
              <AppText variant="body" style={styles.desc} numberOfLines={2}>
                {item.description}
              </AppText>
            ) : null}
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: tokens.surface },
  list: { padding: tokens.space[4], paddingBottom: 100 },
  card: {
    backgroundColor: tokens.surfaceContainerLowest,
    padding: tokens.space[4],
    borderRadius: tokens.radiusXl,
    marginBottom: tokens.space[3],
  },
  desc: { marginTop: 8, opacity: 0.85 },
});
