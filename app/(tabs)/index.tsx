import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Modal, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react-native';
import { useEvents } from '@/context/EventsContext';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isToday, isSameDay } from 'date-fns';

type ViewMode = 'year' | 'month' | 'week' | 'day' | 'schedule';

const VIEW_TABS: { id: ViewMode; label: string }[] = [
  { id: 'year', label: 'Year' },
  { id: 'month', label: 'Month' },
  { id: 'week', label: 'Week' },
  { id: 'day', label: 'Day' },
  { id: 'schedule', label: 'Schedule' },
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function HomeScreen() {
  const router = useRouter();
  const { getDatesWithEvents, getEventsByDate } = useEvents();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  // Get dates with events for current month
  const datesWithEvents = useMemo(() => {
    return getDatesWithEvents(currentYear, currentMonth);
  }, [getDatesWithEvents, currentYear, currentMonth]);

  // Generate calendar days for current month
  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start, end });
    
    // Add padding for first week
    const startDay = getDay(start);
    const paddingBefore = Array(startDay).fill(null);
    
    // Add padding for last week
    const endDay = getDay(end);
    const paddingAfter = Array(6 - endDay).fill(null);
    
    return [...paddingBefore, ...days, ...paddingAfter];
  }, [currentDate]);

  const goToPreviousMonth = useCallback(() => {
    setCurrentDate(prev => subMonths(prev, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentDate(prev => addMonths(prev, 1));
  }, []);

  const handleDayPress = useCallback((day: Date) => {
    const dateString = format(day, 'yyyy-MM-dd');
    router.push(`/(stacks)/schedule/${dateString}`);
  }, [router]);

  const handleYearSelect = useCallback((year: number) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
    setShowYearPicker(false);
  }, [currentDate]);

  // Generate year options (current year -10 to +10)
  const yearOptions = useMemo(() => {
    const years = [];
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      years.push(i);
    }
    return years;
  }, [currentYear]);

  const renderMonthView = () => {
    const weeks = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      weeks.push(calendarDays.slice(i, i + 7));
    }

    return (
      <View className="flex-1 px-4">
        {/* Weekday headers */}
        <View className="flex-row mb-2">
          {WEEKDAYS.map((day) => (
            <View key={day} className="flex-1 items-center py-2">
              <Text className="text-gray-400 text-xs font-medium uppercase">{day}</Text>
            </View>
          ))}
        </View>

        {/* Calendar grid - flex-1 makes it fill remaining space */}
        <View className="flex-1">
          {weeks.map((week, weekIndex) => (
            <View key={weekIndex} className="flex-row flex-1">
              {week.map((day, dayIndex) => {
                if (!day) {
                  return <View key={`empty-${dayIndex}`} className="flex-1" />;
                }

                const dateString = format(day, 'yyyy-MM-dd');
                const hasEvents = datesWithEvents.has(dateString);
                const isCurrentDay = isToday(day);
                const dayEvents = getEventsByDate(dateString);

                return (
                  <TouchableOpacity
                    key={dateString}
                    className="flex-1 border-t border-gray-100 p-1"
                    onPress={() => handleDayPress(day)}
                    activeOpacity={0.7}
                  >
                    <View className={`w-7 h-7 rounded-full items-center justify-center self-center ${isCurrentDay ? 'bg-[#5D4037]' : ''}`}>
                      <Text className={`text-sm font-semibold ${isCurrentDay ? 'text-white' : 'text-gray-800'}`}>
                        {format(day, 'd')}
                      </Text>
                    </View>
                    
                    {/* Event indicators */}
                    {dayEvents.length > 0 && (
                      <View className="mt-1 gap-0.5">
                        {dayEvents.slice(0, 2).map((event, idx) => (
                          <View
                            key={event.id}
                            className={`h-1.5 rounded-full mx-0.5 ${
                              event.color === 'red' ? 'bg-red-400' :
                              event.color === 'purple' ? 'bg-purple-400' :
                              event.color === 'blue' ? 'bg-blue-400' :
                              event.color === 'green' ? 'bg-green-400' :
                              'bg-[#5D4037]'
                            }`}
                          />
                        ))}
                        {dayEvents.length > 2 && (
                          <Text className="text-[8px] text-gray-400 text-center">+{dayEvents.length - 2}</Text>
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderYearView = () => {
    const months = Array.from({ length: 12 }, (_, i) => i);
    return (
      <ScrollView className="flex-1 px-4">
        <View className="flex-row flex-wrap">
          {months.map((month) => {
            const monthDate = new Date(currentYear, month, 1);
            const monthEvents = getDatesWithEvents(currentYear, month + 1);
            return (
              <TouchableOpacity
                key={month}
                className="w-1/3 p-2"
                onPress={() => {
                  setCurrentDate(monthDate);
                  setViewMode('month');
                }}
              >
                <View className="bg-gray-50 rounded-xl p-3 items-center">
                  <Text className="font-semibold text-gray-800">{format(monthDate, 'MMM')}</Text>
                  {monthEvents.size > 0 && (
                    <View className="flex-row gap-1 mt-1">
                      <View className="w-1.5 h-1.5 rounded-full bg-[#5D4037]" />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    );
  };

  const renderWeekView = () => {
    const start = startOfMonth(currentDate);
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay());
    
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      return day;
    });

    return (
      <ScrollView className="flex-1 px-4">
        {weekDays.map((day) => {
          const dateString = format(day, 'yyyy-MM-dd');
          const dayEvents = getEventsByDate(dateString);
          const isCurrentDay = isToday(day);

          return (
            <TouchableOpacity
              key={dateString}
              className="flex-row border-b border-gray-100 py-4"
              onPress={() => handleDayPress(day)}
            >
              <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${isCurrentDay ? 'bg-[#5D4037]' : 'bg-gray-100'}`}>
                <Text className={`text-lg font-bold ${isCurrentDay ? 'text-white' : 'text-gray-800'}`}>
                  {format(day, 'd')}
                </Text>
                <Text className={`text-xs ${isCurrentDay ? 'text-white/80' : 'text-gray-500'}`}>
                  {format(day, 'EEE')}
                </Text>
              </View>
              <View className="flex-1">
                {dayEvents.length > 0 ? (
                  dayEvents.map((event) => (
                    <View key={event.id} className="bg-[#F9F6F3] rounded-lg p-2 mb-1">
                      <Text className="font-medium text-gray-800">{event.title}</Text>
                      <Text className="text-xs text-gray-500">{event.startTime} - {event.endTime}</Text>
                    </View>
                  ))
                ) : (
                  <Text className="text-gray-400 text-sm">No events</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  const renderDayView = () => {
    const dateString = format(currentDate, 'yyyy-MM-dd');
    const dayEvents = getEventsByDate(dateString);
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <ScrollView className="flex-1 px-4">
        <View className="items-center py-4 border-b border-gray-100">
          <Text className="text-2xl font-bold text-gray-800">{format(currentDate, 'EEEE')}</Text>
          <Text className="text-gray-500">{format(currentDate, 'MMMM d, yyyy')}</Text>
        </View>
        {hours.map((hour) => {
          const hourStr = `${String(hour).padStart(2, '0')}:00`;
          const hourEvents = dayEvents.filter(e => e.startTime.startsWith(String(hour).padStart(2, '0')));
          
          return (
            <View key={hour} className="flex-row border-b border-gray-50 min-h-[60px]">
              <Text className="w-16 text-xs text-gray-400 py-2">{hourStr}</Text>
              <View className="flex-1 py-1">
                {hourEvents.map((event) => (
                  <TouchableOpacity
                    key={event.id}
                    className="bg-[#5D4037] rounded-lg p-2 mb-1"
                    onPress={() => handleDayPress(currentDate)}
                  >
                    <Text className="text-white font-medium">{event.title}</Text>
                    <Text className="text-white/80 text-xs">{event.startTime} - {event.endTime}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>
    );
  };

  const renderScheduleView = () => {
    const dateString = format(currentDate, 'yyyy-MM-dd');
    const monthEvents = getEventsByDate(dateString);
    
    // Get all events for next 30 days
    const upcomingEvents: { date: Date; events: typeof monthEvents }[] = [];
    for (let i = 0; i < 30; i++) {
      const day = new Date(currentDate);
      day.setDate(currentDate.getDate() + i);
      const dayStr = format(day, 'yyyy-MM-dd');
      const events = getEventsByDate(dayStr);
      if (events.length > 0) {
        upcomingEvents.push({ date: day, events });
      }
    }

    return (
      <ScrollView className="flex-1 px-4">
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map(({ date, events }) => (
            <View key={format(date, 'yyyy-MM-dd')} className="mb-6">
              <Text className="text-gray-500 font-medium text-xs uppercase tracking-wider mb-2">
                {isToday(date) ? 'Today' : format(date, 'EEEE, MMMM d')}
              </Text>
              {events.map((event) => (
                <TouchableOpacity
                  key={event.id}
                  className="bg-white border border-gray-100 rounded-2xl p-4 mb-2"
                  onPress={() => handleDayPress(date)}
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="font-bold text-gray-800">{event.title}</Text>
                    <View className={`px-2 py-1 rounded-full ${
                      event.color === 'red' ? 'bg-red-100' : 'bg-purple-100'
                    }`}>
                      <Text className={`text-xs font-medium ${
                        event.color === 'red' ? 'text-red-600' : 'text-purple-600'
                      }`}>
                        {event.startTime}
                      </Text>
                    </View>
                  </View>
                  {event.location && (
                    <Text className="text-gray-500 text-sm mt-1">{event.location}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))
        ) : (
          <View className="items-center justify-center py-20">
            <Text className="text-gray-400 text-center">No upcoming events</Text>
            <Text className="text-gray-400 text-center text-sm mt-1">Tap + to create one</Text>
          </View>
        )}
      </ScrollView>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView edges={['top']} className="flex-1">
        
        {/* Header */}
        <View className="px-5 py-3 flex-row justify-between items-center bg-white">
          <View>
            <Text className="text-2xl font-bold text-[#5D4037]">Hello!</Text>
            <Text className="text-gray-400 text-sm">Good morning, Emma!</Text>
          </View>
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              className="w-10 h-10 bg-gray-50 rounded-full justify-center items-center"
              onPress={() => router.push('/(stacks)/notifications')}
            >
              <Bell size={20} color="black" />
            </TouchableOpacity>
            <View className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-100">
              <Image
                source={{ uri: 'https://i.pravatar.cc/120' }}
                className="w-full h-full"
              />
            </View>
          </View>
        </View>

        {/* View Mode Tabs */}
        <View className="px-4 py-2">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row bg-gray-100 rounded-xl p-1">
              {VIEW_TABS.map((tab) => (
                <TouchableOpacity
                  key={tab.id}
                  className={`px-4 py-2 rounded-lg ${viewMode === tab.id ? 'bg-white shadow-sm' : ''}`}
                  onPress={() => setViewMode(tab.id)}
                >
                  <Text className={`text-sm font-medium ${viewMode === tab.id ? 'text-[#5D4037]' : 'text-gray-500'}`}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Month/Year Navigation */}
        <View className="px-5 py-3 flex-row justify-between items-center">
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => setShowYearPicker(true)}
          >
            <Text className="text-xl font-bold text-gray-800">
              {format(currentDate, 'MMMM yyyy')}
            </Text>
            <ChevronDown size={20} color="#5D4037" className="ml-1" />
          </TouchableOpacity>
          
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              className="w-9 h-9 bg-gray-100 rounded-full items-center justify-center"
              onPress={goToPreviousMonth}
            >
              <ChevronLeft size={20} color="#5D4037" />
            </TouchableOpacity>
            <TouchableOpacity
              className="w-9 h-9 bg-gray-100 rounded-full items-center justify-center"
              onPress={goToNextMonth}
            >
              <ChevronRight size={20} color="#5D4037" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Calendar View */}
        {viewMode === 'year' && renderYearView()}
        {viewMode === 'month' && renderMonthView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'day' && renderDayView()}
        {viewMode === 'schedule' && renderScheduleView()}
        
      </SafeAreaView>

      {/* Year Picker Modal */}
      <Modal visible={showYearPicker} transparent animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center"
          activeOpacity={1}
          onPress={() => setShowYearPicker(false)}
        >
          <View className="bg-white rounded-2xl w-72 max-h-96 overflow-hidden">
            <Text className="text-lg font-bold text-center py-4 border-b border-gray-100">Select Year</Text>
            <FlatList
              data={yearOptions}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`py-3 px-6 ${item === currentYear ? 'bg-[#F9F6F3]' : ''}`}
                  onPress={() => handleYearSelect(item)}
                >
                  <Text className={`text-center text-lg ${item === currentYear ? 'text-[#5D4037] font-bold' : 'text-gray-700'}`}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              initialScrollIndex={yearOptions.indexOf(currentYear)}
              getItemLayout={(data, index) => ({ length: 48, offset: 48 * index, index })}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
