import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
} from '@expo-google-fonts/manrope';
import {
  Newsreader_400Regular,
  Newsreader_600SemiBold,
  Newsreader_700Bold,
} from '@expo-google-fonts/newsreader';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StatusBar, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { I18nextProvider } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { AuthProvider } from './src/auth/AuthContext';
import i18n, { initI18n } from './src/i18n';
import { RootNavigator } from './src/navigation/RootNavigator';
import { tokens } from './src/theme/tokens';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function App() {
  const [loaded, fontError] = useFonts({
    Newsreader_400Regular,
    Newsreader_600SemiBold,
    Newsreader_700Bold,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
  });
  const [i18nReady, setI18nReady] = useState(false);

  useEffect(() => {
    initI18n().then(() => setI18nReady(true));
  }, []);

  useEffect(() => {
    if ((loaded || fontError) && i18nReady) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [loaded, fontError, i18nReady]);

  if ((!loaded && !fontError) || !i18nReady) {
    return null;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <View style={{ flex: 1, backgroundColor: tokens.surface }}>
              <StatusBar barStyle="dark-content" />
              <RootNavigator />
              <Toast />
            </View>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </AuthProvider>
    </I18nextProvider>
  );
}
