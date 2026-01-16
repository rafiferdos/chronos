import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Modal, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react-native';
import { useEvents } from '@/context/EventsContext';
import { useUser } from '@/context/UserContext';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday, startOfWeek, addDays } from 'date-fns';
import Animated, { FadeIn, FadeOut, SlideInRight, SlideOutLeft, Layout } from 'react-native-reanimated';

type ViewMode = 'year' | 'month' | 'week' | 'day' | 'schedule';

const VIEW_TABS: { id: ViewMode; label: string }[] = [
  { id: 'year', label: 'Year' },
  { id: 'month', label: 'Month' },
  { id: 'week', label: 'Week' },
  { id: 'day', label: 'Day' },
  { id: 'schedule', label: 'Schedule' },
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function HomeScreen() {
  const router = useRouter();
  const { events, getDatesWithEvents, getEventsByDate } = useEvents();
  const { user } = useUser();

  // Get greeting based on time of day
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const firstName = useMemo(() => {
    if (!user?.name) return 'there';
    return user.name.split(' ')[0];
  }, [user?.name]);
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [showYearPicker, setShowYearPicker] = useState(false);

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
    
    const startDay = getDay(start);
    const paddingBefore: (Date | null)[] = Array(startDay).fill(null);
    
    const endDay = getDay(end);
    const paddingAfter: (Date | null)[] = Array(6 - endDay).fill(null);
    
    return [...paddingBefore, ...days, ...paddingAfter];
  }, [currentDate]);

  // Week days for week view
  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(currentDate);
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [currentDate]);

  const goToPreviousMonth = useCallback(() => {
    setCurrentDate(prev => subMonths(prev, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentDate(prev => addMonths(prev, 1));
  }, []);

  const goToPreviousWeek = useCallback(() => {
    setCurrentDate(prev => addDays(prev, -7));
  }, []);

  const goToNextWeek = useCallback(() => {
    setCurrentDate(prev => addDays(prev, 7));
  }, []);

  const goToPreviousDay = useCallback(() => {
    setCurrentDate(prev => addDays(prev, -1));
  }, []);

  const goToNextDay = useCallback(() => {
    setCurrentDate(prev => addDays(prev, 1));
  }, []);

  const handleDayPress = useCallback((day: Date) => {
    const dateString = format(day, 'yyyy-MM-dd');
    router.push(`/(stacks)/schedule/${dateString}`);
  }, [router]);

  const handleYearSelect = useCallback((year: number) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
    setShowYearPicker(false);
  }, [currentDate]);

  const yearOptions = useMemo(() => {
    const years = [];
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      years.push(i);
    }
    return years;
  }, [currentYear]);

  const handleNavigate = useCallback(() => {
    if (viewMode === 'week') {
      return { prev: goToPreviousWeek, next: goToNextWeek };
    }
    if (viewMode === 'day') {
      return { prev: goToPreviousDay, next: goToNextDay };
    }
    return { prev: goToPreviousMonth, next: goToNextMonth };
  }, [viewMode, goToPreviousMonth, goToNextMonth, goToPreviousWeek, goToNextWeek, goToPreviousDay, goToNextDay]);

  const getEventColor = (color?: string) => {
    switch (color) {
      case 'red': return { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-300' };
      case 'blue': return { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-300' };
      case 'green': return { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-300' };
      case 'purple': return { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-300' };
      default: return { bg: 'bg-[#F9F6F3]', text: 'text-[#5D4037]', border: 'border-[#D4C4B5]' };
    }
  };

  const renderMonthView = () => {
    const weeks: (Date | null)[][] = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      weeks.push(calendarDays.slice(i, i + 7));
    }

    return (
      <Animated.View 
        entering={FadeIn.duration(300)} 
        exiting={FadeOut.duration(200)}
        className="flex-1 px-2"
      >
        {/* Weekday headers */}
        <View className="flex-row mb-1">
          {WEEKDAYS.map((day) => (
            <View key={day} className="flex-1 items-center py-1">
              <Text className="text-gray-400 text-xs font-medium uppercase">{day}</Text>
            </View>
          ))}
        </View>

        {/* Calendar grid */}
        <View className="flex-1">
          {weeks.map((week, weekIndex) => (
            <View key={weekIndex} className="flex-row flex-1">
              {week.map((day, dayIndex) => {
                if (!day) {
                  return <View key={`empty-${weekIndex}-${dayIndex}`} className="flex-1" />;
                }

                const dateString = format(day, 'yyyy-MM-dd');
                const isCurrentDay = isToday(day);
                const dayEvents = getEventsByDate(dateString);

                return (
                  <TouchableOpacity
                    key={dateString}
                    className="flex-1 border-t border-gray-100 px-0.5 py-1"
                    onPress={() => handleDayPress(day)}
                    activeOpacity={0.7}
                  >
                    <View className={`w-6 h-6 rounded-full items-center justify-center self-center ${isCurrentDay ? 'bg-[#5D4037]' : ''}`}>
                      <Text className={`text-xs font-semibold ${isCurrentDay ? 'text-white' : 'text-gray-800'}`}>
                        {format(day, 'd')}
                      </Text>
                    </View>
                    
                    {/* Event titles */}
                    {dayEvents.length > 0 && (
                      <View className="mt-0.5 gap-0.5">
                        {dayEvents.slice(0, 2).map((event) => {
                          const colors = getEventColor(event.color);
                          return (
                            <View
                              key={event.id}
                              className={`px-1 py-0.5 rounded ${colors.bg}`}
                            >
                              <Text 
                                className={`text-[8px] font-medium ${colors.text}`}
                                numberOfLines={1}
                              >
                                {event.title}
                              </Text>
                            </View>
                          );
                        })}
                        {dayEvents.length > 2 && (
                          <Text className="text-[8px] text-gray-400 text-center">+{dayEvents.length - 2} more</Text>
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </Animated.View>
    );
  };

  const renderYearView = () => {
    const months = Array.from({ length: 12 }, (_, i) => i);
    
    // Get unique event colors for each month
    const getMonthEventColors = (year: number, month: number) => {
      const monthStr = `${year}-${String(month).padStart(2, '0')}`;
      const monthEvents = events.filter(e => e.date.startsWith(monthStr));
      const colors = new Set(monthEvents.map(e => e.color || 'default'));
      return Array.from(colors).slice(0, 4); // Max 4 color indicators
    };

    return (
      <Animated.ScrollView 
        entering={FadeIn.duration(300)} 
        exiting={FadeOut.duration(200)}
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row flex-wrap py-2">
          {months.map((month) => {
            const monthDate = new Date(currentYear, month, 1);
            const monthEventColors = getMonthEventColors(currentYear, month + 1);
            const hasEvents = monthEventColors.length > 0;
            
            return (
              <AnimatedPressable
                key={month}
                entering={FadeIn.delay(month * 50)}
                className="w-1/3 p-2"
                onPress={() => {
                  setCurrentDate(monthDate);
                  setViewMode('month');
                }}
              >
                <View className={`rounded-xl p-4 items-center ${hasEvents ? 'bg-[#F9F6F3] border border-[#E8DDD4]' : 'bg-gray-50'}`}>
                  <Text className={`font-semibold text-base ${hasEvents ? 'text-[#5D4037]' : 'text-gray-800'}`}>
                    {format(monthDate, 'MMM')}
                  </Text>
                  {hasEvents && (
                    <View className="flex-row gap-1 mt-2">
                      {monthEventColors.map((color, idx) => (
                        <View 
                          key={idx}
                          className={`w-2 h-2 rounded-full ${
                            color === 'red' ? 'bg-red-400' :
                            color === 'blue' ? 'bg-blue-400' :
                            color === 'green' ? 'bg-green-400' :
                            color === 'purple' ? 'bg-purple-400' :
                            'bg-[#5D4037]'
                          }`}
                        />
                      ))}
                    </View>
                  )}
                </View>
              </AnimatedPressable>
            );
          })}
        </View>
      </Animated.ScrollView>
    );
  };

  const renderWeekView = () => {
    return (
      <Animated.ScrollView 
        entering={FadeIn.duration(300)} 
        exiting={FadeOut.duration(200)}
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
      >
        {weekDays.map((day, index) => {
          const dateString = format(day, 'yyyy-MM-dd');
          const dayEvents = getEventsByDate(dateString);
          const isCurrentDay = isToday(day);

          return (
            <Animated.View 
              key={dateString}
              entering={FadeIn.delay(index * 50)}
              layout={Layout.springify()}
            >
              <TouchableOpacity
                className="flex-row border-b border-gray-100 py-4"
                onPress={() => handleDayPress(day)}
              >
                <View className={`w-14 h-14 rounded-2xl items-center justify-center mr-4 ${isCurrentDay ? 'bg-[#5D4037]' : 'bg-gray-100'}`}>
                  <Text className={`text-lg font-bold ${isCurrentDay ? 'text-white' : 'text-gray-800'}`}>
                    {format(day, 'd')}
                  </Text>
                  <Text className={`text-xs ${isCurrentDay ? 'text-white/80' : 'text-gray-500'}`}>
                    {format(day, 'EEE')}
                  </Text>
                </View>
                <View className="flex-1 justify-center">
                  {dayEvents.length > 0 ? (
                    dayEvents.map((event) => (
                      <View key={event.id} className="bg-[#F9F6F3] rounded-xl p-3 mb-2">
                        <Text className="font-semibold text-gray-800">{event.title}</Text>
                        <Text className="text-xs text-gray-500 mt-1">{event.startTime} - {event.endTime}</Text>
                      </View>
                    ))
                  ) : (
                    <Text className="text-gray-400 text-sm">No events scheduled</Text>
                  )}
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </Animated.ScrollView>
    );
  };

  const renderDayView = () => {
    const dateString = format(currentDate, 'yyyy-MM-dd');
    const dayEvents = getEventsByDate(dateString);
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <Animated.ScrollView 
        entering={FadeIn.duration(300)} 
        exiting={FadeOut.duration(200)}
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          entering={FadeIn.delay(100)}
          className="items-center py-6 border-b border-gray-100 mb-4"
        >
          <Text className="text-3xl font-bold text-gray-800">{format(currentDate, 'EEEE')}</Text>
          <Text className="text-gray-500 mt-1">{format(currentDate, 'MMMM d, yyyy')}</Text>
        </Animated.View>
        
        {hours.map((hour, index) => {
          const hourStr = `${String(hour).padStart(2, '0')}:00`;
          const hourEvents = dayEvents.filter(e => {
            const eventHour = parseInt(e.startTime.split(':')[0], 10);
            return eventHour === hour;
          });
          
          return (
            <Animated.View 
              key={hour} 
              entering={FadeIn.delay(index * 20)}
              className="flex-row border-b border-gray-50 min-h-[70px]"
            >
              <Text className="w-16 text-xs text-gray-400 py-3 font-medium">{hourStr}</Text>
              <View className="flex-1 py-2 pl-2 border-l border-gray-100">
                {hourEvents.map((event) => (
                  <TouchableOpacity
                    key={event.id}
                    className={`rounded-xl p-3 mb-1 ${
                      event.color === 'red' ? 'bg-red-500' :
                      event.color === 'blue' ? 'bg-blue-500' :
                      event.color === 'green' ? 'bg-green-500' :
                      'bg-[#5D4037]'
                    }`}
                    onPress={() => handleDayPress(currentDate)}
                  >
                    <Text className="text-white font-semibold">{event.title}</Text>
                    <Text className="text-white/80 text-xs mt-1">{event.startTime} - {event.endTime}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          );
        })}
        <View className="h-20" />
      </Animated.ScrollView>
    );
  };

  const renderScheduleView = () => {
    // Get all events for next 30 days
    const upcomingEvents: { date: Date; events: ReturnType<typeof getEventsByDate> }[] = [];
    for (let i = 0; i < 30; i++) {
      const day = addDays(currentDate, i);
      const dayStr = format(day, 'yyyy-MM-dd');
      const events = getEventsByDate(dayStr);
      if (events.length > 0) {
        upcomingEvents.push({ date: day, events });
      }
    }

    return (
      <Animated.ScrollView 
        entering={FadeIn.duration(300)} 
        exiting={FadeOut.duration(200)}
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
      >
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map(({ date, events }, groupIndex) => (
            <Animated.View 
              key={format(date, 'yyyy-MM-dd')} 
              entering={FadeIn.delay(groupIndex * 100)}
              className="mb-6"
            >
              <Text className="text-gray-500 font-semibold text-xs uppercase tracking-wider mb-3">
                {isToday(date) ? 'Today' : format(date, 'EEEE, MMMM d')}
              </Text>
              {events.map((event, eventIndex) => (
                <Animated.View
                  key={event.id}
                  entering={FadeIn.delay(groupIndex * 100 + eventIndex * 50)}
                >
                  <TouchableOpacity
                    className="bg-white border border-gray-100 rounded-2xl p-4 mb-3 shadow-sm"
                    onPress={() => handleDayPress(date)}
                    activeOpacity={0.8}
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1">
                        <Text className="font-bold text-gray-800 text-base">{event.title}</Text>
                        {event.location && (
                          <Text className="text-gray-500 text-sm mt-1">{event.location}</Text>
                        )}
                      </View>
                      <View className={`px-3 py-1.5 rounded-full ml-3 ${
                        event.color === 'red' ? 'bg-red-100' :
                        event.color === 'blue' ? 'bg-blue-100' :
                        event.color === 'green' ? 'bg-green-100' :
                        'bg-purple-100'
                      }`}>
                        <Text className={`text-xs font-semibold ${
                          event.color === 'red' ? 'text-red-600' :
                          event.color === 'blue' ? 'text-blue-600' :
                          event.color === 'green' ? 'text-green-600' :
                          'text-purple-600'
                        }`}>
                          {event.startTime}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </Animated.View>
          ))
        ) : (
          <Animated.View 
            entering={FadeIn.delay(200)}
            className="items-center justify-center py-20"
          >
            <Text className="text-gray-400 text-lg text-center">No upcoming events</Text>
            <Text className="text-gray-400 text-center text-sm mt-2">Tap + to create one</Text>
          </Animated.View>
        )}
        <View className="h-20" />
      </Animated.ScrollView>
    );
  };

  const nav = handleNavigate();

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView edges={['top']} className="flex-1">
        
        {/* Header */}
        <View className="px-5 py-3 flex-row justify-between items-center bg-white">
          <View>
            <Text className="text-2xl font-bold text-[#5D4037]">Hello!</Text>
            <Text className="text-gray-400 text-sm">{greeting}, {firstName}!</Text>
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
                source={{ uri: user?.avatarUrl || 'https://i.pravatar.cc/120' }}
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
              {viewMode === 'day' 
                ? format(currentDate, 'MMMM d, yyyy')
                : viewMode === 'week'
                ? `Week of ${format(weekDays[0], 'MMM d')}`
                : format(currentDate, 'MMMM yyyy')
              }
            </Text>
            <ChevronDown size={20} color="#5D4037" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
          
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              className="w-9 h-9 bg-gray-100 rounded-full items-center justify-center"
              onPress={nav.prev}
            >
              <ChevronLeft size={20} color="#5D4037" />
            </TouchableOpacity>
            <TouchableOpacity
              className="w-9 h-9 bg-gray-100 rounded-full items-center justify-center"
              onPress={nav.next}
            >
              <ChevronRight size={20} color="#5D4037" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Calendar Views */}
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
          <Animated.View 
            entering={FadeIn.duration(200)}
            className="bg-white rounded-2xl w-72 max-h-96 overflow-hidden"
          >
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
              initialScrollIndex={Math.max(0, yearOptions.indexOf(currentYear) - 3)}
              getItemLayout={(_, index) => ({ length: 48, offset: 48 * index, index })}
            />
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
