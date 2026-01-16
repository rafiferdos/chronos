import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CalendarList } from 'react-native-calendars'; // CalendarList scrolls vertically like Google Cal
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Plus } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();

  const handleDayPress = (day: any) => {
    // Navigate to the dynamic schedule screen with the selected date
    router.push(`/(stacks)/schedule/${day.dateString}`);
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView edges={['top']} className="flex-1">
        
        {/* Header */}
        <View className="px-5 py-4 flex-row justify-between items-center bg-white border-b border-gray-100">
          <View>
            <Text className="text-3xl font-bold text-[#5D4037]">Hello!</Text>
            <Text className="text-gray-400 text-base">Good morning, Emma!</Text>
          </View>
          <TouchableOpacity className="w-10 h-10 bg-gray-50 rounded-full justify-center items-center">
            <Bell size={20} color="black" />
          </TouchableOpacity>
        </View>

        {/* Full Screen Calendar */}
        {/* CalendarList is better than Calendar for this view because it scrolls infinitely */}
        <CalendarList
          // Scroll settings
          pastScrollRange={12}
          futureScrollRange={12}
          scrollEnabled={true}
          showScrollIndicator={false}
          
          // Interaction
          onDayPress={handleDayPress}
          
          // Theme
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#5D4037',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#5D4037',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            dotColor: '#5D4037',
            selectedDotColor: '#ffffff',
            arrowColor: '#5D4037',
            monthTextColor: 'black',
            textDayFontWeight: '600',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '500',
            textDayFontSize: 16,
            textMonthFontSize: 20,
            textDayHeaderFontSize: 12
          }}
          
          // Mark days that have events (Mock data for now)
          markedDates={{
            '2025-10-28': { marked: true, dotColor: '#5D4037' },
            '2025-10-30': { marked: true, dotColor: '#5D4037' },
          }}
        />
        
      </SafeAreaView>

      {/* Floating Action Button (Alternative to Tab Bar + button if you prefer overlay) */}
      {/* Based on your design, you might rely on the Tab Bar '+' we built earlier, 
          but if you want a floating button on the calendar specifically, keep this: */}
      {/* <TouchableOpacity 
        className="absolute bottom-6 right-6 w-14 h-14 bg-[#5D4037] rounded-full justify-center items-center shadow-lg"
        onPress={() => router.push('/(stacks)/create-event')}
      >
        <Plus color="white" size={28} />
      </TouchableOpacity> 
      */}
    </View>
  );
}