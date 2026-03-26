import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../../auth/AuthContext';
import type { RootStackParamList } from '../../navigation/types';
import { tokens } from '../../theme/tokens';
import { AppText } from '../../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

export function SignUpScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit() {
    if (!email.trim() || !password || !username.trim() || !fullName.trim()) {
      Toast.show({ type: 'error', text1: t('auth.fillAllFields') });
      return;
    }
    if (password.length < 6) {
      Toast.show({ type: 'error', text1: t('auth.passwordTooShort') });
      return;
    }
    setBusy(true);
    try {
      await signUp(email, password, username, fullName);
      Toast.show({ type: 'success', text1: t('auth.signUpSuccess') });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : t('auth.unknownError');
      Toast.show({ type: 'error', text1: t('auth.signUpFailed'), text2: msg });
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <AppText variant="display" style={styles.title}>
          {t('auth.createAccount')}
        </AppText>
        <AppText variant="label" style={styles.label}>
          {t('auth.email')}
        </AppText>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          keyboardAppearance="light"
          placeholder={t('auth.emailPlaceholder')}
          placeholderTextColor={tokens.onSurfaceVariant}
        />
        <AppText variant="label" style={styles.label}>
          {t('auth.password')}
        </AppText>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="new-password"
          keyboardAppearance="light"
          placeholder={t('auth.passwordPlaceholder')}
          placeholderTextColor={tokens.onSurfaceVariant}
        />
        <AppText variant="label" style={styles.label}>
          {t('auth.username')}
        </AppText>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoComplete="username"
          keyboardAppearance="light"
          placeholder={t('auth.usernamePlaceholder')}
          placeholderTextColor={tokens.onSurfaceVariant}
        />
        <AppText variant="label" style={styles.label}>
          {t('auth.fullName')}
        </AppText>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          autoComplete="name"
          keyboardAppearance="light"
          placeholder={t('auth.fullNamePlaceholder')}
          placeholderTextColor={tokens.onSurfaceVariant}
        />
        <Pressable
          style={[styles.primary, busy && styles.primaryDisabled]}
          onPress={onSubmit}
          disabled={busy}
        >
          {busy ? (
            <ActivityIndicator color={tokens.surfaceContainerLowest} />
          ) : (
            <AppText variant="title" style={styles.primaryText}>
              {t('auth.signUp')}
            </AppText>
          )}
        </Pressable>
        <Pressable style={styles.link} onPress={() => navigation.goBack()}>
          <AppText variant="body" style={styles.linkText}>
            {t('auth.haveAccount')}
          </AppText>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: tokens.surface },
  scroll: { padding: tokens.space[5], paddingTop: 48, paddingBottom: 48 },
  title: { marginBottom: tokens.space[5] },
  label: { marginBottom: 6, opacity: 0.8 },
  input: {
    borderWidth: 0,
    backgroundColor: tokens.surfaceContainerLowest,
    borderRadius: tokens.radiusLg,
    paddingHorizontal: tokens.space[4],
    paddingVertical: 14,
    fontFamily: 'Manrope_500Medium',
    fontSize: 16,
    color: tokens.onSurface,
    marginBottom: tokens.space[4],
  },
  primary: {
    backgroundColor: tokens.primary,
    borderRadius: tokens.radiusLg,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: tokens.space[2],
  },
  primaryDisabled: { opacity: 0.7 },
  primaryText: { color: tokens.surfaceContainerLowest },
  link: { marginTop: tokens.space[6], alignItems: 'center' },
  linkText: { color: tokens.primary },
});
