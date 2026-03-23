import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import es from './locales/es.json';

export const LANGUAGE_STORAGE_KEY = '@crumb/language';

export async function initI18n() {
  const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
  let lng: 'en' | 'es' = 'en';
  if (stored === 'es' || stored === 'en') {
    lng = stored;
  } else {
    const locales = Localization.getLocales();
    const tag = locales[0]?.languageCode ?? 'en';
    lng = tag === 'es' ? 'es' : 'en';
  }

  await i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    lng,
    fallbackLng: 'en',
    supportedLngs: ['en', 'es'],
    nonExplicitSupportedLngs: true,
    compatibilityJSON: 'v4',
    interpolation: { escapeValue: false },
  });
}

export async function persistLanguage(lng: 'en' | 'es') {
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
  await i18n.changeLanguage(lng);
}

export default i18n;
