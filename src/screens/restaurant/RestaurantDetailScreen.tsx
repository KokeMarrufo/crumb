import { useCallback, useState } from 'react';
import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CrumbCard } from '../../components/CrumbCard';
import { useViewerId } from '../../auth/useViewerId';
import { navigateRestaurant, navigateTrail } from '../../navigation/navigationHelpers';
import type { RootStackParamList } from '../../navigation/types';
import { getRestaurantDetail } from '../../services/restaurants';
import type { RestaurantDetailResult } from '../../services/types';
import { tokens } from '../../theme/tokens';
import { AppText } from '../../theme/typography';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'RestaurantDetail'>;

export function RestaurantDetailScreen({ route }: Props) {
  const { t } = useTranslation();
  const viewerId = useViewerId();
  const { restaurantId } = route.params;
  const [data, setData] = useState<RestaurantDetailResult | null>(null);

  useFocusEffect(
    useCallback(() => {
      getRestaurantDetail(restaurantId, viewerId).then(setData);
    }, [restaurantId, viewerId]),
  );

  const hero = data?.my_crumbs[0]?.photos[0]?.url ?? data?.friends_crumbs[0]?.photos[0]?.url;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {hero ? (
        <Image source={{ uri: hero }} style={styles.hero} contentFit="cover" />
      ) : (
        <View style={[styles.hero, { backgroundColor: tokens.surfaceContainerHighest }]} />
      )}
      <View style={styles.pad}>
        <AppText variant="display" style={styles.title}>
          {data?.restaurant.name ?? t('restaurantDetail.loading')}
        </AppText>
        <AppText variant="body" style={styles.sub}>
          {[data?.restaurant.city, data?.restaurant.address].filter(Boolean).join(' · ')}
        </AppText>

        <View style={styles.section}>
          <AppText variant="headline" style={styles.sectionTitle}>
            {t('restaurantDetail.myHistory')}
          </AppText>
          {data?.my_crumbs.map((item) => (
            <View key={item.checkin.id}>
              <CrumbCard item={item} onPress={() => navigateRestaurant(item.restaurant.id)} />
              {item.checkin.private_note ? (
                <View style={styles.private}>
                  <AppText variant="label">{t('restaurantDetail.onlyYou')}</AppText>
                  <AppText variant="body" style={{ marginTop: 4 }}>
                    {item.checkin.private_note}
                  </AppText>
                </View>
              ) : null}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <AppText variant="headline" style={styles.sectionTitle}>
            {t('restaurantDetail.friendsCrumbs')}
          </AppText>
          {data?.friends_crumbs.length === 0 ? (
            <AppText variant="body" style={styles.muted}>
              {t('restaurantDetail.friendsEmpty')}
            </AppText>
          ) : (
            data?.friends_crumbs.map((item) => (
              <CrumbCard
                key={item.checkin.id}
                item={item}
                showAuthor
                onPress={() => navigateRestaurant(item.restaurant.id)}
              />
            ))
          )}
        </View>

        <View style={styles.section}>
          <AppText variant="headline" style={styles.sectionTitle}>
            {t('restaurantDetail.appearsInTrails')}
          </AppText>
          {data?.appears_in_trails.map(({ trail, rank }) => (
            <Pressable key={trail.id} style={styles.trailPill} onPress={() => navigateTrail(trail.id)}>
              <AppText variant="title">{trail.name}</AppText>
              <AppText variant="label">{t('restaurantDetail.stopRank', { rank })}</AppText>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: tokens.surface },
  content: { paddingBottom: 48 },
  hero: { width: '100%', height: 240 },
  pad: { padding: tokens.space[4] },
  title: { marginBottom: 4 },
  sub: { opacity: 0.8, marginBottom: tokens.space[5] },
  section: { marginBottom: tokens.space[6], backgroundColor: tokens.surfaceContainerLow, padding: tokens.space[4], borderRadius: tokens.radiusXl },
  sectionTitle: { marginBottom: tokens.space[3] },
  muted: { opacity: 0.75 },
  trailPill: {
    backgroundColor: tokens.surfaceContainerLowest,
    padding: tokens.space[3],
    borderRadius: tokens.radiusLg,
    marginBottom: 8,
  },
  private: {
    marginTop: -8,
    marginBottom: 16,
    padding: 12,
    backgroundColor: tokens.surfaceContainerHighest,
    borderRadius: tokens.radiusLg,
  },
});
