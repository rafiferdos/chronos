import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react-native';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView edges={['top']} className="flex-1">
        {/* Header */}
        <View className="px-5 py-2 flex-row items-center mb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-gray-50 rounded-full justify-center items-center mr-3"
          >
            <ArrowLeft size={20} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-black">Change Password</Text>
        </View>

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          <View className="gap-6 pb-8">
            <View className="gap-2">
              <Text className="text-gray-500 font-medium text-xs uppercase tracking-wide">
                Current Password
              </Text>
              <Input
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                startIcon={<Lock size={20} color="#6b7280" />}
                endIcon={showPassword ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
                onEndIconPress={() => setShowPassword(!showPassword)}
                className="h-14 bg-gray-50 border-gray-100"
              />
            </View>

            <View className="gap-2">
              <Text className="text-gray-500 font-medium text-xs uppercase tracking-wide">
                New Password
              </Text>
              <Input
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                startIcon={<Lock size={20} color="#6b7280" />}
                className="h-14 bg-gray-50 border-gray-100"
              />
            </View>

            <View className="gap-2">
              <Text className="text-gray-500 font-medium text-xs uppercase tracking-wide">
                Confirm New Password
              </Text>
              <Input
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                startIcon={<Lock size={20} color="#6b7280" />}
                className="h-14 bg-gray-50 border-gray-100"
              />
            </View>

            <Button
              className="bg-[#5D4037] h-14 rounded-2xl shadow-sm mt-4"
              onPress={() => router.back()}
            >
              <Text className="text-white font-bold text-lg">Save Password</Text>
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
