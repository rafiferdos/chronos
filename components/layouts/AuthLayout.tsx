import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'center' }}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. Logo / Header Area */}
          <View className="items-center mb-10">
            {/* Placeholder for your Logo - You can replace Text with <Image> later */}
            <View className="h-16 w-16 bg-[#5D4037] rounded-xl justify-center items-center mb-4">
               <Text className="text-white font-bold text-2xl">C</Text>
            </View>
            
            <Text className="text-3xl font-bold text-black text-center mb-2">
              {title}
            </Text>
            <Text className="text-gray-500 text-center text-base">
              {subtitle}
            </Text>
          </View>

          {/* 2. The Form Blocks go here */}
          {children}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}