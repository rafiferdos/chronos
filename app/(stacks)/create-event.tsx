import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, Calendar, Clock, AlignLeft, MapPin } from 'lucide-react-native';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function CreateEventScreen() {
  const router = useRouter();
  const [isMeAssigned, setIsMeAssigned] = useState(true);

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView edges={['top']} className="flex-1">
        
        {/* 1. Header */}
        <View className="px-5 py-2 flex-row justify-between items-center mb-4">
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="w-10 h-10 bg-gray-50 rounded-full justify-center items-center"
          >
            <ArrowLeft size={20} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-black">New Event</Text>
          <TouchableOpacity
            className="w-10 h-10 bg-gray-50 rounded-full justify-center items-center"
            onPress={() => router.push('/(stacks)/notifications')}
          >
            <Bell size={20} color="black" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          <View className="gap-6 pb-24">
            <View className="gap-2">
              <Text className="text-gray-500 font-medium text-xs uppercase tracking-wide">
                Title
              </Text>
              <Input placeholder="Ballet class" className="bg-gray-50 border-gray-100 h-14" />
            </View>

            <View className="gap-2">
              <Text className="text-gray-500 font-medium text-xs uppercase tracking-wide">
                Date and time
              </Text>
              <View className="flex-row gap-3">
                <TouchableOpacity className="flex-1 flex-row items-center bg-gray-50 border border-gray-100 h-14 rounded-xl px-3">
                  <Calendar size={18} color="#9CA3AF" />
                  <Text className="ml-2 text-gray-900 font-medium">Oct 28, 2025</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 flex-row items-center bg-gray-50 border border-gray-100 h-14 rounded-xl px-3">
                  <Clock size={18} color="#9CA3AF" />
                  <Text className="ml-2 text-gray-900 font-medium">10:00 AM</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="gap-2">
              <Text className="text-gray-500 font-medium text-xs uppercase tracking-wide">
                Location
              </Text>
              <Input
                placeholder="Add location"
                className="bg-gray-50 border-gray-100 h-14"
                startIcon={<MapPin size={18} color="#9CA3AF" />}
              />
            </View>

            <View className="gap-2">
              <Text className="text-gray-500 font-medium text-xs uppercase tracking-wide">
                Assigned to
              </Text>
              <Input placeholder="Emma Johnson" className="bg-gray-50 border-gray-100 h-14" />
            </View>

            <TouchableOpacity 
              className="flex-row items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-4"
              onPress={() => setIsMeAssigned(!isMeAssigned)}
            >
              <View>
                <Text className="text-gray-900 font-medium">Assign to me</Text>
                <Text className="text-gray-500 text-xs mt-1">Keeps this event on your calendar</Text>
              </View>
              <View className={cn(
                "w-5 h-5 rounded border items-center justify-center",
                isMeAssigned ? "bg-[#5D4037] border-[#5D4037]" : "border-gray-300"
              )}>
                {isMeAssigned && <View className="w-2 h-2 bg-white rounded-sm" />}
              </View>
            </TouchableOpacity>

            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <AlignLeft size={16} color="#9CA3AF" />
                <Text className="text-gray-500 font-medium text-xs uppercase tracking-wide">Notes</Text>
              </View>
              <TextInput 
                multiline
                numberOfLines={4}
                placeholder="Add a short note"
                textAlignVertical="top"
                className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-base min-h-[120px]"
              />
            </View>

            <Button 
              className="bg-[#5D4037] h-14 rounded-2xl shadow-sm mt-2" 
              onPress={() => router.back()}
            >
              <Text className="text-white font-bold text-lg">Create event</Text>
            </Button>
          </View>
        </ScrollView>

      </SafeAreaView>
    </View>
  );
}