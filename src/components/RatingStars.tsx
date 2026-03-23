import { StyleSheet, Text, View } from 'react-native';
import { tokens } from '../theme/tokens';

type Props = { value: number; max?: number };

export function RatingStars({ value, max = 5 }: Props) {
  const full = Math.round(Math.min(max, Math.max(0, value)));
  const chars = Array.from({ length: max }, (_, i) => (i < full ? '★' : '☆')).join(' ');
  return (
    <View style={styles.row}>
      <Text style={styles.stars}>{chars}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  stars: {
    color: tokens.primary,
    letterSpacing: 2,
    fontSize: 14,
    fontFamily: 'Manrope_600SemiBold',
  },
});
