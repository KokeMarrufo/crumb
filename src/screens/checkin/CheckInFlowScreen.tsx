import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from '../../components/PrimaryButton';
import { IngredientChip } from '../../components/IngredientChip';
import { RatingStars } from '../../components/RatingStars';
import { FOOD_IMAGE_URLS } from '../../data/mockData';
import { getRestaurantSearchResults } from '../../services/restaurants';
import type { Restaurant } from '../../types/models';
import { tokens } from '../../theme/tokens';
import { AppText } from '../../theme/typography';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'CheckInFlow'>;

type DishDraft = { id: string; name: string; rating: number };

export function CheckInFlowScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Restaurant[]>([]);
  const [picked, setPicked] = useState<Restaurant | null>(null);
  const [photoUris] = useState<string[]>([FOOD_IMAGE_URLS[10], FOOD_IMAGE_URLS[11]]);
  const [dishes, setDishes] = useState<DishDraft[]>([{ id: '1', name: '', rating: 5 }]);
  const [story, setStory] = useState('');
  const [privateReflection, setPrivateReflection] = useState('');

  const runSearch = async (q: string) => {
    setQuery(q);
    const r = await getRestaurantSearchResults(q);
    setResults(r);
  };

  const addDish = () => {
    setDishes((d) => [...d, { id: String(Date.now()), name: '', rating: 4 }]);
  };

  useEffect(() => {
    getRestaurantSearchResults('').then(setResults);
  }, []);

  const submit = () => {
    Toast.show({
      type: 'success',
      text1: t('checkin.toastTitle'),
      text2: picked?.name ?? t('checkin.toastSubtitle'),
    });
    navigation.goBack();
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => (step > 0 ? setStep(step - 1) : navigation.goBack())}>
          <AppText variant="title" style={styles.back}>
            {step === 0 ? t('checkin.close') : t('checkin.back')}
          </AppText>
        </Pressable>
        <AppText variant="label">{t('checkin.stepProgress', { current: step + 1 })}</AppText>
      </View>

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        {step === 0 && (
          <>
            <AppText variant="headline" style={styles.title}>
              {t('checkin.whereEat')}
            </AppText>
            <TextInput
              value={query}
              onChangeText={runSearch}
              placeholder={t('checkin.searchPlaceholder')}
              placeholderTextColor={tokens.onSurfaceVariant}
              style={styles.input}
            />
            {results.map((item) => (
              <Pressable
                key={item.id}
                style={styles.result}
                onPress={() => {
                  setPicked(item);
                  setStep(1);
                }}
              >
                <AppText variant="title">{item.name}</AppText>
                <AppText variant="body" style={styles.muted}>
                  {item.city}
                </AppText>
              </Pressable>
            ))}
          </>
        )}

        {step === 1 && (
          <>
            <AppText variant="headline" style={styles.title}>
              {t('checkin.photos')}
            </AppText>
            <AppText variant="body" style={styles.muted}>
              {t('checkin.photosMock')}
            </AppText>
            <View style={styles.photoRow}>
              {photoUris.map((uri) => (
                <Image key={uri} source={{ uri }} style={styles.photo} contentFit="cover" />
              ))}
            </View>
            <PrimaryButton label={t('checkin.continue')} onPress={() => setStep(2)} />
          </>
        )}

        {step === 2 && (
          <>
            <AppText variant="headline" style={styles.title}>
              {t('checkin.whatEat')}
            </AppText>
            {dishes.map((d, i) => (
              <View key={d.id} style={styles.dishBlock}>
                <TextInput
                  value={d.name}
                  onChangeText={(txt) =>
                    setDishes((prev) => prev.map((x) => (x.id === d.id ? { ...x, name: txt } : x)))
                  }
                  placeholder={t('checkin.dishPlaceholder', { n: i + 1 })}
                  placeholderTextColor={tokens.onSurfaceVariant}
                  style={styles.input}
                />
                <AppText variant="label" style={{ marginBottom: 4 }}>
                  {t('checkin.rating')}
                </AppText>
                <View style={styles.starRow}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <IngredientChip
                      key={n}
                      label={`${n}`}
                      active={d.rating === n}
                      onPress={() =>
                        setDishes((prev) =>
                          prev.map((x) => (x.id === d.id ? { ...x, rating: n } : x)),
                        )
                      }
                    />
                  ))}
                </View>
              </View>
            ))}
            <Pressable onPress={addDish}>
              <AppText variant="title" style={{ color: tokens.primary }}>
                {t('checkin.addAnotherDish')}
              </AppText>
            </Pressable>
            <PrimaryButton label={t('checkin.continue')} onPress={() => setStep(3)} style={{ marginTop: 16 }} />
          </>
        )}

        {step === 3 && (
          <>
            <AppText variant="headline" style={styles.title}>
              {t('checkin.theStory')}
            </AppText>
            <TextInput
              multiline
              value={story}
              onChangeText={setStory}
              placeholder={t('checkin.storyPlaceholder')}
              placeholderTextColor={tokens.onSurfaceVariant}
              style={[styles.input, styles.multiline]}
            />
            <PrimaryButton label={t('checkin.continue')} onPress={() => setStep(4)} />
          </>
        )}

        {step === 4 && (
          <>
            <AppText variant="headline" style={styles.title}>
              {t('checkin.privateReflection')}
            </AppText>
            <AppText variant="label" style={{ marginBottom: 8 }}>
              {t('checkin.privateReflectionHint')}
            </AppText>
            <TextInput
              multiline
              value={privateReflection}
              onChangeText={setPrivateReflection}
              placeholder={t('checkin.privateNotePlaceholder')}
              placeholderTextColor={tokens.onSurfaceVariant}
              style={[styles.input, styles.multiline]}
            />
            <RatingStars value={dishes[0]?.rating ?? 5} />
            <PrimaryButton label={t('checkin.dropCrumb')} onPress={submit} style={{ marginTop: 24 }} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: tokens.surface },
  header: {
    paddingHorizontal: tokens.space[4],
    paddingTop: 56,
    paddingBottom: 12,
    backgroundColor: tokens.surfaceContainerLow,
  },
  back: { marginBottom: 8 },
  body: { padding: tokens.space[4], paddingBottom: 48 },
  title: { marginBottom: tokens.space[3] },
  muted: { opacity: 0.75, marginBottom: 12 },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: tokens.surfaceContainerHighest,
    paddingVertical: 12,
    fontFamily: 'Manrope_400Regular',
    fontSize: 16,
    color: tokens.onSurface,
    marginBottom: 16,
  },
  multiline: { minHeight: 120, borderBottomWidth: 0, backgroundColor: tokens.surfaceContainerLow, padding: 12, borderRadius: tokens.radiusLg },
  result: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: tokens.surfaceContainerLowest,
    borderRadius: tokens.radiusLg,
    marginBottom: 8,
  },
  photoRow: { flexDirection: 'row', gap: 12, marginVertical: 16 },
  photo: { width: 100, height: 100, borderRadius: tokens.radiusLg },
  dishBlock: { marginBottom: 16 },
  starRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
});
