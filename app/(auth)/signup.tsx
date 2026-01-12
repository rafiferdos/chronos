import { SignUpForm } from '@/components/sign-up-form';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';

export default function SignUp() {
  const router = useRouter();
  const { signUp } = useAuth();

  const handleSignUp = async () => {
    // Mock signup
    await signUp('newuser@example.com');
  };

  return (
    <ScrollView
      contentContainerClassName="sm:flex-1 items-center justify-center p-4 py-8 sm:py-4 sm:p-6 mt-safe"
      keyboardDismissMode="interactive">
      <View className="w-full max-w-sm">
        <SignUpForm
          onSignUp={handleSignUp}
          onSignIn={() => router.push('/(auth)/login')}
        />
      </View>
    </ScrollView>
  );
}
