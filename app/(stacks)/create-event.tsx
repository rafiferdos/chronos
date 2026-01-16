import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, Calendar, Clock, ChevronDown, AlignLeft } from 'lucide-react-native';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useEvents } from '@/context/EventsContext';
import { format, addDays } from 'date-fns';
import Toast from 'react-native-toast-message';

const REMINDER_OPTIONS = ['5 minutes before', '15 minutes before', '30 minutes before', '1 hour before', '2 hours before', '1 day before'];
const REPEAT_OPTIONS: Array<'daily' | 'weekly' | 'monthly' | 'annually' | null> = [null, 'daily', 'weekly', 'monthly', 'annually'];
const REPEAT_LABELS: Record<string, string> = { daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly', annually: 'Annually' };
const MEMBER_OPTIONS = ['Jenny Wilson', 'Guy Hawkins', 'Jacob Jones', 'Cody Fisher', 'Ralph Edwards'];
const COLOR_OPTIONS: Array<{ id: 'red' | 'purple' | 'blue' | 'green'; label: string; color: string }> = [
  { id: 'red', label: 'Red', color: '#F87171' },
  { id: 'purple', label: 'Purple', color: '#A78BFA' },
  { id: 'blue', label: 'Blue', color: '#60A5FA' },
  { id: 'green', label: 'Green', color: '#4ADE80' },
];
const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = (i % 2) * 30;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
});

