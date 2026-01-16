import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Check, Lock } from 'lucide-react-native';

interface SubscriptionCardProps {
  title: string;
  price: string;
  features: string[];
  isPremium?: boolean;
  onPress: () => void;
}

export function SubscriptionCard({ title, price, features, isPremium, onPress }: SubscriptionCardProps) {
  return (
    <View className="bg-white rounded-3xl p-6 mb-6 shadow-sm border border-gray-100">
      
      {/* Title & Price */}
      <Text className="text-lg font-bold text-black mb-1">{title}</Text>
      <View className="flex-row items-end mb-4">
        <Text className="text-3xl font-bold text-black">{price}</Text>
        <Text className="text-gray-400 mb-1 ml-1">/ Monthly</Text>
      </View>

      {/* Feature List */}
      <View className="gap-3 mb-6">
        {features.map((feature, index) => (
          <View key={index} className="flex-row items-center gap-3">
            <View className="w-5 h-5 rounded-full bg-[#5D4037] items-center justify-center">
              <Check size={12} color="white" />
            </View>
            <Text className="text-gray-600 text-sm">{feature}</Text>
          </View>
        ))}
      </View>

      {/* Button */}
      <TouchableOpacity 
        onPress={onPress}
        className="bg-[#5D4037]/90 h-12 rounded-full flex-row items-center justify-center gap-2"
        activeOpacity={0.8}
      >
        <Lock size={16} color="white" />
        <Text className="text-white font-bold">Subscribe now</Text>
      </TouchableOpacity>

    </View>
  );
}