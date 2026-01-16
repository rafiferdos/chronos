import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { SubscriptionCard } from '@/components/SubscriptionCard';

export default function SubscriptionScreen() {
  const router = useRouter();

  const handleSubscribe = () => {
    // Navigate to the checkout form
    router.push('/(stacks)/checkout');
  };

  return (
    <View className="flex-1 bg-gray-50/50">
      <SafeAreaView edges={['top']} className="flex-1">
        
        {/* Header */}
        <View className="px-5 py-2 flex-row items-center justify-between">
           <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-full bg-white items-center justify-center">
             <ArrowLeft size={20} color="black" />
           </TouchableOpacity>
           {/* Placeholder for top right icon if needed */}
           <View className="w-10" />
        </View>

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          
          {/* Illustration Section */}
          <View className="items-center mt-4 mb-8">
            {/* Placeholder for the vector art in your design */}
            <View className="w-40 h-40 bg-gray-200 rounded-full mb-4 items-center justify-center">
               <Text className="text-gray-400 text-xs text-center">Illustration{"\n"}Placeholder</Text>
            </View>
            <Text className="text-2xl font-bold text-center text-black mb-2">
              Upgrade to Premium
            </Text>
            <Text className="text-gray-500 text-center px-8">
              Unlock full access and work with uncertainty
            </Text>
          </View>

          {/* Pricing Cards */}
          <SubscriptionCard 
            title="Basic"
            price="$5.99"
            features={[
              "Maximize 12 members",
              "Ads-free experience",
              "Secure permission & modification",
              "Family calendar sync"
            ]}
            onPress={handleSubscribe}
          />

          <SubscriptionCard 
            title="Premium Family Plan"
            price="$29"
            features={[
              "Unlimited members",
              "Ads-free & Priority Support",
              "Advanced Analytics",
              "Family calendar sync + Export"
            ]}
            onPress={handleSubscribe}
          />

          <View className="h-10" />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}