import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { JournalFeedItem } from '../services/types';
import { tokens } from '../theme/tokens';
import { AppText } from '../theme/typography';
import { RatingStars } from './RatingStars';

type Props = {
  item: JournalFeedItem;
  onPress: () => void;
  showAuthor?: boolean;
};

export function CrumbCard({ item, onPress, showAuthor }: Props) {
  const { t, i18n } = useTranslation();
  const photo = item.photos[0]?.url;
  const dishNames = item.dishes.map((d) => d.name).slice(0, 2).join(' · ');
  const rating = item.checkin.user_rating ?? item.checkin.computed_rating ?? 0;
  const locale = i18n.language.startsWith('es') ? 'es' : 'en-US';
  const date = new Date(item.checkin.visited_at).toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
  });

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && { opacity: 0.96 }]}>
      {photo ? (
        <Image source={{ uri: photo }} style={styles.hero} contentFit="cover" />
      ) : (
        <View style={[styles.hero, styles.heroPlaceholder]} />
      )}
      <View style={styles.pad}>
        {showAuthor ? (
          <AppText variant="label" style={styles.author}>
            {item.author.full_name}
          </AppText>
        ) : null}
        <AppText variant="headline" style={styles.restaurant}>
          {item.restaurant.name}
        </AppText>
        {dishNames ? (
          <AppText variant="body" style={styles.dish} numberOfLines={2}>
            {dishNames}
          </AppText>
        ) : null}
        <View style={styles.row}>
          <RatingStars value={rating} />
          <AppText variant="label" style={styles.meta}>
            {t('common.likesReplies', {
              date,
              likes: item.likes.length,
              replies: item.comments.length,
            })}
          </AppText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.surfaceContainerLowest,
    borderRadius: tokens.radiusXl,
    marginBottom: tokens.space[4],
    overflow: 'hidden',
  },
  hero: { width: '100%', height: 200 },
  heroPlaceholder: { backgroundColor: tokens.surfaceContainerHighest },
  pad: { padding: tokens.space[4] },
  author: { marginBottom: 4 },
  restaurant: { marginBottom: 6 },
  dish: { marginBottom: tokens.space[3], opacity: 0.92 },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  meta: { flex: 1, marginLeft: 4 },
});
