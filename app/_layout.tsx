import '@/global.css';

import { AuthProvider } from '@/context/AuthContext';
import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import ToastManager from 'toastify-react-native';

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
            headerShown: false, // Remove default headers globally as requested
          }}
        />
        <PortalHost />
        <ToastManager
          width={350}
          height={60}
          style={{
            backgroundColor: '#5D4037', // Brand color
            borderRadius: 12,
            paddingHorizontal: 16,
          }}
          textStyle={{
            color: '#FFFFFF',
            fontSize: 14,
            fontWeight: '600',
          }}
          position="top"
          positionValue={50}
          duration={3000}
          animationStyle="rightInOut"
        />
      </AuthProvider>
    </ThemeProvider>
  );
}
