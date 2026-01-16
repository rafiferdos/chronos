import { SignUpForm } from '@/components/sign-up-form';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';

export default function SignUp() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { initializeUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (data: { name: string; email: string; password: string }) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      // Initialize user profile with name and email
      await initializeUser(data.email, data.name);
      
      // Then sign up (this will navigate to tabs)
      await signUp(data.email);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Sign up failed',
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
        <SignUpForm onSignUp={handleSignUp} onSignIn={() => router.push('/(auth)/login')} />
      </View>
    </ScrollView>
  );
}
