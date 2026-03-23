import { Text as RNText, type TextProps as RNTextProps, StyleSheet } from 'react-native';
import { tokens } from './tokens';

export type TextVariant = 'display' | 'headline' | 'title' | 'body' | 'label';

const styles = StyleSheet.create({
  display: {
    fontFamily: 'Newsreader_700Bold',
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.5,
    color: tokens.onSurface,
  },
  headline: {
    fontFamily: 'Newsreader_600SemiBold',
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.3,
    color: tokens.onSurface,
  },
  title: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 18,
    lineHeight: 24,
    color: tokens.onSurface,
  },
  body: {
    fontFamily: 'Manrope_400Regular',
    fontSize: 16,
    lineHeight: 24,
    color: tokens.onSurface,
  },
  label: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
    color: tokens.onSurfaceVariant,
  },
});

export function AppText({
  variant = 'body',
  style,
  ...rest
}: RNTextProps & { variant?: TextVariant }) {
  return <RNText style={[styles[variant], style]} {...rest} />;
}
