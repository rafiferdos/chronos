import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView edges={['top']} className="flex-1">
        
        {/* Header */}
        <View className="px-5 py-4 flex-row items-center mb-2">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <ArrowLeft size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-black">Privacy policy</Text>
        </View>

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          <Text className="text-gray-600 text-base leading-7 mb-6">
            We value your privacy and are committed to protecting your personal information. 
            Your data — such as name, events, and schedules — is only used to improve your experience within this app.
          </Text>
          
          <Text className="text-gray-600 text-base leading-7 mb-6">
            We do not share or sell your information with anyone outside your family group. 
            All event details and messages remain private between approved users.
          </Text>

          <Text className="text-gray-600 text-base leading-7 mb-6">
            You can delete your account or data at any time from the settings page. 
            If you have any questions, please contact us at support@familyplanner.com.
          </Text>
          
          {/* Bottom spacer */}
          <View className="h-10" />
        </ScrollView>

      </SafeAreaView>
    </View>
  );
}