import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'expo-router';
import { Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import { Text, View } from 'react-native';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleSendCode = () => {
    // In a real app, we would call API here
    if (email) {
      router.push({
        pathname: '/(auth)/verify-otp',
        params: { email },
      });
    }
  };

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email to receive a verification code">
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

        <Button
          className="h-12 rounded-xl bg-[#5D4037] active:opacity-90"
          onPress={handleSendCode}>
          <Text className="text-lg font-bold text-white">Send Code</Text>
        </Button>

        <Button
          variant="ghost"
          className="h-12"
          onPress={() => router.back()}>
          <Text className="text-base font-medium text-gray-600">Back to Login</Text>
        </Button>
      </View>
    </AuthLayout>
  );
}
