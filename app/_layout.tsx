import '@/global.css';

import { useState, useCallback } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { EventsProvider } from '@/context/EventsContext';
import { UserProvider } from '@/context/UserContext';
import { NAV_THEME } from '@/lib/theme';
import { toastConfig } from '@/lib/toast-config';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import Toast from 'react-native-toast-message';
import { VideoSplash } from '@/components/VideoSplash';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const [showSplash, setShowSplash] = useState(true);

  // Called when video finishes for new users - proceed to onboarding
  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  // Called when returning users skip the video - proceed directly to main app
  const handleSplashSkip = useCallback(() => {
    setShowSplash(false);
  }, []);

  // Show video splash screen for new users only
  if (showSplash) {
    return <VideoSplash onFinish={handleSplashFinish} onSkip={handleSplashSkip} />;
  }

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
      <AuthProvider>
        <UserProvider>
          <EventsProvider>
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
          </EventsProvider>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
