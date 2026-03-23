import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { AppText } from '../theme/typography';
import { tokens } from '../theme/tokens';

type Props = {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
};

export function PrimaryButton({ label, onPress, style, disabled }: Props) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [pressed && { opacity: 0.92 }, style]}>
      <LinearGradient
        colors={[tokens.primary, tokens.primaryContainer]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.grad, disabled && styles.disabled]}
      >
        <AppText variant="title" style={styles.label}>
          {label}
        </AppText>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  grad: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: { opacity: 0.5 },
  label: { color: tokens.surfaceContainerLowest },
});
