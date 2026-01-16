import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MoreVertical, Plus, Search, Trash2, Edit3 } from 'lucide-react-native';
import { format, addDays, parseISO, isToday, isTomorrow } from 'date-fns';
import { useEvents, type CalendarEvent } from '@/context/EventsContext';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'today' | 'tomorrow' | 'upcoming';

export default function DailyScheduleScreen() {
  const router = useRouter();
  const { date } = useLocalSearchParams();
  const { getEventsByDate, deleteEvent } = useEvents();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Safe parsing of the date string
  const currentDate = typeof date === 'string' ? date : format(new Date(), 'yyyy-MM-dd');
  const parsedDate = parseISO(currentDate);

  // Generate a mini 5-day strip for the top header
  const weekDates = useMemo(() => 
    Array.from({ length: 5 }).map((_, i) => addDays(parsedDate, i - 2)),
    [parsedDate]
  );

  // Get events for selected date
  const dayEvents = useMemo(() => {
    let events = getEventsByDate(currentDate);
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      events = events.filter(e => 
        e.title.toLowerCase().includes(query) ||
        e.location?.toLowerCase().includes(query) ||
        e.note?.toLowerCase().includes(query)
      );
    }
    
    return events;
  }, [getEventsByDate, currentDate, searchQuery]);

  const handleDateSelect = (d: Date) => {
    const dateStr = format(d, 'yyyy-MM-dd');
    router.replace(`/(stacks)/schedule/${dateStr}` as Href);
  };

  const handleDeleteEvent = (event: CalendarEvent) => {
    Alert.alert(
      'Delete Event',
      `Are you sure you want to delete "${event.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteEvent(event.id),
        },
      ]
    );
  };

  const handleEditEvent = (event: CalendarEvent) => {
    router.push(`/(stacks)/edit-event?id=${event.id}` as Href);
  };

  const getEventColorStyle = (color?: string) => {
    switch (color) {
      case 'red':
        return { border: 'border-[#FF8A8A]', bg: 'bg-[#FFF0F0]', badge: 'bg-[#FFE4E4]', text: 'text-[#FF8A8A]' };
      case 'blue':
        return { border: 'border-[#60A5FA]', bg: 'bg-[#EFF6FF]', badge: 'bg-[#DBEAFE]', text: 'text-[#60A5FA]' };
      case 'green':
        return { border: 'border-[#4ADE80]', bg: 'bg-[#F0FDF4]', badge: 'bg-[#DCFCE7]', text: 'text-[#4ADE80]' };
      case 'purple':
      default:
        return { border: 'border-[#A78BFA]', bg: 'bg-[#F5F3FF]', badge: 'bg-[#EDE9FE]', text: 'text-[#8B5CF6]' };
    }
  };

  const formatTimeRange = (start: string, end: string) => {
    const formatTime = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
    };
    return `${formatTime(start)} - ${formatTime(end)}`;
  };

  return (
    <View className="flex-1 bg-[#F5F5F5]">
      
      {/* Header with Week Strip */}
      <View className="bg-white pb-4 rounded-b-[30px] shadow-sm z-10">
        <SafeAreaView edges={['top']} className="px-4">
          
          {/* Nav Bar */}
          <View className="flex-row justify-between items-center mb-4 pt-2">
            <TouchableOpacity onPress={() => router.back()} className="p-2">
              <ArrowLeft size={24} color="black" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-black">Schedule</Text>
            <TouchableOpacity
              className="p-2"
              onPress={() => router.push(`/(stacks)/create-event?date=${currentDate}` as Href)}
            >
              <Plus size={24} color="#5D4037" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View className="bg-gray-100 h-12 rounded-full flex-row items-center px-4 mb-4">
            <Search size={18} color="#9CA3AF" />
            <TextInput
              className="flex-1 ml-2 text-base"
              placeholder="Search events by name..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Filter Pills */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            <View className="flex-row gap-2">
              {(['all', 'today', 'tomorrow', 'upcoming'] as FilterType[]).map((filter) => {
                const isActive = activeFilter === filter;
                return (
                  <TouchableOpacity
                    key={filter}
                    className={cn(
                      'px-4 py-2 rounded-full',
                      isActive ? 'bg-[#5D4037]' : 'bg-white border border-gray-200'
                    )}
                    onPress={() => setActiveFilter(filter)}
                  >
                    <Text className={cn(
                      'font-medium text-xs capitalize',
                      isActive ? 'text-white' : 'text-gray-600'
                    )}>
                      {filter}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Horizontal Date Strip */}
          <View className="flex-row justify-between px-2">
            {weekDates.map((d, index) => {
              const dateStr = format(d, 'yyyy-MM-dd');
              const isSelected = dateStr === currentDate;
              const isTodayDate = isToday(d);
              
              return (
                <TouchableOpacity
                  key={index}
                  className={cn('items-center gap-1', isSelected ? 'opacity-100' : 'opacity-50')}
                  onPress={() => handleDateSelect(d)}
                >
                  <Text className="text-gray-500 font-medium text-xs uppercase">
                    {format(d, 'EEE')}
                  </Text>
                  <View className={cn(
                    'h-10 w-10 rounded-full items-center justify-center',
                    isSelected ? 'bg-[#5D4037]' : isTodayDate ? 'bg-gray-200' : 'bg-transparent'
                  )}>
                    <Text className={cn(
                      'font-bold',
                      isSelected ? 'text-white' : 'text-black'
                    )}>
                      {format(d, 'd')}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

        </SafeAreaView>
      </View>

      {/* Event List */}
      <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
        
        {/* Section Title */}
        <Text className="text-gray-500 font-medium mb-4 uppercase text-xs tracking-wider">
          {isToday(parsedDate) ? 'Today' : isTomorrow(parsedDate) ? 'Tomorrow' : format(parsedDate, 'MMMM d, yyyy')}
        </Text>

        {dayEvents.length > 0 ? (
          dayEvents.map((event) => {
            const colorStyle = getEventColorStyle(event.color);
            return (
              <View
                key={event.id}
                className={cn(
                  'mb-4 rounded-2xl border-l-4 p-4 shadow-sm',
                  colorStyle.border,
                  colorStyle.bg
                )}
              >
                {/* Header row */}
                <View className="mb-3 flex-row items-start justify-between">
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-900">{event.title}</Text>
                    {event.location && (
                      <Text className="text-gray-500 text-sm mt-0.5">{event.location}</Text>
                    )}
                  </View>
                  <View className="flex-row items-center gap-2">
                    <TouchableOpacity
                      className="p-1.5"
                      onPress={() => handleEditEvent(event)}
                    >
                      <Edit3 size={16} color="#5D4037" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="p-1.5"
                      onPress={() => handleDeleteEvent(event)}
                    >
                      <Trash2 size={16} color="#F87171" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Time row */}
                <View className="flex-row items-center justify-between">
                  <Text className="font-medium text-gray-600">
                    {formatTimeRange(event.startTime, event.endTime)}
                  </Text>
                  <View className={cn('rounded-full px-3 py-1', colorStyle.badge)}>
                    <Text className={cn('text-xs font-bold', colorStyle.text)}>
                      {event.assignedTo || 'Personal'}
                    </Text>
                  </View>
                </View>

                {/* Note preview */}
                {event.note && (
                  <Text className="text-gray-500 text-sm mt-2 italic" numberOfLines={2}>
                    {event.note}
                  </Text>
                )}
              </View>
            );
          })
        ) : (
          <View className="items-center justify-center py-16">
            <Text className="text-gray-400 text-lg mb-2">No events</Text>
            <Text className="text-gray-400 text-sm mb-6">Tap + to create one</Text>
            <TouchableOpacity
              className="bg-[#5D4037] px-6 py-3 rounded-full flex-row items-center gap-2"
              onPress={() => router.push(`/(stacks)/create-event?date=${currentDate}` as Href)}
            >
              <Plus size={18} color="white" />
              <Text className="text-white font-medium">Add Event</Text>
            </TouchableOpacity>
          </View>
        )}

        <View className="h-24" />
      </ScrollView>
    </View>
  );
}