export default function CreateEventScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ date?: string }>();
  const { addEvent } = useEvents();

  // Form state
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(params.date || format(new Date(), 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState('10:00');
  const [endDate, setEndDate] = useState(params.date || format(new Date(), 'yyyy-MM-dd'));
  const [endTime, setEndTime] = useState('11:00');
  const [assignedTo, setAssignedTo] = useState('');
  const [location, setLocation] = useState('');
  const [note, setNote] = useState('');
  const [isMeAssigned, setIsMeAssigned] = useState(true);
  const [reminders, setReminders] = useState<string[]>(['5 minutes before']);
  const [recurring, setRecurring] = useState<'daily' | 'weekly' | 'monthly' | 'annually' | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [eventColor, setEventColor] = useState<'red' | 'purple' | 'blue' | 'green'>('purple');
  const [isLoading, setIsLoading] = useState(false);

  // UI state for dropdowns
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState<'start' | 'end' | null>(null);
  const [showMembers, setShowMembers] = useState(false);
  const [showRecurring, setShowRecurring] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const [showColors, setShowColors] = useState(false);

  // Generate date options for next 365 days
  const dateOptions = useMemo(() => {
    return Array.from({ length: 365 }, (_, i) => {
      const date = addDays(new Date(), i);
      return {
        value: format(date, 'yyyy-MM-dd'),
        label: format(date, 'MMM d, yyyy'),
      };
    });
  }, []);

  const memberSummary = useMemo(() => {
    if (selectedMembers.length === 0) return 'People who can see the event';
    if (selectedMembers.length === 1) return selectedMembers[0];
    return `${selectedMembers[0]} +${selectedMembers.length - 1}`;
  }, [selectedMembers]);

  const toggleMember = (name: string) => {
    setSelectedMembers((prev) =>
      prev.includes(name) ? prev.filter((m) => m !== name) : [...prev, name]
    );
  };

  const toggleReminder = (reminder: string) => {
    setReminders((prev) =>
      prev.includes(reminder) ? prev.filter((r) => r !== reminder) : [...prev, reminder]
    );
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Toast.show({ type: 'error', text1: 'Title required', text2: 'Please enter an event title' });
      return;
    }

    // Validate end time is after start time when on same day
    if (startDate === endDate && endTime <= startTime) {
      Toast.show({ type: 'error', text1: 'Invalid time', text2: 'End time must be after start time' });
      return;
    }

    // Validate end date is not before start date
    if (endDate < startDate) {
      Toast.show({ type: 'error', text1: 'Invalid date', text2: 'End date cannot be before start date' });
      return;
    }

    setIsLoading(true);
    try {
      await addEvent({
        title: title.trim(),
        date: startDate,
        endDate,
        startTime,
        endTime,
        location: location.trim() || undefined,
        assignedTo: assignedTo.trim() || undefined,
        assignToMe: isMeAssigned,
        note: note.trim() || undefined,
        reminders,
        recurring,
        includedMembers: selectedMembers,
        color: eventColor,
      });

      Toast.show({ type: 'success', text1: 'Event created', text2: 'Your event has been saved' });
      router.back();
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Failed to save', text2: 'Please try again' });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateDisplay = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM d');
    } catch {
      return dateStr;
    }
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView edges={['top']} className="flex-1">
        
        {/* Header */}
        <View className="px-5 py-2 flex-row justify-between items-center mb-4">
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="w-10 h-10 bg-gray-50 rounded-full justify-center items-center"
          >
            <ArrowLeft size={20} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-black">Event</Text>
          <TouchableOpacity
            className="w-10 h-10 bg-gray-50 rounded-full justify-center items-center"
            onPress={() => router.push('/(stacks)/notifications')}
          >
            <Bell size={20} color="black" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          <View className="items-center mb-6">
            <Text className="text-xl font-bold text-black mb-1">Add New Event</Text>
            <Text className="text-gray-400 text-sm">Plan and organize your day easily</Text>
          </View>

          <View className="gap-5 pb-24">
            {/* Event Title */}
            <View className="gap-2">
              <Text className="text-[#F87171] font-bold text-xs uppercase tracking-wide">Event Title</Text>
              <Input
                placeholder="Ballet Class"
                className="bg-gray-50 border-gray-100 h-14"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* Start Event */}
            <View className="gap-3">
              <Text className="text-[#F87171] font-bold text-xs uppercase tracking-wide">Start Event</Text>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  className="flex-1 flex-row items-center bg-gray-50 border border-gray-100 h-14 rounded-xl px-3"
                  onPress={() => setShowDatePicker('start')}
                >
                  <Calendar size={18} color="#9CA3AF" />
                  <Text className="ml-2 text-gray-900 font-medium">{formatDateDisplay(startDate)}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 flex-row items-center bg-gray-50 border border-gray-100 h-14 rounded-xl px-3"
                  onPress={() => setShowStartTimePicker(true)}
                >
                  <Clock size={18} color="#F59E0B" />
                  <Text className="ml-2 text-gray-900 font-medium">{startTime}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* End Event */}
            <View className="gap-3">
              <Text className="text-[#F87171] font-bold text-xs uppercase tracking-wide">End Event</Text>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  className="flex-1 flex-row items-center bg-gray-50 border border-gray-100 h-14 rounded-xl px-3"
                  onPress={() => setShowDatePicker('end')}
                >
                  <Calendar size={18} color="#9CA3AF" />
                  <Text className="ml-2 text-gray-900 font-medium">{formatDateDisplay(endDate)}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 flex-row items-center bg-gray-50 border border-gray-100 h-14 rounded-xl px-3"
                  onPress={() => setShowEndTimePicker(true)}
                >
                  <Clock size={18} color="#F59E0B" />
                  <Text className="ml-2 text-gray-900 font-medium">{endTime}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Assign To */}
            <View className="gap-2">
              <Text className="text-gray-500 font-medium text-sm">Assign to</Text>
              <Input
                placeholder="Babysitter"
                className="bg-gray-50 border-gray-100 h-14"
                value={assignedTo}
                onChangeText={setAssignedTo}
              />
            </View>

            {/* Include Members */}
            <View className="gap-2">
              <Text className="text-gray-500 font-medium text-sm">Include in this event</Text>
              <TouchableOpacity
                className="flex-row items-center justify-between bg-gray-50 border border-gray-100 h-14 rounded-xl px-3"
                onPress={() => setShowMembers(!showMembers)}
              >
                <Text className="text-gray-500">{memberSummary}</Text>
                <ChevronDown size={18} color="#9CA3AF" />
              </TouchableOpacity>
              {showMembers && (
                <View className="rounded-xl border border-gray-100 bg-white p-3">
                  {MEMBER_OPTIONS.map((member) => {
                    const checked = selectedMembers.includes(member);
                    return (
                      <TouchableOpacity
                        key={member}
                        className="flex-row items-center justify-between py-2"
                        onPress={() => toggleMember(member)}
                      >
                        <Text className="text-gray-700 text-sm">{member}</Text>
                        <View
                          className={cn(
                            'h-4 w-4 rounded border items-center justify-center',
                            checked ? 'bg-[#5D4037] border-[#5D4037]' : 'border-gray-300'
                          )}
                        >
                          {checked && <View className="h-2 w-2 bg-white rounded-sm" />}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>

            {/* Reminders */}
            <View className="gap-2">
              <TouchableOpacity
                className="flex-row items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-4"
                onPress={() => setShowReminders(!showReminders)}
              >
                <View className="flex-row items-center gap-3">
                  <Bell size={18} color="#5D4037" />
                  <Text className="text-gray-700 font-medium">Set reminder</Text>
                </View>
                <ChevronDown size={18} color="#9CA3AF" />
              </TouchableOpacity>
              {reminders.length > 0 && (
                <View className="flex-row flex-wrap gap-2">
                  {reminders.map((r) => (
                    <View key={r} className="bg-[#F9F6F3] px-3 py-1.5 rounded-full">
                      <Text className="text-xs text-[#5D4037]">{r}</Text>
                    </View>
                  ))}
                </View>
              )}
              {showReminders && (
                <View className="rounded-xl border border-gray-100 bg-white p-3">
                  {REMINDER_OPTIONS.map((option) => {
                    const checked = reminders.includes(option);
                    return (
                      <TouchableOpacity
                        key={option}
                        className="flex-row items-center justify-between py-2"
                        onPress={() => toggleReminder(option)}
                      >
                        <Text className="text-sm text-gray-700">{option}</Text>
                        <View
                          className={cn(
                            'h-4 w-4 rounded border items-center justify-center',
                            checked ? 'bg-[#5D4037] border-[#5D4037]' : 'border-gray-300'
                          )}
                        >
                          {checked && <View className="h-2 w-2 bg-white rounded-sm" />}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>

            {/* Recurring */}
            <View className="gap-2">
              <TouchableOpacity
                className="flex-row items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-4"
                onPress={() => setShowRecurring(!showRecurring)}
              >
                <View className="flex-row items-center gap-3">
                  <Clock size={18} color="#5D4037" />
                  <Text className="text-gray-700 font-medium">Recurring</Text>
                </View>
                <Text className="text-gray-500 text-sm">{recurring ? REPEAT_LABELS[recurring] : 'None'}</Text>
              </TouchableOpacity>
              {showRecurring && (
                <View className="rounded-xl border border-gray-100 bg-white p-3">
                  {REPEAT_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option || 'none'}
                      className="py-2"
                      onPress={() => {
                        setRecurring(option);
                        setShowRecurring(false);
                      }}
                    >
                      <Text className={cn('text-sm', recurring === option ? 'text-[#5D4037] font-medium' : 'text-gray-700')}>
                        {option ? REPEAT_LABELS[option] : 'None'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Event Color */}
            <View className="gap-2">
              <Text className="text-gray-500 font-medium text-sm">Event Color</Text>
              <View className="flex-row gap-3">
                {COLOR_OPTIONS.map((c) => (
                  <TouchableOpacity
                    key={c.id}
                    className={cn(
                      'w-10 h-10 rounded-full items-center justify-center',
                      eventColor === c.id ? 'border-2 border-gray-800' : ''
                    )}
                    style={{ backgroundColor: c.color }}
                    onPress={() => setEventColor(c.id)}
                  />
                ))}
              </View>
            </View>

            {/* Assign to me */}
            <TouchableOpacity 
              className="flex-row items-center gap-3 mt-1"
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

            {/* Note */}
            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <AlignLeft size={16} color="#F59E0B" />
                <Text className="text-gray-500 font-medium text-sm">Note</Text>
              </View>
              <TextInput 
                multiline
                numberOfLines={4}
                placeholder="I have a meeting at 4pm, can you take Emma to her ballet class today?"
                textAlignVertical="top"
                className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-base min-h-[120px]"
                value={note}
                onChangeText={setNote}
              />
            </View>

            {/* Save Button */}
            <Button 
              className="bg-[#5D4037] h-14 rounded-2xl shadow-sm mt-2" 
              onPress={handleSave}
              disabled={isLoading}
            >
              <Text className="text-white font-bold text-lg">{isLoading ? 'Saving...' : 'Save'}</Text>
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Time Picker Modal - Start */}
      <Modal visible={showStartTimePicker} transparent animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center"
          activeOpacity={1}
          onPress={() => setShowStartTimePicker(false)}
        >
          <View className="bg-white rounded-2xl w-72 max-h-80">
            <Text className="text-lg font-bold text-center py-4 border-b border-gray-100">Start Time</Text>
            <FlatList
              data={TIME_OPTIONS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={cn('py-3 px-6', item === startTime ? 'bg-[#F9F6F3]' : '')}
                  onPress={() => {
                    setStartTime(item);
                    setShowStartTimePicker(false);
                  }}
                >
                  <Text className={cn('text-center', item === startTime ? 'text-[#5D4037] font-bold' : 'text-gray-700')}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Time Picker Modal - End */}
      <Modal visible={showEndTimePicker} transparent animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center"
          activeOpacity={1}
          onPress={() => setShowEndTimePicker(false)}
        >
          <View className="bg-white rounded-2xl w-72 max-h-80">
            <Text className="text-lg font-bold text-center py-4 border-b border-gray-100">End Time</Text>
            <FlatList
              data={TIME_OPTIONS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={cn('py-3 px-6', item === endTime ? 'bg-[#F9F6F3]' : '')}
                  onPress={() => {
                    setEndTime(item);
                    setShowEndTimePicker(false);
                  }}
                >
                  <Text className={cn('text-center', item === endTime ? 'text-[#5D4037] font-bold' : 'text-gray-700')}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Date Picker Modal */}
      <Modal visible={showDatePicker !== null} transparent animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center"
          activeOpacity={1}
          onPress={() => setShowDatePicker(null)}
        >
          <View className="bg-white rounded-2xl w-80 max-h-96">
            <Text className="text-lg font-bold text-center py-4 border-b border-gray-100">
              {showDatePicker === 'start' ? 'Start Date' : 'End Date'}
            </Text>
            <FlatList
              data={dateOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const selected = showDatePicker === 'start' ? startDate === item.value : endDate === item.value;
                return (
                  <TouchableOpacity
                    className={cn('py-3 px-6', selected ? 'bg-[#F9F6F3]' : '')}
                    onPress={() => {
                      if (showDatePicker === 'start') {
                        setStartDate(item.value);
                        if (item.value > endDate) setEndDate(item.value);
                      } else {
                        setEndDate(item.value);
                      }
                      setShowDatePicker(null);
                    }}
                  >
                    <Text className={cn('text-center', selected ? 'text-[#5D4037] font-bold' : 'text-gray-700')}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
