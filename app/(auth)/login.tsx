import { SignInForm } from '@/components/sign-in-form';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';

export default function Login() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { initializeUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (data: { email: string; password: string }) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      // Initialize or load user profile with email
      await initializeUser(data.email);
      
      // Then sign in (this will navigate to tabs)
      await signIn(data.email);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Sign in failed',
        text2: 'Please try again',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#5D4037" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerClassName="sm:flex-1 items-center justify-center p-4 py-8 sm:py-4 sm:p-6 mt-safe"
      keyboardDismissMode="interactive">
      <View className="w-full max-w-sm">
        <SignInForm
          onSignIn={handleSignIn}
          onSignUp={() => router.push('/(auth)/signup')}
          onForgotPassword={() => router.push('/(auth)/forgot-password')}
        />
      </View>
    </ScrollView>
  );
}
