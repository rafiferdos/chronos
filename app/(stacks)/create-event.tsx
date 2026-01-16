import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, Calendar, Clock, ChevronDown, AlignLeft } from 'lucide-react-native';
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
          <Text className="text-xl font-bold text-black">Event</Text>
          <TouchableOpacity className="w-10 h-10 bg-gray-50 rounded-full justify-center items-center">
            <Bell size={20} color="black" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          
          {/* Title Section */}
          <View className="items-center mb-8">
            <Text className="text-xl font-bold text-black mb-1">Add New Event</Text>
            <Text className="text-gray-400 text-sm">Plan and organize your day easily</Text>
          </View>

          {/* Form Fields */}
          <View className="gap-6 pb-20">
            
            {/* Event Title */}
            <View className="gap-2">
              <Text className="text-[#F87171] font-bold text-xs uppercase tracking-wide">Event Title</Text>
              <Input placeholder="Ballet Class" className="bg-gray-50 border-gray-100 h-14" />
            </View>

            {/* Start Event Row */}
            <View className="gap-2">
               <Text className="text-[#F87171] font-bold text-xs uppercase tracking-wide">Start Event</Text>
               <View className="flex-row gap-3">
                  {/* Date Picker Button */}
                  <TouchableOpacity className="flex-1 flex-row items-center bg-gray-50 border border-gray-100 h-14 rounded-md px-3">
                     <Calendar size={18} color="#9CA3AF" />
                     <Text className="ml-2 text-gray-900 font-medium">Oct 28th</Text>
                  </TouchableOpacity>
                  
                  {/* Time Picker Button */}
                  <TouchableOpacity className="flex-1 flex-row items-center bg-gray-50 border border-gray-100 h-14 rounded-md px-3">
                     <Clock size={18} color="#F59E0B" /> {/* Orange Clock from design */}
                     <Text className="ml-2 text-gray-900 font-medium">10:00</Text>
                  </TouchableOpacity>
               </View>
            </View>

            {/* End Event Row */}
            <View className="gap-2">
               <Text className="text-[#F87171] font-bold text-xs uppercase tracking-wide">End Event</Text>
               <View className="flex-row gap-3">
                  <TouchableOpacity className="flex-1 flex-row items-center bg-gray-50 border border-gray-100 h-14 rounded-md px-3">
                     <Calendar size={18} color="#9CA3AF" />
                     <Text className="ml-2 text-gray-900 font-medium">Oct 28th</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity className="flex-1 flex-row items-center bg-gray-50 border border-gray-100 h-14 rounded-md px-3">
                     <Clock size={18} color="#F59E0B" />
                     <Text className="ml-2 text-gray-900 font-medium">11:00</Text>
                  </TouchableOpacity>
               </View>
            </View>

            {/* Assign To */}
            <View className="gap-2">
               <Text className="text-gray-500 font-medium text-sm">Assign to</Text>
               <Input placeholder="Assignee name" className="bg-gray-50 border-gray-100 h-14" />
            </View>

            {/* Reminders (Dropdown Simulation) */}
            <View className="gap-3">
               {/* 1. Reminder */}
               <TouchableOpacity className="flex-row items-center justify-between bg-white border-b border-gray-100 py-4">
                  <View className="flex-row items-center gap-3">
                     <Bell size={18} color="#5D4037" />
                     <Text className="text-gray-700 font-medium">Set reminder</Text>
                  </View>
                  <ChevronDown size={18} color="gray" />
               </TouchableOpacity>

               {/* 2. Recurring */}
               <TouchableOpacity className="flex-row items-center justify-between bg-white border-b border-gray-100 py-4">
                  <View className="flex-row items-center gap-3">
                     {/* Rotate icon to simulate 'Recurring' loop */}
                     <Clock size={18} color="#5D4037" />
                     <Text className="text-gray-700 font-medium">Recurring</Text>
                  </View>
                  <ChevronDown size={18} color="gray" />
               </TouchableOpacity>
            </View>

            {/* Checkbox Row */}
            <TouchableOpacity 
               className="flex-row items-center gap-3 mt-2"
               onPress={() => setIsMeAssigned(!isMeAssigned)}
            >
               <View className={cn(
                  "w-5 h-5 rounded border items-center justify-center",
                  isMeAssigned ? "bg-[#5D4037] border-[#5D4037]" : "border-gray-300"
               )}>
                  {isMeAssigned && <View className="w-2 h-2 bg-white rounded-sm" />}
               </View>
               <Text className="text-gray-600 font-medium">Assign this event to me as well</Text>
            </TouchableOpacity>

            {/* Note Area */}
            <View className="gap-2">
               <View className="flex-row items-center gap-2">
                  <AlignLeft size={16} color="#F59E0B" />
                  <Text className="text-gray-500 font-medium text-sm">Note</Text>
               </View>
               <TextInput 
                  multiline
                  numberOfLines={4}
                  placeholder="I have a meeting at 4 PM..."
                  textAlignVertical="top"
                  className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-base min-h-[120px]"
               />
            </View>

            {/* Save Button */}
            <Button 
               className="bg-[#5D4037] h-14 rounded-2xl shadow-sm mt-4" 
               onPress={() => router.back()}
            >
               <Text className="text-white font-bold text-lg">Save</Text>
            </Button>

          </View>
        </ScrollView>

      </SafeAreaView>
    </View>
  );
}