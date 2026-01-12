import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'expo-router';
import { Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleSendCode = () => {
    if (!email || !email.includes('@')) {
      Toast.show({
        type: 'error',
        text1: 'Invalid email',
        text2: 'Please enter a valid email address',
      });
      return;
    }
    
    Toast.show({
      type: 'success',
      text1: 'Code sent!',
      text2: `Check your inbox at ${email}`,
    });
    
    router.push({
      pathname: '/(auth)/verify-otp',
      params: { email },
    });
  };

  return (
    <AuthLayout title="Forgot Password" subtitle="Enter your email to receive a verification code">
      <View className="gap-6">
        <View className="gap-2">
          <Text className="text-sm font-medium text-foreground">Email Address</Text>
          <Input
            placeholder="hello@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            startIcon={<Mail size={20} color="#6b7280" />}
          />
        </View>

        <Button onPress={handleSendCode}>
          <Text className="text-lg font-bold text-primary-foreground">Send Code</Text>
        </Button>

        <Button variant="ghost" onPress={() => router.back()}>
          <Text className="text-base font-medium text-muted-foreground">Back to Login</Text>
        </Button>
      </View>
    </AuthLayout>
  );
}
