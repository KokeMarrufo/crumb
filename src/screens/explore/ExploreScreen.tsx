import { useCallback, useState } from 'react';
import { Image } from 'expo-image';
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenHeader } from '../../components/ScreenHeader';
import { MOCK_CURRENT_USER_ID } from '../../data/mockData';
import { navigateProfile, navigateRestaurant, navigateTrail } from '../../navigation/navigationHelpers';
import { getExploreData } from '../../services/explore';
import { tokens } from '../../theme/tokens';
import { AppText } from '../../theme/typography';
import { useFocusEffect } from '@react-navigation/native';
import type { ExploreData } from '../../services/types';
import { Avatar } from '../../components/Avatar';

export function ExploreScreen() {
  const { t } = useTranslation();
  const [data, setData] = useState<ExploreData | null>(null);

  useFocusEffect(
    useCallback(() => {
      getExploreData(MOCK_CURRENT_USER_ID).then(setData);
    }, []),
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t('explore.title')} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <AppText variant="headline" style={styles.sectionTitle}>
            {t('explore.trendingTrails')}
          </AppText>
          {data?.trending_trails.map(({ trail, owner, preview_image_url }) => (
            <Pressable
              key={trail.id}
              onPress={() => navigateTrail(trail.id)}
              style={({ pressed }) => [styles.trailRow, pressed && { opacity: 0.94 }]}
            >
              {preview_image_url ? (
                <Image source={{ uri: preview_image_url }} style={styles.trailImg} contentFit="cover" />
              ) : (
                <View style={[styles.trailImg, { backgroundColor: tokens.surfaceContainerHighest }]} />
              )}
              <View style={styles.trailText}>
                <AppText variant="title">{trail.name}</AppText>
                <AppText variant="body" style={styles.muted}>
                  {t('explore.byCreator', { name: owner.full_name })}
                </AppText>
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.section}>
          <AppText variant="headline" style={styles.sectionTitle}>
            {t('explore.suggestedPeople')}
          </AppText>
          <FlatList
            horizontal
            data={data?.suggested_users ?? []}
            keyExtractor={(u) => u.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Pressable style={styles.suggest} onPress={() => navigateProfile(item.id)}>
                <Avatar uri={item.avatar_url} size={64} />
                <AppText variant="body" style={styles.suggestName} numberOfLines={1}>
                  {item.username}
                </AppText>
              </Pressable>
            )}
          />
        </View>

        <View style={styles.section}>
          <AppText variant="headline" style={styles.sectionTitle}>
            {t('explore.localSpots')}
          </AppText>
          <AppText variant="label" style={styles.proof}>
            {t('explore.friendsAreLoving')}
          </AppText>
          {data?.local_spots.map(({ restaurant, friends_loving }) => (
            <Pressable
              key={restaurant.id}
              onPress={() => navigateRestaurant(restaurant.id)}
              style={({ pressed }) => [styles.spot, pressed && { opacity: 0.95 }]}
            >
              <AppText variant="title">{restaurant.name}</AppText>
              <AppText variant="body" style={styles.muted}>
                {restaurant.city}
              </AppText>
              {friends_loving.map(({ user, snippet }) => (
                <View key={user.id} style={styles.proofRow}>
                  <Avatar uri={user.avatar_url} size={28} />
                  <AppText variant="body" style={styles.proofText}>
                    <AppText variant="title" style={styles.inlineName}>{user.full_name}</AppText>
                    {' — '}
                    {snippet || t('explore.friendsLovingFallback')}
                  </AppText>
                </View>
              ))}
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: tokens.surface },
  scroll: { paddingBottom: 120 },
  section: { paddingHorizontal: tokens.space[4], marginBottom: tokens.space[6] },
  sectionTitle: { marginBottom: tokens.space[3] },
  trailRow: {
    flexDirection: 'row',
    backgroundColor: tokens.surfaceContainerLowest,
    borderRadius: tokens.radiusXl,
    marginBottom: tokens.space[3],
    overflow: 'hidden',
  },
  trailImg: { width: 96, height: 96 },
  trailText: { flex: 1, padding: tokens.space[3], justifyContent: 'center' },
  muted: { opacity: 0.75, marginTop: 4 },
  suggest: { alignItems: 'center', marginRight: tokens.space[4], width: 88 },
  suggestName: { marginTop: 6, textAlign: 'center' },
  spot: {
    backgroundColor: tokens.surfaceContainerLow,
    padding: tokens.space[4],
    borderRadius: tokens.radiusXl,
    marginBottom: tokens.space[3],
  },
  proof: { marginBottom: 8 },
  proofRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 10, gap: 8 },
  proofText: { flex: 1 },
  inlineName: { fontSize: 15 },
});
