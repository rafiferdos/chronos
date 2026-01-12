import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Lock } from 'lucide-react-native';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function ResetPassword() {
  const { signIn } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleReset = async () => {
    if (password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Password too short',
        text2: 'Must be at least 6 characters',
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Passwords do not match',
        text2: 'Please check and try again',
      });
      return;
    }
    
    // Auto login after password reset
    await signIn('user@example.com'); 
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Create a new strong password for your account">
      <View className="gap-6">
        <View className="gap-2">
          <Text className="text-sm font-medium text-foreground">New Password</Text>
          <Input
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            startIcon={<Lock size={20} color="#6b7280" />}
            endIcon={
              showPassword ? (
                <EyeOff size={20} color="#6b7280" />
              ) : (
                <Eye size={20} color="#6b7280" />
              )
            }
            onEndIconPress={() => setShowPassword(!showPassword)}
          />
        </View>

        <View className="gap-2">
          <Text className="text-sm font-medium text-foreground">Confirm Password</Text>
          <Input
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword}
            startIcon={<Lock size={20} color="#6b7280" />}
          />
        </View>

        <Button onPress={handleReset}>
          <Text className="text-lg font-bold text-primary-foreground">Reset Password</Text>
        </Button>
      </View>
    </AuthLayout>
  );
}
