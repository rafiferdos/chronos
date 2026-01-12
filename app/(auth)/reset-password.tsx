import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, Lock } from 'lucide-react-native';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Toast } from 'toastify-react-native';

export default function ResetPassword() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleReset = async () => {
    if (password !== confirmPassword) {
      Toast.error('Passwords do not match', 'top');
      return;
    }
    
    // Mock API call simulation
    Toast.success('Password reset successfully', 'top');
    
    // Auto login or redirect to home as requested
    // We'll simulate a sign in for flow completion
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

        <Button
          className="h-12 rounded-xl bg-[#5D4037] active:opacity-90"
          onPress={handleReset}>
          <Text className="text-lg font-bold text-white">Reset Password</Text>
        </Button>
      </View>
    </AuthLayout>
  );
}
