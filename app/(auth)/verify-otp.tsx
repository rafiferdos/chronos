import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { KeyRound } from 'lucide-react-native';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function VerifyOtp() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState('');

  const handleVerify = () => {
    if (code.length < 4) {
      Toast.show({
        type: 'error',
        text1: 'Invalid code',
        text2: 'Please enter a 4-6 digit code',
      });
      return;
    }
    
    Toast.show({
      type: 'success',
      text1: 'Verified!',
      text2: 'Now set your new password',
    });
    
    router.push({
      pathname: '/(auth)/reset-password',
      params: { email, code },
    });
  };

  return (
    <AuthLayout title="Verify Email" subtitle={`Enter the code sent to ${email || 'your email'}`}>
      <View className="gap-6">
        <View className="gap-2">
          <Text className="text-sm font-medium text-foreground">Verification Code</Text>
          <Input
            placeholder="1234"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            maxLength={6}
            startIcon={<KeyRound size={20} color="#6b7280" />}
          />
        </View>

        <Button onPress={handleVerify}>
          <Text className="text-lg font-bold text-primary-foreground">Verify</Text>
        </Button>

        <Button variant="ghost" onPress={() => router.back()}>
          <Text className="text-base font-medium text-muted-foreground">Back</Text>
        </Button>
      </View>
    </AuthLayout>
  );
}
