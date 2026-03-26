import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { tokens } from '../../theme/tokens';
import { AppText } from '../../theme/typography';

export function ConfigMissingScreen() {
  const { t } = useTranslation();

  return (
    <ScrollView contentContainerStyle={styles.wrap} style={styles.screen}>
      <AppText variant="display" style={styles.title}>
        {t('auth.configTitle')}
      </AppText>
      <AppText variant="body" style={styles.body}>
        {t('auth.configBody')}
      </AppText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: tokens.surface },
  wrap: { padding: tokens.space[5], paddingTop: 64 },
  title: { marginBottom: tokens.space[4] },
  body: { opacity: 0.85, lineHeight: 24 },
});
