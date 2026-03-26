import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import { ActivityIndicator, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../auth/AuthContext';
import { ConfigMissingScreen } from '../screens/auth/ConfigMissingScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';
import { ActivityScreen } from '../screens/activity/ActivityScreen';
import { CheckInFlowScreen } from '../screens/checkin/CheckInFlowScreen';
import { CheckInPlaceholderScreen } from '../screens/checkin/CheckInPlaceholderScreen';
import { ExploreScreen } from '../screens/explore/ExploreScreen';
import { JournalScreen } from '../screens/journal/JournalScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { RestaurantDetailScreen } from '../screens/restaurant/RestaurantDetailScreen';
import { TrailDetailScreen } from '../screens/trail/TrailDetailScreen';
import { TrailsScreen } from '../screens/trails/TrailsScreen';
import { tokens } from '../theme/tokens';
import { navigateCheckInFlow } from './navigationHelpers';
import { rootNavRef } from './rootNavRef';
import type { MainTabParamList, RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<Pick<RootStackParamList, 'Login' | 'SignUp'>>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: tokens.surface,
    primary: tokens.primary,
    text: tokens.onSurface,
    card: tokens.surface,
    border: 'transparent',
  },
};

function MainTabs() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tokens.primary,
        tabBarInactiveTintColor: tokens.onSurfaceVariant,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : tokens.tabBarGlass,
          borderTopWidth: 0,
          elevation: 0,
          height: 56 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: tokens.tabBarGlass }]} />
          ),
        tabBarLabelStyle: { fontFamily: 'Manrope_500Medium', fontSize: 11 },
      }}
    >
      <Tab.Screen
        name="Journal"
        component={JournalScreen}
        options={{
          tabBarLabel: t('tabs.journal'),
          tabBarIcon: ({ color, size }) => <Ionicons name="book-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarLabel: t('tabs.explore'),
          tabBarIcon: ({ color, size }) => <Ionicons name="compass-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="CheckIn"
        component={CheckInPlaceholderScreen}
        options={{
          tabBarLabel: t('tabs.checkin'),
          tabBarIcon: () => null,
          tabBarButton: (props) => (
            <Pressable
              accessibilityRole={props.accessibilityRole}
              accessibilityState={props.accessibilityState}
              testID={props.testID}
              onPress={() => navigateCheckInFlow()}
              style={[props.style, styles.centerTabWrap]}
            >
              <View style={styles.centerCta}>
                <Ionicons name="add" size={28} color={tokens.surfaceContainerLowest} />
              </View>
            </Pressable>
          ),
        }}
      />
      <Tab.Screen
        name="Trails"
        component={TrailsScreen}
        options={{
          tabBarLabel: t('tabs.trails'),
          tabBarIcon: ({ color, size }) => <Ionicons name="map-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Activity"
        component={ActivityScreen}
        options={{
          tabBarLabel: t('tabs.activity'),
          tabBarIcon: ({ color, size }) => <Ionicons name="pulse-outline" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

function AppStack() {
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: tokens.surface },
        headerTitleStyle: { fontFamily: 'Newsreader_600SemiBold', color: tokens.onSurface },
        headerTintColor: tokens.primary,
        contentStyle: { backgroundColor: tokens.surface },
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: t('stack.profile') }} />
      <Stack.Screen
        name="RestaurantDetail"
        component={RestaurantDetailScreen}
        options={{ title: t('stack.restaurant') }}
      />
      <Stack.Screen name="TrailDetail" component={TrailDetailScreen} options={{ title: t('stack.trail') }} />
      <Stack.Screen
        name="CheckInFlow"
        component={CheckInFlowScreen}
        options={{ title: t('stack.checkInFlow'), presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}

function AuthNavigator() {
  const { t } = useTranslation();

  return (
    <AuthStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: tokens.surface },
        headerTitleStyle: { fontFamily: 'Newsreader_600SemiBold', color: tokens.onSurface },
        headerTintColor: tokens.primary,
        contentStyle: { backgroundColor: tokens.surface },
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} options={{ title: t('auth.signIn') }} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} options={{ title: t('auth.signUp') }} />
    </AuthStack.Navigator>
  );
}

export function RootNavigator() {
  const { session, loading, configured } = useAuth();

  if (loading) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator size="large" color={tokens.primary} />
      </View>
    );
  }

  if (!configured) {
    return (
      <NavigationContainer ref={rootNavRef} theme={navTheme}>
        <ConfigMissingScreen />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer ref={rootNavRef} theme={navTheme}>
      {session ? <AppStack /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  boot: { flex: 1, backgroundColor: tokens.surface, alignItems: 'center', justifyContent: 'center' },
  centerTabWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    top: -12,
  },
  centerCta: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: tokens.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: tokens.onSurface,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
});
