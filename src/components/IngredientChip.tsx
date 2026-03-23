import { Pressable, StyleSheet } from 'react-native';
import { AppText } from '../theme/typography';
import { tokens } from '../theme/tokens';

type Props = {
  label: string;
  active?: boolean;
  onPress?: () => void;
};

export function IngredientChip({ label, active, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        active ? styles.active : styles.idle,
        pressed && { opacity: 0.88 },
      ]}
    >
      <AppText variant="body" style={[styles.text, active && styles.textActive]}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  idle: { backgroundColor: tokens.surfaceContainerHighest },
  active: { backgroundColor: tokens.tertiarySage },
  text: { fontSize: 14, fontFamily: 'Manrope_500Medium' },
  textActive: { color: tokens.surfaceContainerLowest },
});
