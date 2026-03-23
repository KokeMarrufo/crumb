import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import { tokens } from '../theme/tokens';

type Props = {
  uri: string | null;
  size?: number;
  onPress?: () => void;
};

const FALLBACK = 'https://picsum.photos/seed/avatar-fallback/200/200';

export function Avatar({ uri, size = 40, onPress }: Props) {
  const inner = (
    <View style={[styles.wrap, { width: size, height: size, borderRadius: size / 2 }]}>
      <Image
        source={{ uri: uri ?? FALLBACK }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        contentFit="cover"
      />
    </View>
  );
  if (onPress) return <Pressable onPress={onPress}>{inner}</Pressable>;
  return inner;
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    backgroundColor: tokens.surfaceContainerHighest,
  },
});
