import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenHeader } from '../../components/ScreenHeader';
import { useViewerId } from '../../auth/useViewerId';
import { navigateProfile } from '../../navigation/navigationHelpers';
import { getNotifications } from '../../services/notifications';
import {
  approveFollowRequest,
  denyFollowRequest,
  getPendingFollowRequestsForUser,
} from '../../services/social';
import { tokens } from '../../theme/tokens';
import { AppText } from '../../theme/typography';
import { useFocusEffect } from '@react-navigation/native';
import { Avatar } from '../../components/Avatar';
import type { Notification as CrumbNotification } from '../../types/models';

export function ActivityScreen() {
  const { t, i18n } = useTranslation();
  const viewerId = useViewerId();
  const [rows, setRows] = useState<{ notification: CrumbNotification; actorName: string; actorAvatar: string | null }[]>(
    [],
  );
  const [pending, setPending] = useState<{ followId: string; username: string; avatar: string | null }[]>([]);

  const load = useCallback(async () => {
    const n = await getNotifications(viewerId);
    setRows(
      n.map((x) => ({
        notification: x.notification,
        actorName: x.actor.full_name,
        actorAvatar: x.actor.avatar_url,
      })),
    );
    const p = await getPendingFollowRequestsForUser(viewerId);
    setPending(p.map((x) => ({ followId: x.follow.id, username: x.user.username, avatar: x.user.avatar_url })));
  }, [viewerId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t('activity.title')} />
      <FlatList
        ListHeaderComponent={
          pending.length ? (
            <View style={styles.pendingBlock}>
              <AppText variant="label" style={{ marginBottom: 8 }}>
                {t('activity.followRequests')}
              </AppText>
              {pending.map((p) => (
                <View key={p.followId} style={styles.req}>
                  <Avatar uri={p.avatar} size={40} />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <AppText variant="title">@{p.username}</AppText>
                    <AppText variant="body" style={styles.muted}>
                      {t('activity.wantsToFollow')}
                    </AppText>
                  </View>
                  <Pressable
                    style={styles.approve}
                    onPress={async () => {
                      await approveFollowRequest(p.followId);
                      load();
                    }}
                  >
                    <AppText variant="title" style={styles.approveLabel}>
                      {t('activity.approve')}
                    </AppText>
                  </Pressable>
                  <Pressable
                    style={styles.deny}
                    onPress={async () => {
                      await denyFollowRequest(p.followId);
                      load();
                    }}
                  >
                    <AppText variant="title">{t('activity.deny')}</AppText>
                  </Pressable>
                </View>
              ))}
            </View>
          ) : null
        }
        data={rows}
        keyExtractor={(r) => r.notification.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() => navigateProfile(item.notification.actor_id)}
          >
            <Avatar uri={item.actorAvatar} size={44} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <AppText variant="body">
                {t(`activity.notifications.${item.notification.type}`, { name: item.actorName })}
              </AppText>
              <AppText variant="label" style={styles.time}>
                {new Date(item.notification.created_at).toLocaleString(
                  i18n.language.startsWith('es') ? 'es' : 'en-US',
                )}
              </AppText>
            </View>
            {!item.notification.is_read ? <View style={styles.dot} /> : null}
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: tokens.surface },
  list: { paddingBottom: 100 },
  pendingBlock: { paddingHorizontal: tokens.space[4], paddingBottom: tokens.space[4], backgroundColor: tokens.surfaceContainerLow },
  req: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.surfaceContainerLowest,
    padding: 12,
    borderRadius: tokens.radiusLg,
    marginBottom: 8,
  },
  approve: {
    backgroundColor: tokens.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 8,
  },
  deny: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: tokens.surfaceContainerHighest,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.space[4],
    paddingVertical: 14,
    backgroundColor: tokens.surface,
  },
  muted: { opacity: 0.75 },
  time: { marginTop: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: tokens.primary },
  approveLabel: { color: tokens.surfaceContainerLowest },
});
