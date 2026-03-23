import { useCallback, useState } from 'react';
import { Image } from 'expo-image';
import { LayoutAnimation, Platform, Pressable, ScrollView, StyleSheet, UIManager, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MOCK_CURRENT_USER_ID } from '../../data/mockData';
import { getTrailById } from '../../services/trails';
import type { TrailDetailResult } from '../../services/types';
import { tokens } from '../../theme/tokens';
import { AppText } from '../../theme/typography';
import { RatingStars } from '../../components/RatingStars';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { useFocusEffect } from '@react-navigation/native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = NativeStackScreenProps<RootStackParamList, 'TrailDetail'>;

export function TrailDetailScreen({ route }: Props) {
  const { t, i18n } = useTranslation();
  const { trailId } = route.params;
  const [data, setData] = useState<TrailDetailResult | null>(null);
  const [open, setOpen] = useState<Record<string, boolean>>({});

  useFocusEffect(
    useCallback(() => {
      getTrailById(trailId, MOCK_CURRENT_USER_ID).then(setData);
    }, [trailId]),
  );

  const toggle = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((o) => ({ ...o, [id]: !o[id] }));
  };

  const locale = i18n.language.startsWith('es') ? 'es' : 'en-US';

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <AppText variant="display" style={styles.trailTitle}>
          {data?.trail.name ?? t('common.ellipsis')}
        </AppText>
        <AppText variant="body" style={styles.owner}>
          {data?.owner.full_name ? t('trailDetail.curatedBy', { name: data.owner.full_name }) : ''}
        </AppText>
        {data?.trail.description ? (
          <AppText variant="body" style={styles.desc}>
            {data.trail.description}
          </AppText>
        ) : null}
      </View>

      {data?.items.map((item) => {
        const isOpen = open[item.trail_item_id];
        const photo = item.photos[0]?.url;
        const quote = item.checkin?.notes?.slice(0, 120) ?? t('trailDetail.defaultQuote');
        return (
          <Pressable
            key={item.trail_item_id}
            onPress={() => toggle(item.trail_item_id)}
            style={({ pressed }) => [styles.card, pressed && { opacity: 0.97 }]}
          >
            <AppText variant="label" style={styles.rank}>
              {t('trailDetail.rankLabel', { rank: item.rank })}
            </AppText>
            {photo ? (
              <Image source={{ uri: photo }} style={styles.cardPhoto} contentFit="cover" />
            ) : (
              <View style={[styles.quoteOnly, { backgroundColor: tokens.surfaceContainerHighest }]}>
                <AppText variant="headline" style={styles.quote}>
                  “{quote}”
                </AppText>
              </View>
            )}
            <View style={styles.cardBody}>
              <AppText variant="headline">{item.restaurant.name}</AppText>
              <AppText variant="body" style={styles.city}>
                {item.restaurant.city}
              </AppText>
              {item.checkin && (
                <View style={styles.row}>
                  <RatingStars value={item.checkin.user_rating ?? item.checkin.computed_rating ?? 0} />
                </View>
              )}
              {isOpen && item.checkin && (
                <View style={styles.expand}>
                  <AppText variant="label" style={{ marginBottom: 6 }}>
                    {t('trailDetail.dishes')}
                  </AppText>
                  {item.dishes.map((d) => (
                    <AppText key={d.id} variant="body">
                      {d.name}
                      {d.rating ? t('trailDetail.starSuffix', { n: d.rating }) : ''}
                    </AppText>
                  ))}
                  {item.checkin.notes ? (
                    <AppText variant="body" style={styles.notes}>
                      {item.checkin.notes}
                    </AppText>
                  ) : null}
                  <AppText variant="label" style={{ marginTop: 8 }}>
                    {new Date(item.checkin.visited_at).toLocaleDateString(locale)}
                  </AppText>
                </View>
              )}
              <AppText variant="label" style={{ marginTop: 8 }}>
                {isOpen ? t('trailDetail.tapCollapse') : t('trailDetail.tapExpand')}
              </AppText>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: tokens.surface },
  content: { paddingBottom: 48 },
  header: { padding: tokens.space[4] },
  trailTitle: { marginBottom: 4 },
  owner: { opacity: 0.8 },
  desc: { marginTop: 12, opacity: 0.9 },
  card: {
    marginHorizontal: tokens.space[4],
    marginBottom: tokens.space[4],
    backgroundColor: tokens.surfaceContainerLowest,
    borderRadius: tokens.radiusXl,
    overflow: 'hidden',
  },
  rank: { position: 'absolute', top: 12, left: 12, zIndex: 2, color: tokens.surfaceContainerLowest },
  cardPhoto: { width: '100%', height: 200 },
  quoteOnly: { padding: tokens.space[5], minHeight: 140, justifyContent: 'center' },
  quote: { fontStyle: 'italic' },
  cardBody: { padding: tokens.space[4] },
  city: { opacity: 0.75, marginTop: 4 },
  row: { marginTop: 8 },
  expand: { marginTop: 12, paddingTop: 12, backgroundColor: tokens.surfaceContainerLow, marginHorizontal: -8, paddingHorizontal: 12, borderRadius: tokens.radiusLg },
  notes: { marginTop: 10 },
});
