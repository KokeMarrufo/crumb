import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CrumbCard } from '../../components/CrumbCard';
import { ScreenHeader } from '../../components/ScreenHeader';
import { navigateRestaurant } from '../../navigation/navigationHelpers';
import { MOCK_CURRENT_USER_ID } from '../../data/mockData';
import { getJournalFeed } from '../../services/checkins';
import type { JournalFeedItem } from '../../services/types';
import { tokens } from '../../theme/tokens';
import { AppText } from '../../theme/typography';
import { useFocusEffect } from '@react-navigation/native';

export function JournalScreen() {
  const { t } = useTranslation();
  const [feed, setFeed] = useState<JournalFeedItem[]>([]);
  const [layout, setLayout] = useState<'list' | 'grid'>('list');

  useFocusEffect(
    useCallback(() => {
      getJournalFeed(MOCK_CURRENT_USER_ID).then(setFeed);
    }, []),
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t('journal.title')} />
      <View style={styles.toolbar}>
        <AppText variant="label">{t('journal.yourCrumbs')}</AppText>
        <View style={styles.toggleRow}>
          <Pressable onPress={() => setLayout('list')} style={[styles.toggle, layout === 'list' && styles.toggleOn]}>
            <AppText variant="body">{t('journal.list')}</AppText>
          </Pressable>
          <Pressable onPress={() => setLayout('grid')} style={[styles.toggle, layout === 'grid' && styles.toggleOn]}>
            <AppText variant="body">{t('journal.grid')}</AppText>
          </Pressable>
        </View>
      </View>
      <FlatList
        key={layout}
        data={feed}
        numColumns={layout === 'grid' ? 2 : 1}
        keyExtractor={(item) => item.checkin.id}
        contentContainerStyle={styles.list}
        columnWrapperStyle={layout === 'grid' ? styles.gridRow : undefined}
        renderItem={({ item }) => (
          <View style={layout === 'grid' ? styles.gridCell : styles.full}>
            <CrumbCard item={item} onPress={() => navigateRestaurant(item.restaurant.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: tokens.surface },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: tokens.space[4],
    paddingBottom: tokens.space[3],
    backgroundColor: tokens.surfaceContainerLow,
  },
  toggleRow: { flexDirection: 'row', backgroundColor: tokens.surfaceContainerHighest, borderRadius: 999 },
  toggle: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 999 },
  toggleOn: { backgroundColor: tokens.surfaceContainerLowest },
  list: { paddingHorizontal: tokens.space[4], paddingBottom: 100 },
  gridRow: { paddingHorizontal: 0, gap: 12 },
  gridCell: { flex: 1, minWidth: '45%' },
  full: { width: '100%' },
});
