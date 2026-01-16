import { useAuth } from '@/context/AuthContext';
import { isOnboardingCompleted } from '@/components/VideoSplash';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { user, isLoading: authLoading } = useAuth();
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      const completed = await isOnboardingCompleted();
      setOnboardingCompleted(completed);
    };
    checkOnboarding();
  }, []);

  // Still loading auth or checking onboarding status
  if (authLoading || onboardingCompleted === null) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#5D4037" />
      </View>
    );
  }

  // User is logged in, go to main app
  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  // User hasn't completed onboarding, show onboarding
  if (!onboardingCompleted) {
    return <Redirect href="/(onboarding)/welcome" />;
  }

  // User completed onboarding but not logged in, go to login
  return <Redirect href="/(auth)/login" />;
}
