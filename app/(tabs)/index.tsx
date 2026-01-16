import { useRouter } from 'expo-router';
import { Bell } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {CalendarList} from 'react-native-calendars'

export default function HomeScreen() {
  const router = useRouter();

  const handleDayPress = (day: any) => {
    // navigate to dynamic schedule pageeee
    router.push(`/(stacks)/schedule/${day.dateString}`);
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView edges={['top']} className="flex-1">
        {/* header section */}
        <View className="flex-row items-start justify-between px-6 py-4">
          <View>
            <Text className="text-3xl font-bold text-[#5D4037]">Hello!</Text>
            <Text className="text-gray-400 text-base mt-1">Good morning, Emma!</Text>
          </View>
          <TouchableOpacity className='w-10 h-10 bg-gray-50 rounded-full justify-center items-center border border-gray-100'>
            <Bell size={20} color={'#5D4037'} />
          </TouchableOpacity>
        </View>
        {/* 2. Filter Pills */}
        <View className="px-6 flex-row gap-3 mb-6">
          <TouchableOpacity className="bg-[#5D4037] px-5 py-2 rounded-full">
             <Text className="text-white font-medium">Today</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-gray-100 px-5 py-2 rounded-full">
             <Text className="text-gray-500 font-medium">Tomorrow</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-gray-100 px-5 py-2 rounded-full">
             <Text className="text-gray-500 font-medium">Upcoming</Text>
          </TouchableOpacity>
        </View>

        {/* 3. The Calendar Engine */}
        {/* Note: Theme object is required by library (no NativeWind support for internal calendar elements) */}
        <CalendarList
          // Layout
          horizontal={true}
          pagingEnabled={true}
          pastScrollRange={12}
          futureScrollRange={12}
          calendarWidth={380} // Adjust slightly based on padding if needed
          
          // Logic
          onDayPress={handleDayPress}
          
          // Visuals
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#5D4037', // Brand Brown
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#5D4037',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            dotColor: '#5D4037',
            selectedDotColor: '#ffffff',
            arrowColor: '#5D4037',
            monthTextColor: '#5D4037',
            indicatorColor: '#5D4037',
            textDayFontWeight: '600',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '500',
            textDayFontSize: 16,
            textMonthFontSize: 24,
            textDayHeaderFontSize: 13
          }}
          
          // Mock Events (Dots on dates)
          markedDates={{
            '2025-10-28': { marked: true, dotColor: '#FF8A8A' },
            '2025-10-30': { marked: true, dotColor: '#A78BFA' },
            '2025-11-05': { selected: true, marked: true, selectedColor: '#5D4037' },
          }}
        />
      </SafeAreaView>
    </View>
  );
}
