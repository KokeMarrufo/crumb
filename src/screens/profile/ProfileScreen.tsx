import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { MOCK_CURRENT_USER_ID } from '../../data/mockData';
import { persistLanguage } from '../../i18n';
import { navigateTrail } from '../../navigation/navigationHelpers';
import { getCrumbsCountForUser, getCrumbsForProfile } from '../../services/checkins';
import { getFollowerCount, getFollowingCount } from '../../services/social';
import { getTrailsForUser } from '../../services/trails';
import { getUserById } from '../../services/users';
import type { JournalFeedItem } from '../../services/types';
import type { Trail } from '../../types/models';
import { tokens } from '../../theme/tokens';
import { AppText } from '../../theme/typography';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export function ProfileScreen({ route }: Props) {
  const { t, i18n } = useTranslation();
  const userId = route.params?.userId ?? MOCK_CURRENT_USER_ID;
  const [name, setName] = useState('');
  const [bio, setBio] = useState<string | null>(null);
  const [crumbs, setCrumbs] = useState<JournalFeedItem[]>([]);
  const [trails, setTrails] = useState<Trail[]>([]);
  const [stats, setStats] = useState({ crumbs: 0, followers: 0, following: 0 });

  const lang: 'en' | 'es' = i18n.language.startsWith('es') ? 'es' : 'en';

  useFocusEffect(
    useCallback(() => {
      Promise.all([
        getUserById(userId),
        getCrumbsForProfile(userId, MOCK_CURRENT_USER_ID),
        getTrailsForUser(userId),
        getCrumbsCountForUser(userId),
        getFollowerCount(userId),
        getFollowingCount(userId),
      ]).then(([u, c, tr, cc, fo, fi]) => {
        setName(u.full_name);
        setBio(u.bio);
        setCrumbs(c);
        setTrails(tr);
        setStats({ crumbs: cc, followers: fo, following: fi });
      });
    }, [userId]),
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <AppText variant="display" style={styles.name}>
          {name}
        </AppText>
        {bio ? (
          <AppText variant="body" style={styles.bio}>
            {bio}
          </AppText>
        ) : null}
        <View style={styles.stats}>
          <View style={styles.stat}>
            <AppText variant="headline">{stats.crumbs}</AppText>
            <AppText variant="label">{t('profile.crumbs')}</AppText>
          </View>
          <View style={styles.stat}>
            <AppText variant="headline">{stats.followers}</AppText>
            <AppText variant="label">{t('profile.followers')}</AppText>
          </View>
          <View style={styles.stat}>
            <AppText variant="headline">{stats.following}</AppText>
            <AppText variant="label">{t('profile.following')}</AppText>
          </View>
        </View>
      </View>

      <AppText variant="headline" style={styles.section}>
        {t('profile.language')}
      </AppText>
      <View style={styles.langRow}>
        <Pressable
          style={[styles.langChip, lang === 'en' && styles.langChipActive]}
          onPress={() => persistLanguage('en')}
        >
          <AppText variant="body" style={lang === 'en' ? styles.langChipTextOn : styles.langChipText}>
            {t('profile.languageEnglish')}
          </AppText>
        </Pressable>
        <Pressable
          style={[styles.langChip, lang === 'es' && styles.langChipActive]}
          onPress={() => persistLanguage('es')}
        >
          <AppText variant="body" style={lang === 'es' ? styles.langChipTextOn : styles.langChipText}>
            {t('profile.languageSpanish')}
          </AppText>
        </Pressable>
      </View>

      <AppText variant="headline" style={styles.section}>
        {t('profile.sectionCrumbs')}
      </AppText>
      <View style={styles.grid}>
        {crumbs.map((item) => (
          <View key={item.checkin.id} style={styles.cell}>
            {item.photos[0] ? (
              <Image source={{ uri: item.photos[0].url }} style={styles.thumb} contentFit="cover" />
            ) : (
              <View style={[styles.thumb, { backgroundColor: tokens.surfaceContainerHighest }]} />
            )}
            <AppText variant="label" numberOfLines={1} style={{ marginTop: 4 }}>
              {item.restaurant.name}
            </AppText>
          </View>
        ))}
      </View>

      <AppText variant="headline" style={styles.section}>
        {t('profile.sectionTrails')}
      </AppText>
      {trails.map((tr) => (
        <Pressable key={tr.id} style={styles.trailRow} onPress={() => navigateTrail(tr.id)}>
          <AppText variant="title">{tr.name}</AppText>
          <AppText variant="label">{t('profile.view')}</AppText>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: tokens.surface },
  content: { paddingBottom: 48 },
  header: { padding: tokens.space[4], backgroundColor: tokens.surfaceContainerLow },
  name: { marginBottom: 8 },
  bio: { opacity: 0.85 },
  stats: { flexDirection: 'row', marginTop: tokens.space[5], justifyContent: 'space-between' },
  stat: { alignItems: 'center', flex: 1 },
  section: { paddingHorizontal: tokens.space[4], marginTop: tokens.space[5], marginBottom: 8 },
  langRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: tokens.space[4],
    marginBottom: tokens.space[4],
  },
  langChip: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: tokens.surfaceContainerHighest,
  },
  langChipActive: {
    backgroundColor: tokens.tertiarySage,
  },
  langChipText: { color: tokens.onSurface },
  langChipTextOn: { color: tokens.surfaceContainerLowest },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: tokens.space[4],
    gap: 8,
  },
  cell: { width: '48%', marginBottom: 12 },
  thumb: { width: '100%', aspectRatio: 1, borderRadius: tokens.radiusLg },
  trailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: tokens.space[4],
    padding: tokens.space[4],
    backgroundColor: tokens.surfaceContainerLowest,
    borderRadius: tokens.radiusXl,
    marginBottom: 8,
  },
});
