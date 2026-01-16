import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MoreVertical } from 'lucide-react-native';
import { format, addDays, parseISO } from 'date-fns';
import { EventCard } from '@/components/EventCard';

export default function DailyScheduleScreen() {
  const router = useRouter();
  const { date } = useLocalSearchParams(); // Captures '2025-10-28' from URL
  
  // Safe parsing of the date string
  const currentDate = typeof date === 'string' ? date : format(new Date(), 'yyyy-MM-dd');
  const parsedDate = parseISO(currentDate);

  // Generate a mini 5-day strip for the top header
  const weekDates = Array.from({ length: 5 }).map((_, i) => addDays(parsedDate, i - 2));

  return (
    <View className="flex-1 bg-[#F5F5F5]">
      
      {/* 1. Header with Week Strip */}
      <View className="bg-white pb-4 rounded-b-[30px] shadow-sm z-10">
        <SafeAreaView edges={['top']} className="px-4">
          
          {/* Nav Bar */}
          <View className="flex-row justify-between items-center mb-6 pt-2">
            <TouchableOpacity onPress={() => router.back()} className="p-2">
              <ArrowLeft size={24} color="black" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-black">Schedule</Text>
            <TouchableOpacity className="p-2">
              <MoreVertical size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* Search Bar Placeholder (From design) */}
          <View className="bg-gray-100 h-10 rounded-full justify-center px-4 mb-6">
            <Text className="text-gray-400">Search Events by name...</Text>
          </View>

          {/* Filter Pills (Today, Tomorrow, Upcoming) */}
          <View className="flex-row gap-3 mb-6">
            <View className="bg-white border border-gray-200 px-4 py-1.5 rounded-full shadow-sm">
                <Text className="text-gray-600 font-medium text-xs">Today</Text>
            </View>
            <View className="bg-[#5D4037] px-4 py-1.5 rounded-full shadow-sm">
                <Text className="text-white font-medium text-xs">Tomorrow</Text>
            </View>
            <View className="bg-white border border-gray-200 px-4 py-1.5 rounded-full shadow-sm">
                <Text className="text-gray-600 font-medium text-xs">Upcoming</Text>
            </View>
          </View>

          {/* Horizontal Date Strip */}
          {/* This mimics the top row in your second screenshot */}
          <View className="flex-row justify-between px-2">
            {weekDates.map((d, index) => {
              const dateStr = format(d, 'yyyy-MM-dd');
              const isSelected = dateStr === currentDate;
              
              return (
                <View key={index} className={`items-center gap-1 ${isSelected ? 'opacity-100' : 'opacity-40'}`}>
                  <Text className="text-gray-500 font-medium text-xs uppercase">
                    {format(d, 'EEE')}
                  </Text>
                  <View className={`h-8 w-8 rounded-full items-center justify-center ${isSelected ? 'bg-[#5D4037]' : 'bg-transparent'}`}>
                    <Text className={`font-bold ${isSelected ? 'text-white' : 'text-black'}`}>
                      {format(d, 'd')}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

        </SafeAreaView>
      </View>

      {/* 2. The Event List */}
      <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
        
        {/* Section Title */}
        <Text className="text-gray-500 font-medium mb-4 uppercase text-xs tracking-wider">
          {format(parsedDate, 'MMMM d, yyyy')}
        </Text>

        {/* Dynamic Cards */}
        <EventCard
          title="Ballet Class"
          time="4:30 PM - 5:30 PM"
          status="Pending"
          themeColor="red"
        />
        <EventCard 
          title="Family Dinner"
          time="6:00 PM - 7:30 PM"
          status="Upcoming"
          themeColor="purple"
        />
        <EventCard 
          title="Doctor Appointment"
          time="9:00 AM - 10:00 AM"
          status="Pending"
          themeColor="red"
        />

        <View className="h-20" /> {/* Bottom Spacer */}
      </ScrollView>

    </View>
  );
}