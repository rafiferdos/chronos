import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, LogOut } from 'lucide-react-native';
import { Button } from '@/components/ui/button';

export default function LogoutScreen() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleLogout = () => {
    setIsSigningOut(true);
    setTimeout(() => {
      router.replace('/(auth)/login');
    }, 800);
  };

  return (
    <View className="flex-1 bg-gray-50/50">
      <SafeAreaView edges={['top']} className="flex-1">
        <View className="px-6 py-4 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <ArrowLeft size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-black">Log Out</Text>
        </View>

        <View className="flex-1 px-6 items-center justify-center">
          <View className="w-16 h-16 rounded-full bg-[#5D4037]/10 items-center justify-center mb-4">
            <LogOut size={28} color="#5D4037" />
          </View>
          <Text className="text-lg font-semibold text-gray-900 mb-2">Leaving already?</Text>
          <Text className="text-center text-gray-500 mb-8">
            You can sign in again anytime to pick up where you left off.
          </Text>

          <Button className="bg-[#5D4037] h-14 rounded-2xl w-full" onPress={handleLogout}>
            <Text className="text-white font-bold text-lg">
              {isSigningOut ? 'Signing out...' : 'Log out'}
            </Text>
          </Button>
          <TouchableOpacity onPress={() => router.back()} className="mt-4">
            <Text className="text-center text-gray-500">Cancel</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}
