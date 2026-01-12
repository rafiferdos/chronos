import { SignInForm } from '@/components/sign-in-form';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';

export default function Login() {
  const router = useRouter();
  const { signIn } = useAuth();

  const handleSignIn = async () => {
    // In a real app, you'd get email/password from the form
    // Since SignInForm is decoupled, we'll assume success for the "Senior" mock flow
    // Ideally, SignInForm should pass data back, but for now we Mock the flow
    await signIn('user@example.com');
  };

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
