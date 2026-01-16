import '@/global.css';

import { AuthProvider } from '@/context/AuthContext';
import { NAV_THEME } from '@/lib/theme';
import { toastConfig } from '@/lib/toast-config';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import Toast from 'react-native-toast-message';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
      <AuthProvider>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerShown: false,
          }}>
          {/* the tab bar (home calendar, profile) */}
          <Stack.Screen name="(tabs)" />

          {/* the stack screens (schedule, details, payments) */}
          <Stack.Screen name="(stacks)" />

          {/* the auth flow (login, signup) */}
          <Stack.Screen name="(auth)" />

          {/* the onboarding flow */}
          <Stack.Screen name="(onboarding)" />
        </Stack>
        <PortalHost />
        <Toast config={toastConfig} position="top" topOffset={50} />
      </AuthProvider>
    </ThemeProvider>
  );
}
